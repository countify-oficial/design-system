import { useComponentProps } from "@countify-oficial/provider";
import type { Size } from "@countify-oficial/tokens";
import type { ElementType, ReactNode } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./ColorSwatch.module.css";

export interface ColorSwatchOwnProps extends StylesApiProps {
  /** A cor mostrada (um dado do app: a cor de uma categoria, por exemplo), em qualquer formato CSS. */
  color: string;
  /** Lado, o dos ícones: xs 16, sm 18, md 22, lg 28, xl 32. Padrão: lg. */
  size?: Size | undefined;
  /** O anel fino em volta (ajuda cores claras). Padrão: true. */
  withShadow?: boolean | undefined;
  children?: ReactNode;
}

export type ColorSwatchProps<C extends ElementType = "span"> = PolymorphicProps<C, ColorSwatchOwnProps>;

/** Amostra de cor num círculo. Para o leitor de tela, dê um aria-label com o nome da cor. */
export function ColorSwatch<C extends ElementType = "span">(props: ColorSwatchProps<C>) {
  const { component, color, size = "lg", withShadow = true, className, style, classNames, styles, ...rest } = useComponentProps("ColorSwatch", {}, props);
  const getStyles = useStyles("ColorSwatch", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "span";
  return <Component {...rest} data-with-shadow={withShadow || undefined} {...getStyles("root", { "--swatch-color": color, "--swatch-size": `var(--cf-icon-size-${size})` })} />;
}
