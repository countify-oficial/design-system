import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, radius, space, state, borderWidth } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { useThemeStyle } from "../styles";

export interface FieldsetProps {
  legend?: ReactNode;
  /** default: cartão com anel; filled: fundo de chip; unstyled: sem nada. Padrão: default. */
  variant?: "default" | "filled" | "unstyled" | undefined;
  /** Desliga o toque em tudo dentro e anuncia desativado (os campos não herdam disabled como na web). */
  disabled?: boolean | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Agrupa campos com um título. */
export function Fieldset(props: FieldsetProps) {
  const { legend, variant = "default", disabled, children, style } = useComponentProps("Fieldset", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Fieldset");
  return (
    <View
      accessibilityState={{ disabled: !!disabled }}
      pointerEvents={disabled ? "none" : "auto"}
      style={[
        { gap: space[4] },
        variant !== "unstyled" && { padding: space[4], borderRadius: radius.md },
        variant === "default" && { backgroundColor: c.card, borderWidth: borderWidth.thin, borderColor: c.divider },
        variant === "filled" && { backgroundColor: c.chip },
        disabled && { opacity: state.disabledOpacity },
        tema,
        style,
      ]}
    >
      {typeof legend === "string" ? <RNText accessibilityRole="header" style={{ color: c.text, fontSize: fontSize.md, fontFamily: nativeFontFamily[500] }}>{legend}</RNText> : legend}
      {children}
    </View>
  );
}
