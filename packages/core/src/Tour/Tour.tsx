/* eslint-disable react-hooks/refs, @typescript-eslint/unbound-method -- Floating UI: refs.setFloating e setPositionReference
   são callbacks, não leitura de .current; é o uso documentado da biblioteca. */
import { useControllableState, useId, useReducedMotion } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { duration, resolveSpacing } from "@countify-oficial/tokens";
import { autoUpdate, flip, FloatingFocusManager, FloatingPortal, offset, shift, useDismiss, useFloating, useInteractions, useRole, type Placement } from "@floating-ui/react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "../Button/Button";
import { CloseButton } from "../CloseButton/CloseButton";
import { Group } from "../Group/Group";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Tour.module.css";

export interface TourStep {
  /** O alvo: um seletor CSS ou o elemento. */
  target: string | HTMLElement;
  title: ReactNode;
  description?: ReactNode;
  /** Lado do alvo. Padrão: bottom. */
  position?: Placement | undefined;
}

export interface TourProps extends StylesApiProps<"spotlight" | "card" | "header" | "title" | "description" | "footer" | "counter"> {
  steps: TourStep[];
  opened: boolean;
  /** Chamado ao fechar ou concluir. */
  onClose: () => void;
  step?: number | undefined;
  defaultStep?: number | undefined;
  onStepChange?: ((step: number) => void) | undefined;
}

const alvo = (t: string | HTMLElement) => (typeof t === "string" ? document.querySelector<HTMLElement>(t) : t);

/** Tour guiado: destaca um elemento por vez e explica, com Voltar, Próximo e Concluir. Esc fecha. */
export function Tour(props: TourProps) {
  const messages = useMessages();
  const { steps, opened, onClose, step, defaultStep, onStepChange, className, style, classNames, styles } = useComponentProps("Tour", {}, props);
  const getStyles = useStyles("Tour", classes, { className, style, classNames, styles });
  const base = useId();
  const reduzir = useReducedMotion();
  const [atual, setAtual] = useControllableState({ value: step, defaultValue: defaultStep ?? 0, onChange: onStepChange });
  const passo = steps[atual];
  const [caixa, setCaixa] = useState<DOMRect | null>(null);
  const { refs, floatingStyles, context } = useFloating({
    open: opened,
    onOpenChange: (v) => !v && onClose(),
    placement: passo?.position ?? "bottom",
    whileElementsMounted: autoUpdate,
    middleware: [offset(resolveSpacing("md")), flip(), shift({ padding: resolveSpacing("sm") })],
  });
  const { getFloatingProps } = useInteractions([useDismiss(context, { outsidePress: false }), useRole(context, { role: "dialog" })]);
  useEffect(() => {
    if (!opened || !passo) return;
    const el = alvo(passo.target);
    if (!el) return;
    el.scrollIntoView({ block: "nearest", behavior: reduzir ? "auto" : "smooth" });
    refs.setPositionReference(el);
    const medir = () => setCaixa(el.getBoundingClientRect());
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    window.addEventListener("scroll", medir, true);
    return () => {
      observador.disconnect();
      window.removeEventListener("scroll", medir, true);
    };
  }, [opened, passo, refs, reduzir]);
  if (!opened || !passo) return null;
  const folga = resolveSpacing("xs");
  const ultimo = atual === steps.length - 1;
  return (
    <FloatingPortal>
      {caixa && (
        <div
          aria-hidden
          {...getStyles("spotlight", {
            "--tour-top": `${caixa.top - folga}px`, "--tour-left": `${caixa.left - folga}px`,
            "--tour-width": `${caixa.width + 2 * folga}px`, "--tour-height": `${caixa.height + 2 * folga}px`,
          })}
        />
      )}
      <FloatingFocusManager context={context} modal initialFocus={-1} returnFocus>
        <div
          ref={refs.setFloating}
          aria-labelledby={`${base}-title`}
          aria-describedby={passo.description !== undefined ? `${base}-description` : undefined}
          {...getFloatingProps()}
          {...getStyles("card")}
          style={{ ...floatingStyles, ...getStyles("card").style, transitionDuration: `${reduzir ? 0 : duration.base}ms` }}
        >
          <div {...getStyles("header")}>
            <h2 id={`${base}-title`} {...getStyles("title")}>{passo.title}</h2>
            <CloseButton color="text2" size="xs" onClick={onClose} />
          </div>
          {passo.description !== undefined && <p id={`${base}-description`} {...getStyles("description")}>{passo.description}</p>}
          <div {...getStyles("footer")}>
            <span {...getStyles("counter")}>{messages.stepOf(atual + 1, steps.length)}</span>
            <Group gap="xs">
              {atual > 0 && <Button variant="subtle" size="sm" onClick={() => setAtual(atual - 1)}>{messages.back}</Button>}
              <Button size="sm" onClick={() => (ultimo ? onClose() : setAtual(atual + 1))}>{ultimo ? messages.done : messages.next}</Button>
            </Group>
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}
