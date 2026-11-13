import { useComponentProps } from "@countify-oficial/provider";
import type { ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Container.module.css";

export type ContainerProps<C extends ElementType = "div"> = PolymorphicProps<C, StylesApiProps>;

/**
 * Margem lateral da página: 20 no celular, 32 a partir de 768. Ocupa a largura toda, como as telas da Countify
 * (a identidade não tem largura máxima).
 */
export function Container<C extends ElementType = "div">(props: ContainerProps<C>) {
  const { component, className, style, classNames, styles, ...rest } = useComponentProps("Container", {}, props);
  const getStyles = useStyles("Container", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return <Component {...rest} {...getStyles("root")} />;
}
