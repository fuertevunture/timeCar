import { useEffect, useId, useMemo, useState } from "react"
import {
  type ChinaMapData,
  FALLBACK_CN_BOUNDS,
  buildTrajectoryQuad,
  fetchChinaMapData,
  projectLngLatToSvg,
} from "./utils/chinaMapGeoJson"
import {
  computeMapPanelHeightPx,
  computeMapZoomTransform,
} from "./utils/mapZoom"
import styles from "./LocationAmbience.module.scss"

const VB = 1000

type GeoState = "idle" | "loading" | "success" | "denied" | "error"

export type LocationAmbienceTrajectoryProps = {
  pastLatLng: { lat: number; lng: number } | null
  currentLatLng: { lat: number; lng: number } | null
  pastLabel: string
  currentCityLabel: string
  distanceKm: number | null
  lineComplete: boolean
  geoState: GeoState
}

function ChinaSilhouetteFallback() {
  return (
    <path
      fill="currentColor"
      d="M205 455c18-95 95-175 205-205 75-22 158-18 235 12 95 38 168 118 198 218 12 42 15 88 5 132-18 78-68 145-138 188-88 55-195 72-298 48-118-28-218-108-275-215-32-58-45-125-32-188zm95-295c52-45 125-58 190-35 72 25 130 82 158 152 22 55 25 118 8 175-22 78-78 142-150 175-95 45-208 35-295-28-102-75-155-210-125-335 12-52 42-98 82-128 48 48 118 68 188 58 45-8 88-32 122-64zm395 85c38-8 78 8 108 38 38 40 52 98 35 152-15 48-52 88-98 108-62 28-132 15-185-32-62-55-78-145-42-220 22-48 62-82 112-95 25 18 52 32 82 38 52 12 108-5 148-42z"
      transform="translate(0,40) scale(1.02)"
    />
  )
}

function PaperPlane({ className }: { className: string }) {
  return (
    <span className={className} aria-hidden>
      <svg
        className={styles.planeSvg}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M44 6 4 22l14 6 6 16 8-12 12 4L44 6zm-24 18-8-3 20-8-12 11z"
        />
      </svg>
    </span>
  )
}

type Props = {
  trajectory: LocationAmbienceTrajectoryProps
}

