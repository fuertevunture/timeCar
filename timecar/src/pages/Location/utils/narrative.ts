export type NarrativeInput = {
  /** 从 address 解析出的地名简称 */
  pastPlace: string
  pastAddressFull: string
  schoolType: string
  schoolName: string
  currentCity: string
  currentProvince: string
  isHubei: boolean
  differsFromSchool: boolean
  distanceKm: number | null
  hasCurrentLocation: boolean
}

type MoveKind = "sameCity" | "sameProvince" | "crossProvince"

function classifyMove(input: NarrativeInput): MoveKind {
  const a = input.pastPlace.replace(/市$/u, "")
  const b = input.currentCity.replace(/市$/u, "")
  if (a && b && (a.includes(b) || b.includes(a))) return "sameCity"
  if (input.distanceKm != null && input.distanceKm < 55) return "sameCity"
  const past = input.pastAddressFull.trim()
  if (
    input.currentProvince &&
    past &&
    (past.includes(input.currentProvince) ||
      past.includes(input.currentProvince.replace(/省|市|自治区/u, "").slice(0, 2)))
  ) {
    return "sameProvince"
  }
  return "crossProvince"
}

function prestigePhrase(schoolType: string): string {
  const t = schoolType || ""
  if (t.includes("985")) return "985"
  if (t.includes("211")) return "211"
  if (t.includes("双一流") || t.includes("一流")) return "双一流"
  if (t.includes("一本")) return "一本"
  return ""
}

function buildWithLocation(input: NarrativeInput): string {
  const { pastPlace, pastAddressFull, schoolType, currentCity, currentProvince } =
    input
  const displayPast =
    pastPlace || pastAddressFull.trim().slice(0, 12) || "问卷里的那个坐标"
  const move = classifyMove(input)
  const prestige = prestigePhrase(schoolType)
  const dist =
    input.distanceKm != null ? `约 ${input.distanceKm} 公里` : "一段不短的路程"

  const hubeiOpen = input.isHubei
    ? "从荆楚大地出发，你走向了更远的远方。"
    : "跨越山河，你把校园里的勇气装进行囊。"

  let core = ""
  if (move === "sameCity") {
    core = `问卷时你在「${displayPast}」，如今仍在「${currentCity || displayPast}」附近扎根——坐标没怎么动，人生却在悄悄换轨。`
  } else if (move === "sameProvince") {
    core = `从「${displayPast}」到「${currentCity}」，脚步还在这片土地的版图里打转。${dist}的挪动，刚好够把「学生」走成「自己」。`
  } else {
    core = `从「${displayPast}」到「${currentCity || currentProvince}」，跨越 ${dist}。${input.isHubei ? hubeiOpen : "你把往事留在身后，把前路握在手里。"}`
  }

  if (prestige && input.schoolName) {
    core += `「${input.schoolName.slice(0, 12)}${input.schoolName.length > 12 ? "…" : ""}」在读时给你的底气，还在。`
  } else {
    core += "从校园到社会，不变的是还在往上走的心。"
  }

  if (input.differsFromSchool && input.schoolName) {
    core += `那时填写的网络位置，未必是教室所在的城市，但母校一直是你心里的参照点。`
  }

  return core
}

function buildWithoutLocation(input: NarrativeInput): string {
  const past = input.pastAddressFull.trim()
  const label = input.pastPlace || past || "问卷中的填写地"
  const base =
    "授权位置后，虚线会连成实线，距离也会显现。"
  if (!past) {
    return `${base}若问卷里曾留下地址，它会是你故事的起点。`
  }
  return `${base}四年前，记录里写着「${label}」；如今只等你点一下定位，补上「现在」。`
}

/**
 * 规则驱动的感悟文案（不调用外部 AI）。
 */
export function generateNarrative(input: NarrativeInput): string {
  if (!input.hasCurrentLocation) {
    return buildWithoutLocation(input)
  }
  return buildWithLocation(input)
}
