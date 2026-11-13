import { useComponentProps } from "@countify-oficial/provider";
import type { ColorRole, headings, Responsive } from "@countify-oficial/tokens";
import type { ComponentPropsWithRef } from "react";
import { colorVar, kebab, responsiveVars, useStyles, type StylesApiProps } from "../styles";
import classes from "./Title.module.css";

/** Os títulos do guia: tabTitle 32, pageTitle 28, screenTitle 22, section 20, number 28, overline 13 em maiúsculas. */
export type TitleSize = keyof typeof headings;

export interface TitleProps extends StylesApiProps, Omit<ComponentPropsWithRef<"h1">, "className" | "style" | "color"> {
  /** Nível: h1 a h6. Padrão: 1. */
  order?: 1 | 2 | 3 | 4 | 5 | 6 | undefined;
  /** Tamanho do guia, por ponto de quebra. Padrão: h1 = screenTitle (22) no celular e pageTitle (28) a partir de 768; os outros, section (20). */
  size?: Responsive<TitleSize> | undefined;
  /** Papel de cor. Sem ele, herda (overline: text2). */
  color?: ColorRole | undefined;
  align?: "start" | "center" | "end" | undefined;
}

const base = (s: Responsive<TitleSize>): TitleSize => (typeof s === "object" ? s.base : s);

/** Título com a escala do guia da Countify. */
export function Title(props: TitleProps) {
  const { order = 1, size, color, align, className, style, classNames, styles, ...rest } = useComponentProps("Title", {}, props);
  const getStyles = useStyles("Title", classes, { className, style, classNames, styles });
  const tamanho = size ?? (order === 1 ? { base: "screenTitle", sm: "pageTitle" } : "section");
  const Tag = `h${order}` as const;
  const v = (sufixo: string) => (s: TitleSize) => `var(--cf-heading-${kebab(s)}-${sufixo})`;
  const cor = color ?? (base(tamanho) === "overline" ? "text2" : undefined);
  return (
    <Tag
      {...rest}
      data-overline={base(tamanho) === "overline" || undefined}
      data-number={base(tamanho) === "number" || undefined}
      {...getStyles("root", {
        ...responsiveVars("--title-fz", tamanho, v("size")),
        ...responsiveVars("--title-lh", tamanho, v("line-height")),
        ...responsiveVars("--title-fw", tamanho, v("weight")),
        "--title-color": cor && colorVar(cor),
        "--title-align": align,
      })}
    />
  );
}
