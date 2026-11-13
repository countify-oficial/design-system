import { useId as useReactId } from "react";

/** Id estável para ligar rótulo e campo; o id passado pelo usuário tem prioridade. */
export function useId(staticId?: string): string {
  const gerado = useReactId();
  return staticId ?? gerado;
}
