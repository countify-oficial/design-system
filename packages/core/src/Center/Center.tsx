import { useComponentProps } from "@countify-oficial/provider";
import type { ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Center.module.css";

export interface CenterOwnProps extends StylesApiProps {
  /** Fica na linha do texto (inline-flex), em vez de ocupar a largura toda. */
  inline?: boolean | undefined;
}

export type CenterProps<C extends ElementType = "div"> = PolymorphicProps<C, CenterOwnProps>;

/** Centraliza o conteúdo na horizontal e na vertical. */
export function Center<C extends ElementType = "div">(props: CenterProps<C>) {
  const { component, inline, className, style, classNames, styles, ...rest } = useComponentProps("Center", {}, props);
  const getStyles = useStyles("Center", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return <Component {...rest} data-inline={inline || undefined} {...getStyles("root")} />;
}
