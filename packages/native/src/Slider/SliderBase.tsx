import { useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, space, state, touchTarget, tones, type Tone } from "@countify-oficial/tokens";
import { useState, type ReactNode } from "react";
import { Text as RNText, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

export interface SliderMark {
  value: number;
  label?: ReactNode;
}

export interface SliderCommonProps {
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  disabled?: boolean | undefined;
  /** Tom da barra e da bolinha. Padrão: accent. */
  color?: Tone | undefined;
  marks?: SliderMark[] | undefined;
  getValueText?: ((value: number) => string) | undefined;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

interface Props extends SliderCommonProps {
  valores: number[];
  aoMudar: (valores: number[]) => void;
  aoTerminar?: ((valores: number[]) => void) | undefined;
  nomes: (string | undefined)[];
  minRange?: number | undefined;
  tipo: "bar" | "hue" | "alpha";
  corDaBolinha?: string | undefined;
  corDoTrilho?: string | undefined;
}

const casas = (n: number) => (String(n).split(".")[1] ?? "").length;
const MATIZES = [0, 60, 120, 180, 240, 300, 360];

/** A base dos sliders do celular: uma ou duas bolinhas, toque e ações do leitor de tela. */
export function SliderBase({
  valores, aoMudar, aoTerminar, nomes, minRange = 0, tipo, corDaBolinha, corDoTrilho, min = 0, max = 100, step = 1, disabled, color = "accent", marks, getValueText, style, testID,
}: Props) {
  const { colors: c } = useCountifyTheme();
  const [largura, setLargura] = useState(0);
  const [ativa, setAtiva] = useState(0);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const encaixar = (v: number) => Math.min(max, Math.max(min, Number((Math.round((v - min) / step) * step + min).toFixed(casas(step)))));
  const definir = (i: number, v: number, fim = false) => {
    const outro = valores[i === 0 ? 1 : 0];
    let novo = encaixar(v);
    if (valores.length === 2) novo = i === 0 ? Math.min(novo, (outro ?? max) - minRange) : Math.max(novo, (outro ?? min) + minRange);
    const lista = valores.map((x, k) => (k === i ? novo : x));
    aoMudar(lista);
    if (fim) aoTerminar?.(lista);
  };
  const doToque = (e: GestureResponderEvent) => (largura === 0 ? min : min + (e.nativeEvent.locationX / largura) * (max - min));
  const lado = space[6];
  const fill = c[tones[color].fill];
  const trilho = tipo === "bar" ? c.borderStrong : "transparent";
  return (
    <View testID={testID} style={[{ minHeight: touchTarget, justifyContent: "center" }, marks?.some((m) => m.label !== undefined) && { paddingBottom: space[6] }, disabled && { opacity: state.disabledOpacity }, style]}>
      <View
        onLayout={(e) => setLargura(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => !disabled}
        onMoveShouldSetResponder={() => !disabled}
        onResponderGrant={(e) => {
          const v = doToque(e);
          const i = valores.length === 2 ? (Math.abs(v - (valores[0] ?? 0)) <= Math.abs(v - (valores[1] ?? 0)) ? 0 : 1) : 0;
          setAtiva(i);
          definir(i, v);
        }}
        onResponderMove={(e) => definir(ativa, doToque(e))}
        onResponderRelease={() => aoTerminar?.(valores)}
        style={{ height: touchTarget, justifyContent: "center" }}
      >
        <View pointerEvents="none" style={{ height: space[2], borderRadius: space[1], backgroundColor: trilho, overflow: "hidden" }}>
          {tipo !== "bar" && (
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="trilho" x1="0" y1="0" x2="1" y2="0">
                  {tipo === "hue"
                    ? MATIZES.map((h) => <Stop key={h} offset={h / 360} stopColor={`hsl(${h}, 100%, 50%)`} />)
                    : [<Stop key="a" offset={0} stopColor={corDoTrilho ?? c.text} stopOpacity={0} />, <Stop key="b" offset={1} stopColor={corDoTrilho ?? c.text} stopOpacity={1} />]}
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#trilho)" />
            </Svg>
          )}
          {tipo === "bar" && (
            <View
              style={{
                position: "absolute", top: 0, bottom: 0, backgroundColor: fill,
                left: `${valores.length === 2 ? pct(valores[0] ?? min) : 0}%`,
                width: `${valores.length === 2 ? pct(valores[1] ?? max) - pct(valores[0] ?? min) : pct(valores[0] ?? min)}%`,
              }}
            />
          )}
        </View>
        {marks?.map((m) => (
          <View key={m.value} pointerEvents="none" style={{ position: "absolute", left: `${pct(m.value)}%`, width: space[1], height: space[1], marginLeft: -space[1] / 2, borderRadius: space[1] / 2, backgroundColor: c.card }} />
        ))}
        {valores.map((v, i) => (
          <View
            key={i}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel={nomes[i]}
            accessibilityValue={{ min, max, now: v, ...(getValueText ? { text: getValueText(v) } : {}) }}
            accessibilityState={{ disabled: !!disabled }}
            accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
            onAccessibilityAction={(e) => definir(i, (valores[i] ?? min) + (e.nativeEvent.actionName === "increment" ? step : -step), true)}
            pointerEvents="none"
            style={{
              position: "absolute", left: `${pct(v)}%`, marginLeft: -lado / 2, width: lado, height: lado, borderRadius: lado / 2,
              borderWidth: space[1], borderColor: tipo === "bar" ? fill : c.card, backgroundColor: corDaBolinha ?? c.card,
            }}
          />
        ))}
      </View>
      {marks?.filter((m) => m.label !== undefined).map((m) => (
        <View key={`r${m.value}`} pointerEvents="none" style={{ position: "absolute", bottom: 0, left: `${pct(m.value)}%` }}>
          {typeof m.label === "string" ? <RNText style={{ color: c.text2, fontSize: fontSize.xs, fontFamily: nativeFontFamily[400], transform: [{ translateX: "-50%" }] }}>{m.label}</RNText> : m.label}
        </View>
      ))}
    </View>
  );
}
