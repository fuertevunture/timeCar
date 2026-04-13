import styles from "./index.module.scss";

function ClockRingGraphic() {
  const ticks = 48;
  const cx = 50;
  const cy = 50;
  const rOuter = 46;
  const rInner = 44.2;

  return (
    <svg className={styles.clockRing} viewBox="0 0 100 100" aria-hidden>
      <circle
        cx={cx}
        cy={cy}
        r={rOuter}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.35}
      />
      {Array.from({ length: ticks }, (_, i) => {
        const a = (i / ticks) * Math.PI * 2 - Math.PI / 2;
        const isMajor = i % 4 === 0;
        const r1 = isMajor ? rInner - 1.2 : rInner - 0.55;
        const r2 = rInner;
        const x1 = cx + r1 * Math.cos(a);
        const y1 = cy + r1 * Math.sin(a);
        const x2 = cx + r2 * Math.cos(a);
        const y2 = cy + r2 * Math.sin(a);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={isMajor ? 0.45 : 0.22}
          />
        );
      })}
    </svg>
  );
}

function IconBook() {
  return (
    <svg
      className={styles.actionIcon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 7h8M8 11h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconEye() {
  return (
    <svg
      className={styles.actionIcon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3.25"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function IconMessage() {
  return (
    <svg
      className={styles.actionIcon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Surface：档案封面式入口，与纵向全屏幻灯片中的「surface」路由对应。
 */
function Surface() {
  return (
    <div className={styles.root}>
      <header className={styles.header} data-swiper-parallax="-18%">
        <h1 className={styles.title}>Back to Future</h1>
        <p className={styles.subtitle}>大学生就业想法调查反馈报告</p>
        <p className={styles.subtitle}>时光流转，皆为序章</p>
      </header>

      <div
        className={styles.hero}
        aria-hidden
        data-swiper-parallax="8%"
        data-swiper-parallax-scale="0.92"
      >
        <ClockRingGraphic />
        <div className={styles.cardStack}>
          <span className={styles.card} />
          <span className={styles.card} />
          <span className={styles.card} />
        </div>
      </div>

      <section
        className={styles.status}
        aria-live="polite"
        data-swiper-parallax="-6%"
      >
        <p className={styles.statusLabel}>准备完毕</p>
        <p className={styles.statusValue}>100% Loaded</p>
        <div className={styles.statusRule} />
      </section>

      <nav
        className={styles.actions}
        aria-label="模式选择"
        data-swiper-parallax="4%"
      >
        <button type="button" className={styles.actionBtn}>
          <IconBook />
          总览模式
        </button>
        <button type="button" className={styles.actionBtn}>
          <IconEye />
          预览模式
        </button>
        <button type="button" className={styles.actionBtn}>
          <IconMessage />
          反馈模式
        </button>
      </nav>

      <footer className={styles.footer} data-swiper-parallax="10%">
        <p className={styles.footerText}>The curated ephemera · Est. 2024</p>
      </footer>
    </div>
  );
}

export default Surface;
