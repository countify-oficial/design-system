import { useComponentProps } from "@countify-oficial/provider";
import type { ElementType } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { PolymorphicProps } from "../polymorphic";
import { useThemeStyle } from "../styles";

export interface CenterOwnProps {
  /** Só o tamanho do conteúdo (alignSelf: flex-start), em vez de ocupar a largura toda. */
  inline?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}

export type CenterProps<C extends ElementType = typeof View> = PolymorphicProps<C, CenterOwnProps>;

const s = StyleSheet.create({ centro: { alignItems: "center", justifyContent: "center" }, inline: { alignSelf: "flex-start" } });

/** Centraliza o conteúdo na horizontal e na vertical. */
export function Center<C extends ElementType = typeof View>(props: CenterProps<C>) {
  const { component, inline, style, ...rest } = useComponentProps("Center", {}, props);
  const doTema = useThemeStyle("Center");
  const Component: ElementType = component ?? View;
  return <Component {...rest} style={[s.centro, inline && s.inline, doTema, style]} />;
}
