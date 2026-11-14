import { useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import type { ComponentPropsWithRef, CSSProperties, MouseEvent, ReactNode } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { FocusTrap } from "../FocusTrap/FocusTrap";
import { Overlay } from "../Overlay/Overlay";
import { Portal } from "../Portal/Portal";
import { useCloseOnEscape, useScrollLock } from "../scrollLock";
import { useStyles, type StylesApiProps } from "../styles";
import { Transition } from "../Transition/Transition";
import classes from "./Modal.module.css";

export interface ModalBaseProps {
  /** Aberto. */
  opened: boolean;
  /** Chamado pelo Esc, pelo clique fora e pelo botão de fechar. */
  onClose: () => void;
  /** Título (vira o nome da janela para o leitor de tela). */
  title?: ReactNode;
  /** Botão de fechar no canto. Padrão: true. */
  withCloseButton?: boolean | undefined;
  closeButtonLabel?: string | undefined;
  /** Esc fecha. Padrão: true. */
  closeOnEscape?: boolean | undefined;
  /** Clique no véu fecha. Padrão: true. */
  closeOnClickOutside?: boolean | undefined;
  /** Trava a rolagem da página. Padrão: true. */
  lockScroll?: boolean | undefined;
  /** Devolve o foco a quem abriu. Padrão: true. */
  returnFocus?: boolean | undefined;
  children?: ReactNode;
}

export interface ModalProps
  extends ModalBaseProps, StylesApiProps<"root" | "inner" | "content" | "header" | "title" | "close" | "body">, Omit<ComponentPropsWithRef<"section">, "className" | "style" | "title"> {
  /** Largura máxima. Padrão: 440 (o alerta do mockup). */
  size?: CSSProperties["maxWidth"];
  /** No meio da tela (true) ou mais perto do topo. Padrão: true. */
  centered?: boolean | undefined;
  /** Ocupa a tela toda. */
  fullScreen?: boolean | undefined;
}

/** Janela sobre a tela, com o véu: prende o foco, fecha com Esc e devolve o foco a quem abriu. */
export function Modal(props: ModalProps) {
  const {
    opened, onClose, title, withCloseButton = true, closeButtonLabel, closeOnEscape = true, closeOnClickOutside = true, lockScroll = true, returnFocus = true,
    size, centered = true, fullScreen, children, id, className, style, classNames, styles, ...rest
  } = useComponentProps("Modal", {}, props);
  const getStyles = useStyles("Modal", classes, { className, style, classNames, styles });
  const base = useId(id);
  useScrollLock(opened && lockScroll);
  useCloseOnEscape(opened, () => {
    if (closeOnEscape) onClose();
  });
  const foraFecha = (e: MouseEvent<HTMLDivElement>) => {
    if (closeOnClickOutside && e.target === e.currentTarget) onClose();
  };
  const tamanho = typeof size === "number" ? `${size}px` : size;
  return (
    <Portal>
      <Transition mounted={opened} transition="fade" duration="base">
        {(s) => <Overlay fixed style={s} />}
      </Transition>
      <Transition mounted={opened} transition={fullScreen ? "fade" : "scale"} duration="base">
        {(s) => (
          <div
            role="presentation"
            data-full-screen={fullScreen || undefined}
            onClick={foraFecha}
            {...getStyles("inner", { "--modal-align": centered ? "center" : "flex-start", "--modal-size": tamanho ?? "var(--cf-dialog-width)" })}
          >
            <FocusTrap active={opened} returnFocus={returnFocus}>
              <section
                id={base}
                role="dialog"
                aria-modal
                aria-labelledby={title !== undefined ? `${base}-title` : undefined}
                {...rest}
                {...getStyles("content")}
                style={{ ...getStyles("content").style, ...s }}
              >
                {(title !== undefined || withCloseButton) && (
                  <header {...getStyles("header")}>
                    {title !== undefined && <h2 id={`${base}-title`} {...getStyles("title")}>{title}</h2>}
                    {withCloseButton && <CloseButton aria-label={closeButtonLabel} color="text2" onClick={onClose} {...getStyles("close")} />}
                  </header>
                )}
                <div {...getStyles("body")}>{children}</div>
              </section>
            </FocusTrap>
          </div>
        )}
      </Transition>
    </Portal>
  );
}
