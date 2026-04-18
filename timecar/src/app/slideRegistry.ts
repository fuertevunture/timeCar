/**
 * 幻灯片唯一数据源：新增页面只在此处追加一条（segment + loader）。
 * 派生 ORDERED_PATHS / LAZY_SLIDES / slideChunks；路由子 path 与之一致。
 */
import { lazy, type ComponentType } from "react";

export type SlideLoader = () => Promise<{ default: ComponentType<object> }>;

export type SlideDef = {
  segment: string;
  loader: SlideLoader;
};

/** 当前索引 ±R 范围内的 chunk 会被 void import() 预取 */
export const PREFETCH_NEIGHBOR_RADIUS = 1;

export const SLIDE_REGISTRY = [
  { segment: "home", loader: () => import("@/pages/Home") },
  { segment: "enter", loader: () => import("@/pages/Enter") },
  { segment: "open", loader: () => import("@/pages/Open") },
  { segment: "location", loader: () => import("@/pages/Location") },
] as const satisfies readonly SlideDef[];

export type SlidePath = `/${(typeof SLIDE_REGISTRY)[number]["segment"]}`;

export const ORDERED_PATHS: readonly SlidePath[] = SLIDE_REGISTRY.map(
  (item) => `/${item.segment}`,
) as readonly SlidePath[];

export const LAZY_SLIDES = SLIDE_REGISTRY.map((item) => lazy(item.loader));

export const slideChunks = SLIDE_REGISTRY.map((item) => item.loader);

/** 根路径重定向与非法 path 回退 */
export const DEFAULT_SLIDE_PATH: SlidePath = `/${SLIDE_REGISTRY[0].segment}`;
