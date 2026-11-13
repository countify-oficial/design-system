import { useComponentProps } from "@countify-oficial/provider";
import type { Tone } from "@countify-oficial/tokens";
import type { ElementType, ReactNode } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { toneVars, useStyles, type StylesApiProps } from "../styles";
import classes from "./Indicator.module.css";

export interface IndicatorOwnProps extends StylesApiProps<"root" | "indicator"> {
  /** Texto do indicador (uma contagem). Sem ele, uma bolinha. */
  label?: ReactNode;
  /** Canto. Padrão: top-end. */
  position?: "top-end" | "top-start" | "bottom-end" | "bottom-start" | undefined;
  /** Tom. Padrão: down (o contador vermelho do menu). */
  color?: Tone | undefined;
  /** Esconde o indicador. */
  disabled?: boolean | undefined;
  /** Ocupa a largura (display: flex) em vez de ficar na linha. */
  block?: boolean | undefined;
  children?: ReactNode;
}

export type IndicatorProps<C extends ElementType = "span"> = PolymorphicProps<C, IndicatorOwnProps>;

/** Bolinha ou contador no canto de outro elemento (avisos novos, por exemplo). */
export function Indicator<C extends ElementType = "span">(props: IndicatorProps<C>) {
  const { component, label, position = "top-end", color = "down", disabled, block, children, className, style, classNames, styles, ...rest } =
    useComponentProps("Indicator", {}, props);
  const getStyles = useStyles("Indicator", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "span";
  return (
    <Component {...rest} data-block={block || undefined} {...getStyles("root")}>
      {children}
      {!disabled && (
        <span data-position={position} data-with-label={label !== undefined || undefined} {...getStyles("indicator", toneVars(color))}>
          {label}
        </span>
      )}
    </Component>
  );
}
