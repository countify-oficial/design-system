import { useComponentProps } from "@countify-oficial/provider";
import type { Spacing } from "@countify-oficial/tokens";
import type { CSSProperties, ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { spacingVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./Stack.module.css";

export interface StackOwnProps extends StylesApiProps {
  /** Espaço entre os itens: xs–xl ou degrau da grade de 4 (3 = 12). Padrão: md. */
  gap?: Spacing | undefined;
  /** align-items. Padrão: stretch. */
  align?: CSSProperties["alignItems"];
  /** justify-content. Padrão: flex-start. */
  justify?: CSSProperties["justifyContent"];
}

export type StackProps<C extends ElementType = "div"> = PolymorphicProps<C, StackOwnProps>;

/** Itens um embaixo do outro, com espaço entre eles. */
export function Stack<C extends ElementType = "div">(props: StackProps<C>) {
  const { component, gap = "md", align, justify, className, style, classNames, styles, ...rest } = useComponentProps("Stack", {}, props);
  const getStyles = useStyles("Stack", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return <Component {...rest} {...getStyles("root", { "--stack-gap": spacingVar(gap), "--stack-align": align, "--stack-justify": justify })} />;
}
