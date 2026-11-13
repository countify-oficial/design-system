import { useMediaQuery } from "./useMediaQuery";

/** web: true quando o sistema pede "reduzir movimento". */
export const useReducedMotion = (): boolean => useMediaQuery("(prefers-reduced-motion: reduce)");
