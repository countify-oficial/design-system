import { useComponentProps } from "@countify-oficial/provider";
import type { Responsive, Spacing } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { responsiveVars, spacingVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./Grid.module.css";

export interface GridOwnProps extends StylesApiProps {
  /** Quantas colunas a grade tem. Padrão: 12, como nas telas da Countify. */
  columns?: number | undefined;
  /** Espaço entre colunas e linhas: xs–xl ou degrau da grade de 4 (3 = 12). Padrão: lg (24, como nas telas). */
  gap?: Spacing | undefined;
}

export type GridProps<C extends ElementType = "div"> = PolymorphicProps<C, GridOwnProps>;

export interface GridColOwnProps extends StylesApiProps {
  /** Quantas colunas ocupa; por ponto de quebra: { base: 12, sm: 6, lg: 4 }. Padrão: a linha toda. */
  span?: Responsive<number> | undefined;
}

export type GridColProps<C extends ElementType = "div"> = PolymorphicProps<C, GridColOwnProps>;

/** Uma coluna do Grid. */
export function GridCol<C extends ElementType = "div">(props: GridColProps<C>) {
  const { component, span, className, style, classNames, styles, ...rest } = useComponentProps("GridCol", {}, props);
  const getStyles = useStyles("GridCol", { root: classes["col"] ?? "" }, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return <Component {...rest} {...getStyles("root", responsiveVars("--col-span", span))} />;
}

function GridRoot<C extends ElementType = "div">(props: GridProps<C>) {
  const { component, columns = 12, gap = "lg", className, style, classNames, styles, ...rest } = useComponentProps("Grid", {}, props);
  const getStyles = useStyles("Grid", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return <Component {...rest} {...getStyles("root", { "--grid-columns": columns, "--grid-gap": spacingVar(gap) })} />;
}

/** Grade de colunas (12 por padrão). As colunas são Grid.Col, com span por ponto de quebra. */
export const Grid = Object.assign(GridRoot, { Col: GridCol });
