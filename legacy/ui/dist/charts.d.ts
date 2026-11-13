import type { LineChartProps, BarChartProps, ScatterChartProps, HeatmapProps } from "./types.js";
export declare const PALETTE_KEYS: readonly ["accent", "text", "text2", "text3", "divider", "border", "hatch", "card"];
export type Palette = Record<(typeof PALETTE_KEYS)[number], string>;
export type Draw = {
    width: number;
    palette: Palette;
    native?: boolean;
};
export type Drawn = {
    svg: string;
    height: number;
};
export declare function niceMax(v: number): number;
export declare function lineChart(o: LineChartProps, { width, palette: c, native }: Draw): Drawn;
export declare function barChart(o: BarChartProps, { width, palette: c, native }: Draw): Drawn;
export declare function scatterChart(o: ScatterChartProps, { width, palette: c, native }: Draw): Drawn;
export declare const HEAT_LEVELS: number[];
export declare function heatmap(o: HeatmapProps, { width, palette: c, native }: Draw): Drawn;
export declare const charts: {
    line: typeof lineChart;
    bar: typeof barChart;
    scatter: typeof scatterChart;
    heatmap: typeof heatmap;
};
