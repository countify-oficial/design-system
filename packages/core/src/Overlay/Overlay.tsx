import { useComponentProps } from "@countify-oficial/provider";
import type { Size, zIndex } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Overlay.module.css";

export interface OverlayOwnProps extends StylesApiProps {
  /** Cobre a tela (fixed) em vez do pai (absolute, o pai precisa de position: relative). */
  fixed?: boolean | undefined;
  /** Centraliza os filhos. */
  center?: boolean | undefined;
  /** Opacidade do véu, de 0 a 1. Padrão: 0,72 (identidade). */
  backgroundOpacity?: number | undefined;
  /** Camada (z-index) dos tokens. Padrão: overlay. */
  zIndex?: keyof typeof zIndex | undefined;
  radius?: Size | undefined;
}

export type OverlayProps<C extends ElementType = "div"> = PolymorphicProps<C, OverlayOwnProps>;

/** O véu da identidade sobre a tela ou sobre um elemento (atrás de modais, sob um carregamento). */
export function Overlay<C extends ElementType = "div">(props: OverlayProps<C>) {
  const { component, fixed, center, backgroundOpacity, zIndex = "overlay", radius, className, style, classNames, styles, ...rest } = useComponentProps("Overlay", {}, props);
  const getStyles = useStyles("Overlay", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "div";
  return (
    <Component
      {...rest}
      data-fixed={fixed || undefined}
      data-center={center || undefined}
      {...getStyles("root", { "--overlay-opacity": backgroundOpacity, "--overlay-z": `var(--cf-z-${zIndex})`, "--overlay-radius": radius && `var(--cf-radius-${radius})` })}
    />
  );
}
