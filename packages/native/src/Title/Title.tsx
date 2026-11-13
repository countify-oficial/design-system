import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { headings, lineHeightPx, nativeFontFamily, overlineTracking, type ColorRole, type Responsive } from "@countify-oficial/tokens";
import { Text as RNText, type StyleProp, type TextProps as RNTextProps, type TextStyle } from "react-native";
import { useContentColor } from "../contentColor";
import { useResponsive, useThemeStyle } from "../styles";

/** Os títulos do guia: tabTitle 32, pageTitle 28, screenTitle 22, section 20, number 28, overline 13 em maiúsculas. */
export type TitleSize = keyof typeof headings;

export interface TitleProps extends Omit<RNTextProps, "style"> {
  /** Nível do título (o leitor de tela anuncia "título"). Padrão: 1. */
  order?: 1 | 2 | 3 | 4 | 5 | 6 | undefined;
  /** Tamanho do guia, pela largura da tela. Padrão: h1 = screenTitle (22) e pageTitle a partir de 768; os outros, section (20). */
  size?: Responsive<TitleSize> | undefined;
  /** Papel de cor. Padrão: text (overline: text2). */
  color?: ColorRole | undefined;
  align?: "start" | "center" | "end" | undefined;
  style?: StyleProp<TextStyle>;
}

const alinhamento = { start: "left", center: "center", end: "right" } as const;

/** Título com a escala do guia da Countify. */
export function Title(props: TitleProps) {
  const { order = 1, size, color, align, style, ...rest } = useComponentProps("Title", {}, props);
  const { colors: c } = useCountifyTheme();
  const doBotao = useContentColor();
  const tema = useThemeStyle<TextStyle>("Title");
  const t = useResponsive<TitleSize>(size ?? (order === 1 ? { base: "screenTitle", sm: "pageTitle" } : "section"));
  const h = headings[t];
  const overline = t === "overline";
  return (
    <RNText
      accessibilityRole="header"
      {...rest}
      style={[
        {
          fontSize: h.fontSize, lineHeight: lineHeightPx(h.fontSize, h.lineHeight), fontFamily: nativeFontFamily[h.fontWeight],
          color: color ? c[color] : overline ? c.text2 : (doBotao ?? c.text),
        },
        overline && { textTransform: "uppercase", letterSpacing: h.fontSize * overlineTracking },
        t === "number" && { fontVariant: ["tabular-nums"] },
        align && { textAlign: alinhamento[align] },
        tema,
        style,
      ]}
    />
  );
}
