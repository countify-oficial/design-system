import { useComponentProps } from "@countify-oficial/provider";
import type { Size } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Paper.module.css";

export interface PaperOwnProps extends StylesApiProps {
  /** Elevação: xs, sm e md são o anel; lg e xl, a sombra da identidade (menus, painel). Sem ela, nenhuma. */
  shadow?: Size | undefined;
  /** Canto: xs 8, sm 12, md 16, lg 20, xl 24. Padrão: md (cartões e listas). */
  radius?: Size | undefined;
  /** O anel fino na cor da divisória (igual a shadow="xs"). */
  withBorder?: boolean | undefined;
}

export type PaperProps<C extends ElementType = "div"> = PolymorphicProps<C, PaperOwnProps>;

/** Superfície: fundo de cartão, canto e elevação da identidade. */
export function Paper<C extends ElementType = "div">(props: PaperProps<C>) {
  const { component, shadow, radius = "md", withBorder, className, style, classNames, styles, ...rest } = useComponentProps("Paper", {}, props);
  const getStyles = useStyles("Paper", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  const sombra = shadow ? `var(--cf-shadow-${shadow})` : withBorder ? "var(--cf-shadow-xs)" : undefined;
  return <Component {...rest} {...getStyles("root", { "--paper-radius": `var(--cf-radius-${radius})`, "--paper-shadow": sombra })} />;
}
