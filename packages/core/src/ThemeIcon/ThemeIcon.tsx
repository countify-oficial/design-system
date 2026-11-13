import { useComponentProps } from "@countify-oficial/provider";
import type { Size, Tone } from "@countify-oficial/tokens";
import type { ElementType, ReactNode } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { toneVars, useStyles, type StylesApiProps } from "../styles";
import classes from "./ThemeIcon.module.css";

export interface ThemeIconOwnProps extends StylesApiProps {
  /** light: fundo claro do tom; filled: fundo cheio. Padrão: light. */
  variant?: "light" | "filled" | undefined;
  /** gray, accent, up, down ou warn. Padrão: accent. */
  color?: Tone | undefined;
  /** Lado: xs 24, sm 32, md 40, lg 48, xl 64 (os do avatar). Padrão: md. */
  size?: Size | undefined;
  /** Canto. Padrão: sm (12). */
  radius?: Size | undefined;
  /** Redondo. */
  round?: boolean | undefined;
  /** O ícone. */
  children?: ReactNode;
}

export type ThemeIconProps<C extends ElementType = "span"> = PolymorphicProps<C, ThemeIconOwnProps>;

/** Ícone num quadrado colorido, como o das linhas de lista. Decorativo: não é botão. */
export function ThemeIcon<C extends ElementType = "span">(props: ThemeIconProps<C>) {
  const { component, variant = "light", color = "accent", size = "md", radius = "sm", round, className, style, classNames, styles, ...rest } =
    useComponentProps("ThemeIcon", {}, props);
  const getStyles = useStyles("ThemeIcon", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "span";
  return (
    <Component
      {...rest}
      data-variant={variant}
      data-round={round || undefined}
      {...getStyles("root", { ...toneVars(color), "--ti-size": `var(--cf-avatar-size-${size})`, "--ti-radius": `var(--cf-radius-${radius})` })}
    />
  );
}
