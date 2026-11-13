import { useComponentProps } from "@countify-oficial/provider";
import type { ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Typography.module.css";

export type TypographyProps<C extends ElementType = "div"> = PolymorphicProps<C, StylesApiProps>;

/** Dá o estilo da Countify a HTML comum (h1, p, ul, a, code, blockquote, table…), como o de um texto de ajuda. */
export function Typography<C extends ElementType = "div">(props: TypographyProps<C>) {
  const { component, className, style, classNames, styles, ...rest } = useComponentProps("Typography", {}, props);
  const getStyles = useStyles("Typography", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return <Component {...rest} {...getStyles("root")} />;
}
