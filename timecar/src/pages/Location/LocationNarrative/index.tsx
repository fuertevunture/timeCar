import { useEffect, useRef, useState } from "react"
import "./index.scss"

export type LocationNarrativeProps = {
  text: string
}

const CHAR_MS = 48
const LINE_PAUSE = 260

export default function LocationNarrative({ text }: LocationNarrativeProps) {
  const [revealedCount, setRevealedCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const chars = [...text]

  useEffect(() => {
    setRevealedCount(0)
    let i = 0

    const step = () => {
      if (i >= chars.length) return
      const isPause = chars[i] === "。" || chars[i] === "！" || chars[i] === "？"
      i++
      setRevealedCount(i)
      if (i < chars.length) {
        timerRef.current = setTimeout(step, isPause ? CHAR_MS + LINE_PAUSE : CHAR_MS)
      }
    }

    timerRef.current = setTimeout(step, CHAR_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text])

  return (
    <div className="loc-narrative">
      <div className="loc-narrative-head">
        <span className="loc-narrative-icon" aria-hidden>
          ✨
        </span>
        <span className="loc-narrative-label">时光感悟 · AI 为你写</span>
      </div>
      <p className="loc-narrative-text">
        {chars.map((ch, idx) => (
          <span
            key={idx}
            className={`loc-narrative-char ${idx < revealedCount ? "loc-narrative-char--visible" : ""}`}
          >
            {ch}
          </span>
        ))}
      </p>
      <p className="loc-narrative-note">由规则与关键词为你拼贴的一段话，无需联网生成</p>
    </div>
  )
}
