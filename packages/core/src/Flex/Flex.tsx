import { useComponentProps } from "@countify-oficial/provider";
import type { Spacing } from "@countify-oficial/tokens";
import type { CSSProperties, ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { spacingVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./Flex.module.css";

export interface FlexOwnProps extends StylesApiProps {
  /** flex-direction. Padrão: row. */
  direction?: CSSProperties["flexDirection"];
  /** flex-wrap. Padrão: nowrap. */
  wrap?: CSSProperties["flexWrap"];
  /** Espaço entre os itens: xs–xl ou degrau da grade de 4 (3 = 12). Sem ele, nenhum. */
  gap?: Spacing | undefined;
  /** Espaço entre as linhas; sem ele, o gap. */
  rowGap?: Spacing | undefined;
  /** Espaço entre as colunas; sem ele, o gap. */
  columnGap?: Spacing | undefined;
  /** align-items. */
  align?: CSSProperties["alignItems"];
  /** justify-content. */
  justify?: CSSProperties["justifyContent"];
}

export type FlexProps<C extends ElementType = "div"> = PolymorphicProps<C, FlexOwnProps>;

/** Flexbox com as props pelo nome: direção, quebra, espaço e alinhamento. */
export function Flex<C extends ElementType = "div">(props: FlexProps<C>) {
  const {
    component, direction, wrap, gap, rowGap, columnGap, align, justify, className, style, classNames, styles, ...rest
  } = useComponentProps("Flex", {}, props);
  const getStyles = useStyles("Flex", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return (
    <Component
      {...rest}
      {...getStyles("root", {
        "--flex-direction": direction,
        "--flex-wrap": wrap,
        "--flex-gap": spacingVar(gap),
        "--flex-row-gap": spacingVar(rowGap),
        "--flex-column-gap": spacingVar(columnGap),
        "--flex-align": align,
        "--flex-justify": justify,
      })}
    />
  );
}
