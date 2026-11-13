import { useComponentProps } from "@countify-oficial/provider";
import type { Tone } from "@countify-oficial/tokens";
import type { ElementType, ReactNode } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { toneVars, useStyles, type StylesApiProps } from "../styles";
import classes from "./Badge.module.css";

/** light: etiqueta ("parcial"); filled: contador; outline: só o contorno; dot: bolinha com texto ("Online"). */
export type BadgeVariant = "light" | "filled" | "outline" | "dot";

export interface BadgeOwnProps extends StylesApiProps<"root" | "section"> {
  /** Padrão: light. */
  variant?: BadgeVariant | undefined;
  /** gray, accent, up, down ou warn. Padrão: gray. */
  color?: Tone | undefined;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  children?: ReactNode;
}

export type BadgeProps<C extends ElementType = "span"> = PolymorphicProps<C, BadgeOwnProps>;

/** Etiqueta curta: situação, contagem ou marca ("parcial"). Cor sempre com texto. */
export function Badge<C extends ElementType = "span">(props: BadgeProps<C>) {
  const { component, variant = "light", color = "gray", leftSection, rightSection, children, className, style, classNames, styles, ...rest } =
    useComponentProps("Badge", {}, props);
  const getStyles = useStyles("Badge", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "span";
  return (
    <Component {...rest} data-variant={variant} data-color={color} {...getStyles("root", toneVars(color))}>
      {leftSection && <span {...getStyles("section")}>{leftSection}</span>}
      {children}
      {rightSection && <span {...getStyles("section")}>{rightSection}</span>}
    </Component>
  );
}
