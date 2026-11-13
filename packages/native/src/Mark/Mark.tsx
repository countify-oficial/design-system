import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { tones, type Tone } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, type StyleProp, type TextStyle } from "react-native";

export interface MarkProps {
  /** Tom do fundo (o claro do tom). Padrão: warn. */
  color?: Tone | undefined;
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
}

/** Trecho marcado, dentro de um Text. */
export function Mark(props: MarkProps) {
  const { color = "warn", children, style } = useComponentProps("Mark", {}, props);
  const { colors: c } = useCountifyTheme();
  return <RNText style={[{ backgroundColor: c[tones[color].tint] }, style]}>{children}</RNText>;
}
