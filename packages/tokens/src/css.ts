// Variáveis CSS (--cf-*) geradas dos tokens: o build grava em dist/tokens.css.
// Modo: segue o sistema; data-cf-color-scheme="light" | "dark" num elemento força o modo dele para baixo.
import { colors, palette, type ColorScheme } from "./colors.js";
import {
  avatarSize, controlFontSize, controlHeight, controlPaddingX, duration, easing, focusRing, fontFamily, fontSize, fontWeight, gutter,
  headings, iconSize, lineHeight, listRowHeight, radius, raisedShadow, shadows, sidePanelWidth, space, spacing, touchTarget, transition,
  zIndex,
} from "./scales.js";

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
const decl = (name: string, value: string | number) => `--cf-${kebab(name)}: ${value};`;
const each = (prefix: string, obj: Record<string, string | number>, unit = "") =>
  Object.entries(obj).map(([k, v]) => decl(`${prefix}-${k}`, `${v}${unit}`));

const ring = "inset 0 0 0 1px var(--cf-color-divider)";
const raised = `0 ${raisedShadow.offsetY}px ${raisedShadow.blur}px var(--cf-shadow-color), ${ring}`;

function schemeVars(scheme: ColorScheme): string[] {
  return [
    ...Object.entries(colors[scheme]).map(([k, v]) => decl(`color-${k}`, v)),
    decl("shadow-color", raisedShadow.color[scheme]),
    `color-scheme: ${scheme};`,
  ];
}

export function createCssVariables(): string {
  const fixas = [
    ...Object.entries(palette).flatMap(([nome, tons]) => tons.map((hex, i) => decl(`${nome}-${i}`, hex))),
    decl("font-sans", fontFamily.sans),
    decl("font-mono", fontFamily.mono),
    ...each("font-weight", fontWeight),
    ...each("font-size", fontSize, "px"),
    decl("line-height", lineHeight),
    ...Object.entries(headings).flatMap(([k, h]) => [
      decl(`heading-${k}-size`, `${h.fontSize}px`), decl(`heading-${k}-line-height`, h.lineHeight), decl(`heading-${k}-weight`, h.fontWeight),
    ]),
    ...each("space", space, "px"),
    ...each("spacing", spacing, "px"),
    ...each("gutter", gutter, "px"),
    ...each("radius", radius, "px"),
    decl("touch-target", `${touchTarget}px`),
    ...each("button-height", controlHeight.button, "px"),
    ...each("input-height", controlHeight.input, "px"),
    ...each("control-font-size", controlFontSize, "px"),
    ...each("control-padding-x", controlPaddingX, "px"),
    ...each("icon-size", iconSize, "px"),
    ...each("avatar-size", avatarSize, "px"),
    decl("list-row-height", `${listRowHeight}px`),
    decl("side-panel-width", `${sidePanelWidth}px`),
    ...Object.entries(shadows).map(([k, kind]) => decl(`shadow-${k}`, kind === "ring" ? ring : raised)),
    ...each("z", zIndex),
    ...each("duration", duration, "ms"),
    ...each("easing", easing),
    decl("transition-slide", `${transition.slide}px`),
    decl("transition-scale", transition.scale),
    ...each("focus-ring", focusRing, "px"),
  ];
  const bloco = (sel: string, linhas: string[]) => `${sel} {\n  ${linhas.join("\n  ")}\n}`;
  return [
    "/* @countify-oficial/tokens: gerado de src/; não edite à mão */",
    bloco(":root", [...fixas, ...schemeVars("light")]),
    bloco('[data-cf-color-scheme="light"]', schemeVars("light")),
    bloco('[data-cf-color-scheme="dark"]', schemeVars("dark")),
    `@media (prefers-color-scheme: dark) {\n${bloco(':root:not([data-cf-color-scheme="light"])', schemeVars("dark"))}\n}`,
    `@media (prefers-reduced-motion: reduce) {\n${bloco(":root", Object.keys(duration).map((k) => decl(`duration-${k}`, "0ms")))}\n}`,
  ].join("\n\n") + "\n";
}
