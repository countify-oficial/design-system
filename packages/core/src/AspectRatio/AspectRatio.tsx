import { useComponentProps } from "@countify-oficial/provider";
import type { ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./AspectRatio.module.css";

export interface AspectRatioOwnProps extends StylesApiProps {
  /** Largura dividida pela altura (16 / 9, 1…). Padrão: 1. */
  ratio?: number | undefined;
}

export type AspectRatioProps<C extends ElementType = "div"> = PolymorphicProps<C, AspectRatioOwnProps>;

/** Caixa com proporção fixa; imagem, vídeo ou iframe dentro preenchem a caixa. */
export function AspectRatio<C extends ElementType = "div">(props: AspectRatioProps<C>) {
  const { component, ratio = 1, className, style, classNames, styles, ...rest } = useComponentProps("AspectRatio", {}, props);
  const getStyles = useStyles("AspectRatio", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return <Component {...rest} {...getStyles("root", { "--ar-ratio": ratio })} />;
}
