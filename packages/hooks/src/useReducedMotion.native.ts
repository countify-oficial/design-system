import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/** nativo: true quando o aparelho pede "reduzir movimento" (começa em false até a resposta do sistema). */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let vivo = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => { if (vivo) setReduce(v); });
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    return () => { vivo = false; sub.remove(); };
  }, []);
  return reduce;
}
