import FingerprintIcon from "../FingerprintIcon"
import "./index.scss"

export type OpenCapsuleTriggerProps = {
  onOpen: () => void
}

export default function OpenCapsuleTrigger({ onOpen }: OpenCapsuleTriggerProps) {
  return (
    <div className="open-capsule-wrap">
      <section className="open-capsule" aria-label="时光胶囊入口">
        <div className="open-capsule-dash" aria-hidden />
        <div className="open-capsule-ring-outer" aria-hidden />
        <div className="open-capsule-ring-inner" aria-hidden />
        <div className="open-capsule-glow" aria-hidden />
        <span className="open-capsule-ribbon" aria-hidden>
          见信如晤
        </span>
        <button type="button" className="open-capsule-btn" onClick={onOpen}>
          <span className="open-capsule-btn-motion">
            <FingerprintIcon />
            <span className="open-capsule-btn-label">
              点击开启
              <br />
              时光胶囊
            </span>
          </span>
        </button>
      </section>
    </div>
  )
}
