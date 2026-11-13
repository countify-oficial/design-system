import { useCallback, useEffect, useRef, useState } from "react";

export interface ControllableStateOptions<T> {
  /** valor controlado: quando vem, o estado interno é ignorado */
  value?: T | undefined;
  /** valor inicial do modo não controlado */
  defaultValue: T;
  onChange?: ((value: T) => void) | undefined;
}

/**
 * Estado que funciona controlado (value + onChange) ou não controlado (defaultValue), como um input do React.
 * Devolve [valor, mudar, controlado]. onChange só é chamado quando o valor muda de fato.
 */
export function useControllableState<T>({ value, defaultValue, onChange }: ControllableStateOptions<T>) {
  const [interno, setInterno] = useState(defaultValue);
  const controlado = value !== undefined;
  const atual = controlado ? value : interno;
  // o último valor e o último onChange, para mudanças em sequência no mesmo evento (setValue(v => v + 1) duas vezes)
  const ultimo = useRef(atual);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    ultimo.current = atual;
    onChangeRef.current = onChange;
  });

  const setValue = useCallback(
    (proximo: T | ((anterior: T) => T)) => {
      const novo = typeof proximo === "function" ? (proximo as (anterior: T) => T)(ultimo.current) : proximo;
      if (Object.is(novo, ultimo.current)) return;
      ultimo.current = novo;
      if (!controlado) setInterno(novo);
      onChangeRef.current?.(novo);
    },
    [controlado],
  );

  return [atual, setValue, controlado] as const;
}
