import { useColorScheme } from "react-native";
import { CountifyContext, useProviderValue, type CountifyProviderProps } from "./context";

/** React Native. Com auto, segue o modo do aparelho (sem preferência, claro). */
export function CountifyProvider(props: CountifyProviderProps) {
  const sistema = useColorScheme();
  const value = useProviderValue(props, sistema === "dark" ? "dark" : "light");
  return <CountifyContext value={value}>{props.children}</CountifyContext>;
}
