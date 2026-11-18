// As contas de cada gráfico: recebem os dados e a largura, devolvem a cena (formas com cor por papel).
import { chart, fontSize, ringProgress, space } from "@countify-oficial/tokens";
import { n1, pontos, type Paint, type Scene, type Shape } from "./scene";

const ROTULO = fontSize.xs;
const fmtPadrao = (v: number) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(v);
const SERIES: Paint[] = ["series-1", "series-2", "series-3", "series-4"];
export const seriesPaint = (i: number): Paint => SERIES[i % SERIES.length] ?? "accent";

/** Teto "redondo" do eixo: 1, 2, 2,5, 5 ou 10 vezes uma potência de 10. */
export function niceMax(v: number): number {
  if (!(v > 0)) return 1;
  const e = 10 ** Math.floor(Math.log10(v));
  const m = v / e;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * e;
}

/** O piso do eixo: 0, ou um valor "redondo" abaixo do menor negativo (a variação que caiu). */
const piso = (vs: number[]): number => {
  const menor = Math.min(0, ...vs);
  return menor < 0 ? -niceMax(-menor) : 0;
};

/** Marcas "redondas" de min a max (3 intervalos). */
export function niceTicks(min: number, max: number, intervalos = 3): number[] {
  const passo = niceMax((max - min) / intervalos || 1);
  // arredonda na casa do passo (0,02 não vira 0)
  const casas = Math.max(0, 1 - Math.floor(Math.log10(passo)));
  const ini = Math.floor(min / passo) * passo;
  const out: number[] = [];
  for (let v = ini; v <= max + passo * 0.999; v += passo) out.push(Number(v.toFixed(casas)));
  return out;
}

const texto = (x: number, y: number, t: string, anchor: "start" | "middle" | "end" = "middle", fill: Paint = "text2", weight?: 400 | 500 | 700): Shape => ({
  kind: "text", x, y, text: t, anchor, fill, size: ROTULO, ...(weight ? { weight } : {}),
});
const linha = (x1: number, y1: number, x2: number, y2: number, stroke: Paint, extra: Partial<Extract<Shape, { kind: "line" }>> = {}): Shape => ({
  kind: "line", x1, y1, x2, y2, stroke, strokeWidth: chart.stroke.grid, ...extra,
});
const finitos = (vs: (number | null | undefined)[]) => vs.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
/** Largura aproximada do texto de 13 (para pôr a legenda do mapa de calor depois de "menos"). */
const larguraTexto = (t: string) => t.length * ROTULO * 0.56;

// ---------- eixo comum da linha, da área e da dispersão

interface Eixo {
  shapes: Shape[];
  X: (i: number) => number;
  Y: (v: number) => number;
  base: number;
}

function eixoDeIndices(largura: number, altura: number, n: number, max: number, lo: number, labels: string[], format: (v: number) => string, labelEvery: number, esquerda: number): Eixo {
  const { top, bottom } = chart.padding;
  const ins = chart.inset;
  const base = altura - bottom;
  const X = (i: number) => esquerda + ins + (n > 1 ? (i * (largura - esquerda - 2 * ins)) / (n - 1) : (largura - esquerda - 2 * ins) / 2);
  const Y = (v: number) => top + ((base - top) * (max - v)) / (max - lo);
  const shapes: Shape[] = [];
  for (const t of lo < 0 ? [lo, 0, max] : [0, max / 2, max]) {
    shapes.push(linha(esquerda, Y(t), largura, Y(t), t === 0 ? "border" : "divider"));
    shapes.push(texto(esquerda - ins, Y(t) + 4, format(t), "end"));
  }
  labels.forEach((r, i) => {
    if (r && i % labelEvery === 0) shapes.push(texto(X(i), base + chart.labelBaseline.line, r, i === n - 1 && n > 1 ? "end" : "middle"));
  });
  return { shapes, X, Y, base };
}

const polilinha = (vs: (number | null)[], X: (i: number) => number, Y: (v: number) => number, de = 0, ate = vs.length): string =>
  pontos(vs.slice(de, ate).flatMap((v, k): [number, number][] => (v === null ? [] : [[X(de + k), Y(v)]])));

// ---------- linha

export interface LineChartData {
  /** Rótulos do eixo x ("8h", "10h"…); vazio não escreve. */
  labels: string[];
  /** O real; null é lacuna (não zero). */
  actual: (number | null)[];
  /** O previsto (ou o período anterior): tracejado, sem pontos. */
  forecast?: (number | null)[] | undefined;
  /** A faixa normal: [mínimos, máximos], cheia por baixo das linhas. */
  band?: [number[], number[]] | undefined;
  /** Índices sem dado, hachurados ("lacuna não é zero"). */
  gaps?: number[] | undefined;
  /** Quantos pontos já fecharam; daí em diante, pontilhado e o último ponto vazio (a hora em andamento). */
  partial?: number | undefined;
  /** Índice da linha "agora". */
  now?: number | undefined;
  /** Teto do eixo (a "mesma escala" entre gráficos). */
  max?: number | undefined;
  /** Pontos no real. Padrão: true. */
  markers?: boolean | undefined;
  /** Escreve um rótulo do x a cada tantos. Padrão: 1. */
  labelEvery?: number | undefined;
  format?: ((v: number) => string) | undefined;
  /** O texto de "agora". */
  nowLabel?: string | undefined;
}

