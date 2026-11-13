import { useComponentProps } from "@countify-oficial/provider";
import type { ColorRole, Size, fontWeight } from "@countify-oficial/tokens";
import type { ElementType } from "react";
import type { PolymorphicProps } from "../polymorphic";
import { colorVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./Text.module.css";

export type TextWeight = keyof typeof fontWeight;

export interface TextOwnProps extends StylesApiProps {
  /** Tamanho da letra: xs 13, sm 15, md 17, lg 20, xl 22. Padrão: md. */
  size?: Size | undefined;
  /** Papel de cor dos tokens (text, text2, accent, up, down…). Sem ele, herda a cor de fora. */
  color?: ColorRole | undefined;
  /** Peso: regular 400, medium 500, bold 700. Padrão: regular. */
  weight?: TextWeight | undefined;
  /** Alinhamento. Sem ele, herda de fora. */
  align?: "start" | "center" | "end" | "justify" | undefined;
  /** Corta em uma linha, com reticências. */
  truncate?: boolean | undefined;
  /** Corta em tantas linhas, com reticências. */
  lineClamp?: number | undefined;
  /** Herda a letra de fora (família, tamanho, peso e altura de linha); size e weight deixam de valer. */
  inherit?: boolean | undefined;
}

export type TextProps<C extends ElementType = "p"> = PolymorphicProps<C, TextOwnProps>;

/** Texto com a letra da Countify. Um `<p>`, ou o elemento de `component` (span, label, h2…). */
export function Text<C extends ElementType = "p">(props: TextProps<C>) {
  const {
    component, size = "md", color, weight = "regular", align, truncate, lineClamp, inherit,
    className, style, classNames, styles, ...rest
  } = useComponentProps("Text", {}, props);
  const getStyles = useStyles("Text", classes, { className, style, classNames, styles });
  const Component: ElementType = component ?? "p";
  return (
    <Component
      {...rest}
      data-size={size}
      data-inherit={inherit || undefined}
      data-truncate={truncate || undefined}
      data-line-clamp={lineClamp ?? undefined}
      {...getStyles("root", {
        "--text-size": `var(--cf-font-size-${size})`,
        "--text-weight": `var(--cf-font-weight-${weight})`,
        "--text-color": color && colorVar(color),
        "--text-align": align,
        "--text-line-clamp": lineClamp,
      })}
    />
  );
}
