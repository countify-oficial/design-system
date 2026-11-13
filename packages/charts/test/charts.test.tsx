import { render, screen } from "@testing-library/react";
import { semViolacoes } from "@countify-oficial/test-utils";
import { describe, expect, it } from "vitest";
import {
  AreaChart, BarChart, BarList, ChartLegend, DonutChart, drawBar, drawBarList, drawHeatmap, drawLine, drawPie, drawRadar, drawScatter, FunnelChart, Heatmap, heatLevel, LineChart, niceMax,
  PieChart, RadarChart, ScatterChart, Sparkline, type Shape,
} from "../src";

const tipos = (s: Shape[], k: Shape["kind"]) => s.filter((x) => x.kind === k);

describe("contas dos gráficos", () => {
  it("teto redondo do eixo", () => {
    expect([niceMax(0), niceMax(7), niceMax(180), niceMax(2300)]).toEqual([1, 10, 200, 2500]);
  });

  it("linha: previsto tracejado, faixa por baixo, lacuna, andamento e agora", () => {
    const c = drawLine({ labels: ["8h", "9h", "10h", "11h"], actual: [10, null, 30, 25], forecast: [12, 20, 28, 32], band: [[5, 10, 15, 20], [20, 30, 40, 45]], gaps: [1], partial: 3, now: 3 }, 400);
    expect(c.shapes[0]).toMatchObject({ kind: "polygon", fill: "divider" });
    expect(c.hatch).toBe(true);
    expect(tipos(c.shapes, "polyline").map((p) => ("dash" in p ? p.dash : undefined))).toEqual(["5 5", undefined, "1 6"]);
    const pontos = tipos(c.shapes, "circle");
    expect(pontos).toHaveLength(3);
    expect(pontos.at(-1)).toMatchObject({ fill: "card", stroke: "accent" });
    expect(tipos(c.shapes, "text").some((t) => t.kind === "text" && t.text === "agora")).toBe(true);
    expect(tipos(c.shapes, "rect")[0]).toMatchObject({ fill: "hatch" });
  });

  it("barras: o pico em destaque, as outras cinza", () => {
    const c = drawBar({ values: [3, 9, 4], highlight: "max", labels: ["9h", "", "11h"] }, 300);
    expect(tipos(c.shapes, "rect").map((r) => (r.kind === "rect" ? r.fill : ""))).toEqual(["border", "accent", "border"]);
  });

  it("ranking: a 1ª barra cheia e a marca de referência", () => {
    const c = drawBarList({ data: [{ label: "Jardins", value: 200 }, { label: "Orla", value: 100 }], reference: 150 }, 300);
    const barras = tipos(c.shapes, "rect").filter((r) => r.kind === "rect" && r.fill === "accent");
    expect(barras.map((b) => (b.kind === "rect" ? b.width : 0))).toEqual([300, 150]);
    expect(tipos(c.shapes, "rect").filter((r) => r.kind === "rect" && r.fill === "text")).toHaveLength(2);
  });

  it("mapa de calor: cinco tons; fechado tracejado", () => {
    expect([heatLevel(1, 100), heatLevel(50, 100), heatLevel(100, 100)]).toEqual([0.18, 0.54, 1]);
    const c = drawHeatmap({ rows: ["seg"], columns: ["9h", "10h"], values: [[null, 4]] }, 300);
    expect(tipos(c.shapes, "rect")[0]).toMatchObject({ fill: "none", stroke: "border" });
  });

  it("pizza, rosca, dispersão e radar", () => {
    expect(tipos(drawPie({ data: [{ label: "A", value: 1 }, { label: "B", value: 3 }] }, 300).shapes, "path")).toHaveLength(2);
    const rosca = drawPie({ data: [{ label: "A", value: 1 }] }, 300, { donut: true, centerLabel: "25%" });
    expect(tipos(rosca.shapes, "text").some((t) => t.kind === "text" && t.text === "25%")).toBe(true);
    expect(tipos(drawScatter({ points: [{ x: 1, y: 2, label: "Orla" }] }, 300).shapes, "circle")[0]).toMatchObject({ stroke: "card" });
    expect(tipos(drawRadar({ axes: ["a", "b", "c"], values: [1, 2, 3] }, 300).shapes, "polygon")).toHaveLength(5);
  });
});

describe("componentes (web)", () => {
  it("o desenho fica fora do leitor de tela; a tabela de dados entra", async () => {
    const { container } = render(
      <LineChart width={400} aria-label="Entradas por hora: 1.428 até agora" labels={["8h", "9h"]} actual={[10, 20]} forecast={[12, 18]} />,
    );
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("table").textContent).toContain("Previsto");
    expect(screen.getByRole("figure", { name: "Entradas por hora: 1.428 até agora" })).toBeTruthy();
    await semViolacoes(container);
  });

  it("todos desenham com a largura dada", async () => {
    const { container } = render(
      <>
        <AreaChart width={300} labels={["a", "b"]} series={[{ name: "Lojas", values: [1, 2] }]} />
        <BarChart width={300} values={[1, 2]} highlight="max" />
        <BarList width={300} data={[{ label: "Jardins", value: 2 }]} />
        <FunnelChart width={300} data={[{ label: "Visitantes", value: 180 }, { label: "Compraram", value: 25 }]} />
        <ScatterChart width={300} points={[{ x: 1, y: 2 }]} />
        <Heatmap width={300} rows={["seg"]} columns={["9h"]} values={[[1]]} />
        <PieChart width={300} data={[{ label: "A", value: 1 }]} />
        <DonutChart width={300} data={[{ label: "A", value: 1 }]} centerLabel="100%" />
        <RadarChart width={300} axes={["a", "b", "c"]} values={[1, 2, 3]} />
        <Sparkline width={120} values={[1, 3, 2]} />
        <ChartLegend items={[{ label: "Real" }, { label: "Previsto", type: "dashed" }, { label: "Pico", type: "square" }]} />
      </>,
    );
    expect(container.querySelectorAll("figure svg")).toHaveLength(10);
    expect(screen.getByText("Previsto")).toBeTruthy();
    await semViolacoes(container);
  });
});