export function drawLine(d: LineChartData, largura: number, altura: number = chart.height.line): Scene {
  const { labels, actual, forecast, band, gaps = [], partial, now, markers = true, labelEvery = 1, format = fmtPadrao, nowLabel = "agora" } = d;
  const valores = finitos([...actual, ...(forecast ?? []), ...(band ? [...band[0], ...band[1]] : [])]);
  const max = d.max ?? niceMax(Math.max(0, ...valores));
  const n = Math.max(labels.length, actual.length);
  const { shapes, X, Y, base } = eixoDeIndices(largura, altura, n, max, piso(valores), labels, format, labelEvery, chart.padding.left);
  const top = chart.padding.top;
  if (band) {
    const [lo, hi] = band;
    const ida = hi.map((v, i): [number, number] => [X(i), Y(v)]);
    const volta = lo.map((v, i): [number, number] => [X(i), Y(v)]).reverse();
    shapes.unshift({ kind: "polygon", points: pontos([...ida, ...volta]), fill: "divider" });
  }
  const passo = n > 1 ? X(1) - X(0) : 0;
  for (const g of gaps) shapes.push({ kind: "rect", x: X(g) - 0.3 * passo, y: top, width: 0.6 * passo, height: base - top, fill: "hatch" });
  if (forecast) shapes.push({ kind: "polyline", points: polilinha(forecast, X, Y), fill: "none", stroke: "text2", strokeWidth: chart.stroke.line, dash: chart.dash.forecast, cap: "round" });
  const corte = partial ?? actual.length;
  shapes.push({ kind: "polyline", points: polilinha(actual, X, Y, 0, corte), fill: "none", stroke: "accent", strokeWidth: chart.stroke.series, cap: "round", join: "round" });
  if (partial !== undefined) shapes.push({ kind: "polyline", points: polilinha(actual, X, Y, Math.max(0, partial - 1)), fill: "none", stroke: "accent", strokeWidth: chart.stroke.series, dash: chart.dash.partial, cap: "round" });
  const ultimo = actual.reduce<number>((u, v, i) => (v === null ? u : i), -1);
  if (markers) {
    actual.forEach((v, i) => {
      if (v === null) return;
      const vazio = partial !== undefined && i === ultimo;
      shapes.push(vazio ? { kind: "circle", cx: X(i), cy: Y(v), r: chart.point.radius, fill: "card", stroke: "accent", strokeWidth: chart.point.ring } : { kind: "circle", cx: X(i), cy: Y(v), r: chart.point.radius, fill: "accent" });
    });
  }
  if (now !== undefined) {
    shapes.push(linha(X(now), top - 4, X(now), base, "text3", { strokeWidth: chart.stroke.now, dash: chart.dash.now }));
    shapes.push(texto(X(now) + 4, top + 2, nowLabel, "start"));
  }
  return { height: altura, shapes, hatch: gaps.length > 0, tips: { xs: Array.from({ length: n }, (_, i) => X(i)), top, bottom: base } };
}

// ---------- área (a confirmar com o design)

export interface AreaChartData {
  labels: string[];
  /** Uma série ou várias (cores das séries, na ordem). */
  series: { name: string; values: (number | null)[] }[];
  max?: number | undefined;
  labelEvery?: number | undefined;
  format?: ((v: number) => string) | undefined;
}

export function drawArea(d: AreaChartData, largura: number, altura: number = chart.height.line): Scene {
  const { labels, series, labelEvery = 1, format = fmtPadrao } = d;
  const valores = finitos(series.flatMap((s) => s.values));
  const max = d.max ?? niceMax(Math.max(0, ...valores));
  const n = Math.max(labels.length, ...series.map((s) => s.values.length));
  const { shapes, X, Y, base } = eixoDeIndices(largura, altura, n, max, piso(valores), labels, format, labelEvery, chart.padding.left);
  const cor = (i: number): Paint => (series.length === 1 ? "accent" : seriesPaint(i));
  series.forEach((s, i) => {
    const pts = s.values.flatMap((v, k): [number, number][] => (v === null ? [] : [[X(k), Y(v)]]));
    const primeiro = pts[0];
    const ultimo = pts.at(-1);
    if (!primeiro || !ultimo) return;
    // a área vai até o zero (com negativos, o zero não é o pé do gráfico)
    shapes.push({ kind: "polygon", points: pontos([[primeiro[0], Y(0)], ...pts, [ultimo[0], Y(0)]]), fill: cor(i), opacity: chart.areaOpacity });
  });
  series.forEach((s, i) => shapes.push({ kind: "polyline", points: polilinha(s.values, X, Y), fill: "none", stroke: cor(i), strokeWidth: chart.stroke.line, cap: "round", join: "round" }));
  return { height: altura, shapes, tips: { xs: Array.from({ length: n }, (_, i) => X(i)), top: chart.padding.top, bottom: base } };
}

// ---------- barras (uma série, várias agrupadas ou empilhadas) e o combinado (barras + linhas)

export interface BarSeries {
  name: string;
  values: (number | null)[];
}

export interface BarChartData {
  /** Uma série só: as barras comuns em cinza e o pico em destaque. */
  values?: (number | null)[] | undefined;
  /** Várias séries (lojas, períodos), no lugar de values: cores das séries, na ordem; lado a lado ou empilhadas. */
  series?: BarSeries[] | undefined;
  /** Empilha as séries numa barra só por ponto (positivos para cima, negativos para baixo). Padrão: false (lado a lado). */
  stacked?: boolean | undefined;
  labels?: string[] | undefined;
  forecast?: (number | null)[] | undefined;
  /** A barra em destaque (o pico): um índice, ou "max" para a maior. Só com values. */
  highlight?: number | "max" | undefined;
  /** Grade e rótulos do eixo y. Padrão: false (as barras pequenas do W-Comparar). */
  axis?: boolean | undefined;
  max?: number | undefined;
  format?: ((v: number) => string) | undefined;
}

