import { useControllableState, useReducedMotion } from "@countify-oficial/hooks";
import { autoUpdate, flip, offset, shift, size, useFloating, useTransitionStyles, type Placement, type UseFloatingReturn } from "@floating-ui/react";
import type { CSSProperties } from "react";
import { duration, resolveSpacing, type Spacing } from "@countify-oficial/tokens";

export interface FloatingOptions {
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onChange?: ((opened: boolean) => void) | undefined;
  /** Lado do alvo (bottom, bottom-start, top, right-end…). Padrão: bottom. */
  position?: Placement | undefined;
  /** Distância do alvo. Padrão: sm (8). */
  offset?: Spacing | undefined;
  /** "target" iguala a largura do alvo; ou um número (px) ou valor CSS ("20rem"). Padrão: a do conteúdo. */
  width?: number | string | undefined;
}

export interface PopoverBase extends UseFloatingReturn {
  aberto: boolean;
  setAberto: (aberto: boolean) => void;
  animacao: { isMounted: boolean; styles: CSSProperties };
  larguraFixa: CSSProperties;
}

/** Posição (Floating UI), estado aberto e animação com as durações dos tokens. */
export function usePopoverBase({ opened, defaultOpened, onChange, position = "bottom", offset: distancia = "sm", width }: FloatingOptions): PopoverBase {
  const [aberto, setAberto] = useControllableState({ value: opened, defaultValue: defaultOpened ?? false, onChange });
  const flutuante = useFloating({
    open: aberto,
    onOpenChange: setAberto,
    placement: position,
    // A posição vai em left/top: o transform é da animação de abrir (scale), que o sobrescrevia e deixava a lista em 0,0.
    transform: false,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(resolveSpacing(distancia)),
      flip(),
      shift({ padding: resolveSpacing("sm") }),
      size({
        apply({ rects, elements }) {
          if (width === "target") elements.floating.style.width = `${rects.reference.width}px`;
        },
      }),
    ],
  });
  const reduzir = useReducedMotion();
  const animacao = useTransitionStyles(flutuante.context, {
    duration: reduzir ? 0 : duration.fast,
    initial: { opacity: 0, transform: "scale(0.98)" },
  });
  const larguraFixa: CSSProperties = width !== undefined && width !== "target" ? { width: typeof width === "number" ? `${width}px` : width } : {};
  return { aberto, setAberto, ...flutuante, animacao, larguraFixa };
}
