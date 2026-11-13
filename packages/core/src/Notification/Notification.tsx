import { useComponentProps } from "@countify-oficial/provider";
import type { ElementType, ReactNode } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { Loader } from "../Loader/Loader";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Notification.module.css";

export interface NotificationOwnProps extends StylesApiProps<"root" | "icon" | "body" | "title" | "action" | "closeButton"> {
  /** Título, em negrito. */
  title?: ReactNode;
  /** default: cores invertidas (texto sobre fundo); down: vermelho, para erro. Padrão: default. */
  color?: "default" | "down" | undefined;
  /** Ícone antes do texto. */
  icon?: ReactNode;
  /** Girador no lugar do ícone (salvando…). */
  loading?: boolean | undefined;
  /** Ação curta ("Desfazer"): um Button variant="subtle". */
  action?: ReactNode;
  withCloseButton?: boolean | undefined;
  onClose?: (() => void) | undefined;
  closeButtonLabel?: string | undefined;
  children?: ReactNode;
}

export type NotificationProps<C extends ElementType = "div"> = PolymorphicProps<C, NotificationOwnProps>;

/** Aviso curto que flutua sobre a tela ("Análise salva"). O gerenciador da fila fica em @countify-oficial/notifications. */
export function Notification<C extends ElementType = "div">(props: NotificationProps<C>) {
  const {
    component, title, color = "default", icon, loading, action, withCloseButton, onClose, closeButtonLabel, children,
    className, style, classNames, styles, ...rest
  } = useComponentProps("Notification", {}, props);
  const getStyles = useStyles("Notification", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return (
    <Component role={color === "down" ? "alert" : "status"} {...rest} data-color={color} {...getStyles("root")}>
      {(loading || icon) && <span {...getStyles("icon")}>{loading ? <Loader size="sm" color="currentColor" label={false} /> : icon}</span>}
      <div {...getStyles("body")}>
        {title !== undefined && <span {...getStyles("title")}>{title}</span>}
        {children}
      </div>
      {action !== undefined && <span {...getStyles("action")}>{action}</span>}
      {withCloseButton && <CloseButton aria-label={closeButtonLabel} onClick={onClose} color="bg" {...getStyles("closeButton")} />}
    </Component>
  );
}
