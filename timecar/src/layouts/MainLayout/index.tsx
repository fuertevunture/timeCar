import { Suspense, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  A11y,
  EffectFade,
  Navigation,
  Pagination,
  Parallax,
} from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperClass } from "swiper"
import {
  DEFAULT_SLIDE_PATH,
  LAZY_SLIDES,
  ORDERED_PATHS,
  PREFETCH_NEIGHBOR_RADIUS,
  slideChunks,
  type SlidePath,
} from "@/app/slideRegistry"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/a11y"
import "swiper/css/effect-fade"

/** 与 Swiper `speed` 一致，便于程序性 slideTo 与淡入淡出时长对齐 */
const SLIDE_TRANSITION_MS = 520

function SlideFallback() {
  return <div className="slide-suspense-fallback" aria-busy="true" aria-label="加载中" />
}

/**
 * 页面切换：手势驱动 Swiper；`onSlideChange` 对齐路由；URL 变化时用 `skipNavigationRef` + `slideTo` 同步索引。
 * 过渡动效：`EffectFade` 交叉淡入淡出 + `Parallax`（各页内 `data-swiper-parallax-*`）。
 */

function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const swiperRef = useRef<SwiperClass | null>(null)
  const skipNavigationRef = useRef(false)

  const pathIndex = ORDERED_PATHS.indexOf(location.pathname as SlidePath)
  const activeIndex = pathIndex >= 0 ? pathIndex : 0

  useEffect(() => {
    if (pathIndex < 0) {
      navigate(DEFAULT_SLIDE_PATH, { replace: true })
    }
  }, [pathIndex, navigate])

  useEffect(() => {
    if (pathIndex < 0) return
    for (let d = -PREFETCH_NEIGHBOR_RADIUS; d <= PREFETCH_NEIGHBOR_RADIUS; d++) {
      const i = pathIndex + d
      if (i >= 0 && i < slideChunks.length) {
        void slideChunks[i]()
      }
    }
  }, [pathIndex])

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper || pathIndex < 0) return
    if (swiper.activeIndex === pathIndex) return
    skipNavigationRef.current = true
    swiper.slideTo(pathIndex, 0)
  }, [location.pathname, pathIndex])

  const onSlideChange = (swiper: SwiperClass) => {
    if (skipNavigationRef.current) {
      skipNavigationRef.current = false
      return
    }
    const idx = swiper.activeIndex
    const target = ORDERED_PATHS[idx]
    if (target && location.pathname !== target) {
      navigate(target)
    }
  }

  return (
    <Swiper
      modules={[A11y, Pagination, Navigation, EffectFade, Parallax]}
      direction="vertical"
      spaceBetween={0}
      slidesPerView={1}
      speed={SLIDE_TRANSITION_MS}
      watchSlidesProgress
      resistanceRatio={0.55}
      initialSlide={activeIndex}
      onSwiper={(swiper) => {
        swiperRef.current = swiper
      }}
      onSlideChange={onSlideChange}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      className="main-swiper main-swiper--fade"
    >
      {LAZY_SLIDES.map((LazyPage, i) => (
        <SwiperSlide key={ORDERED_PATHS[i]} className="main-swiper-slide">
          <Suspense fallback={<SlideFallback />}>
            <LazyPage />
          </Suspense>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default MainLayout
