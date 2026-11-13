import { useComponentTheme } from "@countify-oficial/provider";
import { breakpoints, type Responsive } from "@countify-oficial/tokens";
import { useWindowDimensions, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from "react-native";

/** O styles.root do tema para o componente. */
export const useThemeStyle = <S = ViewStyle>(name: string): StyleProp<S> => useComponentTheme(name).styles?.["root"] as StyleProp<S>;

/** O valor do ponto de quebra da largura da tela: lg a partir de 1280, sm a partir de 768, senão base. */
export function useResponsive<T extends string | number>(value: Responsive<T>): T {
  const { width } = useWindowDimensions();
  if (typeof value !== "object") return value;
  if (width >= breakpoints.lg) return value.lg ?? value.sm ?? value.base;
  if (width >= breakpoints.sm) return value.sm ?? value.base;
  return value.base;
}

/** Junta estilos a um style do Pressable, que pode ser função do estado ({ pressed }). */
export function pressableStyle(
  style: PressableProps["style"],
  base: (estado: PressableStateCallbackType) => StyleProp<ViewStyle>,
): (estado: PressableStateCallbackType) => StyleProp<ViewStyle> {
  return (estado) => [base(estado), typeof style === "function" ? style(estado) : style];
}
