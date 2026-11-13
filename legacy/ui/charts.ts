// Gráficos do Countify em SVG: a conta e o desenho ficam aqui, iguais na web e no celular.
// Cada função devolve { svg, height }; o componente da plataforma só mede a largura e desenha.
// Cores: na web vêm como variáveis CSS e vão no atributo style; no celular vêm em hex e vão em
// atributos, que é o que o react-native-svg lê.
import { font } from "./tokens.js";
import type { LineChartProps, BarChartProps, ScatterChartProps, HeatmapProps } from "./types.js";

export const PALETTE_KEYS = ["accent", "text", "text2", "text3", "divider", "border", "hatch", "card"] as const;
export type Palette = Record<(typeof PALETTE_KEYS)[number], string>;
// web: palette em variáveis CSS; nativo: em hex (native: true põe a cor em atributos)
export type Draw = { width: number; palette: Palette; native?: boolean };
export type Drawn = { svg: string; height: number };
const fmtPadrao = (v: number) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(v);
const esc = (s: unknown) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch as "&"]);
const n1 = (v: number) => Math.round(v * 10) / 10;

// teto "redondo" do eixo: 1, 2, 2,5, 5 ou 10 vezes uma potência de 10
export function niceMax(v: number): number {
  if (!(v > 0)) return 1;
  const e = 10 ** Math.floor(Math.log10(v)), m = v / e;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * e;
}
function niceTicks(min: number, max: number, count = 3): number[] {
  const passo = niceMax((max - min) / count || 1), a = Math.floor(min / passo) * passo, out: number[] = [];
  for (let v = a; v <= max + passo * 0.999; v += passo) out.push(n1(v));
  return out;
}

