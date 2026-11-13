import { useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { fontSize, gutter, nativeFontFamily, resolveSpacing, space, type Spacing } from "@countify-oficial/tokens";
import { Children, useState, type ReactNode } from "react";
import { ScrollView, Text, View, type StyleProp, type ViewStyle } from "react-native";

export interface CarouselProps {
  children?: ReactNode;
  accessibilityLabel: string;
  /** Largura de cada cartão, em fração da largura do carrossel (0 a 1). Padrão: 1 (um por vez). */
  slideSize?: number | undefined;
  /** Espaço entre os cartões. Padrão: sm (8). */
  slideGap?: Spacing | undefined;
  /** O contador "2 de 5". Padrão: true. */
  withCounter?: boolean | undefined;
  onSlideChange?: ((index: number) => void) | undefined;
  style?: StyleProp<ViewStyle>;
}

/** Um cartão do carrossel. */
export function CarouselSlide({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={style}>{children}</View>;
}

/** Carrossel: cartões que rolam com o dedo e param no encaixe, sangrando à direita (M-Datas); o contador embaixo. */
function CarouselRoot(props: CarouselProps) {
  const messages = useMessages();
  const { colors: c } = useCountifyTheme();
  const { children, accessibilityLabel, slideSize = 1, slideGap = "sm", withCounter = true, onSlideChange, style } = useComponentProps("Carousel", {}, props);
  const itens = Children.toArray(children);
  const [largura, setLargura] = useState(0);
  const [atual, setAtual] = useState(0);
  const vao = resolveSpacing(slideGap);
  const cartao = Math.max(0, largura * slideSize);
  const passo = cartao + vao;
  return (
    <View style={[{ gap: space[2] }, style]} onLayout={(e) => setLargura(e.nativeEvent.layout.width)}>
      <ScrollView
        horizontal
        accessibilityLabel={accessibilityLabel}
        showsHorizontalScrollIndicator={false}
        snapToInterval={passo > 0 ? passo : undefined}
        decelerationRate="fast"
        disableIntervalMomentum
        style={{ marginRight: -gutter.mobile }}
        contentContainerStyle={{ gap: vao, paddingRight: gutter.mobile }}
        onMomentumScrollEnd={(e) => {
          const i = passo > 0 ? Math.round(e.nativeEvent.contentOffset.x / passo) : 0;
          setAtual(i);
          onSlideChange?.(i);
        }}
      >
        {itens.map((item, i) => (
          <View key={i} accessibilityLabel={messages.stepOf(i + 1, itens.length)} style={{ width: cartao }}>
            {item}
          </View>
        ))}
      </ScrollView>
      {withCounter && itens.length > 1 && (
        <Text accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ alignSelf: "flex-end", color: c.text2, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400], fontVariant: ["tabular-nums"] }}>
          {messages.stepOf(Math.min(atual + 1, itens.length), itens.length)}
        </Text>
      )}
    </View>
  );
}

export const Carousel = Object.assign(CarouselRoot, { Slide: CarouselSlide });
