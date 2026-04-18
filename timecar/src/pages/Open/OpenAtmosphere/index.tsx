import type { CSSProperties } from "react"
import "./index.scss"

function frac(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const SNOW_COUNT = 48
const STAR_COUNT = 72
const FIREFLY_COUNT = 22

/**
 * 全屏氛围层：冬→夏斜向渐变 + 雪花（上部）+ 星空（下部）+ 萤火虫。
 */
export default function OpenAtmosphere() {
  return (
    <div className="open-atmosphere" aria-hidden>
      <div className="open-atmosphere-gradient" />

      <div className="open-atmosphere-stars">
        {Array.from({ length: STAR_COUNT }, (_, i) => {
          const size = 1 + frac(i, 20) * 2.2
          const top = 42 + frac(i, 21) * 58
          const left = frac(i, 22) * 100
          return (
            <span
              key={`star-${i}`}
              className="open-atmosphere-star"
              style={
                {
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  "--star-dur": `${2.5 + frac(i, 23) * 4}s`,
                  "--star-delay": `${-frac(i, 24) * 6}s`,
                  "--star-min": `${0.15 + frac(i, 25) * 0.2}`,
                  "--star-max": `${0.7 + frac(i, 26) * 0.3}`,
                } as CSSProperties
              }
            />
          )
        })}
      </div>

      {Array.from({ length: SNOW_COUNT }, (_, i) => {
        const size = 2 + frac(i, 2) * 5
        return (
          <span
            key={`snow-${i}`}
            className="open-atmosphere-snow"
            style={
              {
                left: `${frac(i, 1) * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDuration: `${7 + frac(i, 3) * 14}s`,
                animationDelay: `${-frac(i, 4) * 22}s`,
                opacity: 0.25 + frac(i, 5) * 0.6,
                "--snow-drift": `${-20 + frac(i, 11) * 40}px`,
              } as CSSProperties
            }
          />
        )
      })}

      {Array.from({ length: FIREFLY_COUNT }, (_, i) => {
        const size = 3 + frac(i, 30) * 4
        return (
          <span
            key={`ff-${i}`}
            className="open-atmosphere-firefly"
            style={
              {
                left: `${frac(i, 31) * 100}%`,
                top: `${40 + frac(i, 32) * 55}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDuration: `${10 + frac(i, 33) * 18}s`,
                animationDelay: `${-frac(i, 34) * 20}s`,
                "--ff-drift": `${-30 + frac(i, 35) * 60}px`,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}
