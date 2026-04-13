import "./index.scss";
import { useEffect, useRef, useState } from "react";

// todo 后期确定一个保守时间，预估完成资源加载

function EnterLoad() {
  const [loadPercent, setLoadPercent] = useState(0);
  const percentTimeRef = useRef<null | number>(null);

  useEffect(() => {
    percentTimeRef.current = setInterval(() => {
      setLoadPercent((prevState) => {
        if (prevState < 100) {
          return prevState + 1;
        }
        if (percentTimeRef.current) {
          clearInterval(percentTimeRef.current);
          percentTimeRef.current = null;
        }
        return prevState;
      });
    }, 200);
    return () => {
      if (percentTimeRef.current) {
        clearInterval(percentTimeRef.current);
      }
    };
  }, []);

  return (
    <div className="enter-load">
      <div className="enter-load-tip">准备完毕！</div>
      <div className="enter-load-process">
        <span className="enter-load-process-tip">资源已加载</span>
        &nbsp;{loadPercent}%
      </div>
      <div className="enter-load-line"></div>
    </div>
  );
}

export default EnterLoad;
