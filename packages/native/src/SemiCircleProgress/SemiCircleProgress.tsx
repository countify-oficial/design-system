import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { ringProgress, type ColorRole } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useThemeStyle } from "../styles";

export interface SemiCircleProgressProps {
  /** De 0 a 100. */
  value: number;
  /** Papel de cor da parte cheia. Padrão: accent. */
  color?: ColorRole | undefined;
  /** Largura. Padrão: 200. */
  size?: number | undefined;
  /** Espessura. Padrão: 1/5 da largura. */
  thickness?: number | undefined;
  /** Arco para cima (up) ou para baixo (down). Padrão: up. */
  orientation?: "up" | "down" | undefined;
  /** Texto junto da base do arco. */
  label?: ReactNode;
  accessibilityLabel?: string | undefined;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/** Meio anel de progresso (de 0 a 100). */
export function SemiCircleProgress(props: SemiCircleProgressProps) {
  const { value, color = "accent", size = ringProgress.semicircleSize, thickness, orientation = "up", label, accessibilityLabel, style, testID } =
    useComponentProps("SemiCircleProgress", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("SemiCircleProgress");
  const espessura = thickness ?? size * ringProgress.thicknessRatio;
  const r = (size - espessura) / 2;
  const altura = size / 2 + espessura / 2;
  const meio = Math.PI * r;
  const v = Math.min(100, Math.max(0, value));
  const y = orientation === "up" ? altura - espessura / 2 : espessura / 2;
  const arco = `M ${espessura / 2} ${y} A ${r} ${r} 0 0 ${orientation === "up" ? 1 : 0} ${size - espessura / 2} ${y}`;
  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: v }}
      style={[{ width: size, height: altura, alignItems: "center", justifyContent: orientation === "up" ? "flex-end" : "flex-start" }, tema, style]}
    >
      <Svg width={size} height={altura} style={{ position: "absolute" }}>
        <Path d={arco} fill="none" stroke={c.borderStrong} strokeWidth={espessura} />
        <Path d={arco} fill="none" stroke={c[color]} strokeWidth={espessura} strokeDasharray={`${(v / 100) * meio} ${meio}`} />
      </Svg>
      {label}
    </View>
  );
}
