import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, iconSize, type Size } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

export interface ColorSwatchProps {
  /** A cor mostrada (um dado do app), em qualquer formato que o React Native aceite. */
  color: string;
  /** Lado, o dos ícones: xs 16, sm 18, md 22, lg 28, xl 32. Padrão: lg. */
  size?: Size | undefined;
  /** O anel fino em volta. Padrão: true. */
  withShadow?: boolean | undefined;
  /** Nome da cor para o leitor de tela. */
  accessibilityLabel?: string | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/** Amostra de cor num círculo. */
export function ColorSwatch(props: ColorSwatchProps) {
  const { color, size = "lg", withShadow = true, accessibilityLabel, children, style, testID } = useComponentProps("ColorSwatch", {}, props);
  const { colors: c } = useCountifyTheme();
  const lado = iconSize[size];
  return (
    <View
      testID={testID}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      style={[
        { width: lado, height: lado, borderRadius: lado / 2, backgroundColor: color, alignItems: "center", justifyContent: "center" },
        withShadow && { borderWidth: borderWidth.thin, borderColor: c.divider },
        style,
      ]}
    >
      {children}
    </View>
  );
}
