import { useNavigate } from "react-router-dom"
import styles from "./index.module.scss"

function FingerprintIcon() {
  return (
    <svg
      className={styles.fingerprint}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <path
        d="M32 16c-8.8 0-16 7.2-16 16v5.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M32 22.8c-5.1 0-9.2 4.1-9.2 9.2v7.2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M32 29.2c-1.5 0-2.8 1.3-2.8 2.8v8.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 39.8c0 9.2 3.6 14.2 8 14.2s8-5 8-14.2v-8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M17 38.5c0 13.4 5.6 22.5 15 22.5s15-9.1 15-22.5V32"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M47 32c0-8.8-7.2-16-16-16"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Open：时光胶囊开启页，使用柔和渐变与环形视觉引导上滑继续。
 */
function Open() {
  const navigate = useNavigate()

  return (
    <div className={styles.root}>
      <div className={styles.noise} aria-hidden />

      <p className={styles.lead} data-swiper-parallax="-14%">
        2022年初冬，我写下了一份关于未来的答案。四年后，它回到我手中。
      </p>

      <section
        className={styles.triggerArea}
        aria-label="时光胶囊入口"
        data-swiper-parallax="4%"
      >
        <div className={styles.outerDash} aria-hidden />
        <div className={styles.outerRing} aria-hidden />
        <div className={styles.innerRing} aria-hidden />
        <span className={styles.ribbon} aria-hidden>
          见信如晤
        </span>
        <button
          type="button"
          className={styles.triggerButton}
          onClick={() => navigate("/enter")}
        >
          <FingerprintIcon />
          <span className={styles.triggerLabel}>
            点击开启
            <br />
            时光胶囊
          </span>
        </button>
      </section>

      <footer className={styles.footer} data-swiper-parallax="12%">
        <p className={styles.swipeHint}>SWIPE TO UNROLL</p>
        <span className={styles.chevrons} aria-hidden>
          <i />
          <i />
        </span>
      </footer>

      <span className={styles.glassCard} aria-hidden />
    </div>
  )
}

export default Open