export interface ComboLine {
  name: string;
  values: (number | null)[];
  /** O eixo da linha: right põe a escala dela à direita (conversão em % sobre vendas em R$). Padrão: left. */
  axis?: "left" | "right" | undefined;
  /** Tracejada na text2, sem pontos, como o previsto (a meta). Padrão: false (cor da série, traço 3 e pontos). */
  dashed?: boolean | undefined;
}

export interface ComboChartData extends Omit<BarChartData, "forecast"> {
  /** As linhas por cima das barras, no centro de cada barra. */
  lines: ComboLine[];
  /** Teto do eixo da direita. */
  rightMax?: number | undefined;
  /** Formato do eixo da direita (e dos valores das linhas da direita na tabela e na dica). Padrão: format. */
  formatRight?: ((v: number) => string) | undefined;
}

const numero = (v: number | null | undefined): v is number => typeof v === "number" && Number.isFinite(v);

export function drawBar(d: BarChartData & Partial<Omit<ComboChartData, keyof BarChartData>>, largura: number, altura: number = chart.height.bar): Scene {
  const { labels, forecast, axis = false, format = fmtPadrao, stacked = false, lines = [] } = d;
  const multi = d.series !== undefined;
  const series = d.series ?? [{ name: "", values: d.values ?? [] }];
  const n = Math.max(1, ...series.map((s) => s.values.length), ...lines.map((l) => l.values.length));
  const direitas = lines.filter((l) => l.axis === "right");
  const esquerda = axis ? chart.padding.left : 0;
  const direita = axis && direitas.length > 0 ? chart.padding.left : 0;
  const topo = axis ? chart.padding.top : chart.inset;
  const base = altura - (labels ? chart.bar.bottom : 0);
  // empilhadas, o eixo vai até a soma de cada ponto
  const somas = (negativos: boolean) => Array.from({ length: n }, (_, i) => series.reduce((t, s) => { const v = s.values[i]; return numero(v) && v < 0 === negativos ? t + v : t; }, 0));
  const valores = finitos([...(stacked ? [...somas(false), ...somas(true)] : series.flatMap((s) => s.values)), ...(forecast ?? []), ...lines.filter((l) => l.axis !== "right").flatMap((l) => l.values)]);
  const max = d.max ?? niceMax(Math.max(0, ...valores));
  const lo = piso(valores);
  const vd = finitos(direitas.flatMap((l) => l.values));
  const rmax = d.rightMax ?? niceMax(Math.max(0, ...vd));
  const rlo = piso(vd);
  const fatia = (largura - esquerda - direita) / n;
  const vao = Math.min(chart.bar.gap, fatia * 0.2);
  const Y = (v: number) => topo + ((base - topo) * (max - v)) / (max - lo);
  const YR = (v: number) => topo + ((base - topo) * (rmax - v)) / (rmax - rlo);
  const cx = (i: number) => esquerda + i * fatia + fatia / 2;
  const primeira = series[0]?.values ?? [];
  const destaque = multi ? undefined : d.highlight === "max" ? primeira.indexOf(Math.max(...finitos(primeira))) : d.highlight;
  const cor = (k: number, i: number): Paint => (multi ? (series.length === 1 ? "accent" : seriesPaint(k)) : i === destaque ? "accent" : "border");
  const shapes: Shape[] = [];
  if (axis) {
    for (const t of lo < 0 ? [lo, max] : [max / 2, max]) {
      shapes.push(linha(esquerda, Y(t), largura - direita, Y(t), "divider"));
      shapes.push(texto(esquerda - chart.inset, Y(t) + 4, format(t), "end"));
      // a escala da direita usa as mesmas linhas da grade
      if (direita > 0) shapes.push(texto(largura - direita + chart.inset, Y(t) + 4, (d.formatRight ?? format)(rlo + ((rmax - rlo) * (t - lo)) / (max - lo)), "start"));
    }
  }
  const lado = stacked ? 1 : series.length;
  const w = (fatia - vao) / lado;
  const cima: number[] = [];
  const baixo: number[] = [];
  series.forEach((s, k) => {
    s.values.forEach((v, i) => {
      if (!numero(v)) return;
      const pilha = v < 0 ? baixo : cima;
      const de = stacked ? (pilha[i] ?? 0) : 0;
      if (stacked) pilha[i] = de + v;
      // a barra sai do zero (ou do topo da pilha): para cima se positiva, para baixo se negativa
      shapes.push({ kind: "rect", x: esquerda + i * fatia + vao / 2 + (stacked ? 0 : k * w), y: Math.min(Y(de + v), Y(de)), width: w, height: Math.abs(Y(de + v) - Y(de)), rx: chart.bar.radius, fill: cor(k, i) });
    });
  });
  shapes.push(linha(esquerda, Y(0), largura - direita, Y(0), "border"));
  if (forecast) {
    shapes.push({ kind: "polyline", points: pontos(forecast.flatMap((v, i): [number, number][] => (v === null ? [] : [[cx(i), Y(v)]]))), fill: "none", stroke: "text2", strokeWidth: chart.stroke.line, dash: chart.dash.forecast, cap: "round" });
  }
  // as linhas cheias continuam as cores depois das barras coloridas; com barras cinza, a 1ª é a da série (a 2ª, se houver pico)
  let cheia = multi ? series.length : destaque !== undefined ? 1 : 0;
  for (const l of lines) {
    const Yl = l.axis === "right" ? YR : Y;
    const pts = l.values.flatMap((v, i): [number, number][] => (numero(v) ? [[cx(i), Yl(v)]] : []));
    if (l.dashed) {
      shapes.push({ kind: "polyline", points: pontos(pts), fill: "none", stroke: "text2", strokeWidth: chart.stroke.line, dash: chart.dash.forecast, cap: "round" });
      continue;
    }
    const c = seriesPaint(cheia++);
    shapes.push({ kind: "polyline", points: pontos(pts), fill: "none", stroke: c, strokeWidth: chart.stroke.series, cap: "round", join: "round" });
    for (const [x, y] of pts) shapes.push({ kind: "circle", cx: x, cy: y, r: chart.point.radius, fill: c });
  }
  labels?.forEach((r, i) => {
    if (r) shapes.push(texto(cx(i), base + chart.labelBaseline.bar, r));
  });
  return { height: altura, shapes, tips: { xs: Array.from({ length: n }, (_, i) => cx(i)), top: topo, bottom: base } };
}

