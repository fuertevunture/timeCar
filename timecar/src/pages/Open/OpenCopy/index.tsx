import { useEffect, useMemo, useRef, useState } from "react"
import "./index.scss"

export type OpenCopyProps = {
  dayCount: number | null
}

const LINE_PAUSE = 320
const CHAR_MS = 50

type Segment = { text: string; cls?: string }
type Line = { segments: Segment[]; lineCls?: string }

function flattenChars(lines: Line[]) {
  const result: { lineIdx: number; segIdx: number; ch: string }[] = []
  lines.forEach((line, li) => {
    line.segments.forEach((seg, si) => {
      for (const ch of seg.text) {
        result.push({ lineIdx: li, segIdx: si, ch })
      }
    })
  })
  return result
}

export default function OpenCopy({ dayCount }: OpenCopyProps) {
  const lines: Line[] = useMemo(
    () => [
      {
        lineCls: "open-copy-line--lead",
        segments: [
          { text: "Hi，" },
          { text: "好久不见", cls: "open-copy-em" },
          { text: "！" },
        ],
      },
      {
        segments: [
          { text: "2022年初冬，你写下了一份关于" },
          { text: "未来", cls: "open-copy-em" },
          { text: "的答案，四年后，它回到了你手中。" },
        ],
      },
      {
        segments: [
          {
            text: dayCount != null ? `${dayCount}` : "一千多",
            cls: "open-copy-em-num",
          },
          { text: "个日夜，你一定经历了很多个" },
          { text: "难忘的时刻", cls: "open-copy-em" },
          { text: "，也收获了非常多不同的体验。" },
        ],
      },
      {
        lineCls: "open-copy-line--closing",
        segments: [
          { text: "现在，请回到过去，和那个回到未来的自己" },
          { text: "对话", cls: "open-copy-em" },
          { text: "。" },
        ],
      },
    ],
    [dayCount],
  )

  const flat = useMemo(() => flattenChars(lines), [lines])
  const [revealedCount, setRevealedCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevLineRef = useRef(0)

  useEffect(() => {
    setRevealedCount(0)
    prevLineRef.current = 0

    let i = 0
    const step = () => {
      if (i >= flat.length) return
      const curLine = flat[i].lineIdx
      const delay =
        curLine !== prevLineRef.current ? CHAR_MS + LINE_PAUSE : CHAR_MS
      prevLineRef.current = curLine
      i++
      setRevealedCount(i)
      if (i < flat.length) {
        timerRef.current = setTimeout(step, delay)
      }
    }

    timerRef.current = setTimeout(step, CHAR_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [flat])

  let globalIdx = 0

  return (
    <article className="open-copy" data-swiper-parallax="-8%">
      {lines.map((line, li) => (
        <p
          key={li}
          className={`open-copy-line ${line.lineCls ?? ""}`}
        >
          {line.segments.map((seg, si) => (
            <span key={si} className={seg.cls ?? ""}>
              {[...seg.text].map((ch) => {
                const idx = globalIdx++
                const visible = idx < revealedCount
                return (
                  <span
                    key={idx}
                    className={`open-copy-char ${visible ? "open-copy-char--visible" : ""}`}
                  >
                    {ch}
                  </span>
                )
              })}
            </span>
          ))}
        </p>
      ))}
    </article>
  )
}
