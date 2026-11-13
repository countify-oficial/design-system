import { useEffect } from "react";

// várias janelas abertas: a página só volta a rolar quando a última fecha
let travas = 0;
let antes = "";

/** Trava a rolagem da página enquanto ativo (Modal, Drawer). */
export function useScrollLock(ativo: boolean): void {
  useEffect(() => {
    if (!ativo) return;
    if (travas++ === 0) {
      antes = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (--travas === 0) document.body.style.overflow = antes;
    };
  }, [ativo]);
}
