import "./index.scss";
import {
  FeedbackIcon,
  StatisticIcon,
  ViewIcon,
} from "@/assets/icons/EnterIcons.tsx";
import type { Mode } from "@/pages/Enter";
import type { SyntheticEvent } from "react";

interface EnterModeProps {
  setMode: (mode: Mode) => void;
}

const modeList = [
  {
    title: "总览模式",
    value: "statistic",
    icon: <StatisticIcon />,
    tip: "无需验证，浏览统计数据",
  },
  {
    title: "浏览模式",
    value: "view",
    icon: <ViewIcon />,
    tip: "需要验证，浏览时光胶囊",
  },
  {
    title: "反馈模式",
    value: "feedback",
    icon: <FeedbackIcon />,
    tip: "需要验证，边反馈边浏览",
  },
];

function EnterMode({ setMode }: EnterModeProps) {
  function handleModeChange(e: SyntheticEvent) {
    const target = e.currentTarget as HTMLElement;
    if (target.dataset.way) {
      setMode(target.dataset.way as Mode);
    }
  }

  return (
    <div className="enter-mode">
      {modeList.map((mode, index) => {
        return (
          <div
            key={index}
            className="enter-mode-way"
            data-way={mode.value}
            onClick={handleModeChange}
          >
            <div className="enter-mode-way-icon">{mode.icon}</div>
            <div className="enter-mode-way-name">{mode.title}</div>
            <div className="enter-mode-way-tip"> {mode.tip}</div>
          </div>
        );
      })}
    </div>
  );
}

export default EnterMode;
