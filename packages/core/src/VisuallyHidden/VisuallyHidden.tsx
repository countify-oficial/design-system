import { useComponentProps } from "@countify-oficial/provider";
import type { ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./VisuallyHidden.module.css";

export type VisuallyHiddenProps<C extends ElementType = "span"> = PolymorphicProps<C, StylesApiProps>;

/** Conteúdo só para o leitor de tela: some da tela e continua acessível. */
export function VisuallyHidden<C extends ElementType = "span">(props: VisuallyHiddenProps<C>) {
  const { component, className, style, classNames, styles, ...rest } = useComponentProps("VisuallyHidden", {}, props);
  const getStyles = useStyles("VisuallyHidden", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "span";
  return <Component {...rest} {...getStyles("root")} />;
}
