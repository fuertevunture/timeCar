type CityInfo = { city: string; province: string }

const HUBEI_SCHOOL_MAP: Record<string, CityInfo> = {
  武汉大学: { city: "武汉", province: "湖北" },
  华中科技大学: { city: "武汉", province: "湖北" },
  华中师范大学: { city: "武汉", province: "湖北" },
  武汉理工大学: { city: "武汉", province: "湖北" },
  中南财经政法大学: { city: "武汉", province: "湖北" },
  "中国地质大学（武汉）": { city: "武汉", province: "湖北" },
  中国地质大学: { city: "武汉", province: "湖北" },
  华中农业大学: { city: "武汉", province: "湖北" },
  湖北大学: { city: "武汉", province: "湖北" },
  武汉科技大学: { city: "武汉", province: "湖北" },
  中南民族大学: { city: "武汉", province: "湖北" },
  湖北工业大学: { city: "武汉", province: "湖北" },
  武汉工程大学: { city: "武汉", province: "湖北" },
  武汉纺织大学: { city: "武汉", province: "湖北" },
  武汉轻工大学: { city: "武汉", province: "湖北" },
  湖北经济学院: { city: "武汉", province: "湖北" },
  江汉大学: { city: "武汉", province: "湖北" },
  武汉商学院: { city: "武汉", province: "湖北" },
  湖北第二师范学院: { city: "武汉", province: "湖北" },
  武汉学院: { city: "武汉", province: "湖北" },
  武汉生物工程学院: { city: "武汉", province: "湖北" },
  武汉东湖学院: { city: "武汉", province: "湖北" },
  武汉工商学院: { city: "武汉", province: "湖北" },
  文华学院: { city: "武汉", province: "湖北" },
  武昌理工学院: { city: "武汉", province: "湖北" },
  武昌工学院: { city: "武汉", province: "湖北" },
  武昌首义学院: { city: "武汉", province: "湖北" },
  三峡大学: { city: "宜昌", province: "湖北" },
  长江大学: { city: "荆州", province: "湖北" },
  湖北师范大学: { city: "黄石", province: "湖北" },
  湖北理工学院: { city: "黄石", province: "湖北" },
  黄冈师范学院: { city: "黄冈", province: "湖北" },
  湖北工程学院: { city: "孝感", province: "湖北" },
  湖北文理学院: { city: "襄阳", province: "湖北" },
  湖北汽车工业学院: { city: "十堰", province: "湖北" },
  湖北民族大学: { city: "恩施", province: "湖北" },
  湖北科技学院: { city: "咸宁", province: "湖北" },
  荆楚理工学院: { city: "荆门", province: "湖北" },
  汉江师范学院: { city: "十堰", province: "湖北" },
}

/**
 * 根据学校名和是否湖北就读，查出学校所在城市。
 * 先用完整名匹配，再试包含关系模糊匹配。
 */
export function getSchoolCity(
  schoolName: string | undefined,
  isHubei: string | undefined,
): CityInfo {
  if (!schoolName || isHubei === "否") {
    return { city: "未知", province: "省外" }
  }

  const name = schoolName.trim()
  if (HUBEI_SCHOOL_MAP[name]) return HUBEI_SCHOOL_MAP[name]

  for (const [key, val] of Object.entries(HUBEI_SCHOOL_MAP)) {
    if (name.includes(key) || key.includes(name)) return val
  }

  if (isHubei === "是") return { city: "湖北（未知城市）", province: "湖北" }
  return { city: "未知", province: "省外" }
}
