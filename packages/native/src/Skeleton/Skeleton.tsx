import { useReducedMotion } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { duration, radius as cantos, space, state, type Size } from "@countify-oficial/tokens";
import { useEffect, useState, type ReactNode } from "react";
import { Animated, Easing, type DimensionValue, type StyleProp, type ViewStyle } from "react-native";
import { useThemeStyle } from "../styles";

export interface SkeletonProps {
  /** Mostra o bloco (true) ou o conteúdo (false). Padrão: true. */
  visible?: boolean | undefined;
  /** Altura. Padrão: 16. */
  height?: DimensionValue | undefined;
  /** Largura. Padrão: 100%. */
  width?: DimensionValue | undefined;
  /** Círculo com o lado da altura (avatar). */
  circle?: boolean | undefined;
  /** Canto. Padrão: 4, como no mockup. */
  radius?: Size | undefined;
  /** Pulsa. Padrão: true (para com "reduzir movimento"). */
  animate?: boolean | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/** Bloco cinza no lugar do conteúdo que ainda carrega. */
export function Skeleton(props: SkeletonProps) {
  const { visible = true, height = space[4], width = "100%", circle, radius, animate = true, children, style, testID } = useComponentProps("Skeleton", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Skeleton");
  const reduzir = useReducedMotion();
  const [opacidade] = useState(() => new Animated.Value(1));
  const pulsar = visible && animate && !reduzir;
  useEffect(() => {
    if (!pulsar) return;
    const meia = duration.pulse / 2;
    const curva = Easing.bezier(0.42, 0, 0.58, 1);
    const laco = Animated.loop(
      Animated.sequence([
        Animated.timing(opacidade, { toValue: state.pulseOpacity, duration: meia, easing: curva, useNativeDriver: true }),
        Animated.timing(opacidade, { toValue: 1, duration: meia, easing: curva, useNativeDriver: true }),
      ]),
    );
    laco.start();
    return () => laco.stop();
  }, [pulsar, opacidade]);
  if (!visible) return children;
  const lado = typeof height === "number" ? height : undefined;
  return (
    <Animated.View
      testID={testID}
      importantForAccessibility="no-hide-descendants"
      style={[
        { height, width: circle ? height : width, backgroundColor: c.divider, borderRadius: circle && lado ? lado / 2 : radius ? cantos[radius] : space[1] },
        pulsar && { opacity: opacidade },
        tema,
        style,
      ]}
    />
  );
}
