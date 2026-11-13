import { useControllableState } from "@countify-oficial/hooks";
import { formatColor, parseColor, useComponentProps, useCountifyTheme, useMessages, type ColorFormat, type HSVA } from "@countify-oficial/provider";
import { borderWidth, radius, space, touchTarget } from "@countify-oficial/tokens";
import { useState } from "react";
import { View, type GestureResponderEvent, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { ColorSwatch } from "../ColorSwatch/ColorSwatch";
import { AlphaSlider, HueSlider } from "../Slider/Slider";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface ColorPickerProps {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  onChangeEnd?: ((value: string) => void) | undefined;
  format?: ColorFormat | undefined;
  swatches?: string[] | undefined;
  withPicker?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}

const PRETO: HSVA = { h: 0, s: 0, v: 0, a: 1 };

/** Escolhe uma cor: área de saturação e brilho, matiz, transparência e cores prontas. */
export function ColorPicker(props: ColorPickerProps) {
  const messages = useMessages();
  const { value, defaultValue, onChange, onChangeEnd, format = "hex", swatches, withPicker = true, style } = useComponentProps("ColorPicker", {}, props);
  const { colors: c } = useCountifyTheme();
  const [texto, setTexto] = useControllableState({ value, defaultValue: defaultValue ?? "#000000", onChange });
  const [ultimo, setUltimo] = useState<HSVA>(() => parseColor(texto) ?? PRETO);
  const [area, setArea] = useState({ w: 0, h: 0 });
  const lida = parseColor(texto);
  const cor = lida ? { ...lida, h: lida.s === 0 || lida.v === 0 ? ultimo.h : lida.h } : ultimo;
  const mudar = (nova: HSVA, fim = false) => {
    setUltimo(nova);
    const t = formatColor(nova, format);
    setTexto(t);
    if (fim) onChangeEnd?.(t);
  };
  const doToque = (e: GestureResponderEvent) => {
    if (area.w === 0) return;
    const s = Math.min(100, Math.max(0, (e.nativeEvent.locationX / area.w) * 100));
    const v = Math.min(100, Math.max(0, 100 - (e.nativeEvent.locationY / area.h) * 100));
    mudar({ ...cor, s, v });
  };
  const lado = space[6];
  return (
    <View style={[{ gap: space[3] }, style]}>
      {withPicker && (
        <>
          <View
            onLayout={(e) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={doToque}
            onResponderMove={doToque}
            onResponderRelease={() => onChangeEnd?.(texto)}
            style={{ aspectRatio: 2, borderRadius: radius.sm, overflow: "hidden" }}
          >
            {/* preto e branco aqui são a conta do espaço de cor (HSV), não cores da identidade */}
            <Svg width="100%" height="100%" pointerEvents="none">
              <Defs>
                <LinearGradient id="branco" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset={0} stopColor="white" stopOpacity={1} />
                  <Stop offset={1} stopColor="white" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient id="preto" x1="0" y1="1" x2="0" y2="0">
                  <Stop offset={0} stopColor="black" stopOpacity={1} />
                  <Stop offset={1} stopColor="black" stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill={`hsl(${cor.h}, 100%, 50%)`} />
              <Rect width="100%" height="100%" fill="url(#branco)" />
              <Rect width="100%" height="100%" fill="url(#preto)" />
            </Svg>
            <View
              accessible
              accessibilityRole="adjustable"
              accessibilityLabel={messages.saturation}
              accessibilityValue={{ min: 0, max: 100, now: Math.round(cor.s), text: `saturação ${Math.round(cor.s)}%, brilho ${Math.round(cor.v)}%` }}
              accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
              onAccessibilityAction={(e) => mudar({ ...cor, s: Math.min(100, Math.max(0, cor.s + (e.nativeEvent.actionName === "increment" ? 5 : -5))) }, true)}
              pointerEvents="none"
              style={{
                position: "absolute", left: `${cor.s}%`, top: `${100 - cor.v}%`, marginLeft: -lado / 2, marginTop: -lado / 2, width: lado, height: lado,
                borderRadius: lado / 2, borderWidth: space[1], borderColor: c.card, backgroundColor: formatColor({ ...cor, a: 1 }, "hex"),
              }}
            />
          </View>
          <HueSlider value={Math.round(cor.h)} onChange={(h) => mudar({ ...cor, h })} onChangeEnd={() => onChangeEnd?.(texto)} />
          {format.endsWith("a") && <AlphaSlider color={formatColor({ ...cor, a: 1 }, "hex")} value={cor.a} onChange={(a) => mudar({ ...cor, a })} onChangeEnd={() => onChangeEnd?.(texto)} />}
        </>
      )}
      {swatches && swatches.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          {swatches.map((s) => (
            <UnstyledButton
              key={s}
              accessibilityLabel={s}
              accessibilityState={{ selected: texto.toLowerCase() === s.toLowerCase() }}
              onPress={() => {
                const nova = parseColor(s);
                if (nova) mudar(nova, true);
              }}
              style={{ minWidth: touchTarget, minHeight: touchTarget, alignItems: "center", justifyContent: "center", borderRadius: touchTarget / 2, borderWidth: texto.toLowerCase() === s.toLowerCase() ? borderWidth.thick : 0, borderColor: c.accent }}
            >
              <ColorSwatch color={s} />
            </UnstyledButton>
          ))}
        </View>
      )}
    </View>
  );
}
