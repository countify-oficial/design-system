import { useComponentProps } from "@countify-oficial/provider";
import type { Size } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./BackgroundImage.module.css";

export interface BackgroundImageOwnProps extends StylesApiProps {
  /** Endereço da imagem. */
  src: string;
  /** Canto. Sem ele, reto. */
  radius?: Size | undefined;
}

export type BackgroundImageProps<C extends ElementType = "div"> = PolymorphicProps<C, BackgroundImageOwnProps>;

/** Caixa com imagem de fundo (cobre e centraliza); os filhos ficam por cima. A imagem é decorativa. */
export function BackgroundImage<C extends ElementType = "div">(props: BackgroundImageProps<C>) {
  const { component, src, radius, className, style, classNames, styles, ...rest } = useComponentProps("BackgroundImage", {}, props);
  const getStyles = useStyles("BackgroundImage", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return <Component {...rest} {...getStyles("root", { "--bg-image": `url(${JSON.stringify(src)})`, "--bg-radius": radius && `var(--cf-radius-${radius})` })} />;
}
