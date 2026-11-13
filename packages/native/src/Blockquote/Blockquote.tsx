import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, lineHeightPx, nativeFontFamily, radius, space, tones, type Tone } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import { useThemeStyle } from "../styles";

export interface BlockquoteProps {
  /** Tom da barra e do fundo. Padrão: accent. */
  color?: Tone | undefined;
  /** Quem disse. */
  cite?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Citação, com barra na cor do tom e autor. */
export function Blockquote(props: BlockquoteProps) {
  const { color = "accent", cite, icon, children, style } = useComponentProps("Blockquote", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Blockquote");
  const tom = tones[color];
  const texto = (v: ReactNode, s: object) => (typeof v === "string" ? <RNText style={s}>{v}</RNText> : v);
  return (
    <View
      style={[
        { flexDirection: "row", gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4], borderLeftWidth: space[1], borderColor: c[tom.c], backgroundColor: c[tom.tint], borderTopRightRadius: radius.md, borderBottomRightRadius: radius.md },
        tema,
        style,
      ]}
    >
      {icon !== undefined && <ContentColor value={c[tom.c]}>{icon}</ContentColor>}
      <View style={{ flex: 1, gap: space[2] }}>
        {texto(children, { color: c.text, fontSize: fontSize.md, lineHeight: lineHeightPx(fontSize.md), fontFamily: nativeFontFamily[400] })}
        {cite !== undefined && texto(cite, { color: c.text2, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400] })}
      </View>
    </View>
  );
}
