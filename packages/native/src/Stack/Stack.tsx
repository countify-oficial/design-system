import { useComponentProps } from "@countify-oficial/provider";
import { resolveSpacing, type Spacing } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import type { PolymorphicProps } from "../polymorphic";
import { useThemeStyle } from "../styles";

export interface StackOwnProps {
  /** Espaço entre os itens: xs–xl ou degrau da grade de 4 (3 = 12). Padrão: md. */
  gap?: Spacing | undefined;
  /** alignItems. Padrão: stretch. */
  align?: ViewStyle["alignItems"];
  /** justifyContent. Padrão: flex-start. */
  justify?: ViewStyle["justifyContent"];
  style?: StyleProp<ViewStyle>;
}

export type StackProps<C extends ElementType = typeof View> = PolymorphicProps<C, StackOwnProps>;

/** Itens um embaixo do outro, com espaço entre eles. */
export function Stack<C extends ElementType = typeof View>(props: StackProps<C>) {
  const { component, gap = "md", align, justify, style, ...rest } = useComponentProps("Stack", {}, props);
  const doTema = useThemeStyle("Stack");
  const Component: ElementType = component ?? View;
  return <Component {...rest} style={[{ flexDirection: "column", gap: resolveSpacing(gap), alignItems: align, justifyContent: justify }, doTema, style]} />;
}
