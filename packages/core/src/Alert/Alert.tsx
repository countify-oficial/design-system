import { useComponentProps } from "@countify-oficial/provider";
import type { IconName, Tone } from "@countify-oficial/tokens";
import type { ElementType, ReactNode } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { Icon } from "../Icon/Icon";
import type { PolymorphicProps } from "../polymorphic";
import { toneVars, useStyles, type StylesApiProps } from "../styles";
import classes from "./Alert.module.css";

export interface AlertOwnProps extends StylesApiProps<"root" | "icon" | "body" | "title" | "message" | "closeButton"> {
  /** Título, em 17. */
  title?: ReactNode;
  /** Tom do ícone: accent (informação), down (erro), warn, up ou gray (sem conexão). Padrão: accent. */
  color?: Tone | undefined;
  /** Ícone próprio. Padrão: o do tom (info, alert, check ou wifi); null tira. */
  icon?: ReactNode;
  /** Mostra o botão de fechar. */
  withCloseButton?: boolean | undefined;
  onClose?: (() => void) | undefined;
  /** Nome do botão de fechar. Padrão: "Fechar" do provider. */
  closeButtonLabel?: string | undefined;
  /** O texto, em 15 e na cor de texto 2; ações (um Button) também vão aqui. */
  children?: ReactNode;
}

export type AlertProps<C extends ElementType = "div"> = PolymorphicProps<C, AlertOwnProps>;

const iconePadrao: Record<Tone, IconName> = { accent: "info", down: "alert", warn: "alert", up: "check", gray: "wifi" };

/** Aviso num cartão: erro, informação ou situação. Erro e alerta são anunciados na hora (role="alert"). */
export function Alert<C extends ElementType = "div">(props: AlertProps<C>) {
  const {
    component, title, color = "accent", icon, withCloseButton, onClose, closeButtonLabel, children,
    className, style, classNames, styles, ...rest
  } = useComponentProps("Alert", {}, props);
  const getStyles = useStyles("Alert", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  const urgente = color === "down" || color === "warn";
  return (
    <Component role={urgente ? "alert" : "status"} {...rest} data-color={color} {...getStyles("root", toneVars(color))}>
      {icon !== null && <span {...getStyles("icon")}>{icon ?? <Icon name={iconePadrao[color]} />}</span>}
      <div {...getStyles("body")}>
        {title !== undefined && <div {...getStyles("title")}>{title}</div>}
        {children !== undefined && <div {...getStyles("message")}>{children}</div>}
      </div>
      {withCloseButton && <CloseButton aria-label={closeButtonLabel} onClick={onClose} color="text2" {...getStyles("closeButton")} />}
    </Component>
  );
}