/** Combinado: barras (uma série ou várias) e linhas por cima, com o eixo da direita opcional. Eixo e altura da linha por padrão. */
export const drawCombo = (d: ComboChartData, largura: number, altura: number = chart.height.line): Scene => drawBar({ axis: true, ...d }, largura, altura);

// ---------- ranking (barras deitadas) e funil

export interface BarListData {
  data: { label: string; value: number; valueLabel?: string | undefined }[];
  /** Uma marca de referência (a média do grupo), no valor dado. */
  reference?: number | undefined;
  /** Teto (a 1ª barra cheia, se não vier). */
  max?: number | undefined;
  format?: ((v: number) => string) | undefined;
}

const LINHA_TEXTO = Math.round(fontSize.sm * 1.4);

function drawRows(itens: { label: string; valor: number; rotulo: string }[], largura: number, max: number, alturaBarra: number, referencia?: number): Scene {
  const shapes: Shape[] = [];
  const linhaDoItem = LINHA_TEXTO + space[2] + alturaBarra;
  const entre = space[4];
  itens.forEach((it, i) => {
    const y = i * (linhaDoItem + entre);
    if (i > 0) shapes.push(linha(0, y - entre / 2, largura, y - entre / 2, "divider"));
    shapes.push({ kind: "text", x: 0, y: y + fontSize.sm, text: it.label, anchor: "start", fill: "text", size: fontSize.sm });
    shapes.push({ kind: "text", x: largura, y: y + fontSize.sm, text: it.rotulo, anchor: "end", fill: "text", size: fontSize.sm, weight: 700 });
    const yb = y + LINHA_TEXTO + space[2];
    shapes.push({ kind: "rect", x: 0, y: yb, width: largura, height: alturaBarra, rx: alturaBarra / 2, fill: "divider" });
    const w = max > 0 ? Math.max(0, Math.min(1, it.valor / max)) * largura : 0;
    if (w > 0) shapes.push({ kind: "rect", x: 0, y: yb, width: w, height: alturaBarra, rx: alturaBarra / 2, fill: "accent" });
    if (referencia !== undefined && max > 0) {
      const xr = Math.min(1, referencia / max) * largura;
      shapes.push({ kind: "rect", x: xr - chart.barList.tick / 2, y: yb - chart.barList.overhang, width: chart.barList.tick, height: alturaBarra + 2 * chart.barList.overhang, fill: "text" });
    }
  });
  const altura = itens.length * linhaDoItem + Math.max(0, itens.length - 1) * entre + chart.barList.overhang;
  return { height: altura, shapes };
}

export function drawBarList(d: BarListData, largura: number): Scene {
  const format = d.format ?? fmtPadrao;
  const max = d.max ?? Math.max(0, ...d.data.map((x) => x.value));
  return drawRows(d.data.map((x) => ({ label: x.label, valor: x.value, rotulo: x.valueLabel ?? format(x.value) })), largura, max, chart.barList.height, d.reference);
}

export interface FunnelChartData {
  /** As etapas, da maior para a menor ("Visitantes", "Compraram"). */
  data: { label: string; value: number }[];
  format?: ((v: number) => string) | undefined;
}

/** Barra de conversão por etapa (W-Indicadores): 16 de altura; o valor e a parte da 1ª etapa à direita. */
export function drawFunnel(d: FunnelChartData, largura: number): Scene {
  const format = d.format ?? fmtPadrao;
  const primeiro = d.data[0]?.value ?? 0;
  const pct = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });
  return drawRows(
    d.data.map((x, i) => ({ label: x.label, valor: x.value, rotulo: i === 0 || primeiro === 0 ? format(x.value) : `${format(x.value)} · ${pct.format(x.value / primeiro)}` })),
    largura,
    primeiro,
    chart.funnel.height,
  );
}

// ---------- Sankey (a identidade não desenha: a barra do funil em pé e as faixas como a área; aprovado em 18/11/2026)

export interface SankeyChartData {
  /** As etapas: id único (o que os fluxos citam) e o nome escrito ao lado da barra. Em cada coluna, a ordem é a de cima para baixo. */
  nodes: { id: string; label: string }[];
  /**
   * Os fluxos de uma etapa para outra; a espessura é proporcional ao value (negativo conta como 0). A coluna de cada
   * etapa é o caminho mais longo desde uma etapa de entrada. Um id fora de nodes, um id repetido em nodes ou fluxos que
   * voltam a uma etapa já passada (ciclo) são recusados com erro: o Sankey só anda para a frente.
   */
  links: { source: string; target: string; value: number }[];
  /** O formato dos números (rótulos, tabela e dica). Padrão: pt-BR com até uma casa. */
  format?: ((v: number) => string) | undefined;
}

