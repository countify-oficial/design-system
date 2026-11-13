import { useId, useMediaQuery } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import { breakpoints, type Responsive } from "@countify-oficial/tokens";
import { useEffect, type ComponentPropsWithRef, type CSSProperties, type MouseEvent } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { FocusTrap } from "../FocusTrap/FocusTrap";
import type { ModalBaseProps } from "../Modal/Modal";
import { Overlay } from "../Overlay/Overlay";
import { Portal } from "../Portal/Portal";
import { useScrollLock } from "../scrollLock";
import { useStyles, type StylesApiProps } from "../styles";
import { Transition, type TransitionName } from "../Transition/Transition";
import classes from "./Drawer.module.css";

export type DrawerPosition = "bottom" | "right" | "left";

export interface DrawerProps
  extends ModalBaseProps, StylesApiProps<"root" | "inner" | "content" | "header" | "title" | "close" | "body">, Omit<ComponentPropsWithRef<"section">, "className" | "style" | "title"> {
  /** De onde vem, por ponto de quebra. Padrão: bottom (folha) no celular e right (painel de 380) a partir de 768. */
  position?: Responsive<DrawerPosition> | undefined;
  /** Largura do painel (right e left). Padrão: 380. */
  size?: CSSProperties["width"];
}

const entrada: Record<DrawerPosition, TransitionName> = { bottom: "slide-up", right: "slide-left", left: "slide-right" };

/** Folha que sobe no celular e painel lateral no computador, sobre o véu. Prende o foco e fecha com Esc. */
export function Drawer(props: DrawerProps) {
  const {
    opened, onClose, title, withCloseButton = true, closeButtonLabel, closeOnEscape = true, closeOnClickOutside = true, lockScroll = true, returnFocus = true,
    position = { base: "bottom", sm: "right" }, size, children, id, className, style, classNames, styles, ...rest
  } = useComponentProps("Drawer", {}, props);
  const getStyles = useStyles("Drawer", classes, { className, style, classNames, styles });
  const base = useId(id);
  const largo = useMediaQuery(`(min-width: ${breakpoints.sm}px)`);
  const pos = typeof position === "object" ? position : { base: position };
  const agora: DrawerPosition = (largo ? pos.sm : undefined) ?? pos.base;
  useScrollLock(opened && lockScroll);
  useEffect(() => {
    if (!opened || !closeOnEscape) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [opened, closeOnEscape, onClose]);
  const largura = typeof size === "number" ? `${size}px` : size;
  return (
    <Portal>
      <Transition mounted={opened} transition="fade" duration="slow">
        {(s) => <Overlay fixed style={s} />}
      </Transition>
      <Transition mounted={opened} transition={entrada[agora]} duration="slow">
        {(s) => (
          <div
            role="presentation"
            data-position={pos.base}
            data-position-sm={pos.sm}
            onClick={(e: MouseEvent<HTMLDivElement>) => closeOnClickOutside && e.target === e.currentTarget && onClose()}
            {...getStyles("inner", { "--drawer-size": largura ?? "var(--cf-side-panel-width)" })}
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
