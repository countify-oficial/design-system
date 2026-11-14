import { useEffect, useRef } from "react";

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

// janelas abertas, da de baixo para a de cima
const abertas: object[] = [];

/** Esc fecha a janela (Modal, Drawer) só quando ela é a de cima: com uma sobre a outra, o Esc fecha uma de cada vez. */
export function useCloseOnEscape(aberta: boolean, fechar: () => void): void {
  // o fechar mais novo, sem reabrir o efeito (reabrir poria esta janela no topo da pilha)
  const aoFechar = useRef(fechar);
  useEffect(() => {
    aoFechar.current = fechar;
  });
  useEffect(() => {
    if (!aberta) return;
    const eu = {};
    abertas.push(eu);
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape" && abertas.at(-1) === eu) aoFechar.current();
    };
    document.addEventListener("keydown", aoTeclar);
    return () => {
      abertas.splice(abertas.indexOf(eu), 1);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberta]);
}
