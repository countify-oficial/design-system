import { useReducedMotion } from "@countify-oficial/hooks";
import { duration as duracoes, transition as distancias, type easing } from "@countify-oficial/tokens";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, type StyleProp, type ViewStyle } from "react-native";

export type TransitionName = "fade" | "scale" | "slide-up" | "slide-down";
export type TransitionDuration = "fast" | "base" | "slow";

export interface TransitionProps {
  /** Mostra (true) ou esconde (false), com a animação. */
  mounted: boolean;
  /** fade: só opacidade; scale: cresce de 0,95; slide-up e slide-down: desliza 8. Todas com fade. Padrão: fade. */
  transition?: TransitionName | undefined;
  /** fast 120, base 150 ou slow 200 ms. Padrão: base. Com "reduzir movimento" ligado, 0. */
  duration?: TransitionDuration | undefined;
  /** Curva. Padrão: out. */
  timingFunction?: keyof typeof easing | undefined;
  /** Escondido, fica montado com display: none (em vez de sair). */
  keepMounted?: boolean | undefined;
  /** Chamado quando termina de aparecer. */
  onEntered?: (() => void) | undefined;
  /** Chamado quando termina de sumir. */
  onExited?: (() => void) | undefined;
  /** Estilo da Animated.View que envolve os filhos. */
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

// as mesmas curvas do CSS: ease-out, ease-in-out e linear
const curvas = { out: Easing.bezier(0, 0, 0.58, 1), inOut: Easing.bezier(0.42, 0, 0.58, 1), linear: Easing.bezier(0, 0, 1, 1) };

/** Anima a entrada e a saída dos filhos (Animated, no thread nativo) com as durações dos tokens. */
export function Transition({
  mounted, transition = "fade", duration = "base", timingFunction = "out", keepMounted, onEntered, onExited, style, children,
}: TransitionProps) {
  const reduzir = useReducedMotion();
  const [progresso] = useState(() => new Animated.Value(mounted ? 1 : 0));
  const [visivel, setVisivel] = useState(mounted);
  if (mounted && !visivel) setVisivel(true);

  // o efeito da animação só roda quando mounted muda; o resto ele lê daqui
  const atual = useRef({ ms: 0, curva: curvas.out, onEntered, onExited });
  useEffect(() => {
    atual.current = { ms: reduzir ? 0 : duracoes[duration], curva: curvas[timingFunction], onEntered, onExited };
  });

  const ultimo = useRef(mounted);
  useEffect(() => {
    if (ultimo.current === mounted) return;
    ultimo.current = mounted;
    const { ms, curva } = atual.current;
    const animacao = Animated.timing(progresso, { toValue: mounted ? 1 : 0, duration: ms, easing: curva, useNativeDriver: true });
    animacao.start(({ finished }) => {
      if (!finished) return;
      if (mounted) atual.current.onEntered?.();
      else {
        setVisivel(false);
        atual.current.onExited?.();
      }
    });
    return () => animacao.stop();
  }, [mounted, progresso]);

  if (!visivel && !keepMounted) return null;
  const de = (inicio: number) => progresso.interpolate({ inputRange: [0, 1], outputRange: [inicio, transition === "scale" ? 1 : 0] });
  const movimento =
    transition === "scale" ? [{ scale: de(distancias.scale) }]
    : transition === "slide-up" ? [{ translateY: de(distancias.slide) }]
    : transition === "slide-down" ? [{ translateY: de(-distancias.slide) }]
    : undefined;
  return (
    <Animated.View style={[{ opacity: progresso, transform: movimento }, style, !visivel && { display: "none" }]}>{children}</Animated.View>
  );
}