/**
 * Os dados do Sankey sem o que não dá para desenhar: etapa com id repetido (fica a primeira), fluxo para uma etapa que
 * não existe e fluxo que fecharia um ciclo (fica o que veio antes em links). O que sai é avisado no console; a tela não
 * quebra quando o servidor manda um dado ruim. Devolve os mesmos objetos quando está tudo certo.
 */
export function cleanSankey<D extends SankeyChartData>(d: D): D {
  const avisos: string[] = [];
  const nodes = d.nodes.filter((x, i) => {
    const primeira = d.nodes.findIndex((o) => o.id === x.id) === i;
    if (!primeira) avisos.push(`etapa com id repetido "${x.id}" ("${x.label}")`);
    return primeira;
  });
  const ids = new Set(nodes.map((x) => x.id));
  const saidas = new Map<string, string[]>();
  // há caminho de "de" até "para" pelos fluxos já aceitos?
  const alcanca = (de: string, para: string): boolean => {
    const vistos = new Set<string>();
    const pilha = [de];
    for (let atual = pilha.pop(); atual !== undefined; atual = pilha.pop()) {
      if (atual === para) return true;
      if (vistos.has(atual)) continue;
      vistos.add(atual);
      pilha.push(...(saidas.get(atual) ?? []));
    }
    return false;
  };
  const links = d.links.filter((l) => {
    if (!ids.has(l.source) || !ids.has(l.target)) {
      avisos.push(`fluxo "${l.source}" → "${l.target}" cita uma etapa que não está em nodes`);
      return false;
    }
    if (alcanca(l.target, l.source)) {
      avisos.push(`fluxo "${l.source}" → "${l.target}" fecharia um ciclo`);
      return false;
    }
    saidas.set(l.source, [...(saidas.get(l.source) ?? []), l.target]);
    return true;
  });
  if (!avisos.length) return d;
  console.warn(`SankeyChart: ignorado(s) ${avisos.join("; ")}.`);
  return { ...d, nodes, links };
}

