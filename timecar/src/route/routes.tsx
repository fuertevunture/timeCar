import { Navigate } from "react-router-dom"
import MainLayout from "@/layouts/MainLayout"
import { DEFAULT_SLIDE_PATH, SLIDE_REGISTRY } from "@/app/slideRegistry"

function RoutePlaceholder() {
  return null
}

/**
 *  todo 未来要考虑“总览”、“浏览”、“反馈”三种模式下的宏观页面的并行与串行
 */

/** 子路由 path 段仅来自 SLIDE_REGISTRY，顺序与 Swiper 一致 */
const slideRouteChildren = SLIDE_REGISTRY.map(({ segment }) => ({
  path: segment,
  element: <RoutePlaceholder />,
}))

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to={DEFAULT_SLIDE_PATH} replace /> },
      ...slideRouteChildren,
    ],
  },
]

export default routes
