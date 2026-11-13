import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { radius as cantos, state, zIndex as camadas, type Size, type zIndex } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

export interface OverlayProps {
  /** Centraliza os filhos. */
  center?: boolean | undefined;
  /** Opacidade do véu. Padrão: 0,72 (identidade). */
  backgroundOpacity?: number | undefined;
  zIndex?: keyof typeof zIndex | undefined;
  radius?: Size | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/** O véu da identidade sobre o pai (position absolute). */
export function Overlay(props: OverlayProps) {
  const { center, backgroundOpacity = state.scrimOpacity, zIndex = "overlay", radius, children, style, testID } = useComponentProps("Overlay", {}, props);
  const { colors: c } = useCountifyTheme();
  const canto = radius ? { borderRadius: cantos[radius], overflow: "hidden" as const } : undefined;
  return (
    <View testID={testID} style={[StyleSheet.absoluteFill, { zIndex: camadas[zIndex] }, canto, center && { alignItems: "center", justifyContent: "center" }, style]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: c.scrim, opacity: backgroundOpacity }]} />
      {children}
    </View>
  );
}