function kit(native: boolean, c: Palette) {
  const pinta = (props: Record<string, string | number>) =>
    native ? Object.entries(props).map(([k, v]) => ` ${k}="${v}"`).join("") : ` style="${Object.entries(props).map(([k, v]) => `${k}:${v}`).join(";")}"`;
  const F = native ? ` font-family="${font.native[400]}"` : "";
  const texto = (x: number, y: number, t: unknown, anchor = "middle", cor = c.text2) =>
    `<text x="${n1(x)}" y="${n1(y)}" font-size="13" text-anchor="${anchor}"${F}${pinta({ fill: cor })}>${esc(t)}</text>`;
  const linha = (x1: number, y1: number, x2: number, y2: number, cor: string, extra = "") =>
    `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}"${extra}${pinta({ stroke: cor })}/>`;
  const abre = (w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${n1(w)}" height="${h}" viewBox="0 0 ${n1(w)} ${h}" aria-hidden="true">`;
  return { pinta, texto, linha, abre };
}

// Linha: real × previsto, faixa normal, lacunas hachuradas, hora em andamento pontilhada e "agora"
export function lineChart(o: LineChartProps, { width, palette: c, native = false }: Draw): Drawn {
  const { labels, actual = [], forecast, band, gaps = [], partial, now, format = fmtPadrao } = o;
  const height = Number(o.height) || 220;
  const { pinta, texto, linha, abre } = kit(native, c);
  const vals = [...actual, ...(forecast || []), ...(band ? band[1] : [])].filter((v) => v != null);
  const ymax = o.max ?? niceMax(Math.max(1, ...vals));
  const n = labels.length, L = 40, R = 8, T = 16, B = 28;
  const X = (i: number) => L + (n > 1 ? (i * (width - L - R)) / (n - 1) : (width - L - R) / 2);
  const Y = (v: number) => T + (height - T - B) * (1 - v / ymax);
  const pts = (arr: (number | null)[], de = 0, ate = arr.length) =>
    arr.slice(de, ate).map((v, k) => (v == null ? null : `${n1(X(de + k))},${n1(Y(v))}`)).filter(Boolean).join(" ");
  const out = [abre(width, height)];
  out.push(`<defs><pattern id="cf-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="7"${pinta({ fill: c.hatch })}/></pattern></defs>`);
  for (const t of [0, ymax / 2, ymax]) {
    out.push(linha(L, Y(t), width - R, Y(t), t === 0 ? c.border : c.divider));
    out.push(texto(L - 8, Y(t) + 4, format(t), "end"));
  }
  if (band) {
    const [lo, hi] = band;
    const ida = hi.map((v, i) => `${n1(X(i))},${n1(Y(v))}`), volta = lo.map((v, i) => `${n1(X(i))},${n1(Y(v))}`).reverse();
    out.push(`<polygon points="${[...ida, ...volta].join(" ")}"${pinta({ fill: c.divider })}/>`);
  }
  const dx = n > 1 ? X(1) - X(0) : 0;
  for (const g of gaps) out.push(`<rect x="${n1(X(g) - 0.3 * dx)}" y="${T}" width="${n1(0.6 * dx)}" height="${height - T - B}" fill="url(#cf-hatch)"/>`);
  if (forecast) out.push(`<polyline points="${pts(forecast)}" fill="none" stroke-width="2" stroke-dasharray="5 5" stroke-linecap="round"${pinta({ stroke: c.text2 })}/>`);
  const corte = partial ?? actual.length;
  out.push(`<polyline points="${pts(actual, 0, corte)}" fill="none" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"${pinta({ stroke: c.accent })}/>`);
  if (partial != null) out.push(`<polyline points="${pts(actual, partial - 1)}" fill="none" stroke-width="3" stroke-dasharray="1 6" stroke-linecap="round"${pinta({ stroke: c.accent })}/>`);
  const ultimo = actual.reduce((u, v, i) => (v == null ? u : i), -1);
  actual.forEach((v, i) => {
    if (v == null) return;
    const vazio = now != null && i === ultimo; // a hora que ainda não fechou
    out.push(`<circle cx="${n1(X(i))}" cy="${n1(Y(v))}" r="4"${vazio ? ' stroke-width="2"' : ""}${pinta(vazio ? { fill: c.card, stroke: c.accent } : { fill: c.accent })}/>`);
  });
  if (now != null) {
    out.push(linha(X(now), T - 4, X(now), height - B, c.text3, ' stroke-width="1.5" stroke-dasharray="3 3"'));
    out.push(texto(X(now) + 4, T + 2, "agora", "start"));
  }
  labels.forEach((r, i) => r && out.push(texto(X(i), height - 6, r, i === n - 1 && n > 1 ? "end" : "middle")));
  return { svg: out.join("") + "</svg>", height };
}

// Barras: real em barras, previsto em linha tracejada, uma barra em destaque (o pico)
export function barChart(o: BarChartProps, { width, palette: c, native = false }: Draw): Drawn {
  const { values, labels, forecast, highlight, axis = false, format = fmtPadrao } = o;
  const height = Number(o.height) || 120;
  const { pinta, texto, linha, abre } = kit(native, c);
  const n = values.length, L = axis ? 40 : 0, T = 8, B = labels ? 24 : 0;
  const ymax = o.max ?? niceMax(Math.max(1, ...values.filter((v) => v != null), ...(forecast || []).filter((v) => v != null)));
  const base = height - B, slot = (width - L) / n, gap = Math.min(4, slot * 0.2);
  const Y = (v: number) => T + (base - T) * (1 - v / ymax), cx = (i: number) => L + i * slot + slot / 2;
  const out = [abre(width, height)];
  if (axis) for (const t of [ymax / 2, ymax]) { out.push(linha(L, Y(t), width, Y(t), c.divider)); out.push(texto(L - 8, Y(t) + 4, format(t), "end")); }
  values.forEach((v, i) => {
    if (v == null) return;
    out.push(`<rect x="${n1(L + i * slot + gap / 2)}" y="${n1(Y(v))}" width="${n1(slot - gap)}" height="${n1(base - Y(v))}" rx="2"${pinta({ fill: i === highlight ? c.accent : c.text })}/>`);
  });
  out.push(linha(L, base, width, base, c.border));
  if (forecast) out.push(`<polyline points="${forecast.map((v, i) => (v == null ? null : `${n1(cx(i))},${n1(Y(v))}`)).filter(Boolean).join(" ")}" fill="none" stroke-width="2" stroke-dasharray="4 4" stroke-linecap="round"${pinta({ stroke: c.text2 })}/>`);
  if (labels) labels.forEach((r, i) => r && out.push(texto(cx(i), height - 6, r)));
  return { svg: out.join("") + "</svg>", height };
}

// Dispersão: um ponto por loja (ou dia), com nome nos que pedirem
export function scatterChart(o: ScatterChartProps, { width, palette: c, native = false }: Draw): Drawn {
  const { points, formatX = fmtPadrao, formatY = fmtPadrao } = o;
  const height = Number(o.height) || 240;
  const { pinta, texto, linha, abre } = kit(native, c);
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  const tx = niceTicks(Math.min(...xs), Math.max(...xs)), ty = niceTicks(Math.min(...ys), Math.max(...ys));
  const L = 72, R = 16, T = 16, B = 28;
  const X = (v: number) => L + ((v - tx[0]) / (tx.at(-1)! - tx[0] || 1)) * (width - L - R);
  const Y = (v: number) => T + (1 - (v - ty[0]) / (ty.at(-1)! - ty[0] || 1)) * (height - T - B);
  const out = [abre(width, height)];
  for (const t of ty) { out.push(linha(L, Y(t), width - R, Y(t), c.divider)); out.push(texto(L - 8, Y(t) + 4, formatY(t), "end")); }
  for (const t of tx) out.push(texto(X(t), height - 6, formatX(t)));
  for (const p of points) {
    out.push(`<circle cx="${n1(X(p.x))}" cy="${n1(Y(p.y))}" r="4.5"${pinta({ fill: c.accent })}/>`);
    if (p.label) out.push(texto(X(p.x) - 8, Y(p.y) - 8, p.label, "end", c.text));
  }
  return { svg: out.join("") + "</svg>", height };
}

// Mapa de calor: dia da semana × hora; null = fechado (contorno tracejado, não zero)
export const HEAT_LEVELS = [0.18, 0.36, 0.56, 0.78, 1];
export function heatmap(o: HeatmapProps, { width, palette: c, native = false }: Draw): Drawn {
  const { rows, columns, values } = o;
  const { pinta, texto, abre } = kit(native, c);
  const L = 36, gap = 4, ch = 20, n = columns.length;
  const cw = (width - L - gap * (n - 1)) / n;
  const max = Math.max(1, ...values.flat().filter((v) => v != null));
  const grade = rows.length * (ch + gap);
  const height = grade + 24 + 32;
  const out = [abre(width, height)];
  rows.forEach((r, i) => {
    const y = i * (ch + gap);
    out.push(texto(0, y + 14, r, "start"));
    values[i].forEach((v, j) => {
      const x = L + j * (cw + gap);
      if (v == null) out.push(`<rect x="${n1(x + 0.5)}" y="${y + 0.5}" width="${n1(cw - 1)}" height="${ch - 1}" rx="3" fill="none" stroke-dasharray="3 3"${pinta({ stroke: c.border })}/>`);
      else {
        const nivel = HEAT_LEVELS[Math.min(4, Math.floor((v / max) * 5 - 1e-9))] ?? HEAT_LEVELS[0];
        out.push(`<rect x="${n1(x)}" y="${y}" width="${n1(cw)}" height="${ch}" rx="3"${pinta({ fill: c.accent, opacity: nivel })}/>`);
      }
    });
  });
  columns.forEach((t, j) => t && out.push(texto(L + j * (cw + gap) + cw / 2, grade + 14, t)));
  const ly = grade + 30;
  out.push(texto(0, ly + 11, "menos", "start"));
  HEAT_LEVELS.forEach((nv, k) => out.push(`<rect x="${48 + k * 20}" y="${ly}" width="16" height="14" rx="3"${pinta({ fill: c.accent, opacity: nv })}/>`));
  out.push(texto(48 + 5 * 20 + 4, ly + 11, "mais", "start"));
  return { svg: out.join("") + "</svg>", height };
}

export const charts = { line: lineChart, bar: barChart, scatter: scatterChart, heatmap };
