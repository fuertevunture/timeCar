import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import useAllStore from "@/stores/all"
import OpenAtmosphere from "./OpenAtmosphere"
import OpenCapsuleTrigger from "./OpenCapsuleTrigger"
import OpenCopy from "./OpenCopy"
import { daysSinceCreatAt } from "./utils/parseCreatAt"
import "./index.scss"

/**
 * Open：时光胶囊开启页，全文同一屏；点击按钮进入 Enter 预览。
 */
function Open() {
  const navigate = useNavigate()
  const creatAt = useAllStore((s:any) => (s.all as { creatAt?: string }).creatAt)
  // const creatAt = '2022/11/24 13:33:31';
    const dayCount = useMemo(() => daysSinceCreatAt(creatAt), [creatAt])

  return (
    <div className="open-page">
      <OpenAtmosphere />
      <div className="open-page-noise" aria-hidden />
      <div className="open-page-main">
        <OpenCopy dayCount={dayCount} />
        <OpenCapsuleTrigger onOpen={() => navigate("/location")} />
      </div>
      <span className="open-page-glass" aria-hidden />
    </div>
  )
}

export default Open
