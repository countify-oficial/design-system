import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, fontSize, nativeFontFamily, radius, space, state, touchTarget } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface SegmentedControlItem {
  value: string;
  label: ReactNode;
  disabled?: boolean | undefined;
}

export interface SegmentedControlProps {
  data: (string | SegmentedControlItem)[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  /** Ocupa a largura toda. Padrão: true no celular. */
  fullWidth?: boolean | undefined;
  disabled?: boolean | undefined;
  accessibilityLabel?: string | undefined;
  style?: StyleProp<ViewStyle>;
}

/** Segmentado: de 2 a 4 opções exclusivas lado a lado. */
export function SegmentedControl(props: SegmentedControlProps) {
  const { data, value, defaultValue, onChange, fullWidth = true, disabled, accessibilityLabel, style } = useComponentProps("SegmentedControl", {}, props);
  const { colors: c } = useCountifyTheme();
  const itens = data.map((d) => (typeof d === "string" ? { value: d, label: d } : d));
  const [valor, setValor] = useControllableState({ value, defaultValue: defaultValue ?? itens[0]?.value ?? "", onChange });
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[{ flexDirection: "row", gap: space[1], padding: space[1], borderRadius: radius.sm, backgroundColor: c.card }, !fullWidth && { alignSelf: "flex-start" }, style]}
    >
      {itens.map((item) => {
        const escolhido = valor === item.value;
        const desligado = disabled || item.disabled;
        return (
          <UnstyledButton
            key={item.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: escolhido, disabled: !!desligado }}
            disabled={desligado}
            onPress={() => setValor(item.value)}
            style={({ pressed }) => [
              { flex: fullWidth ? 1 : undefined, minHeight: touchTarget, paddingHorizontal: space[3], alignItems: "center", justifyContent: "center", borderRadius: radius.xs },
              escolhido && { backgroundColor: c.accentTint, borderWidth: borderWidth.thick, borderColor: c.accent },
              pressed && { opacity: state.pressedOpacity },
              desligado && { opacity: state.disabledOpacity },
            ]}
          >
            {typeof item.label === "string" ? <RNText style={{ color: escolhido ? c.accent : c.text, fontSize: fontSize.sm, fontFamily: nativeFontFamily[500] }}>{item.label}</RNText> : item.label}
          </UnstyledButton>
        );
      })}
    </View>
  );
}
