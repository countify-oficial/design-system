import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, lineHeightPx, nativeMonoFontFamily, radius, space } from "@countify-oficial/tokens";
import { Text as RNText, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { useThemeStyle } from "../styles";

export interface CodeProps {
  children?: string | undefined;
  /** Bloco em vez de trecho na linha. */
  block?: boolean | undefined;
  style?: StyleProp<ViewStyle | TextStyle>;
}

/** Código em letra de largura fixa: um trecho (dentro de um Text) ou um bloco. */
export function Code(props: CodeProps) {
  const { children, block, style } = useComponentProps("Code", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle<TextStyle>("Code");
  const letra: TextStyle = { fontFamily: nativeMonoFontFamily[400], fontSize: fontSize.xs, color: c.text };
  if (block) {
    return (
      <View style={[{ backgroundColor: c.chip, borderRadius: radius.sm, paddingVertical: space[3], paddingHorizontal: space[4] }, style]}>
        <RNText style={[letra, { lineHeight: lineHeightPx(fontSize.xs) }, tema]}>{children}</RNText>
      </View>
    );
  }
  return <RNText style={[letra, { backgroundColor: c.chip }, tema, style]}>{children}</RNText>;
}
