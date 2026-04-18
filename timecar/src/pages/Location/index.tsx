import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useAllStore from "@/stores/all"
import LocationAmbience from "./LocationAmbience"
import LocationGeoActions from "./LocationGeoActions"
import LocationNarrative from "./LocationNarrative"
import LocationShare from "./LocationShare"
import { fetchCurrentLocation } from "./utils/geolocation"
import { getSchoolCity } from "./utils/schoolCity"
import {
  extractPastPlaceLabel,
  lookupCityLatLng,
  parseIpRegionAddress,
} from "./utils/cityCoords"
import { generateNarrative } from "./utils/narrative"
import { haversineKm } from "./utils/distance"
import { ipLocationDiffersFromSchool } from "./utils/addressHint"
import "./index.scss"

type GeoState = "idle" | "loading" | "success" | "denied" | "error"

/** 顶部句式：四年前 / 如今 的展示用短文案（避免撑破一行） */
function headlinePast(addr: string | undefined) {
  const s = addr?.trim()
  if (!s) return "未知地点"
  return s.length > 20 ? `${s.slice(0, 19)}…` : s
}

function headlineNow(
  geoState: GeoState,
  hasCurrent: boolean,
  line: string,
) {
  if (geoState === "loading") return "定位中…"
  if (hasCurrent) return line || "—"
  return "待定位"
}

function Location() {
  const all = useAllStore((s) => s.all) as Record<string, string>
  const setAll = useAllStore((s) => s.setAll)

  const schoolInfo = useMemo(() => {
    const sc = getSchoolCity(all.school, all.isHubei)
    return {
      name: all.school || "",
      type: all.schoolType || "",
      city: sc.city,
      province: sc.province,
    }
  }, [all.school, all.schoolType, all.isHubei])

  /** 当时：支持 IP(省-市) 与纯地名；经纬度用于距离 */
  const pastLatLng = useMemo(() => {
    const p = parseIpRegionAddress(all.address)
    if (p) return lookupCityLatLng(p.cityForLookup)
    return lookupCityLatLng(all.address ?? "")
  }, [all.address])

  const pastPlaceLabel = useMemo(
    () => extractPastPlaceLabel(all.address),
    [all.address],
  )

  const [geoState, setGeoState] = useState<GeoState>("loading")
  const [geoResult, setGeoResult] = useState<Awaited<
    ReturnType<typeof fetchCurrentLocation>
  > | null>(null)
  const [manualCity, setManualCity] = useState("")

  const requestGeo = useCallback(async () => {
    setGeoState("loading")
    setGeoResult(null)
    try {
      const res = await fetchCurrentLocation()
      setGeoResult(res)
      setManualCity("")
      setGeoState("success")
    } catch (err: unknown) {
      const code =
        err instanceof GeolocationPositionError ? err.code : undefined
      setGeoState(code === 1 ? "denied" : "error")
    }
  }, [])

  useEffect(() => {
    void requestGeo()
  }, [requestGeo])

  const savedAddress = (all as { currentAddress?: string }).currentAddress?.trim()

  useEffect(() => {
    if (geoState !== "denied" && geoState !== "error") return
    if (!savedAddress || manualCity || geoResult) return
    setManualCity(savedAddress)
    setGeoState("success")
  }, [geoState, savedAddress, manualCity, geoResult])

  const handleManualCity = useCallback(
    (city: string) => {
      const v = city.trim()
      if (!v) return
      setManualCity(v)
      setGeoResult(null)
      setGeoState("success")
      setAll({ currentAddress: v })
    },
    [setAll],
  )

  const currentGeo = useMemo(() => {
    if (geoResult) return geoResult
    if (manualCity)
      return {
        lat: 0,
        lng: 0,
        city: manualCity,
        district: "",
        province: "",
      }
    return null
  }, [geoResult, manualCity])

  const currentLatLng = useMemo(() => {
    if (geoResult) return { lat: geoResult.lat, lng: geoResult.lng }
    if (manualCity) return lookupCityLatLng(manualCity)
    return null
  }, [geoResult, manualCity])

  const distance = useMemo(() => {
    if (!pastLatLng || !currentLatLng) return null
    return haversineKm(
      pastLatLng.lat,
      pastLatLng.lng,
      currentLatLng.lat,
      currentLatLng.lng,
    )
  }, [pastLatLng, currentLatLng])

  const hasCurrentLocation = Boolean(
    geoState === "success" && currentGeo && (geoResult || manualCity),
  )

  const isHubei =
    all.isHubei === "是" ||
    all.isHubei === "true" ||
    String(all.isHubei).toLowerCase() === "true"

  const differsFromSchool = ipLocationDiffersFromSchool(
    all.address,
    all.school,
    all.isHubei,
  )

  const narrativeText = useMemo(
    () =>
      generateNarrative({
        pastPlace: pastPlaceLabel,
        pastAddressFull: all.address?.trim() ?? "",
        schoolType: schoolInfo.type,
        schoolName: schoolInfo.name,
        currentCity: currentGeo?.city ?? "",
        currentProvince: currentGeo?.province ?? "",
        isHubei,
        differsFromSchool,
        distanceKm: distance,
        hasCurrentLocation,
      }),
    [
      pastPlaceLabel,
      schoolInfo,
      currentGeo,
      isHubei,
      all.address,
      differsFromSchool,
      distance,
      hasCurrentLocation,
    ],
  )

  const nowSummaryLine =
    geoState === "loading"
      ? "正在获取…"
      : hasCurrentLocation
        ? [currentGeo?.province, currentGeo?.city, currentGeo?.district]
            .filter(Boolean)
            .join(" · ") || currentGeo?.city || "—"
        : "未获取"

  const captureRef = useRef<HTMLDivElement>(null)

  const lineComplete = hasCurrentLocation

  const pastPrimary =
    pastPlaceLabel || (all.address?.trim() ? headlinePast(all.address) : "问卷未留地址")

  return (
    <div className="loc-page">
      <div className="loc-page-noise" aria-hidden />
      <div className="loc-page-scroll" ref={captureRef}>
        <div className="loc-foreground">
        <h1 className="loc-poem-title">光点流淌处，是时间走过的路</h1>
        <p className="loc-timeline-sub">
          四年前，你在
          <span className="loc-timeline-em">
            {pastPlaceLabel || headlinePast(all.address)}
          </span>
          ；如今，你在
          <span className="loc-timeline-em">
            {headlineNow(geoState, hasCurrentLocation, nowSummaryLine)}
          </span>
          。
        </p>

        <div className="loc-map-panel">
          <LocationAmbience
            trajectory={{
              pastLatLng,
              currentLatLng,
              pastLabel: pastPrimary,
              currentCityLabel: hasCurrentLocation
                ? (currentGeo?.city || "当前")
                : "",
              distanceKm: lineComplete ? distance : null,
              lineComplete,
              geoState,
            }}
          />
        </div>

        <LocationGeoActions
          geoState={geoState}
          onRetryGeo={requestGeo}
          onManualCity={handleManualCity}
        />

        <LocationNarrative text={narrativeText} />
        <LocationShare captureRef={captureRef} />
        <p className="loc-page-footer">问卷地址字段记录当时网络位置；当前位置仅本地用于本页。</p>
        </div>
      </div>
    </div>
  )
}

export default Location
