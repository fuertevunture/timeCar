/**
 * Home：纵向幻灯首屏；分层使用 Parallax，与 MainLayout 中 Parallax 模块配合。
 */
function Home() {
  return (
    <div style={{ minHeight: "100%", padding: "2rem", boxSizing: "border-box",background:"red" }}>
      <p
        data-swiper-parallax="-25%"
        data-swiper-parallax-opacity="0.35"
        style={{ fontSize: "4rem", fontWeight: 700, margin: 0, color: "#cbd5e1" }}
      >
        01
      </p>
      <h1 data-swiper-parallax="-12%" style={{ margin: "0.5rem 0 0", fontSize: "1.75rem" }}>
        home
      </h1>
      <p data-swiper-parallax="0" data-swiper-parallax-opacity="0.85" style={{ maxWidth: "28rem", color: "#64748b" }}>
        向上滑动进入 Surface
      </p>
    </div>
  )
}

export default Home