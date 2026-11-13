import { useComponentProps } from "@countify-oficial/provider";
import { gutter } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import type { PolymorphicProps } from "../polymorphic";
import { useResponsive, useThemeStyle } from "../styles";

export type ContainerProps<C extends ElementType = typeof View> = PolymorphicProps<C, { style?: StyleProp<ViewStyle> }>;

/** Margem lateral da tela: 20 no celular, 32 a partir de 768 (tablet). */
export function Container<C extends ElementType = typeof View>(props: ContainerProps<C>) {
  const { component, style, ...rest } = useComponentProps("Container", {}, props);
  const doTema = useThemeStyle("Container");
  const margem = useResponsive({ base: gutter.mobile, sm: gutter.desktop });
  const Component: ElementType = component ?? View;
  return <Component {...rest} style={[{ paddingHorizontal: margem }, doTema, style]} />;
}
