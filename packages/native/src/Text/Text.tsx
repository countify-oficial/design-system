import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, fontWeight, lineHeightPx, nativeFontFamily, type ColorRole, type Size } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import { Text as RNText, type StyleProp, type TextStyle } from "react-native";
import type { PolymorphicProps } from "../polymorphic";
import { useThemeStyle } from "../styles";

export type TextWeight = keyof typeof fontWeight;

export interface TextOwnProps {
  /** Tamanho da letra: xs 13, sm 15, md 17, lg 20, xl 22. Padrão: md. */
  size?: Size | undefined;
  /** Papel de cor dos tokens, no modo em uso. Padrão: text (com inherit, herda). */
  color?: ColorRole | undefined;
  /** Peso: regular 400, medium 500, bold 700 (cada um é uma família da Roboto). Padrão: regular. */
  weight?: TextWeight | undefined;
  /** Alinhamento. start e end viram left e right. */
  align?: "start" | "center" | "end" | "justify" | undefined;
  /** Corta em uma linha, com reticências. */
  truncate?: boolean | undefined;
  /** Corta em tantas linhas, com reticências. */
  lineClamp?: number | undefined;
  /** Dentro de outro Text: herda a letra e a cor dele; size e weight deixam de valer. */
  inherit?: boolean | undefined;
  style?: StyleProp<TextStyle>;
}

export type TextProps<C extends ElementType = typeof RNText> = PolymorphicProps<C, TextOwnProps>;

const alinhamento = { start: "left", center: "center", end: "right", justify: "justify" } as const;

/** Texto com a letra da Countify, nas cores do modo em uso. */
export function Text<C extends ElementType = typeof RNText>(props: TextProps<C>) {
  const {
    component, size = "md", color, weight = "regular", align, truncate, lineClamp, inherit, style, ...rest
  } = useComponentProps("Text", {}, props);
  const { colors } = useCountifyTheme();
  const doTema = useThemeStyle<TextStyle>("Text");
  const Component: ElementType = component ?? RNText;
  const cor = color ?? (inherit ? undefined : "text");
  return (
    <Component
      numberOfLines={truncate ? 1 : lineClamp}
      {...rest}
      style={[
        !inherit && { fontFamily: nativeFontFamily[fontWeight[weight]], fontSize: fontSize[size], lineHeight: lineHeightPx(fontSize[size]) },
        cor && { color: colors[cor] },
        align && { textAlign: alinhamento[align] },
        doTema,
        style,
      ]}
    />
  );
}
