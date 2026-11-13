import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { avatarSize, borderWidth, fontSize, nativeFontFamily, space, state, tones, type Size, type Tone } from "@countify-oficial/tokens";
import { Text as RNText, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from "react-native";

export interface AngleSliderProps {
  value?: number | undefined;
  defaultValue?: number | undefined;
  onChange?: ((value: number) => void) | undefined;
  onChangeEnd?: ((value: number) => void) | undefined;
  step?: number | undefined;
  /** Lado, o dos avatares. Padrão: xl (64). */
  size?: Size | undefined;
  withLabel?: boolean | undefined;
  color?: Tone | undefined;
  disabled?: boolean | undefined;
  label?: string | undefined;
  style?: StyleProp<ViewStyle>;
}

/** Escolhe um ângulo girando o ponteiro. */
export function AngleSlider(props: AngleSliderProps) {
  const { value, defaultValue, onChange, onChangeEnd, step = 1, size = "xl", withLabel = true, color = "accent", disabled, label, style } = useComponentProps("AngleSlider", {}, props);
  const { colors: c } = useCountifyTheme();
  const [angulo, setAngulo] = useControllableState({ value, defaultValue: defaultValue ?? 0, onChange });
  const lado = avatarSize[size];
  const normal = (a: number) => ((Math.round(a / step) * step) % 360 + 360) % 360;
  const doToque = (e: GestureResponderEvent) => {
    const { locationX: x, locationY: y } = e.nativeEvent;
    setAngulo(normal((Math.atan2(x - lado / 2, -(y - lado / 2)) * 180) / Math.PI));
  };
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 359, now: angulo, text: `${angulo} graus` }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => {
        const n = normal(angulo + (e.nativeEvent.actionName === "increment" ? step : -step));
        setAngulo(n);
        onChangeEnd?.(n);
      }}
      onStartShouldSetResponder={() => !disabled}
      onMoveShouldSetResponder={() => !disabled}
      onResponderGrant={doToque}
      onResponderMove={doToque}
      onResponderRelease={() => onChangeEnd?.(angulo)}
      style={[
        { width: lado, height: lado, borderRadius: lado / 2, backgroundColor: c.card, borderWidth: borderWidth.thin, borderColor: c.divider, alignItems: "center", justifyContent: "center" },
        disabled && { opacity: state.disabledOpacity },
        style,
      ]}
    >
      <View pointerEvents="none" style={{ position: "absolute", top: space[1], bottom: space[1], left: space[1], right: space[1], transform: [{ rotate: `${angulo}deg` }] }}>
        <View style={{ alignSelf: "center", width: space[2], height: space[2], borderRadius: space[1], backgroundColor: c[tones[color].fill] }} />
      </View>
      {withLabel && <RNText style={{ color: c.text, fontSize: fontSize.xs, fontFamily: nativeFontFamily[400], fontVariant: ["tabular-nums"] }}>{angulo}°</RNText>}
    </View>
  );
}
