import { useCallback, useRef, useState } from "react";

export interface DisclosureCallbacks {
  onOpen?: (() => void) | undefined;
  onClose?: (() => void) | undefined;
}

/** Aberto ou fechado (menu, folha, modal). onOpen e onClose só disparam quando o estado muda. */
export function useDisclosure(initialState = false, { onOpen, onClose }: DisclosureCallbacks = {}) {
  const [opened, setOpened] = useState(initialState);
  // o estado de agora, lido nos cliques; os avisos ficam fora do setState (o modo estrito chama o setState duas vezes)
  const atual = useRef(initialState);
  const set = useCallback(
    (proximo: boolean) => {
      if (atual.current === proximo) return;
      atual.current = proximo;
      setOpened(proximo);
      (proximo ? onOpen : onClose)?.();
    },
    [onOpen, onClose],
  );
  const open = useCallback(() => set(true), [set]);
  const close = useCallback(() => set(false), [set]);
  const toggle = useCallback(() => set(!atual.current), [set]);
  return [opened, { open, close, toggle }] as const;
}