export function drawSankey(dados: SankeyChartData, largura: number, altura: number = chart.height.line): Scene {
  const d = cleanSankey(dados);
  const format = d.format ?? fmtPadrao;
  const ids = new Map(d.nodes.map((x, i) => [x.id, i]));
  // depois do cleanSankey, toda etapa citada existe
  const fluxos = d.links.map((l) => ({ s: ids.get(l.source) ?? 0, t: ids.get(l.target) ?? 0, v: Math.max(0, l.value) || 0 }));
  // a coluna pela ordem topológica (Kahn): quem não entra na fila está num ciclo
  const prof = d.nodes.map(() => 0);
  const faltam = d.nodes.map((_, i) => fluxos.filter((l) => l.t === i).length);
  const fila = faltam.flatMap((f, i) => (f === 0 ? [i] : []));
  for (let k = 0; k < fila.length; k++) {
    const s = fila[k] ?? 0;
    for (const l of fluxos) {
      if (l.s !== s) continue;
      prof[l.t] = Math.max(prof[l.t] ?? 0, (prof[s] ?? 0) + 1);
      faltam[l.t] = (faltam[l.t] ?? 0) - 1;
      if (faltam[l.t] === 0) fila.push(l.t);
    }
  }
  const soma = (f: (l: (typeof fluxos)[number]) => boolean) => fluxos.reduce((t, l) => (f(l) ? t + l.v : t), 0);
  const valor = d.nodes.map((_, i) => Math.max(soma((l) => l.t === i), soma((l) => l.s === i)));
  const ultima = Math.max(0, ...prof);
  const colunas = Array.from({ length: ultima + 1 }, (_, c) => d.nodes.flatMap((_, i) => (prof[i] === c ? [i] : [])));
  // aprovado em 18/11/2026: a barra da etapa tem a altura da barra de conversão (16) e o vão entre etapas é o do funil (16)
  const barra = chart.funnel.height;
  const vao = space[4];
  // cada etapa ocupa ao menos as duas linhas do rótulo (nome e número), para os textos não se encostarem
  const bloco = 2 * LINHA_TEXTO;
  const somaCol = (col: number[]) => col.reduce((t, i) => t + (valor[i] ?? 0), 0);
  const ky = Math.max(0, Math.min(...colunas.map((col) => (somaCol(col) > 0 ? (altura - (col.length - 1) * vao) / somaCol(col) : Infinity))));
  const escala = Number.isFinite(ky) ? ky : 0;
  const alto = valor.map((v) => v * escala);
  const vaga = alto.map((h) => Math.max(h, bloco));
  const extensao = colunas.map((col) => col.reduce((t, i) => t + (vaga[i] ?? 0), 0) + Math.max(0, col.length - 1) * vao);
  const total = Math.max(0, ...extensao);
  // o rótulo do funil: o nome e, embaixo, o número em negrito com a parte da entrada (a soma da 1ª coluna)
  const entrada = somaCol(colunas[0] ?? []);
  const pct = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });
  const numeros = valor.map((v, i) => (prof[i] === 0 || entrada === 0 ? format(v) : `${format(v)} · ${pct.format(v / entrada)}`));
  // os rótulos ficam à direita da barra; a última coluna reserva o lugar dos dela (largura aproximada do texto de 15)
  const larguraRotulo = (i: number) => space[2] + Math.max(...[d.nodes[i]?.label ?? "", numeros[i] ?? ""].map((t) => t.length * fontSize.sm * 0.56));
  const reserva = Math.max(0, ...(colunas[ultima] ?? []).map(larguraRotulo));
  const X = prof.map((c) => (ultima > 0 ? (c * Math.max(0, largura - barra - reserva)) / ultima : 0));
  const Y = d.nodes.map(() => 0);
  colunas.forEach((col, c) => {
    // cada coluna centrada na altura da maior
    let y = (total - (extensao[c] ?? 0)) / 2;
    for (const i of col) {
      Y[i] = y + ((vaga[i] ?? 0) - (alto[i] ?? 0)) / 2;
      y += (vaga[i] ?? 0) + vao;
    }
  });
  // as faixas saem na ordem do destino e chegam na ordem da origem (de cima para baixo): menos cruzamentos
  const sai = d.nodes.map(() => 0);
  const chega = d.nodes.map(() => 0);
  const ys0: number[] = [];
  const ys1: number[] = [];
  const ordem = fluxos.map((_, j) => j);
  const de = (j: number) => fluxos[j] ?? { s: 0, t: 0, v: 0 };
  for (const j of [...ordem].sort((a, b) => (Y[de(a).t] ?? 0) - (Y[de(b).t] ?? 0))) {
    const { s, v } = de(j);
    ys0[j] = (Y[s] ?? 0) + (sai[s] ?? 0);
    sai[s] = (sai[s] ?? 0) + v * escala;
  }
  for (const j of [...ordem].sort((a, b) => (Y[de(a).s] ?? 0) - (Y[de(b).s] ?? 0))) {
    const { t, v } = de(j);
    ys1[j] = (Y[t] ?? 0) + (chega[t] ?? 0);
    chega[t] = (chega[t] ?? 0) + v * escala;
  }
  const f = (v: number) => String(n1(v));
  const faixas = fluxos.map(({ s, t, v }, j) => {
    const x0 = (X[s] ?? 0) + barra;
    const x1 = X[t] ?? 0;
    const xm = (x0 + x1) / 2;
    const y0 = ys0[j] ?? 0;
    const y1 = ys1[j] ?? 0;
    const w = v * escala;
    return { d: `M${f(x0)},${f(y0)}C${f(xm)},${f(y0)} ${f(xm)},${f(y1)} ${f(x1)},${f(y1)}L${f(x1)},${f(y1 + w)}C${f(xm)},${f(y1 + w)} ${f(xm)},${f(y0 + w)} ${f(x0)},${f(y0 + w)}Z`, x: xm, y: (y0 + y1 + w) / 2 };
  });
  const shapes: Shape[] = faixas.map((fx) => ({ kind: "path", d: fx.d, fill: "accent", opacity: chart.areaOpacity }));
  d.nodes.forEach((x, i) => {
    const xi = X[i] ?? 0;
    const yi = Y[i] ?? 0;
    if ((alto[i] ?? 0) > 0) shapes.push({ kind: "rect", x: xi, y: yi, width: barra, height: alto[i] ?? 0, rx: chart.bar.radius, fill: "accent" });
    const tx = xi + barra + space[2];
    const b1 = yi + (alto[i] ?? 0) / 2 - LINHA_TEXTO + fontSize.sm;
    shapes.push({ kind: "text", x: tx, y: b1, text: x.label, anchor: "start", fill: "text", size: fontSize.sm });
    shapes.push({ kind: "text", x: tx, y: b1 + LINHA_TEXTO, text: numeros[i] ?? "", anchor: "start", fill: "text", size: fontSize.sm, weight: 700 });
  });
  // aprovado em 18/11/2026: o fluxo ativo da dica ganha mais uma camada da série a 36% (o 2º tom do mapa de calor)
  const marks: Shape[] = faixas.map((fx) => ({ kind: "path", d: fx.d, fill: "accent", opacity: chart.heatmap.levels[1] }));
  return { height: total, shapes, tips: { xs: faixas.map((fx) => fx.x), ys: faixas.map((fx) => fx.y), top: 0, bottom: total, marks } };
}

// ---------- dispersão

export interface ScatterChartData {
  points: { x: number; y: number; label?: string | undefined }[];
  formatX?: ((v: number) => string) | undefined;
  formatY?: ((v: number) => string) | undefined;
  /** Rótulos do y largos ("R$ 25 mil"). Padrão: true. */
  wideAxis?: boolean | undefined;
}

