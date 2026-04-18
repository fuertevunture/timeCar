/** 城市中心点近似经纬度，用于 Haversine 与 Canvas 逻辑（非测绘级） */

export type LatLng = { lat: number; lng: number }

const COORDS: Record<string, LatLng> = {
  武汉: { lat: 30.593, lng: 114.305 },
  宜昌: { lat: 30.702, lng: 111.286 },
  荆州: { lat: 30.335, lng: 112.239 },
  黄石: { lat: 30.201, lng: 115.077 },
  黄冈: { lat: 30.453, lng: 114.872 },
  孝感: { lat: 30.924, lng: 113.916 },
  襄阳: { lat: 32.042, lng: 112.144 },
  十堰: { lat: 32.629, lng: 110.798 },
  恩施: { lat: 30.272, lng: 109.488 },
  咸宁: { lat: 29.841, lng: 114.322 },
  荆门: { lat: 31.035, lng: 112.199 },
  北京: { lat: 39.904, lng: 116.407 },
  上海: { lat: 31.23, lng: 121.473 },
  广州: { lat: 23.129, lng: 113.264 },
  深圳: { lat: 22.543, lng: 114.057 },
  杭州: { lat: 30.274, lng: 120.155 },
  南京: { lat: 32.06, lng: 118.796 },
  成都: { lat: 30.572, lng: 104.066 },
  重庆: { lat: 29.563, lng: 106.551 },
  西安: { lat: 34.341, lng: 108.939 },
  天津: { lat: 39.084, lng: 117.201 },
  苏州: { lat: 31.299, lng: 120.585 },
  郑州: { lat: 34.746, lng: 113.625 },
  长沙: { lat: 28.228, lng: 112.938 },
  合肥: { lat: 31.82, lng: 117.227 },
  福州: { lat: 26.074, lng: 119.296 },
  青岛: { lat: 36.067, lng: 120.382 },
  厦门: { lat: 24.479, lng: 118.089 },
  宁波: { lat: 29.868, lng: 121.544 },
  无锡: { lat: 31.491, lng: 120.312 },
  佛山: { lat: 23.021, lng: 113.121 },
  东莞: { lat: 23.02, lng: 113.751 },
  济南: { lat: 36.651, lng: 117.12 },
  沈阳: { lat: 41.805, lng: 123.431 },
  大连: { lat: 38.914, lng: 121.615 },
  哈尔滨: { lat: 45.803, lng: 126.534 },
  长春: { lat: 43.817, lng: 125.323 },
  昆明: { lat: 25.038, lng: 102.832 },
  贵阳: { lat: 26.647, lng: 106.63 },
  南昌: { lat: 28.682, lng: 115.857 },
  太原: { lat: 37.87, lng: 112.548 },
  石家庄: { lat: 38.042, lng: 114.514 },
  兰州: { lat: 36.061, lng: 103.834 },
  海口: { lat: 20.044, lng: 110.199 },
  南宁: { lat: 22.817, lng: 108.366 },
  乌鲁木齐: { lat: 43.825, lng: 87.616 },
  拉萨: { lat: 29.65, lng: 91.172 },
  银川: { lat: 38.487, lng: 106.23 },
  西宁: { lat: 36.617, lng: 101.778 },
  呼和浩特: { lat: 40.842, lng: 111.749 },
  香港: { lat: 22.319, lng: 114.169 },
  澳门: { lat: 22.198, lng: 113.543 },
  台北: { lat: 25.033, lng: 121.565 },
}

function stripSuffix(name: string) {
  return name
    .trim()
    .replace(/市$/u, "")
    .replace(/区$/u, "")
    .replace(/县$/u, "")
}

/**
 * 根据城市名解析经纬度；支持「武汉市」「武汉」「湖北-荆门」及包含关系。
 */
export function lookupCityLatLng(cityOrRegion: string): LatLng | null {
  const raw = cityOrRegion?.trim()
  if (!raw || raw === "未知" || raw === "未知地点") return null

  const dashParts = raw.split(/[\-－]/u).map((s) => s.trim()).filter(Boolean)
  if (dashParts.length >= 2) {
    const lastCity = stripSuffix(dashParts[dashParts.length - 1])
    if (COORDS[lastCity]) return COORDS[lastCity]
    for (const [name, ll] of Object.entries(COORDS)) {
      if (lastCity.includes(name) || name.includes(lastCity)) return ll
    }
  }

  const simple = stripSuffix(raw)
  if (COORDS[simple]) return COORDS[simple]

  for (const [name, ll] of Object.entries(COORDS)) {
    if (raw.includes(name) || simple.includes(name)) return ll
  }

  return null
}

/** 问卷常见格式：117.153.142.48(湖北-荆门) */
export type ParsedIpRegionAddress = {
  /** 括号内原文，如 湖北-荆门 */
  innerRegion: string
  /** 用于命中 COORDS 的城市段，如 荆门 */
  cityForLookup: string
  /** 展示用：湖北 · 荆门 */
  displayLabel: string
}

export function parseIpRegionAddress(
  raw: string | undefined,
): ParsedIpRegionAddress | null {
  const s = raw?.trim()
  if (!s) return null
  const m = s.match(/[（(]\s*([^)）]+)\s*[)）]/u)
  if (!m) return null
  const inner = m[1].trim()
  const segs = inner.split(/[\-－]/u).map((x) => x.trim()).filter(Boolean)
  if (segs.length >= 2) {
    return {
      innerRegion: inner,
      cityForLookup: segs[segs.length - 1],
      displayLabel: `${segs[0]} · ${segs[segs.length - 1]}`,
    }
  }
  if (segs.length === 1) {
    return {
      innerRegion: inner,
      cityForLookup: segs[0],
      displayLabel: segs[0],
    }
  }
  return null
}

const CITY_NAMES_BY_LEN = Object.keys(COORDS).sort((a, b) => b.length - a.length)

/**
 * 从问卷的 address 字符串中抽出便于展示的地名（优先命中预置城市名，否则截断原文）。
 */
export function extractPastPlaceLabel(address: string | undefined): string {
  const parsed = parseIpRegionAddress(address)
  if (parsed) return parsed.displayLabel

  const raw = address?.trim()
  if (!raw) return ""
  for (const name of CITY_NAMES_BY_LEN) {
    if (raw.includes(name)) return name
  }
  return raw.length > 16 ? `${raw.slice(0, 15)}…` : raw
}

/** 母校映射失败等场景：用武汉作为湖北默认参考点 */
export function hubeiFallbackCoords(): LatLng {
  return COORDS.武汉
}
