import { useComponentProps } from "@countify-oficial/provider";
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { Portal } from "../Portal/Portal";
import { useStyles, type StylesApiProps } from "../styles";
import { Transition } from "../Transition/Transition";
import classes from "./Dialog.module.css";

export interface DialogProps extends StylesApiProps<"root" | "close">, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  opened: boolean;
  onClose?: (() => void) | undefined;
  /** Canto da tela. Padrão: bottom-right. */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | undefined;
  withCloseButton?: boolean | undefined;
  closeButtonLabel?: string | undefined;
  /** Largura. Padrão: 440. */
  size?: CSSProperties["width"];
  children?: ReactNode;
}

/** Caixa fixa num canto da tela, sem véu e sem prender o foco (um aviso que pede resposta, um chat). */
export function Dialog(props: DialogProps) {
  const { opened, onClose, position = "bottom-right", withCloseButton, closeButtonLabel, size, children, className, style, classNames, styles, ...rest } = useComponentProps("Dialog", {}, props);
  const getStyles = useStyles("Dialog", classes, { className, style, classNames, styles });
  const largura = typeof size === "number" ? `${size}px` : size;
  const raiz = getStyles("root", { "--dialog-size": largura ?? "var(--cf-dialog-width)" });
  return (
    <Portal>
      <Transition mounted={opened} transition="slide-up" duration="base">
        {(s) => (
          <div role="dialog" {...rest} data-position={position} {...raiz} style={{ ...raiz.style, ...s }}>
            {withCloseButton && <CloseButton aria-label={closeButtonLabel} color="text2" onClick={onClose} {...getStyles("close")} />}
            {children}
          </div>
        )}
      </Transition>
    </Portal>
  );
}