export function drawScatter(d: ScatterChartData, largura: number, altura: number = chart.height.scatter): Scene {
  const { points, formatX = fmtPadrao, formatY = fmtPadrao, wideAxis = true } = d;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  // sem nada acima de zero, o eixo vai até 1 (como o niceMax)
  const tx = niceTicks(Math.min(0, ...xs), Math.max(0, ...xs) || 1);
  const ty = niceTicks(Math.min(0, ...ys), Math.max(0, ...ys) || 1);
  const esquerda = wideAxis ? chart.padding.leftWide : chart.padding.left;
  const { top, bottom } = chart.padding;
  const base = altura - bottom;
  const x0 = tx[0] ?? 0;
  const x1 = tx.at(-1) ?? 1;
  const y0 = ty[0] ?? 0;
  const y1 = ty.at(-1) ?? 1;
  const X = (v: number) => esquerda + chart.inset + ((v - x0) / (x1 - x0 || 1)) * (largura - esquerda - 2 * chart.inset);
  const Y = (v: number) => top + (1 - (v - y0) / (y1 - y0 || 1)) * (base - top);
  const shapes: Shape[] = [];
  for (const t of ty) {
    shapes.push(linha(esquerda, Y(t), largura, Y(t), t === y0 ? "border" : "divider"));
    shapes.push(texto(esquerda - chart.inset, Y(t) + 4, formatY(t), "end"));
  }
  tx.forEach((t, i) => shapes.push(texto(X(t), base + chart.labelBaseline.line, formatX(t), i === tx.length - 1 ? "end" : "middle")));
  for (const p of points) {
    shapes.push({ kind: "circle", cx: X(p.x), cy: Y(p.y), r: chart.point.scatter, fill: "accent", stroke: "card", strokeWidth: chart.point.ring });
    if (p.label) shapes.push(texto(X(p.x) - chart.point.scatter - 4, Y(p.y) - 4, p.label, "end", "label"));
  }
  return { height: altura, shapes };
}

// ---------- mapa de calor

export interface HeatmapData {
  rows: string[];
  columns: string[];
  /** Linhas × colunas; null = fechado (contorno tracejado, não zero). */
  values: (number | null)[][];
  lessLabel?: string | undefined;
  moreLabel?: string | undefined;
}

export const heatLevel = (v: number, max: number): number => {
  const niveis = chart.heatmap.levels;
  const i = Math.min(niveis.length - 1, Math.max(0, Math.floor((max > 0 ? v / max : 0) * niveis.length - 1e-9)));
  return niveis[i] ?? 1;
};

export function drawHeatmap(d: HeatmapData, largura: number): Scene {
  const { rows, columns, values, lessLabel = "menos", moreLabel = "mais" } = d;
  const { cellHeight: ch, radius, labelWidth, swatch } = chart.heatmap;
  const vao = space[1];
  const n = Math.max(1, columns.length);
  const cw = (largura - labelWidth - vao * n) / n;
  const max = Math.max(0, ...finitos(values.flat()));
  const shapes: Shape[] = [];
  rows.forEach((r, i) => {
    const y = i * (ch + vao);
    shapes.push(texto(0, y + ch / 2 + 4, r, "start"));
    (values[i] ?? []).forEach((v, j) => {
      const x = labelWidth + vao + j * (cw + vao);
      shapes.push(
        v === null
          ? { kind: "rect", x: x + 0.5, y: y + 0.5, width: cw - 1, height: ch - 1, rx: radius, fill: "none", stroke: "border", strokeWidth: chart.stroke.grid, dash: chart.dash.now }
          : { kind: "rect", x, y, width: cw, height: ch, rx: radius, fill: "accent", opacity: heatLevel(v, max) },
      );
    });
  });
  const grade = rows.length * (ch + vao);
  columns.forEach((t, j) => {
    if (t) shapes.push(texto(labelWidth + vao + j * (cw + vao) + cw / 2, grade + fontSize.xs, t));
  });
  const ly = grade + fontSize.xs + space[3];
  shapes.push(texto(0, ly + swatch.height - 1, lessLabel, "start"));
  const x0 = larguraTexto(lessLabel) + space[2];
  chart.heatmap.levels.forEach((nv, k) => shapes.push({ kind: "rect", x: x0 + k * (swatch.width + vao), y: ly, width: swatch.width, height: swatch.height, rx: swatch.radius, fill: "accent", opacity: nv }));
  shapes.push(texto(x0 + chart.heatmap.levels.length * (swatch.width + vao) + space[1], ly + swatch.height - 1, moreLabel, "start"));
  return { height: ly + swatch.height, shapes };
}

// ---------- pizza e rosca (a confirmar com o design)

export interface PieChartData {
  data: { label: string; value: number }[];
  format?: ((v: number) => string) | undefined;
}

const polar = (cx: number, cy: number, r: number, ang: number): [number, number] => [cx + r * Math.sin(ang), cy - r * Math.cos(ang)];

function fatia(cx: number, cy: number, r: number, interno: number, a0: number, a1: number): string {
  const grande = a1 - a0 > Math.PI ? 1 : 0;
  // um só pedaço (100%): dois arcos, porque o arco de 360° some
  if (a1 - a0 >= Math.PI * 2 - 1e-9) {
    const fora = `M${String(n1(cx))},${String(n1(cy - r))}A${String(r)},${String(r)} 0 1 1 ${String(n1(cx))},${String(n1(cy + r))}A${String(r)},${String(r)} 0 1 1 ${String(n1(cx))},${String(n1(cy - r))}Z`;
    return interno > 0 ? `${fora}M${String(n1(cx))},${String(n1(cy - interno))}A${String(interno)},${String(interno)} 0 1 0 ${String(n1(cx))},${String(n1(cy + interno))}A${String(interno)},${String(interno)} 0 1 0 ${String(n1(cx))},${String(n1(cy - interno))}Z` : fora;
  }
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  if (interno <= 0) return `M${String(n1(cx))},${String(n1(cy))}L${String(n1(x0))},${String(n1(y0))}A${String(r)},${String(r)} 0 ${String(grande)} 1 ${String(n1(x1))},${String(n1(y1))}Z`;
  const [x2, y2] = polar(cx, cy, interno, a1);
  const [x3, y3] = polar(cx, cy, interno, a0);
  return `M${String(n1(x0))},${String(n1(y0))}A${String(r)},${String(r)} 0 ${String(grande)} 1 ${String(n1(x1))},${String(n1(y1))}L${String(n1(x2))},${String(n1(y2))}A${String(interno)},${String(interno)} 0 ${String(grande)} 0 ${String(n1(x3))},${String(n1(y3))}Z`;
}

