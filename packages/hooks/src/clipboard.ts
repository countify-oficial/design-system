import { useCallback, useEffect, useRef, useState } from "react";

export interface ClipboardOptions {
  /** quanto tempo "copiado" fica true, em ms */
  timeout?: number;
}

// o estado (copiado, erro, tempo) é o mesmo nas duas plataformas; muda só quem escreve na área de transferência
export function createUseClipboard(write: (text: string) => Promise<unknown>) {
  return function useClipboard({ timeout = 2000 }: ClipboardOptions = {}) {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
    useEffect(() => () => clearTimeout(timer.current), []);

    const copy = useCallback(
      async (text: string) => {
        clearTimeout(timer.current);
        try {
          await write(text);
          setError(null);
          setCopied(true);
          timer.current = setTimeout(() => setCopied(false), timeout);
        } catch (e) {
          setCopied(false);
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      },
      [timeout],
    );
    const reset = useCallback(() => {
      clearTimeout(timer.current);
      setCopied(false);
      setError(null);
    }, []);
    return { copy, copied, error, reset };
  };
}
