/** 从公开接口拉取中国边界 GeoJSON，并转为 SVG path + 经纬度投影范围（轨迹与地图共用） */

export type LngLat = [number, number]

export type LatLngBounds = {
  minLng: number
  maxLng: number
  minLat: number
  maxLat: number
}

export type ChinaMapData = {
  paths: string[]
  bounds: LatLngBounds
}

type Geom = {
  type: string
  coordinates: unknown
}

const SOURCES = [
  "https://geo.datav.aliyun.com/areas_v3/bound/100000.json",
  "https://fastly.jsdelivr.net/npm/echarts@5.5.1/map/json/china.json",
] as const

/** 无网络数据时用于轨迹投影的近似全国范围（与示意轮廓搭配） */
export const FALLBACK_CN_BOUNDS: LatLngBounds = {
  minLng: 73,
  maxLng: 135,
  minLat: 18,
  maxLat: 54,
}

function geometriesFromJson(data: unknown): Geom[] {
  if (!data || typeof data !== "object") return []
  const o = data as Record<string, unknown>
  if (o.geometry && typeof o.geometry === "object") {
    return [o.geometry as Geom]
  }
  const feats = o.features
  if (Array.isArray(feats)) {
    return feats
      .map((f) => (f as { geometry?: Geom }).geometry)
      .filter(Boolean) as Geom[]
  }
  return []
}

function ringsFromGeometry(g: Geom): LngLat[][] {
  const { type, coordinates: c } = g
  if (type === "Polygon" && Array.isArray(c)) {
    return c as LngLat[][]
  }
  if (type === "MultiPolygon" && Array.isArray(c)) {
    return (c as LngLat[][][]).flat()
  }
  return []
}

function forEachLngLat(
  geometries: Geom[],
  fn: (lng: number, lat: number) => void,
) {
  for (const g of geometries) {
    for (const ring of ringsFromGeometry(g)) {
      for (const pt of ring) {
        if (Array.isArray(pt) && pt.length >= 2) {
          fn(Number(pt[0]), Number(pt[1]))
        }
      }
    }
  }
}

function boundsWithPad(
  geometries: Geom[],
  padRatio: number,
): LatLngBounds {
  let minLng = Infinity
  let maxLng = -Infinity
  let minLat = Infinity
  let maxLat = -Infinity
  forEachLngLat(geometries, (lng, lat) => {
    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
  })
  if (!Number.isFinite(minLng)) {
    return { ...FALLBACK_CN_BOUNDS }
  }
  const w = maxLng - minLng
  const h = maxLat - minLat
  const px = w * padRatio
  const py = h * padRatio
  return {
    minLng: minLng - px,
    maxLng: maxLng + px,
    minLat: minLat - py,
    maxLat: maxLat + py,
  }
}

function simplifyRing(ring: LngLat[], maxPts: number): LngLat[] {
  if (ring.length <= maxPts) return ring
  const step = Math.ceil(ring.length / maxPts)
  const out: LngLat[] = []
  for (let i = 0; i < ring.length; i += step) out.push(ring[i])
  const last = ring[ring.length - 1]
  if (out[out.length - 1] !== last) out.push(last)
  return out
}

function ringToPathD(
  ring: LngLat[],
  bounds: LatLngBounds,
  vw: number,
  vh: number,
): string {
  const { minLng, maxLng, minLat, maxLat } = bounds
  const rw = maxLng - minLng
  const rh = maxLat - minLat
  if (rw <= 0 || rh <= 0) return ""
  let d = ""
  const simp = simplifyRing(ring, 520)
  for (let i = 0; i < simp.length; i++) {
    const [lng, lat] = simp[i]
    const x = ((lng - minLng) / rw) * vw
    const y = ((maxLat - lat) / rh) * vh
    const xs = x.toFixed(2)
    const ys = y.toFixed(2)
    d += i === 0 ? `M${xs} ${ys}` : `L${xs} ${ys}`
  }
  return `${d}Z`
}

export function geoJsonToChinaMapData(
  data: unknown,
  vw = 1000,
  vh = 1000,
  padRatio = 0.035,
): ChinaMapData | null {
  const geometries = geometriesFromJson(data)
  if (!geometries.length) return null
  const bounds = boundsWithPad(geometries, padRatio)
  const paths: string[] = []
  for (const g of geometries) {
    for (const ring of ringsFromGeometry(g)) {
      if (ring.length < 3) continue
      const d = ringToPathD(ring, bounds, vw, vh)
      if (d) paths.push(d)
    }
  }
  if (!paths.length) return null
  return { paths, bounds }
}

/**
 * 将经纬度映射到与地图相同的 SVG 坐标系（viewBox 0 0 vw vh），并做边距钳制。
 */
export function projectLngLatToSvg(
  lng: number,
  lat: number,
  bounds: LatLngBounds,
  vw: number,
  vh: number,
  edgePad = 28,
): { x: number; y: number } {
  const { minLng, maxLng, minLat, maxLat } = bounds
  const rw = maxLng - minLng
  const rh = maxLat - minLat
  if (rw <= 0 || rh <= 0) return { x: vw / 2, y: vh / 2 }
  let x = ((lng - minLng) / rw) * vw
  let y = ((maxLat - lat) / rh) * vh
  const maxX = vw - edgePad
  const maxY = vh - edgePad
  x = Math.min(maxX, Math.max(edgePad, x))
  y = Math.min(maxY, Math.max(edgePad, y))
  return { x, y }
}

export type TrajectoryQuad = {
  d: string
  control: { x: number; y: number }
  labelPos: { x: number; y: number }
}

/** 二次贝塞尔轨迹：用于路径 d 与中点文案位置（t≈0.5 处） */
export function buildTrajectoryQuad(
  a: { x: number; y: number },
  b: { x: number; y: number },
): TrajectoryQuad {
  const midX = (a.x + b.x) / 2
  const midY = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const ox = (-dy / len) * 72
  const oy = (dx / len) * 72
  const cx = midX + ox
  const cy = midY + oy
  const t = 0.5
  const u = 1 - t
  const labelPos = {
    x: u * u * a.x + 2 * u * t * cx + t * t * b.x,
    y: u * u * a.y + 2 * u * t * cy + t * t * b.y,
  }
  const d = `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
  return { d, control: { x: cx, y: cy }, labelPos }
}

const CACHE_KEY = "timecar-china-map-v3"

export async function fetchChinaMapData(
  signal?: AbortSignal,
): Promise<ChinaMapData | null> {
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (
          parsed &&
          typeof parsed === "object" &&
          "paths" in parsed &&
          "bounds" in parsed
        ) {
          const p = parsed as ChinaMapData
          if (Array.isArray(p.paths) && p.paths.length && p.bounds) return p
        }
        if (Array.isArray(parsed) && parsed.length) {
          return { paths: parsed as string[], bounds: { ...FALLBACK_CN_BOUNDS } }
        }
      }
    } catch {
      /* ignore */
    }
  }

  for (const url of SOURCES) {
    try {
      const res = await fetch(url, {
        signal,
        cache: "force-cache",
        headers: { Accept: "application/json" },
      })
      if (!res.ok) continue
      const data = await res.json()
      const built = geoJsonToChinaMapData(data, 1000, 1000, 0.035)
      if (built) {
        try {
          const ser = JSON.stringify(built)
          if (ser.length < 2_400_000) sessionStorage.setItem(CACHE_KEY, ser)
        } catch {
          /* quota */
        }
        return built
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return null
      /* try next */
    }
  }
  return null
}
