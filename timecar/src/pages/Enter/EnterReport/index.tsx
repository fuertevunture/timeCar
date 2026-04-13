import "./index.scss";

function ClockRingGraphic() {
  const ticks = 48;
  const cx = 50;
  const cy = 50;
  const rOuter = 46;
  const rInner = 44.2;

  return (
    <svg className="clockRing" viewBox="0 0 100 100" aria-hidden>
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

function EnterReport() {
  return (
    <div
      className="hero"
      aria-hidden
      data-swiper-parallax="8%"
      data-swiper-parallax-scale="0.92"
    >
      <ClockRingGraphic />
      <div className="cardStack">
        <div className="card">
          2022
          <div className="card-title">大一</div>
        </div>
        <div className="card">
          2023
          <div className="card-title">大二</div>
        </div>
        <div className="card">
          2024
          <div className="card-title">大三</div>
        </div>
        <div className="card">
          2025
          <div className="card-title">大四</div>
        </div>
        <div className="card">
          2026
          <div className="card-title">毕业</div>
        </div>
      </div>
    </div>
  );
}

export default EnterReport;
