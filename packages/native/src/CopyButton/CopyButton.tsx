import { useClipboard } from "@countify-oficial/hooks";
import type { ReactNode } from "react";

export interface CopyButtonProps {
  /** O texto que vai para a área de transferência. */
  value: string;
  /** Por quanto tempo `copied` fica true, em ms. Padrão: 2000. */
  timeout?: number | undefined;
  /** Desenha o botão: recebe copied e a função copy. */
  children: (estado: { copied: boolean; copy: () => void }) => ReactNode;
}

/** Copia um texto (pelo expo-clipboard) e diz por um tempo que copiou. */
export function CopyButton({ value, timeout, children }: CopyButtonProps) {
  const { copied, copy } = useClipboard(timeout === undefined ? {} : { timeout });
  return children({ copied, copy: () => void copy(value) });
}
