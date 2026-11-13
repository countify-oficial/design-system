import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, fontSize, nativeFontFamily, space, type ColorRole } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { useThemeStyle } from "../styles";

export interface DividerProps extends Omit<ViewProps, "children"> {
  /** Padrão: horizontal. */
  orientation?: "horizontal" | "vertical" | undefined;
  /** Linha cheia ou tracejada. Padrão: solid. */
  variant?: "solid" | "dashed" | undefined;
  /** Papel de cor da linha. Padrão: divider. */
  color?: ColorRole | undefined;
  /** Texto no meio da linha (só na horizontal). */
  label?: ReactNode;
  /** Onde fica o texto. Padrão: center. */
  labelPosition?: "left" | "center" | "right" | undefined;
  style?: StyleProp<ViewStyle>;
}

/** Linha que separa conteúdos, na cor da divisória. */
export function Divider(props: DividerProps) {
  const { orientation = "horizontal", variant = "solid", color = "divider", label, labelPosition = "center", style, ...rest } =
    useComponentProps("Divider", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Divider");
  const linha: ViewStyle =
    orientation === "vertical"
      ? { alignSelf: "stretch", borderLeftWidth: borderWidth.thin, borderStyle: variant, borderColor: c[color] }
      : { borderTopWidth: borderWidth.thin, borderStyle: variant, borderColor: c[color] };
  const papel = { accessibilityRole: "none" as const, importantForAccessibility: "no" as const };
  if (label === undefined || orientation === "vertical") return <View {...papel} {...rest} style={[linha, tema, style]} />;
  return (
    <View {...papel} {...rest} style={[{ flexDirection: "row", alignItems: "center", gap: space[2] }, tema, style]}>
      {labelPosition !== "left" && <View style={[linha, { flex: 1 }]} />}
      {typeof label === "string" ? <RNText style={{ color: c.text2, fontSize: fontSize.xs, fontFamily: nativeFontFamily[400] }}>{label}</RNText> : label}
      {labelPosition !== "right" && <View style={[linha, { flex: 1 }]} />}
    </View>
  );
}
