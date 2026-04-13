import "./index.scss";

import type { FormEvent } from "react";
import { FingerprintIcon } from "@/assets/icons/EnterIcons.tsx";
import { useNavigate } from "react-router-dom";

interface EnterConfirmProps {
  identity: string;
  setIdentity: (identity: string) => void;
}

function EnterConfirm({ identity, setIdentity }: EnterConfirmProps) {
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // 校验与接口在业务确定后接入
    navigate("/open");
  }

  return (
    <div className="enter-confirm">
      <form
        className="enter-confirm-panel"
        onSubmit={handleSubmit}
        noValidate
        aria-label="身份验证"
      >
        <FingerprintIcon />
        <h2 className="enter-confirm-title">Identity Access</h2>
        <div className="enter-confirm-field">
          <input
            id="enter-confirm-identity"
            className="enter-confirm-input"
            name="identity"
            type="text"
            inputMode="text"
            autoComplete="timecar"
            aria-label="学号或手机号"
            placeholder="输入预留的邮箱或手机号"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
          />
          <button className="enter-confirm-submit" type="submit">
            验证 →
          </button>
        </div>
        <p className="enter-confirm-footer">隐私将受到保护</p>
      </form>
    </div>
  );
}

export default EnterConfirm;
