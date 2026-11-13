// Letra, espaço, cantos, tamanhos, sombras, camadas, movimento e pontos de quebra.
// Origem de cada valor: docs/TOKENS_COUNTIFY.md ("identidade" ou "aprovado em 13/11/2026").

export type Size = "xs" | "sm" | "md" | "lg" | "xl";
type BySize<T = number> = Record<Size, T>;

// ---------- letra
export const fontFamily = {
  sans: "Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'Roboto Mono', ui-monospace, Menlo, Consolas, monospace",
} as const;
export const fontWeight = { regular: 400, medium: 500, bold: 700 } as const;
export type FontWeight = (typeof fontWeight)[keyof typeof fontWeight];
/** Nada abaixo de 13. */
export const fontSize: BySize = { xs: 13, sm: 15, md: 17, lg: 20, xl: 22 };
/** Espaço entre letras do rótulo em maiúsculas (overline), em em. Origem: 0.1.0. */
export const overlineTracking = 0.08;
/** Texto de 13 a 17: 1,4. Títulos e números têm a sua em `headings`. */
export const lineHeight = 1.4;
export const headings = {
  /** título das telas de aba no celular (Painel, Análises, Avisos, Ajustes) */
  tabTitle: { fontSize: 32, lineHeight: 1.15, fontWeight: 700 },
  /** título da página no computador */
  pageTitle: { fontSize: 28, lineHeight: 1.2, fontWeight: 700 },
  /** título das telas internas no celular */
  screenTitle: { fontSize: 22, lineHeight: 1.2, fontWeight: 700 },
  section: { fontSize: 20, lineHeight: 1.25, fontWeight: 700 },
  /** número de indicador, com algarismos de mesma largura */
  number: { fontSize: 28, lineHeight: 1.15, fontWeight: 700 },
  /** rótulo de seção e eixo de gráfico, em maiúsculas (espaço entre letras: overlineTracking) */
  overline: { fontSize: 13, lineHeight: 1.4, fontWeight: 700 },
} as const satisfies Record<string, { fontSize: number; lineHeight: number; fontWeight: FontWeight }>;

// ---------- espaço e cantos
/** Grade de 4: a chave vezes 4 dá o valor. */
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32 } as const;
export const spacing: BySize = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
/** Espaço das props (gap, spacing…): um tamanho xs–xl ou um degrau da grade de 4 (3 = 12, 5 = 20); 0 = sem espaço. */
export type Spacing = Size | keyof typeof space | 0;
/** O valor em px de um Spacing. */
export const resolveSpacing = (s: Spacing): number => (s === 0 ? 0 : typeof s === "number" ? space[s] : spacing[s]);
/** Margem lateral da tela. */
export const gutter = { mobile: 20, desktop: 32 } as const;
/** Retângulo arredondado, nunca pílula: 8 segmento, 12 controles, 16 cartões, 20 dia escolhido, 24 topo da folha. */
export const radius: BySize = { xs: 8, sm: 12, md: 16, lg: 20, xl: 24 };

// ---------- tamanhos dos componentes (prop size). Nada que se toca abaixo de 44.
export const touchTarget = 44;
export const controlHeight = {
  button: { xs: 44, sm: 44, md: 52, lg: 56, xl: 64 },
  input: { xs: 44, sm: 44, md: 48, lg: 52, xl: 56 },
} as const satisfies Record<string, BySize>;
export const controlFontSize: BySize = { xs: 13, sm: 15, md: 17, lg: 17, xl: 20 };
export const controlPaddingX: BySize = { xs: 12, sm: 16, md: 20, lg: 24, xl: 28 };
export const iconSize: BySize = { xs: 16, sm: 18, md: 22, lg: 28, xl: 32 };
export const avatarSize: BySize = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };
export const listRowHeight = 64;
/** Linha compacta de 56: lista com caixas, interruptor e cabeçalho do acordeão (mockup X-DocComponentes e 0.1.0). */
export const compactRowHeight = 56;
/** Painel lateral no computador (a folha vira painel a partir de 768). */
export const sidePanelWidth = 380;

// ---------- sombras: só o anel em xs–md; a sombra da identidade em lg e xl (menus, popover, painel lateral, modal)
export type ShadowKind = "ring" | "raised";
export const shadows: BySize<ShadowKind> = { xs: "ring", sm: "ring", md: "ring", lg: "raised", xl: "raised" };
/** Sombra elevada: 0 16px 40px na cor do modo, sempre com o anel por cima. */
export const raisedShadow = {
  offsetY: 16,
  blur: 40,
  color: { light: "rgba(24, 42, 66, 0.16)", dark: "rgba(0, 0, 0, 0.35)" },
} as const;

// ---------- estados (0.1.0): apagado, véu do hover (web) e opacidade ao tocar (celular)
export const state = { disabledOpacity: 0.4, hoverVeil: "rgb(127 127 127 / 0.1)", pressedOpacity: 0.8, pulseOpacity: 0.5 } as const;

// ---------- "Carregando" do mockup (X-DocEstados): os três blocos do cartão de número (rótulo, número e variação)
export const skeletonStat = {
  label: { width: 96, height: 16 },
  value: { width: 140, height: 32 },
  detail: { width: 112, height: 16 },
} as const;

// ---------- anel e semicírculo de progresso (aprovado em 13/11/2026): espessura = 1/5 do tamanho, como o anel da marca
export const ringProgress = { size: 120, semicircleSize: 200, thicknessRatio: 0.2 } as const;

// ---------- linhas (mockup X-DocComponentes): fina (contorno, divisória) e grossa (escolhido, tracejado)
export const borderWidth = { thin: 1, thick: 1.5 } as const;

// ---------- girador (0.1.0): o traço; o tamanho é o do ícone (iconSize)
export const loaderStroke = 2.5;

// ---------- camadas
export const zIndex = { base: 0, sticky: 10, app: 100, overlay: 200, dropdown: 300, notification: 400, tooltip: 500, max: 9999 } as const;

// ---------- movimento (em ms). Com "reduzir movimento" ligado, tudo vira 0.
export const duration = { fast: 120, base: 150, slow: 200, spin: 800, pulse: 1400 } as const;
export const easing = { out: "ease-out", inOut: "ease-in-out", linear: "linear" } as const;
/** Quanto o Transition desloca (slide, em px) e de quanto cresce (scale); aprovado em 13/11/2026. */
export const transition = { slide: space[2], scale: 0.95 } as const;

// ---------- anel de foco (teclado): linha na cor accent; aprovado em 13/11/2026
export const focusRing = { width: 2, offset: 2 } as const;

// ---------- pontos de quebra: sm = layout de computador; lg = menu superior com texto
export const breakpoints = { sm: 768, lg: 1280 } as const;
/** Valor por ponto de quebra: base (celular), sm (a partir de 768) e lg (a partir de 1280); o que falta herda o menor. */
export type Responsive<T extends string | number> = T | { base: T; sm?: T | undefined; lg?: T | undefined };
