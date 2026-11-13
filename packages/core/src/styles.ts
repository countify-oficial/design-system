import { useComponentTheme } from "@countify-oficial/provider";
import type { CSSProperties } from "react";

/** Styles API (web): classe e estilo por parte interna. className e style soltos vão para a raiz. */
export interface StylesApiProps<Part extends string = "root"> {
  className?: string | undefined;
  style?: CSSProperties | undefined;
  classNames?: Partial<Record<Part, string>> | undefined;
  styles?: Partial<Record<Part, CSSProperties>> | undefined;
}

/** Variáveis CSS para o style (o tipo do React não aceita "--nome"). */
export type CssVars = Partial<Record<`--${string}`, string | number | undefined>>;

const cx = (...nomes: (string | false | undefined)[]) => nomes.filter(Boolean).join(" ") || undefined;

/** "accentHover" → "accent-hover", como nas variáveis --cf-color-* */
export const kebab = (s: string): string => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

/**
 * className e style de cada parte. Do mais fraco ao mais forte: CSS Module, tema (theme.components[name]), props.
 * `vars` são as variáveis CSS do próprio componente (o CSS Module lê delas).
 */
export function useStyles<Part extends string>(name: string, css: Readonly<Record<string, string>>, props: StylesApiProps<Part>) {
  const theme = useComponentTheme(name);
  return (part: Part, vars?: CssVars): { className: string | undefined; style: CSSProperties } => ({
    className: cx(css[part], theme.classNames?.[part], props.classNames?.[part], part === "root" && props.className),
    style: {
      ...(vars as CSSProperties | undefined),
      ...(theme.styles?.[part] as CSSProperties | undefined),
      ...props.styles?.[part],
      ...(part === "root" ? props.style : undefined),
    },
  });
}
