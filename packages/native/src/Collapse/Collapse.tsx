import { useReducedMotion } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import { duration as duracoes } from "@countify-oficial/tokens";
import { useEffect, useState, type ReactNode } from "react";
import { Animated, Easing, View, type StyleProp, type ViewStyle } from "react-native";

export interface CollapseProps {
  /** Aberto. */
  in: boolean;
  /** Duração: fast, base ou slow. Padrão: base. */
  duration?: "fast" | "base" | "slow" | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/** Abre e fecha o conteúdo animando a altura (medida pelo onLayout). Fechado, sai do leitor de tela. */
export function Collapse(props: CollapseProps) {
  const { in: aberto, duration = "base", children, style, testID } = useComponentProps("Collapse", {}, props);
  const ms = useReducedMotion() ? 0 : duracoes[duration];
  const [altura, setAltura] = useState(0);
  const [progresso] = useState(() => new Animated.Value(aberto ? 1 : 0));
  useEffect(() => {
    const a = Animated.timing(progresso, { toValue: aberto ? 1 : 0, duration: ms, easing: Easing.bezier(0, 0, 0.58, 1), useNativeDriver: false });
    a.start();
    return () => a.stop();
  }, [aberto, ms, progresso]);
  return (
    <Animated.View
      testID={testID}
      importantForAccessibility={aberto ? "auto" : "no-hide-descendants"}
      accessibilityElementsHidden={!aberto}
      style={[{ overflow: "hidden", height: progresso.interpolate({ inputRange: [0, 1], outputRange: [0, altura] }) }, style]}
    >
      <View style={{ position: "absolute", left: 0, right: 0 }} onLayout={(e) => setAltura(e.nativeEvent.layout.height)}>
        {children}
      </View>
    </Animated.View>
  );
}
