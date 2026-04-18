import { useCallback, useRef, useState } from "react"
import html2canvas from "html2canvas"
import "./index.scss"

export type LocationShareProps = {
  /** 截图目标 DOM 的 ref */
  captureRef: React.RefObject<HTMLDivElement | null>
}

export default function LocationShare({ captureRef }: LocationShareProps) {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleCapture = useCallback(async () => {
    const el = captureRef.current
    if (!el || busy) return
    setBusy(true)

    if (btnRef.current) btnRef.current.style.visibility = "hidden"

    try {
      const canvas = await html2canvas(el, {
        backgroundColor: "#f1f5f9",
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const now = new Date()
      const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.font = "11px sans-serif"
        ctx.fillStyle = "rgba(148,163,184,0.65)"
        ctx.textAlign = "right"
        ctx.fillText(
          `时光回响 · 生成于 ${dateStr}`,
          canvas.width - 16,
          canvas.height - 10,
        )
      }

      canvas.toBlob(async (blob) => {
        if (!blob) return

        if (navigator.share && navigator.canShare) {
          const file = new File([blob], "timemap.png", { type: "image/png" })
          try {
            await navigator.share({
              files: [file],
              title: "从大学到社会 · 我的轨迹图",
            })
          } catch {
            downloadBlob(blob)
          }
        } else {
          downloadBlob(blob)
        }

        setDone(true)
        setTimeout(() => setDone(false), 3000)
      }, "image/png")
    } catch {
      alert("截图失败，请尝试手动截图")
    } finally {
      if (btnRef.current) btnRef.current.style.visibility = "visible"
      setBusy(false)
    }
  }, [captureRef, busy])

  return (
    <div className="loc-share">
      <button
        ref={btnRef}
        type="button"
        className="loc-share-btn"
        disabled={busy}
        onClick={handleCapture}
      >
        {busy ? "生成中…" : done ? "已保存 ✓" : "📸 截图分享 · 收藏我的轨迹"}
      </button>
      <p className="loc-share-privacy">
        位置信息仅用于生成此页面，不会存储
      </p>
    </div>
  )
}

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "timemap.png"
  a.click()
  URL.revokeObjectURL(url)
}
