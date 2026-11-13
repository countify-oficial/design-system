import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  children?: ReactNode;
  /** Onde desenhar: um elemento ou um seletor CSS. Sem ele, um div novo no fim do `<body>`, removido ao desmontar. */
  target?: HTMLElement | string | undefined;
}

/** Desenha os filhos fora da árvore do DOM (menus, modais, avisos). Só no navegador: no servidor não desenha nada. */
export function Portal({ children, target }: PortalProps) {
  const [destino, setDestino] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (target !== undefined) {
      // o destino só existe no navegador, depois de montar
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDestino(typeof target === "string" ? document.querySelector<HTMLElement>(target) : target);
      return;
    }
    const div = document.createElement("div");
    div.setAttribute("data-cf-portal", "");
    document.body.appendChild(div);
    setDestino(div);
    return () => div.remove();
  }, [target]);
  return destino ? createPortal(children, destino) : null;
}
