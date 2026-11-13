import { useEffect, useState } from "react";

/** O valor só muda depois de `delay` ms sem mudar (busca enquanto se digita). */
export function useDebounce<T>(value: T, delay: number): T {
  const [atrasado, setAtrasado] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setAtrasado(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return atrasado;
}
