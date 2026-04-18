import { parseIpRegionAddress } from "./cityCoords"
import { getSchoolCity } from "./schoolCity"

/** 取出可与母校比对的地域文案（优先括号内 省-市） */
function regionTextForCompare(address: string | undefined): string {
  const parsed = parseIpRegionAddress(address)
  if (parsed) return `${parsed.innerRegion} ${parsed.displayLabel}`
  return address?.trim() ?? ""
}

/** 当年 IP / 问卷填写地文案是否与母校同城（粗略：字符串包含城市名或省份一致） */
export function ipLocationDiffersFromSchool(
  address: string | undefined,
  schoolName: string | undefined,
  isHubei: string | undefined,
): boolean {
  const ip = regionTextForCompare(address)
  if (!ip) return false

  const { city, province } = getSchoolCity(schoolName, isHubei)
  if (city === "未知" && province === "省外") return true

  if (city !== "未知" && ip.includes(city.replace(/市$/u, ""))) return false
  if (province && province !== "省外" && ip.includes(province)) {
    if (city === "未知" || ip.includes(city.replace(/市$/u, ""))) return false
  }

  return true
}
