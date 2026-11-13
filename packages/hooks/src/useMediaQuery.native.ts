import { useColorScheme, useWindowDimensions } from "react-native";
import { matchesMediaQuery } from "./mediaQuery";

/** nativo: confere min-width, max-width e prefers-color-scheme contra a tela atual. */
export function useMediaQuery(query: string, _initialValue = false): boolean {
  const { width } = useWindowDimensions();
  const scheme = useColorScheme();
  return matchesMediaQuery(query, { width, colorScheme: scheme === "dark" ? "dark" : "light" });
}
