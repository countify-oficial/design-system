import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, radius, space, tones, type Tone } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { useThemeStyle } from "../styles";

export interface IndicatorProps extends ViewProps {
  /** Texto do indicador (uma contagem). Sem ele, uma bolinha. */
  label?: ReactNode;
  /** Canto. Padrão: top-end. */
  position?: "top-end" | "top-start" | "bottom-end" | "bottom-start" | undefined;
  /** Tom. Padrão: down (o contador vermelho do menu). */
  color?: Tone | undefined;
  /** Esconde o indicador. */
  disabled?: boolean | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Bolinha ou contador no canto de outro elemento (avisos novos, por exemplo). */
export function Indicator(props: IndicatorProps) {
  const { label, position = "top-end", color = "down", disabled, children, style, ...rest } = useComponentProps("Indicator", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Indicator");
  const comTexto = label !== undefined;
  const lado = comTexto ? space[6] : space[2];
  // metade do indicador para fora do canto, como na web
  const fora = -lado / 2;
  const [v, h] = position.split("-") as ["top" | "bottom", "start" | "end"];
  return (
    <View {...rest} style={[{ position: "relative", alignSelf: "flex-start" }, tema, style]}>
      {children}
      {!disabled && (
        <View
          testID="indicator"
          style={{
            position: "absolute", zIndex: 1, [v]: fora, [h]: fora, minWidth: lado, height: lado, borderRadius: comTexto ? radius.sm : lado / 2,
            paddingHorizontal: comTexto ? space[2] : 0, alignItems: "center", justifyContent: "center", backgroundColor: c[tones[color].fill],
          }}
        >
          {comTexto && <RNText style={{ color: c.bg, fontSize: fontSize.xs, fontFamily: nativeFontFamily[700] }}>{label}</RNText>}
        </View>
      )}
    </View>
  );
}
