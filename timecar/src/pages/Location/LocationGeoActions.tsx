import { useState } from "react"
import styles from "./LocationGeoActions.module.scss"

export type LocationGeoActionsProps = {
  geoState: "idle" | "loading" | "success" | "denied" | "error"
  onRetryGeo: () => void
  onManualCity: (city: string) => void
}

export default function LocationGeoActions({
  geoState,
  onRetryGeo,
  onManualCity,
}: LocationGeoActionsProps) {
  const [manualInput, setManualInput] = useState("")
  const [showManual, setShowManual] = useState(false)

  if (geoState === "success" && !showManual) return null

  const submit = () => {
    const v = manualInput.trim()
    if (v) {
      onManualCity(v)
      setShowManual(false)
      setManualInput("")
    }
  }

  if (geoState === "loading") {
    return (
      <div className={styles.box}>
        <p className={styles.note}>正在请求定位权限并解析城市…</p>
      </div>
    )
  }

  return (
    <div className={styles.box}>
      <div className={styles.row}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => void onRetryGeo()}
        >
          重新定位
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => setShowManual(true)}
        >
          手动输入城市
        </button>
      </div>
      {showManual ? (
        <div className={styles.manual}>
          <input
            className={styles.input}
            placeholder="例如：杭州"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <button type="button" className={styles.btn} onClick={submit}>
            确定
          </button>
        </div>
      ) : null}
    </div>
  )
}
