import { useComponentProps } from "@countify-oficial/provider";
import type { Responsive, Spacing } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { responsiveVars, spacingVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./SimpleGrid.module.css";

export interface SimpleGridOwnProps extends StylesApiProps {
  /** Colunas de mesma largura; por ponto de quebra: { base: 1, sm: 2, lg: 4 }. Padrão: 1. */
  cols?: Responsive<number> | undefined;
  /** Espaço entre as colunas: xs–xl ou degrau da grade de 4 (3 = 12). Padrão: md. */
  spacing?: Spacing | undefined;
  /** Espaço entre as linhas; sem ele, o spacing. */
  verticalSpacing?: Spacing | undefined;
}

export type SimpleGridProps<C extends ElementType = "div"> = PolymorphicProps<C, SimpleGridOwnProps>;

/** Grade de colunas iguais; cada filho é uma célula. */
export function SimpleGrid<C extends ElementType = "div">(props: SimpleGridProps<C>) {
  const {
    component, cols = 1, spacing = "md", verticalSpacing, className, style, classNames, styles, ...rest
  } = useComponentProps("SimpleGrid", {}, props);
  const getStyles = useStyles("SimpleGrid", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return (
    <Component
      {...rest}
      {...getStyles("root", {
        ...responsiveVars("--sg-cols", cols),
        "--sg-spacing": spacingVar(spacing),
        "--sg-vertical-spacing": spacingVar(verticalSpacing),
      })}
    />
  );
}
