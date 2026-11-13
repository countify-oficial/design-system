import { useReducedMotion } from "@countify-oficial/hooks";
import { formatNumber, useComponentProps, useCountifyTheme, type FormatNumberOptions } from "@countify-oficial/provider";
import { duration as duracoes, fontSize, lineHeightPx, nativeFontFamily, type Size } from "@countify-oficial/tokens";
import { useEffect, useState } from "react";
import { Animated, Easing, Text as RNText, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";

export interface RollingNumberProps extends FormatNumberOptions {
  value: number;
  /** Tamanho da letra. Padrão: md (17). */
  size?: Size | undefined;
  /** Duração da rolagem. Padrão: slow. */
  duration?: "fast" | "base" | "slow" | undefined;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string | undefined;
}

function Coluna({ digito, altura, ms, letra }: { digito: number; altura: number; ms: number; letra: StyleProp<TextStyle> }) {
  const [posicao] = useState(() => new Animated.Value(-digito * altura));
  useEffect(() => {
    const a = Animated.timing(posicao, { toValue: -digito * altura, duration: ms, easing: Easing.bezier(0, 0, 0.58, 1), useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, [digito, altura, ms, posicao]);
  return (
    <View style={{ height: altura, overflow: "hidden" }}>
      <Animated.View style={{ transform: [{ translateY: posicao }] }}>
        {Array.from({ length: 10 }, (_, d) => <RNText key={d} style={[letra, { height: altura }]}>{d}</RNText>)}
      </Animated.View>
    </View>
  );
}

/** Número que rola os algarismos quando muda. O leitor de tela lê o número inteiro. */
export function RollingNumber(props: RollingNumberProps) {
  const { locale: doProvider, colors: c } = useCountifyTheme();
  const { value, size = "md", duration = "slow", locale = doProvider, decimalScale, fixedDecimalScale, format, style, textStyle, testID } =
    useComponentProps("RollingNumber", {}, props);
  const ms = useReducedMotion() ? 0 : duracoes[duration];
  const texto = formatNumber(value, { locale, decimalScale, fixedDecimalScale, format });
  const altura = lineHeightPx(fontSize[size]);
  const letra: StyleProp<TextStyle> = [{ color: c.text, fontSize: fontSize[size], lineHeight: altura, fontFamily: nativeFontFamily[400], fontVariant: ["tabular-nums"] }, textStyle];
  const letras = Array.from(texto);
  return (
    <View testID={testID} accessible accessibilityLabel={texto} style={[{ flexDirection: "row" }, style]}>
      {letras.map((l, i) => {
        const chave = letras.length - i;
        return /\d/.test(l) ? <Coluna key={chave} digito={Number(l)} altura={altura} ms={ms} letra={letra} /> : <RNText key={chave} style={letra}>{l}</RNText>;
      })}
    </View>
  );
}