export default function LocationAmbience({ trajectory }: Props) {
  const gradId = useId().replace(/:/g, "")
  const [mapData, setMapData] = useState<ChinaMapData | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    void fetchChinaMapData(ac.signal).then((d) => {
      if (!ac.signal.aborted) setMapData(d)
    })
    return () => ac.abort()
  }, [])

  const bounds = mapData?.bounds ?? FALLBACK_CN_BOUNDS
  const pathDs =
    mapData?.paths && mapData.paths.length > 0 ? mapData.paths : []

  const panelH = useMemo(
    () =>
      computeMapPanelHeightPx(
        trajectory.distanceKm,
        trajectory.lineComplete,
      ),
    [trajectory.distanceKm, trajectory.lineComplete],
  )

  const pastPt = useMemo(() => {
    if (!trajectory.pastLatLng) return null
    return projectLngLatToSvg(
      trajectory.pastLatLng.lng,
      trajectory.pastLatLng.lat,
      bounds,
      VB,
      VB,
    )
  }, [trajectory.pastLatLng, bounds])

  const currentPt = useMemo(() => {
    if (!trajectory.currentLatLng) return null
    return projectLngLatToSvg(
      trajectory.currentLatLng.lng,
      trajectory.currentLatLng.lat,
      bounds,
      VB,
      VB,
    )
  }, [trajectory.currentLatLng, bounds])

  const ghostEnd = useMemo(() => ({ x: VB * 0.82, y: VB * 0.48 }), [])

  const endPos = useMemo(() => {
    if (trajectory.lineComplete && currentPt) return currentPt
    return ghostEnd
  }, [trajectory.lineComplete, currentPt, ghostEnd])

  const quad = useMemo(() => {
    if (!pastPt) return null
    return buildTrajectoryQuad(pastPt, endPos)
  }, [pastPt, endPos])

  const zoomTransform = useMemo(() => {
    if (!pastPt) return undefined
    return computeMapZoomTransform(
      pastPt,
      endPos,
      trajectory.distanceKm,
      trajectory.lineComplete,
    )
  }, [
    pastPt,
    endPos,
    trajectory.distanceKm,
    trajectory.lineComplete,
  ])

  const midHint = useMemo(() => {
    if (!quad) return ""
    if (trajectory.geoState === "loading") return "正在获取坐标…"
    if (!trajectory.lineComplete) return "待解锁轨迹"
    if (trajectory.distanceKm != null) {
      return trajectory.distanceKm === 0
        ? "近在咫尺"
        : `约 ${trajectory.distanceKm} 公里`
    }
    return "距离需解析城市"
  }, [quad, trajectory])

  return (
    <div
      className={styles.root}
      style={{ ["--loc-map-panel-h" as string]: `${panelH}px` }}
    >
      <p className={styles.caption}>地址变迁</p>
      <div className={styles.mapWrap}>
        <svg
          className={styles.chinaMap}
          viewBox={`0 0 ${VB} ${VB}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient
              id={gradId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          <g transform={zoomTransform}>
            {pathDs.length > 0 ? (
              pathDs.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  className={styles.mapFill}
                  fill="currentColor"
                  fillRule="evenodd"
                />
              ))
            ) : (
              <ChinaSilhouetteFallback />
            )}

            {quad && pastPt ? (
              <g className={styles.trajectory}>
                <path
                  d={quad.d}
                  className={styles.trajPath}
                  fill="none"
                  stroke={
                    trajectory.lineComplete
                      ? `url(#${gradId})`
                      : "rgba(148,163,184,0.65)"
                  }
                  strokeWidth={trajectory.lineComplete ? 3.2 : 2.2}
                  strokeDasharray={trajectory.lineComplete ? undefined : "10 10"}
                  strokeLinecap="round"
                  vectorEffect="nonScalingStroke"
                />
                <circle
                  className={styles.markerPast}
                  cx={pastPt.x}
                  cy={pastPt.y}
                  r={11}
                  vectorEffect="nonScalingStroke"
                />
                <text
                  x={pastPt.x}
                  y={pastPt.y - 18}
                  className={styles.markerCap}
                  textAnchor="middle"
                >
                  四年前
                </text>
                <text
                  x={pastPt.x}
                  y={pastPt.y + 5}
                  className={styles.markerTxt}
                  textAnchor="middle"
                >
                  {(trajectory.pastLabel || "当时").slice(0, 9)}
                </text>

                <circle
                  className={
                    trajectory.lineComplete
                      ? styles.markerNow
                      : styles.markerGhost
                  }
                  cx={endPos.x}
                  cy={endPos.y}
                  r={11}
                  vectorEffect="nonScalingStroke"
                />
                <text
                  x={endPos.x}
                  y={endPos.y - 18}
                  className={styles.markerCap}
                  textAnchor="middle"
                >
                  {trajectory.geoState === "loading" ? "定位中" : "如今"}
                </text>
                <text
                  x={endPos.x}
                  y={endPos.y + 5}
                  className={styles.markerTxt}
                  textAnchor="middle"
                >
                  {trajectory.lineComplete
                    ? (trajectory.currentCityLabel || "—").slice(0, 9)
                    : trajectory.geoState === "loading"
                      ? "…"
                      : "未获取"}
                </text>

                <text
                  x={quad.labelPos.x}
                  y={quad.labelPos.y}
                  className={styles.distLabel}
                  textAnchor="middle"
                >
                  {midHint}
                </text>
              </g>
            ) : null}
          </g>
        </svg>
        <div className={styles.planes} aria-hidden>
          <PaperPlane className={`${styles.plane} ${styles.planeA}`} />
          <PaperPlane className={`${styles.plane} ${styles.planeB}`} />
          <PaperPlane className={`${styles.plane} ${styles.planeC}`} />
        </div>
        <div className={styles.glow} aria-hidden />
      </div>
    </div>
  )
}
