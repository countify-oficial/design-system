import { useCallback, useSyncExternalStore } from "react";

/** web: true enquanto a media query vale. No servidor (SSR) devolve initialValue. */
export function useMediaQuery(query: string, initialValue = false): boolean {
  const subscribe = useCallback(
    (avisar: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", avisar);
      return () => mql.removeEventListener("change", avisar);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => initialValue);
}
