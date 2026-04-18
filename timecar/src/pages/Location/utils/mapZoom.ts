const VB = 1000
const VB2 = VB / 2

/**
 * 根据轨迹两端在 viewBox 中的像素距与直线距离（公里）计算聚焦缩放，
 * 使近距自动放大、远距略缩小，避免两点挤成一团或过度留白。
 */
export function computeMapZoomTransform(
  past: { x: number; y: number },
  end: { x: number; y: number },
  distanceKm: number | null,
  lineComplete: boolean,
): string {
  const cx = (past.x + end.x) / 2
  const cy = (past.y + end.y) / 2
  const dPx = Math.hypot(end.x - past.x, end.y - past.y)
  const targetSpan = 360
  let scale = Math.min(3.4, Math.max(0.9, targetSpan / Math.max(dPx, 42)))

  if (lineComplete && distanceKm != null) {
    if (distanceKm < 120) scale = Math.max(scale, 2.65)
    else if (distanceKm < 600) scale = Math.max(scale, 1.55)
    if (distanceKm > 2800) scale = Math.min(scale, 1.08)
    if (distanceKm > 4500) scale = Math.min(scale, 1)
  }

  scale = Math.min(3.4, Math.max(0.88, scale))
  return `translate(${VB2} ${VB2}) scale(${scale}) translate(${-cx} ${-cy})`
}

/** 地图容器高度（px）：随公里数略增，并限制在合理区间 */
export function computeMapPanelHeightPx(
  distanceKm: number | null,
  lineComplete: boolean,
): number {
  if (!lineComplete || distanceKm == null) {
    return 252
  }
  const extra = Math.min(175, Math.sqrt(distanceKm) * 4.2 + distanceKm * 0.02)
  return Math.round(Math.min(430, Math.max(220, 228 + extra)))
}
