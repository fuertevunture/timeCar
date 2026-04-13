import "./index.scss";
import EnterHeader from "@/pages/Enter/EnterHeader";
import EnterMode from "@/pages/Enter/EnterMode";
import { useState } from "react";
import EnterConfirm from "@/pages/Enter/EnterConfirm";
import EnterReport from "@/pages/Enter/EnterReport";
import EnterLoad from "@/pages/Enter/EnterLoad";

// 手动约束不被刘海屏和底部栏屏蔽

// 控制模式

export type Mode = "statistic" | "view" | "feedback" | "";

function Enter() {
  const [mode, setMode] = useState<Mode>("");
  const [identity, setIdentity] = useState("");

  return (
    <div className="enter">
      <EnterHeader></EnterHeader>
      {mode.length === 0 && <EnterReport />}
      {mode.length === 0 && <EnterLoad />}
      {mode.length !== 0 && (
        <EnterConfirm
          identity={identity}
          setIdentity={setIdentity}
        ></EnterConfirm>
      )}
      <EnterMode setMode={setMode}></EnterMode>
      <div className="enter-back">
        <div className="enter-back-line-one"></div>
        <div className="enter-back-line-two"></div>
        <div className="enter-back-line-three"></div>
        <div className="enter-back-line-four"></div>
      </div>
    </div>
  );
}

export default Enter;
