/**
 * 后端 creatAt 字符串格式：`2022/11/24 13:33:31`
 */
export function parseBackendCreatAtMs(raw: unknown): number | null {
  if (raw == null || raw === "") return null
  const s = String(raw).trim()
  const m = s.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/,
  )
  if (m) {
    const y = Number(m[1])
    const mo = Number(m[2])
    const d = Number(m[3])
    const h = Number(m[4])
    const mi = Number(m[5])
    const se = Number(m[6])
    const t = new Date(y, mo - 1, d, h, mi, se).getTime()
    return Number.isNaN(t) ? null : t
  }
  const t = new Date(s.replace(/\//g, "-")).getTime()
  return Number.isNaN(t) ? null : t
}

export function daysSinceCreatAt(raw: unknown): number | null {
  const t0 = parseBackendCreatAtMs(raw)
  if (t0 == null) return null
  return Math.max(0, Math.floor((Date.now() - t0) / 86_400_000))
}
