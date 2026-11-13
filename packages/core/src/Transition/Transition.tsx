import { useReducedMotion } from "@countify-oficial/hooks";
import { duration as duracoes, easing as curvas } from "@countify-oficial/tokens";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export type TransitionName = "fade" | "scale" | "slide-up" | "slide-down";
export type TransitionDuration = "fast" | "base" | "slow";

export interface TransitionProps {
  /** Mostra (true) ou esconde (false), com a animação. */
  mounted: boolean;
  /** fade: só opacidade; scale: cresce de 0,95; slide-up e slide-down: desliza 8 px. Todas com fade. Padrão: fade. */
  transition?: TransitionName | undefined;
  /** fast 120, base 150 ou slow 200 ms. Padrão: base. Com "reduzir movimento" ligado, 0. */
  duration?: TransitionDuration | undefined;
  /** Curva. Padrão: out. */
  timingFunction?: keyof typeof curvas | undefined;
  /** Escondido, fica no DOM com display: none (em vez de sair). */
  keepMounted?: boolean | undefined;
  /** Chamado quando termina de aparecer. */
  onEntered?: (() => void) | undefined;
  /** Chamado quando termina de sumir. */
  onExited?: (() => void) | undefined;
  /** Recebe o estilo da animação e o aplica no elemento. */
  children: (style: CSSProperties) => ReactNode;
}

type Status = "entered" | "exited" | "pre-enter" | "entering" | "exiting";

const fora: Record<TransitionName, CSSProperties> = {
  fade: { opacity: 0 },
  scale: { opacity: 0, transform: "scale(var(--cf-transition-scale))" },
  "slide-up": { opacity: 0, transform: "translateY(var(--cf-transition-slide))" },
  "slide-down": { opacity: 0, transform: "translateY(calc(-1 * var(--cf-transition-slide)))" },
};
const dentro: Record<TransitionName, CSSProperties> = {
  fade: { opacity: 1 },
  scale: { opacity: 1, transform: "scale(1)" },
  "slide-up": { opacity: 1, transform: "translateY(0)" },
  "slide-down": { opacity: 1, transform: "translateY(0)" },
};

/** Anima a entrada e a saída de um elemento com as durações e curvas dos tokens. */
export function Transition({
  mounted, transition = "fade", duration = "base", timingFunction = "out", keepMounted, onEntered, onExited, children,
}: TransitionProps) {
  const ms = useReducedMotion() ? 0 : duracoes[duration];
  const [status, setStatus] = useState<Status>(mounted ? "entered" : "exited");
  const [antes, setAntes] = useState(mounted);
  if (mounted !== antes) {
    setAntes(mounted);
    setStatus(mounted ? "pre-enter" : "exiting");
  }

  const avisos = useRef({ onEntered, onExited });
  useEffect(() => {
    avisos.current = { onEntered, onExited };
  });

  useEffect(() => {
    // pre-enter desenha o estado de fora; no quadro seguinte começa a entrar, para o navegador animar
    if (status === "pre-enter") {
      const quadro = requestAnimationFrame(() => setStatus("entering"));
      return () => cancelAnimationFrame(quadro);
    }
    if (status !== "entering" && status !== "exiting") return;
    const fim = setTimeout(() => {
      setStatus(status === "entering" ? "entered" : "exited");
      (status === "entering" ? avisos.current.onEntered : avisos.current.onExited)?.();
    }, ms);
    return () => clearTimeout(fim);
  }, [status, ms]);

  if (status === "exited") return keepMounted ? children({ display: "none" }) : null;
  const visivel = status === "entering" || status === "entered";
  return children({
    ...(visivel ? dentro : fora)[transition],
    transitionProperty: transition === "fade" ? "opacity" : "opacity, transform",
    transitionDuration: `${ms}ms`,
    transitionTimingFunction: curvas[timingFunction],
  });
}
