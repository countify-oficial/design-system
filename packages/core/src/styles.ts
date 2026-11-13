import { useComponentTheme } from "@countify-oficial/provider";
import { colors, tones, type ColorRole, type Responsive, type Spacing, type Tone } from "@countify-oficial/tokens";
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

/** Junta nomes de classe, ignorando os vazios. */
export const cx = (...nomes: (string | false | undefined)[]): string | undefined => nomes.filter(Boolean).join(" ") || undefined;

/** "accentHover" → "accent-hover", como nas variáveis --cf-color-* */
export const kebab = (s: string): string => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

/**
 * A variável CSS de um papel de cor. Só aceita papéis que existem nos tokens (o valor pode vir de JS sem tipo ou de
 * dados do servidor); qualquer outro vira o papel de reserva.
 */
export const colorVar = (role: string, fallback: ColorRole = "text"): string =>
  `var(--cf-color-${kebab(Object.hasOwn(colors.light, role) ? role : fallback)})`;

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

/** Spacing → variável dos tokens: "md" → var(--cf-spacing-md); 3 → var(--cf-space-3); 0 → 0. */
export const spacingVar = (s: Spacing | undefined): string | undefined =>
  s === undefined ? undefined : s === 0 ? "0" : typeof s === "number" ? `var(--cf-space-${s})` : `var(--cf-spacing-${s})`;

/**
 * Valor por ponto de quebra → --nome, --nome-sm e --nome-lg. O CSS Module escolhe pela media query
 * (o que falta herda o menor).
 */
export function responsiveVars<T extends string | number>(
  name: `--${string}`,
  value: Responsive<T> | undefined,
  toCss: (v: T) => string | number | undefined = (v) => v,
): CssVars {
  if (value === undefined) return {};
  if (typeof value !== "object") return { [name]: toCss(value) };
  return {
    [name]: toCss(value.base),
    [`${name}-sm`]: value.sm === undefined ? undefined : toCss(value.sm),
    [`${name}-lg`]: value.lg === undefined ? undefined : toCss(value.lg),
  };
}

/** Variáveis do tom: --tone-c (texto), --tone-tint (fundo claro), --tone-fill (fundo cheio). */
export const toneVars = (tone: Tone): CssVars => {
  const t = Object.hasOwn(tones, tone) ? tones[tone] : tones.gray;
  return { "--tone-c": colorVar(t.c), "--tone-tint": colorVar(t.tint), "--tone-fill": colorVar(t.fill) };
};
