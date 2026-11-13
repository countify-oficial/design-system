import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, fontSize, nativeMonoFontFamily, radius, space } from "@countify-oficial/tokens";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { useThemeStyle } from "../styles";

export interface KbdProps {
  children?: string | undefined;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/** Tecla do teclado (Ctrl, K…), em letra de largura fixa. */
export function Kbd(props: KbdProps) {
  const { children, style, testID } = useComponentProps("Kbd", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Kbd");
  return (
    <View
      testID={testID}
      style={[
        { alignSelf: "flex-start", minHeight: space[6], justifyContent: "center", paddingHorizontal: space[2], borderRadius: radius.xs, backgroundColor: c.chip, borderWidth: borderWidth.thin, borderColor: c.borderStrong },
        tema,
        style,
      ]}
    >
      <RNText style={{ color: c.label, fontSize: fontSize.xs, fontFamily: nativeMonoFontFamily[500] }}>{children}</RNText>
    </View>
  );
}
