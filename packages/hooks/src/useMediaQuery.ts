import { useCallback, useSyncExternalStore } from "react";

interface Consulta {
  lista: MediaQueryList;
  avisos: Set<() => void>;
}
// Uma MediaQueryList e um ouvinte por query, para todos os componentes (mil linhas com Menu: um ouvinte, não mil).
// Guardadas por matchMedia: um teste que troca o matchMedia começa do zero.
const porMatchMedia = new WeakMap<object, Map<string, Consulta>>();

function consulta(query: string): Consulta {
  // eslint-disable-next-line @typescript-eslint/unbound-method -- só a identidade da função, como chave; não é chamada solta
  const chave = window.matchMedia;
  let mapa = porMatchMedia.get(chave);
  if (!mapa) {
    mapa = new Map<string, Consulta>();
    porMatchMedia.set(chave, mapa);
  }
  let c = mapa.get(query);
  if (!c) {
    const avisos = new Set<() => void>();
    const lista = window.matchMedia(query);
    lista.addEventListener("change", () => avisos.forEach((avisar) => avisar()));
    c = { lista, avisos };
    mapa.set(query, c);
  }
  return c;
}

/** web: true enquanto a media query vale. No servidor (SSR) devolve initialValue. */
export function useMediaQuery(query: string, initialValue = false): boolean {
  const subscribe = useCallback(
    (avisar: () => void) => {
      const { avisos } = consulta(query);
      avisos.add(avisar);
      return () => {
        avisos.delete(avisar);
      };
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => consulta(query).lista.matches, () => initialValue);
}
