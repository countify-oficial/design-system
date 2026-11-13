import { useComponentProps } from "@countify-oficial/provider";
import type { ElementType } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import type { PolymorphicProps } from "../polymorphic";
import { useThemeStyle } from "../styles";

export interface AspectRatioOwnProps {
  /** Largura dividida pela altura (16 / 9, 1…). Padrão: 1. */
  ratio?: number | undefined;
  style?: StyleProp<ViewStyle>;
}

export type AspectRatioProps<C extends ElementType = typeof View> = PolymorphicProps<C, AspectRatioOwnProps>;

/** Caixa com proporção fixa. Uma Image dentro precisa de width e height 100%. */
export function AspectRatio<C extends ElementType = typeof View>(props: AspectRatioProps<C>) {
  const { component, ratio = 1, style, ...rest } = useComponentProps("AspectRatio", {}, props);
  const doTema = useThemeStyle("AspectRatio");
  const Component: ElementType = component ?? View;
  return <Component {...rest} style={[{ aspectRatio: ratio, overflow: "hidden" }, doTema, style]} />;
}
