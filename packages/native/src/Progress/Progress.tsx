import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, space, tones, type Tone } from "@countify-oficial/tokens";
import { View, type AccessibilityValue, type StyleProp, type ViewStyle } from "react-native";
import { useThemeStyle } from "../styles";

export interface ProgressProps {
  /** De 0 a 100. */
  value: number;
  /** Tom da parte cheia. Padrão: accent. */
  color?: Tone | undefined;
  /** Onde fica a meta, de 0 a 100. */
  marker?: number | undefined;
  /** Nome para o leitor de tela. */
  accessibilityLabel?: string | undefined;
  /** Troca o valor lido pelo leitor de tela (min, max, now e text). Padrão: de 0 a 100, com o value. */
  accessibilityValue?: AccessibilityValue | undefined;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

const limitar = (n: number) => Math.min(100, Math.max(0, n));

/** Barra de progresso, com meta opcional. */
export function Progress(props: ProgressProps) {
  const { value, color = "accent", marker, accessibilityLabel, accessibilityValue, style, testID } = useComponentProps("Progress", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Progress");
  const v = limitar(value);
  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: v, ...accessibilityValue }}
      style={[{ height: space[2], borderRadius: space[1], backgroundColor: c.borderStrong }, tema, style]}
    >
      <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${v}%`, borderRadius: space[1], backgroundColor: c[tones[color].fill] }} />
      {marker !== undefined && (
        <View
          style={{
            // passa 4 da barra em cima e embaixo: 16 na barra de 8, e acompanha uma barra mais alta (o Meter lg)
            position: "absolute", top: -space[1], bottom: -space[1], left: `${limitar(marker)}%`, width: 2 * borderWidth.thin,
            marginLeft: -borderWidth.thin, borderRadius: borderWidth.thin, backgroundColor: c.text,
          }}
        />
      )}
    </View>
  );
}
