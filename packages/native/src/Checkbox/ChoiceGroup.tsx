import { useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, resolveSpacing, space, type Spacing } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";

export interface ChoiceGroupProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  /** Itens em coluna ou em linha. Padrão: column. */
  orientation?: "column" | "row" | undefined;
  /** Padrão: sm (8). */
  gap?: Spacing | undefined;
  /** radiogroup para escolha única. */
  role?: "radiogroup" | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Moldura dos grupos de escolha: título, itens, ajuda e erro. */
export function ChoiceGroup({ label, description, error, orientation = "column", gap = "sm", role, children, style }: ChoiceGroupProps) {
  const { colors: c } = useCountifyTheme();
  const letra = { fontSize: fontSize.sm, fontFamily: nativeFontFamily[400] };
  const tem = (v: ReactNode) => v !== undefined && v !== null && v !== false && v !== "";
  return (
    <View accessibilityRole={role} accessibilityLabel={typeof label === "string" ? label : undefined} style={[{ gap: space[2] }, style]}>
      {tem(label) && (typeof label === "string" ? <RNText style={[letra, { color: c.text2 }]}>{label}</RNText> : label)}
      <View style={{ flexDirection: orientation, flexWrap: "wrap", gap: resolveSpacing(gap) }}>{children}</View>
      {tem(description) && <RNText style={[letra, { color: c.text2 }]}>{description}</RNText>}
      {tem(error) && <RNText accessibilityRole="alert" accessibilityLiveRegion="polite" style={[letra, { color: c.down }]}>{error}</RNText>}
    </View>
  );
}
