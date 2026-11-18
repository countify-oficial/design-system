// A tabela de dados de cada gráfico: vai escondida na web (para o leitor de tela) e vira o resumo no celular.
import type { CountifyMessages } from "@countify-oficial/provider";
import type { AreaChartData, BarChartData, BarListData, ComboChartData, FunnelChartData, HeatmapData, LineChartData, PieChartData, RadarChartData, SankeyChartData, ScatterChartData, SparklineData } from "./draw";

export interface DataTable {
  head: string[];
  rows: string[][];
}

const fmt = (v: number | null | undefined, f?: (v: number) => string) => (v === null || v === undefined ? "—" : (f ?? ((x: number) => new Intl.NumberFormat("pt-BR").format(x)))(v));

export function lineTable(d: LineChartData, m: CountifyMessages, nomes: { actual?: string | undefined; forecast?: string | undefined } = {}): DataTable {
  const n = Math.max(d.labels.length, d.actual.length);
  return {
    head: ["", nomes.actual ?? m.actual, ...(d.forecast ? [nomes.forecast ?? m.forecast] : []), ...(d.band ? [m.normalRange] : [])],
    rows: Array.from({ length: n }, (_, i) => [
      d.labels[i] ?? String(i + 1),
      fmt(d.actual[i], d.format),
      ...(d.forecast ? [fmt(d.forecast[i], d.format)] : []),
      ...(d.band ? [`${fmt(d.band[0][i], d.format)}–${fmt(d.band[1][i], d.format)}`] : []),
    ]),
  };
}

export const areaTable = (d: AreaChartData): DataTable => ({
  head: ["", ...d.series.map((s) => s.name)],
  rows: d.labels.map((l, i) => [l, ...d.series.map((s) => fmt(s.values[i], d.format))]),
});

/** Barras e combinado: uma coluna por série de barras e por linha (com uma série só, sem nome). */
export const barTable = (d: BarChartData & Partial<Pick<ComboChartData, "lines" | "formatRight">>): DataTable => {
  const series = d.series ?? [{ name: "", values: d.values ?? [] }];
  const lines = d.lines ?? [];
  const n = Math.max(0, ...series.map((s) => s.values.length), ...lines.map((l) => l.values.length));
  return {
    head: ["", ...series.map((s) => s.name), ...lines.map((l) => l.name)],
    rows: Array.from({ length: n }, (_, i) => [
      d.labels?.[i] || String(i + 1),
      ...series.map((s) => fmt(s.values[i], d.format)),
      ...lines.map((l) => fmt(l.values[i], l.axis === "right" ? (d.formatRight ?? d.format) : d.format)),
    ]),
  };
};

export const barListTable = (d: BarListData): DataTable => ({ head: ["", ""], rows: d.data.map((x) => [x.label, x.valueLabel ?? fmt(x.value, d.format)]) });

export const funnelTable = (d: FunnelChartData): DataTable => ({ head: ["", ""], rows: d.data.map((x) => [x.label, fmt(x.value, d.format)]) });

export const scatterTable = (d: ScatterChartData): DataTable => ({ head: ["", "x", "y"], rows: d.points.map((p, i) => [p.label ?? String(i + 1), fmt(p.x, d.formatX), fmt(p.y, d.formatY)]) });

export const heatmapTable = (d: HeatmapData, m: CountifyMessages): DataTable => ({
  head: ["", ...d.columns],
  rows: d.rows.map((r, i) => [r, ...(d.values[i] ?? []).map((v) => (v === null ? m.closed : fmt(v)))]),
});

export const pieTable = (d: PieChartData): DataTable => ({ head: ["", ""], rows: d.data.map((x) => [x.label, fmt(x.value, d.format)]) });

export const radarTable = (d: RadarChartData): DataTable => ({ head: ["", "", ...(d.compare ? [""] : [])], rows: d.axes.map((a, i) => [a, fmt(d.values[i]), ...(d.compare ? [fmt(d.compare[i])] : [])]) });

/** Sankey: uma linha por fluxo (origem, destino, valor), na ordem de links: é a mesma ordem da dica. */
export const sankeyTable = (d: SankeyChartData, m: CountifyMessages): DataTable => {
  const nome = new Map(d.nodes.map((x) => [x.id, x.label]));
  return { head: [m.flowSource, m.flowTarget, m.flowValue], rows: d.links.map((l) => [nome.get(l.source) ?? l.source, nome.get(l.target) ?? l.target, fmt(l.value, d.format)]) };
};

export const sparklineTable = (d: SparklineData): DataTable => ({ head: ["", ""], rows: d.values.map((v, i) => [String(i + 1), fmt(v)]) });

/** As linhas da dica de um ponto: o rótulo e "série: valor" (sem nome de série, só o valor). */
export const tipLines = (t: DataTable, i: number): string[] => {
  const [rotulo = "", ...celulas] = t.rows[i] ?? [];
  return [rotulo, ...celulas.map((c, j) => (t.head[j + 1] ? `${t.head[j + 1] ?? ""}: ${c}` : c))];
};

/** A tabela numa frase, para o leitor de tela do celular. */
export const tableSummary = (t: DataTable): string => t.rows.map((r) => r.filter(Boolean).join(" ")).join("; ");
