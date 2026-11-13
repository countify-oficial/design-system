// Cores da Countify. Origem de cada valor: docs/TOKENS_COUNTIFY.md.
// As escalas têm 10 tons (0 = mais claro); os tons da identidade estão nos degraus marcados com "identidade".
// Os papéis (accent, up, down…) apontam para um degrau quando o tom existe na escala; senão, são o hex da identidade.

export const palette = {
  // identidade: 0, 2, 3, 6, 7, 9
  blue: ["#EBF2FC", "#D2E3F9", "#B9D4F6", "#8CBAF2", "#689AD8", "#457ABF", "#225BA5", "#184680", "#183A68", "#172F50"],
  // identidade: 0, 3, 6, 9
  green: ["#E9F7F0", "#CAE8D9", "#ABD8C2", "#8BC9AC", "#6DA98D", "#4F896F", "#326B53", "#275947", "#1E483B", "#16372F"],
  // identidade: 3, 6
  red: ["#FDEDEE", "#FBD7DA", "#F7C1C7", "#FDA4AF", "#E67C82", "#CE5352", "#B42318", "#85110A", "#6C160E", "#541710"],
  // aviso: aprovado em 13/11/2026 (a identidade não tem amarelo nem laranja)
  amber: ["#FFEEDC", "#FFDAB1", "#FFC581", "#F1A43E", "#CF8400", "#A76A00", "#805000", "#633D00", "#533200", "#442800"],
  // identidade: todos
  gray: ["#F8FAFC", "#EEF2F6", "#E8EDF3", "#CBD5E1", "#94A3B8", "#667085", "#475569", "#334155", "#182A42", "#111827"],
} as const;

export type PaletteColor = keyof typeof palette;
export type Shade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type ColorScheme = "light" | "dark";

/** Cor principal e o degrau que vale em cada modo (#225BA5 no claro, #8CBAF2 no escuro). */
export const primaryColor: PaletteColor = "blue";
export const primaryShade = { light: 6, dark: 3 } as const satisfies Record<ColorScheme, Shade>;

const { blue, green, red, amber, gray } = palette;

const light = {
  bg: "#F4F6FA",
  card: "#FFFFFF",
  sheet: "#F4F6FA",
  field: "#FFFFFF",
  chip: gray[2],
  nav: "#FFFFFF",
  text: gray[8],
  text2: gray[6],
  text3: gray[5],
  label: gray[7],
  accent: blue[6],
  accentHover: blue[7],
  accentTint: blue[0],
  /** botão principal: o mesmo azul nos dois modos, com texto branco */
  button: blue[6],
  onButton: "#FFFFFF",
  up: green[6],
  upTint: green[0],
  down: red[6],
  warn: amber[6],
  warnTint: amber[0],
  divider: gray[1],
  border: "#D0D5DD",
  borderStrong: gray[3],
  hatch: gray[3],
  scrim: "#C9CFD8",
  logoTile: blue[6],
  logoRing: "#FFFFFF",
  logoArc: blue[3],
  logoWord: gray[9],
};

export type ColorRole = keyof typeof light;
export type SchemeColors = Record<ColorRole, string>;

const dark: SchemeColors = {
  bg: "#0B1120",
  card: gray[9],
  sheet: gray[9],
  field: "#172033",
  chip: "#22334A",
  nav: gray[9],
  text: gray[0],
  text2: gray[4],
  text3: gray[4],
  label: gray[3],
  accent: blue[3],
  accentHover: blue[2],
  accentTint: blue[9],
  button: blue[6],
  onButton: "#FFFFFF",
  up: green[3],
  upTint: green[9],
  down: red[3],
  warn: amber[3],
  warnTint: amber[9],
  divider: "#253044",
  border: gray[6],
  borderStrong: gray[6],
  hatch: gray[6],
  scrim: "#020617",
  logoTile: blue[3],
  logoRing: gray[9],
  logoArc: blue[6],
  logoWord: gray[0],
};

export const colors: Record<ColorScheme, SchemeColors> = { light, dark };

/** Tom da cor principal no modo pedido. */
export const primary = (scheme: ColorScheme): string => palette[primaryColor][primaryShade[scheme]];

/** Tom de um componente (Badge, ThemeIcon, Alert…): cor do texto (c), fundo claro (tint) e fundo cheio (fill). */
export type Tone = "gray" | "accent" | "up" | "down" | "warn";
export const tones = {
  gray: { c: "text2", tint: "chip", fill: "text2" },
  accent: { c: "accent", tint: "accentTint", fill: "accent" },
  up: { c: "up", tint: "upTint", fill: "up" },
  // a identidade não tem tinta de queda: o fundo claro é o do chip
  down: { c: "down", tint: "chip", fill: "down" },
  warn: { c: "warn", tint: "warnTint", fill: "warn" },
} as const satisfies Record<Tone, { c: ColorRole; tint: ColorRole; fill: ColorRole }>;
