import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { ringProgress, type ColorRole } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useThemeStyle } from "../styles";

export interface RingProgressSection {
  /** De 0 a 100 (a soma das partes não passa de 100). */
  value: number;
  /** Papel de cor. */
  color: ColorRole;
}

export interface RingProgressProps {
  sections: RingProgressSection[];
  /** Lado. Padrão: 120. */
  size?: number | undefined;
  /** Espessura do anel. Padrão: 1/5 do tamanho, como o anel da marca. */
  thickness?: number | undefined;
  /** No centro do anel. */
  label?: ReactNode;
  /** Pontas arredondadas. */
  roundCaps?: boolean | undefined;
  /** Nome para o leitor de tela. */
  accessibilityLabel?: string | undefined;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/** Anel com uma ou mais partes (de 0 a 100), com texto no centro. */
export function RingProgress(props: RingProgressProps) {
  const { sections, size = ringProgress.size, thickness, label, roundCaps, accessibilityLabel, style, testID } = useComponentProps("RingProgress", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("RingProgress");
  const espessura = thickness ?? size * ringProgress.thicknessRatio;
  const r = (size - espessura) / 2;
  const volta = 2 * Math.PI * r;
  const comprimentos = sections.map((s) => (Math.min(100, Math.max(0, s.value)) / 100) * volta);
  const inicios = comprimentos.map((_, i) => comprimentos.slice(0, i).reduce((a, b) => a + b, 0));
  const meio = size / 2;
  return (
    <View testID={testID} accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel} style={[{ width: size, height: size, alignItems: "center", justifyContent: "center" }, tema, style]}>
      <Svg width={size} height={size} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        <Circle cx={meio} cy={meio} r={r} fill="none" stroke={c.borderStrong} strokeWidth={espessura} />
        {sections.map((s, i) => (
          <Circle
            key={i}
            cx={meio}
            cy={meio}
            r={r}
            fill="none"
            stroke={c[s.color]}
            strokeWidth={espessura}
            strokeLinecap={roundCaps ? "round" : "butt"}
            strokeDasharray={`${comprimentos[i] ?? 0} ${volta}`}
            strokeDashoffset={-(inicios[i] ?? 0)}
          />
        ))}
      </Svg>
      {label}
    </View>
  );
}