export function drawPie(d: PieChartData, largura: number, opcoes: { donut?: boolean | undefined; centerLabel?: string | undefined; size?: number | undefined } = {}): Scene {
  const format = d.format ?? fmtPadrao;
  const tamanho = Math.min(largura, opcoes.size ?? chart.pieSize);
  const r = tamanho / 2;
  const cx = largura / 2;
  const cy = r;
  const interno = opcoes.donut ? r - tamanho * ringProgress.thicknessRatio : 0;
  const total = d.data.reduce((t, x) => t + Math.max(0, x.value), 0);
  const shapes: Shape[] = [];
  let a = 0;
  d.data.forEach((x, i) => {
    const parte = total > 0 ? (Math.max(0, x.value) / total) * Math.PI * 2 : 0;
    if (parte <= 0) return;
    shapes.push({ kind: "path", d: fatia(cx, cy, r, interno, a, a + parte), fill: seriesPaint(i), stroke: d.data.length > 1 ? "card" : "none", strokeWidth: chart.sliceGap, join: "round" });
    a += parte;
  });
  if (opcoes.donut && opcoes.centerLabel) shapes.push({ kind: "text", x: cx, y: cy + fontSize.lg / 3, text: opcoes.centerLabel, anchor: "middle", fill: "text", size: fontSize.lg, weight: 700 });
  // legenda: quadrado da cor, nome e valor
  const lq = chart.legend.square;
  const passo = Math.round(fontSize.xs * 1.4) + space[1];
  d.data.forEach((x, i) => {
    const y = tamanho + space[4] + i * passo;
    shapes.push({ kind: "rect", x: 0, y, width: lq, height: lq, rx: chart.bar.radius, fill: seriesPaint(i) });
    shapes.push(texto(lq + space[2], y + lq - 1, x.label, "start", "label"));
    shapes.push(texto(largura, y + lq - 1, format(x.value), "end", "text", 700));
  });
  return { height: tamanho + space[4] + d.data.length * passo, shapes };
}

// ---------- radar (a confirmar com o design)

export interface RadarChartData {
  /** Os eixos ("Entradas", "Conversão"…). */
  axes: string[];
  values: number[];
  /** Outra série para comparar: tracejada, sem preenchimento. */
  compare?: number[] | undefined;
  max?: number | undefined;
}

export function drawRadar(d: RadarChartData, largura: number, size: number = chart.pieSize): Scene {
  const n = d.axes.length;
  const max = d.max ?? niceMax(Math.max(0, ...d.values, ...(d.compare ?? [])));
  const folga = space[8] + space[4];
  const tamanho = Math.min(largura - 2 * folga, size);
  const r = tamanho / 2;
  const cx = largura / 2;
  const cy = r + space[6];
  const ang = (i: number) => (i * Math.PI * 2) / Math.max(1, n);
  const ponto = (i: number, v: number) => polar(cx, cy, (Math.max(0, v) / max) * r, ang(i));
  const shapes: Shape[] = [];
  for (const nivel of [1 / 3, 2 / 3, 1]) shapes.push({ kind: "polygon", points: pontos(d.axes.map((_, i) => polar(cx, cy, r * nivel, ang(i)))), fill: "none", stroke: "divider", strokeWidth: chart.stroke.grid });
  d.axes.forEach((nome, i) => {
    const [x, y] = polar(cx, cy, r, ang(i));
    shapes.push(linha(cx, cy, x, y, "divider"));
    const [lx, ly] = polar(cx, cy, r + space[3], ang(i));
    const s = Math.sin(ang(i));
    shapes.push(texto(lx, ly + 4, nome, Math.abs(s) < 0.2 ? "middle" : s > 0 ? "start" : "end"));
  });
  if (d.compare) shapes.push({ kind: "polygon", points: pontos(d.compare.map((v, i) => ponto(i, v))), fill: "none", stroke: "text2", strokeWidth: chart.stroke.line, dash: chart.dash.forecast });
  shapes.push({ kind: "polygon", points: pontos(d.values.map((v, i) => ponto(i, v))), fill: "accent", opacity: chart.areaOpacity });
  shapes.push({ kind: "polygon", points: pontos(d.values.map((v, i) => ponto(i, v))), fill: "none", stroke: "accent", strokeWidth: chart.stroke.line, join: "round" });
  return { height: cy + r + space[6], shapes };
}

// ---------- minigráfico (a confirmar com o design)

export interface SparklineData {
  values: (number | null)[];
}

export function drawSparkline(d: SparklineData, largura: number, altura: number = chart.sparklineHeight): Scene {
  const vs = finitos(d.values);
  const min = Math.min(0, ...vs);
  const max = Math.max(0, ...vs);
  const m = chart.stroke.line;
  const n = d.values.length;
  const X = (i: number) => m + (n > 1 ? (i * (largura - 2 * m)) / (n - 1) : (largura - 2 * m) / 2);
  const Y = (v: number) => m + (altura - 2 * m) * (1 - (v - min) / (max - min || 1));
  return { height: altura, shapes: [{ kind: "polyline", points: polilinha(d.values, X, Y), fill: "none", stroke: "accent", strokeWidth: chart.stroke.line, cap: "round", join: "round" }] };
}
