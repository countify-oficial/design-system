import { useControllableState, useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import { space } from "@countify-oficial/tokens";
import { useState, type ComponentPropsWithRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { Portal } from "../Portal/Portal";
import { useStyles, type StylesApiProps } from "../styles";
import { Transition } from "../Transition/Transition";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import classes from "./FloatingWindow.module.css";

export interface FloatingWindowProps extends StylesApiProps<"root" | "header" | "title" | "body">, Omit<ComponentPropsWithRef<"section">, "className" | "style" | "title"> {
  opened: boolean;
  onClose?: (() => void) | undefined;
  title: ReactNode;
  /** Posição (controlado), em px a partir do canto de cima à esquerda. */
  position?: { x: number; y: number } | undefined;
  defaultPosition?: { x: number; y: number } | undefined;
  onPositionChange?: ((p: { x: number; y: number }) => void) | undefined;
  /** Largura. Padrão: 440. */
  size?: CSSProperties["width"];
  closeButtonLabel?: string | undefined;
}

/**
 * Janela flutuante que se arrasta pelo título (uma câmera ao vivo ao lado do painel). Pelo teclado: foco no título e
 * setas movem (Shift move mais). Só computador.
 */
export function FloatingWindow(props: FloatingWindowProps) {
  const { opened, onClose, title, position, defaultPosition, onPositionChange, size, closeButtonLabel, children, id, className, style, classNames, styles, ...rest } =
    useComponentProps("FloatingWindow", {}, props);
  const getStyles = useStyles("FloatingWindow", classes, { className, style, classNames, styles });
  const base = useId(id);
  const [pos, setPos] = useControllableState({ value: position, defaultValue: defaultPosition ?? { x: space[8], y: space[8] }, onChange: onPositionChange });
  const [arraste, setArraste] = useState<{ dx: number; dy: number } | null>(null);
  const limitar = (x: number, y: number) => ({ x: Math.max(0, Math.min(x, window.innerWidth - space[8])), y: Math.max(0, Math.min(y, window.innerHeight - space[8])) });
  const aoTeclar = (e: KeyboardEvent<HTMLButtonElement>) => {
    const passo = e.shiftKey ? space[8] : space[2];
    const d = { ArrowLeft: [-passo, 0], ArrowRight: [passo, 0], ArrowUp: [0, -passo], ArrowDown: [0, passo] }[e.key];
    if (!d) return;
    e.preventDefault();
    setPos(limitar(pos.x + (d[0] ?? 0), pos.y + (d[1] ?? 0)));
  };
  const largura = typeof size === "number" ? `${size}px` : size;
  return (
    <Portal>
      <Transition mounted={opened} transition="scale" duration="fast">
        {(s) => {
          const raiz = getStyles("root", { "--fw-x": `${pos.x}px`, "--fw-y": `${pos.y}px`, "--fw-width": largura ?? "var(--cf-dialog-width)" });
          return (
            <section role="dialog" aria-labelledby={`${base}-title`} {...rest} data-dragging={arraste ? true : undefined} {...raiz} style={{ ...raiz.style, ...s }}>
              <div
                onPointerDown={(e: PointerEvent<HTMLDivElement>) => {
                  if ((e.target as HTMLElement).closest("button")) return;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setArraste({ dx: e.clientX - pos.x, dy: e.clientY - pos.y });
                }}
                onPointerMove={(e) => arraste && setPos(limitar(e.clientX - arraste.dx, e.clientY - arraste.dy))}
                onPointerUp={() => setArraste(null)}
                {...getStyles("header")}
              >
                {/* o título é o botão que move pelo teclado (setas; Shift move mais) */}
                <UnstyledButton id={`${base}-title`} aria-describedby={`${base}-dica`} onKeyDown={aoTeclar} {...getStyles("title")}>{title}</UnstyledButton>
                <VisuallyHidden id={`${base}-dica`}>use as setas para mover a janela</VisuallyHidden>
                {onClose && <CloseButton aria-label={closeButtonLabel} color="text2" onClick={onClose} />}
              </div>
              <div {...getStyles("body")}>{children}</div>
            </section>
          );
        }}
      </Transition>
    </Portal>
  );
}
