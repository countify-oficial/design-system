import { useReducedMotion } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import { marqueeSpeed, resolveSpacing, type Spacing } from "@countify-oficial/tokens";
import { useEffect, useState, type ReactNode } from "react";
import { Animated, Pressable, ScrollView, View, type StyleProp, type ViewStyle } from "react-native";

export interface MarqueeProps {
  /** Pixels por segundo. Padrão: 50 (aprovado em 13/11/2026). */
  speed?: number | undefined;
  reverse?: boolean | undefined;
  /** Espaço entre as voltas. Padrão: xl. */
  gap?: Spacing | undefined;
  accessibilityLabel?: string | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Faixa que corre sozinha e dá a volta. Para enquanto o dedo segura; parada (rola com o dedo) para quem pediu menos movimento. */
export function Marquee(props: MarqueeProps) {
  const { speed = marqueeSpeed, reverse, gap = "xl", accessibilityLabel, children, style } = useComponentProps("Marquee", {}, props);
  const reduzir = useReducedMotion();
  const espaco = resolveSpacing(gap);
  const [largura, setLargura] = useState(0);
  const [segurando, setSegurando] = useState(false);
  const [x] = useState(() => new Animated.Value(0));
  const volta = largura + espaco;
  useEffect(() => {
    if (reduzir || segurando || volta <= espaco) return;
    x.setValue(0);
    const anim = Animated.loop(Animated.timing(x, { toValue: 1, duration: (volta / Math.max(1, speed)) * 1000, easing: (t: number) => t, useNativeDriver: true }));
    anim.start();
    return () => anim.stop();
  }, [reduzir, segurando, volta, espaco, speed, x]);
  const copia = (escondida: boolean) => (
    <View
      onLayout={escondida ? undefined : (e) => setLargura(e.nativeEvent.layout.width)}
      accessibilityElementsHidden={escondida}
      importantForAccessibility={escondida ? "no-hide-descendants" : "auto"}
      style={{ flexDirection: "row", gap: espaco }}
    >
      {children}
    </View>
  );
  if (reduzir) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityLabel={accessibilityLabel} style={style}>
        {copia(false)}
      </ScrollView>
    );
  }
  const de = reverse ? -volta : 0;
  const ate = reverse ? 0 : -volta;
  return (
    <Pressable accessible accessibilityLabel={accessibilityLabel} onPressIn={() => setSegurando(true)} onPressOut={() => setSegurando(false)} style={[{ overflow: "hidden" }, style]}>
      <Animated.View style={{ flexDirection: "row", gap: espaco, transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [de, ate] }) }] }}>
        {copia(false)}
        {copia(true)}
      </Animated.View>
    </Pressable>
  );
}
