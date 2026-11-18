// Os gráficos viram uma lista de formas com cor por papel (accent, text2…); a web desenha em <svg> e o celular no
// react-native-svg. A conta fica toda aqui, igual nas duas plataformas.
import type { ColorRole } from "@countify-oficial/tokens";

/** Um papel de cor, uma das séries (degraus da escala azul), "none" ou o padrão de hachura (lacuna de dados). */
export type Paint = ColorRole | "none" | "hatch" | "series-1" | "series-2" | "series-3" | "series-4";

interface Traco {
  stroke?: Paint | undefined;
  strokeWidth?: number | undefined;
  dash?: string | undefined;
  cap?: "round" | "butt" | undefined;
  join?: "round" | "miter" | undefined;
  opacity?: number | undefined;
}

export type Shape =
  | ({ kind: "line"; x1: number; y1: number; x2: number; y2: number } & Traco)
  | ({ kind: "polyline"; points: string; fill?: Paint | undefined } & Traco)
  | ({ kind: "polygon"; points: string; fill: Paint } & Traco)
  | ({ kind: "path"; d: string; fill: Paint } & Traco)
  | ({ kind: "rect"; x: number; y: number; width: number; height: number; rx?: number | undefined; fill: Paint } & Traco)
  | ({ kind: "circle"; cx: number; cy: number; r: number; fill: Paint } & Traco)
  | { kind: "text"; x: number; y: number; text: string; anchor?: "start" | "middle" | "end" | undefined; fill: Paint; size: number; weight?: 400 | 500 | 700 | undefined };

/** O desenho pronto: altura e formas (a largura é a medida do lugar). */
export interface Scene {
  height: number;
  shapes: Shape[];
  /** Usa o padrão de hachura (as lacunas da linha). */
  hatch?: boolean | undefined;
  /**
   * A dica (passar o mouse, foco, toque): o x de cada ponto e a altura da linha-guia, nos gráficos por índice. Com ys
   * (Sankey), cada item é um ponto (x, y): a escolha é pelo mais perto nos dois eixos, sem linha-guia; a dica sai no
   * ponto e marks[i] realça o item ativo.
   */
  tips?: { xs: number[]; top: number; bottom: number; ys?: number[] | undefined; marks?: Shape[] | undefined } | undefined;
}

/** O ponto mais perto do x (o mouse ou o dedo); com ys, o mais perto de (x, y). */
export const nearest = (xs: number[], x: number, ys?: number[], y = 0): number => {
  const d = (i: number) => Math.hypot((xs[i] ?? 0) - x, ys ? (ys[i] ?? 0) - y : 0);
  return xs.reduce((m, _, i) => (d(i) < d(m) ? i : m), 0);
};

/** Arredonda a 1 casa (SVG menor e estável nos testes). */
export const n1 = (v: number): number => Math.round(v * 10) / 10;
export const pontos = (lista: [number, number][]): string => lista.map(([x, y]) => `${String(n1(x))},${String(n1(y))}`).join(" ");
