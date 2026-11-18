import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { Grafico, type ChartFrameProps } from "./Chart.native";
import {
  drawArea, drawBar, drawBarList, drawCombo, drawFunnel, drawHeatmap, drawLine, drawPie, drawRadar, drawSankey, drawScatter, drawSparkline,
  type AreaChartData, type BarChartData, type BarListData, type ComboChartData, type FunnelChartData, type HeatmapData, type LineChartData, type PieChartData, type RadarChartData, type SankeyChartData, type ScatterChartData,
  type SparklineData,
} from "./draw";
import { areaTable, barListTable, barTable, funnelTable, heatmapTable, lineTable, pieTable, radarTable, sankeyTable, scatterTable, sparklineTable } from "./tables";

export type LineChartProps = LineChartData & ChartFrameProps & { seriesLabels?: { actual?: string | undefined; forecast?: string | undefined } | undefined };

/** Linha por hora do mockup: real (traço 3, pontos), previsto tracejado, faixa normal, lacunas hachuradas e "agora". */
export function LineChart(props: LineChartProps) {
  const messages = useMessages();
  const p = useComponentProps("LineChart", {}, props);
  return <Grafico {...p} desenhar={(w) => drawLine({ nowLabel: messages.now, ...p }, w, p.height)} tabela={lineTable(p, messages, p.seriesLabels)} />;
}

export type AreaChartProps = AreaChartData & ChartFrameProps;

/** Área: a série com o preenchimento claro por baixo; várias séries nas cores das séries. A confirmar com o design. */
export function AreaChart(props: AreaChartProps) {
  const p = useComponentProps("AreaChart", {}, props);
  return <Grafico {...p} desenhar={(w) => drawArea(p, w, p.height)} tabela={areaTable(p)} />;
}

export type BarChartProps = BarChartData & ChartFrameProps;

/**
 * Barras (W-Comparar): as comuns em cinza, o pico em destaque, o previsto tracejado. Use max igual para a "mesma escala".
 * Com series, várias séries nas cores das séries: lado a lado (lojas, períodos) ou empilhadas (stacked).
 */
export function BarChart(props: BarChartProps) {
  const p = useComponentProps("BarChart", {}, props);
  return <Grafico {...p} desenhar={(w) => drawBar(p, w, p.height)} tabela={barTable(p)} />;
}

export type ComboChartProps = ComboChartData & ChartFrameProps;

/** Combinado: barras (values ou series) e linhas por cima (a meta tracejada, a conversão no eixo da direita). */
export function ComboChart(props: ComboChartProps) {
  const p = useComponentProps("ComboChart", {}, props);
  return <Grafico {...p} desenhar={(w) => drawCombo(p, w, p.height)} tabela={barTable(p)} />;
}

export type BarListProps = BarListData & ChartFrameProps;

/** Ranking em barras deitadas de 8: nome e valor em cima, a 1ª cheia; reference marca a média do grupo. */
export function BarList(props: BarListProps) {
  const p = useComponentProps("BarList", {}, props);
  return <Grafico {...p} desenhar={(w) => drawBarList(p, w)} tabela={barListTable(p)} />;
}

export type FunnelChartProps = FunnelChartData & ChartFrameProps;

/** Funil: uma barra de conversão de 16 por etapa, com a parte da 1ª etapa. */
export function FunnelChart(props: FunnelChartProps) {
  const p = useComponentProps("FunnelChart", {}, props);
  return <Grafico {...p} desenhar={(w) => drawFunnel(p, w)} tabela={funnelTable(p)} />;
}

export type SankeyChartProps = SankeyChartData & ChartFrameProps;

/**
 * Sankey: fluxos entre etapas (visitantes → entraram → compraram; recebido → exposto → vendido ou perdido), com a
 * espessura proporcional ao valor. Etapas como a barra do funil em pé, com o nome e o número; faixas na série a 18%.
 * A dica mostra o fluxo mais perto do mouse, do dedo ou das setas. Ciclo ou id desconhecido: erro. A confirmar com o design.
 */
export function SankeyChart(props: SankeyChartProps) {
  const messages = useMessages();
  const p = useComponentProps("SankeyChart", {}, props);
  return <Grafico {...p} desenhar={(w) => drawSankey(p, w, p.height)} tabela={sankeyTable(p, messages)} />;
}

export type ScatterChartProps = ScatterChartData & ChartFrameProps;

/** Dispersão (M-Montar): um ponto por loja, com anel na cor do cartão e o nome nos que pedirem. */
export function ScatterChart(props: ScatterChartProps) {
  const p = useComponentProps("ScatterChart", {}, props);
  return <Grafico {...p} desenhar={(w) => drawScatter(p, w, p.height)} tabela={scatterTable(p)} />;
}

export type HeatmapProps = HeatmapData & ChartFrameProps;

/** Mapa de calor (dia × hora): cinco tons da série; fechado é contorno tracejado, não zero. */
export function Heatmap(props: HeatmapProps) {
  const messages = useMessages();
  const p = useComponentProps("Heatmap", {}, props);
  return <Grafico {...p} desenhar={(w) => drawHeatmap({ lessLabel: messages.less, moreLabel: messages.more, ...p }, w)} tabela={heatmapTable(p, messages)} />;
}

export type PieChartProps = PieChartData & ChartFrameProps & { size?: number | undefined };

/** Pizza com legenda (cores das séries). A confirmar com o design. */
export function PieChart(props: PieChartProps) {
  const p = useComponentProps("PieChart", {}, props);
  return <Grafico {...p} desenhar={(w) => drawPie(p, w, { size: p.size })} tabela={pieTable(p)} />;
}

export type DonutChartProps = PieChartData & ChartFrameProps & { size?: number | undefined; /** No meio da rosca. */ centerLabel?: string | undefined };

/** Rosca com espessura de 1/5, como o anel da marca. A confirmar com o design. */
export function DonutChart(props: DonutChartProps) {
  const p = useComponentProps("DonutChart", {}, props);
  return <Grafico {...p} desenhar={(w) => drawPie(p, w, { donut: true, centerLabel: p.centerLabel, size: p.size })} tabela={pieTable(p)} />;
}

export type RadarChartProps = RadarChartData & ChartFrameProps & { size?: number | undefined };

/** Radar: a série preenchida e, se vier, a comparação tracejada. A confirmar com o design. */
export function RadarChart(props: RadarChartProps) {
  const p = useComponentProps("RadarChart", {}, props);
  return <Grafico {...p} desenhar={(w) => drawRadar(p, w, p.size)} tabela={radarTable(p)} />;
}

export type SparklineProps = SparklineData & ChartFrameProps;

/** Minigráfico: só a linha da série, sem eixos (num cartão de número). A confirmar com o design. */
export function Sparkline(props: SparklineProps) {
  const p = useComponentProps("Sparkline", {}, props);
  return <Grafico {...p} desenhar={(w) => drawSparkline(p, w, p.height)} tabela={sparklineTable(p)} />;
}
