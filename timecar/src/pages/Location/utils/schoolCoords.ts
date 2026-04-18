import type { LatLng } from "./cityCoords"
import { hubeiFallbackCoords, lookupCityLatLng } from "./cityCoords"
import { getSchoolCity } from "./schoolCity"

/**
 * 大学锚点经纬度：优先学校所在城市，其次湖北默认武汉，省外未知则 null。
 */
export function getSchoolLatLng(
  schoolName: string | undefined,
  isHubei: string | undefined,
): LatLng | null {
  const { city, province } = getSchoolCity(schoolName, isHubei)

  if (city === "未知" && province === "省外") return null

  if (city === "湖北（未知城市）" || city.includes("未知")) {
    if (province === "湖北" || isHubei === "是") return hubeiFallbackCoords()
    return null
  }

  const hit = lookupCityLatLng(city)
  if (hit) return hit
  if (province === "湖北" || isHubei === "是") return hubeiFallbackCoords()
  return null
}
