import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { semViolacoes } from "@countify-oficial/test-utils";
import { describe, expect, it } from "vitest";
import {
  AreaChart, BarChart, BarList, ChartLegend, ComboChart, DonutChart, drawBar, drawCombo, drawBarList, drawHeatmap, drawLine, drawPie, drawRadar, drawSankey, drawScatter, FunnelChart, Heatmap, heatLevel, LineChart, niceMax,
  niceTicks, PieChart, RadarChart, SankeyChart, ScatterChart, Sparkline, type SankeyChartData, type Shape,
} from "../src";
import { nearest } from "../src/scene";
import { barTable, tipLines } from "../src/tables";

// estoque: recebido → exposto → vendido; o que não foi exposto se perdeu
const estoque: SankeyChartData = {
  nodes: [{ id: "rec", label: "Recebido" }, { id: "exp", label: "Exposto" }, { id: "ven", label: "Vendido" }, { id: "per", label: "Perdido" }],
  links: [{ source: "rec", target: "exp", value: 80 }, { source: "rec", target: "per", value: 20 }, { source: "exp", target: "ven", value: 60 }, { source: "exp", target: "per", value: 20 }],
};

const tipos = (s: Shape[], k: Shape["kind"]) => s.filter((x) => x.kind === k);
const retangulos = (s: Shape[]) => s.filter((x): x is Extract<Shape, { kind: "rect" }> => x.kind === "rect");

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

  it("barras com várias séries: lado a lado ou empilhadas, nas cores das séries", () => {
    const series = [{ name: "Orla", values: [10, 20] }, { name: "Jardins", values: [30, -10] }];
    const lado = retangulos(drawBar({ series }, 200).shapes);
    expect(lado.map((r) => r.fill)).toEqual(["series-1", "series-1", "series-2", "series-2"]);
    // dois por ponto, cada um com metade da fatia (100 menos o vão de 4)
    expect(lado.map((r) => r.width)).toEqual([48, 48, 48, 48]);
    expect(lado[2]?.x).toBe((lado[0]?.x ?? 0) + 48);
    const pilha = retangulos(drawBar({ series, stacked: true }, 200).shapes);
    expect(pilha.map((r) => r.width)).toEqual([96, 96, 96, 96]);
    const [orla0, , jardins0, jardins1] = pilha;
    // Jardins começa onde Orla termina; o negativo desce do zero
    expect(jardins0?.y).toBeCloseTo((orla0?.y ?? 0) - (jardins0?.height ?? 0));
    expect(jardins1?.y).toBeCloseTo((pilha[1]?.y ?? 0) + (pilha[1]?.height ?? 0));
    // o eixo vai da soma dos negativos (-10) à soma dos positivos (40, teto 50), não até a maior barra (30)
    expect(Math.round((orla0?.height ?? 0) + (jardins0?.height ?? 0))).toBe(Math.round(((96 - 8) * 40) / 60));
    expect(barTable({ series, labels: ["9h", "10h"] })).toEqual({ head: ["", "Orla", "Jardins"], rows: [["9h", "10", "30"], ["10h", "20", "-10"]] });
  });

  it("combinado: barras cinza, a linha da série com pontos, a meta tracejada e o eixo da direita", () => {
    const c = drawCombo({ values: [100, 200], labels: ["seg", "ter"], lines: [{ name: "Meta", values: [150, 150], dashed: true }, { name: "Conversão", values: [0.1, 0.2], axis: "right" }], formatRight: (v) => `${String(v * 100)}%` }, 400);
    expect(retangulos(c.shapes).map((r) => r.fill)).toEqual(["border", "border"]);
    const linhas = tipos(c.shapes, "polyline");
    expect(linhas).toMatchObject([{ stroke: "text2", dash: "5 5" }, { stroke: "series-1", strokeWidth: 3 }]);
    expect(tipos(c.shapes, "circle")).toHaveLength(2);
    // a conversão de 20% fica no topo, como a barra de 200 (cada uma no seu eixo)
    const [, barra] = retangulos(c.shapes);
    expect(tipos(c.shapes, "circle")[1]).toMatchObject({ cy: barra?.y });
    const textos = tipos(c.shapes, "text").map((t) => (t.kind === "text" ? t.text : ""));
    expect(textos).toEqual(expect.arrayContaining(["10%", "20%"]));
    expect(c.tips?.xs).toHaveLength(2);
    expect(tipLines(barTable({ values: [100, 200], labels: ["seg", "ter"], lines: [{ name: "Conversão", values: [0.1, 0.2], axis: "right" }], formatRight: (v) => `${String(v * 100)}%` }), 1)).toEqual(["ter", "200", "Conversão: 20%"]);
    // com o pico na cor da série, a linha passa para a cor seguinte (não some sobre a barra em destaque)
    expect(tipos(drawCombo({ values: [1, 2], highlight: "max", lines: [{ name: "Conversão", values: [1, 2] }] }, 300).shapes, "polyline")[0]).toMatchObject({ stroke: "series-2" });
    expect(nearest([10, 50, 90], 62)).toBe(1);
  });

  it("negativos descem do zero dentro do gráfico; frações enchem o eixo", () => {
    const c = drawBar({ values: [-50, 100] }, 300);
    const [negativa, positiva] = retangulos(c.shapes);
    // as duas saem do zero: a negativa para baixo, sem passar do pé do desenho
    expect(negativa?.height).toBeGreaterThan(0);
    expect(negativa?.y).toBeCloseTo((positiva?.y ?? 0) + (positiva?.height ?? 0));
    expect((negativa?.y ?? 0) + (negativa?.height ?? 0)).toBeLessThanOrEqual(c.height);
    const l = drawLine({ labels: ["a", "b"], actual: [-50, 100] }, 300);
    expect(tipos(l.shapes, "circle").every((p) => p.kind === "circle" && p.cy >= 0 && p.cy <= l.height)).toBe(true);
    // 2% e 5%: a maior enche o eixo (antes o teto era 1 e as barras tinham 2 e 4 px)
    const f = drawBar({ values: [0.02, 0.05] }, 300);
    expect(retangulos(f.shapes).map((r) => Math.round(r.height))).toEqual([35, 88]);
    expect(heatLevel(0.5, 0.5)).toBe(1);
    expect(niceTicks(0, 0.05)).toEqual([0, 0.02, 0.04, 0.06]);
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

describe("Sankey", () => {
  it("colunas pela profundidade, barras e faixas proporcionais ao valor, rótulos do funil", () => {
    const c = drawSankey(estoque, 400, 200);
    const barras = retangulos(c.shapes);
    // Recebido na 1ª coluna, Exposto na 2ª, Vendido e Perdido na última (Perdido recebe da 1ª e da 2ª); a última
    // coluna reserva o lugar dos rótulos dela ("60 · 60%": 8 + 8 letras de 15 × 0,56 = 75,2)
    expect(barras.map((b) => b.x)).toEqual([0, 154.4, 308.8, 308.8]);
    expect(barras.every((b) => b.width === 16 && b.fill === "accent")).toBe(true);
    // a coluna mais cheia (Vendido e Perdido, 60 + 40, com o vão de 16) enche a altura: 184 para 100
    expect(barras.map((b) => Math.round(b.height))).toEqual([184, 147, 110, 74]);
    const faixas = tipos(c.shapes, "path");
    expect(faixas).toHaveLength(4);
    expect(faixas.every((f) => f.kind === "path" && f.fill === "accent" && f.opacity === 0.18)).toBe(true);
    const textos = tipos(c.shapes, "text").map((t) => (t.kind === "text" ? t.text : ""));
    expect(textos).toEqual(["Recebido", "100", "Exposto", "80 · 80%", "Vendido", "60 · 60%", "Perdido", "40 · 40%"]);
    // os rótulos ficam 8 à direita da barra, também na última coluna
    expect(tipos(c.shapes, "text").at(-1)).toMatchObject({ anchor: "start", x: 332.8 });
    // a dica: um ponto no meio de cada fluxo e o realce dele
    expect(c.tips?.xs).toHaveLength(4);
    expect(c.tips?.ys).toHaveLength(4);
    expect(c.tips?.marks?.[0]).toMatchObject({ kind: "path", opacity: 0.36 });
    expect(nearest([0, 10], 4, [0, 10], 9)).toBe(1);
  });

  it("as faixas saem e chegam empilhadas na barra, sem sobrar nem passar", () => {
    const c = drawSankey(estoque, 400, 200);
    const [rec] = retangulos(c.shapes);
    // os dois fluxos do Recebido somam a barra inteira: o 1º começa no topo
    const inicio = (k: number) => {
      const f = tipos(c.shapes, "path")[k];
      return f?.kind === "path" ? Number(/^M[\d.]+,([\d.]+)/.exec(f.d)?.[1]) : NaN;
    };
    expect(inicio(0)).toBeCloseTo(rec?.y ?? 0, 0);
    expect(inicio(1)).toBeCloseTo((rec?.y ?? 0) + (rec?.height ?? 0) * 0.8, 0);
  });

  it("recusa ciclo, id desconhecido e id repetido com erro claro", () => {
    const nodes = [{ id: "a", label: "A" }, { id: "b", label: "B" }];
    expect(() => drawSankey({ nodes, links: [{ source: "a", target: "b", value: 1 }, { source: "b", target: "a", value: 1 }] }, 300)).toThrow(/ciclo entre A, B/);
    expect(() => drawSankey({ nodes, links: [{ source: "a", target: "a", value: 1 }] }, 300)).toThrow(/ciclo/);
    expect(() => drawSankey({ nodes, links: [{ source: "a", target: "x", value: 1 }] }, 300)).toThrow(/"a" → "x"/);
    expect(() => drawSankey({ nodes: [...nodes, { id: "a", label: "C" }], links: [] }, 300)).toThrow(/mesmo id/);
    // sem fluxos, só os nomes; vazio não quebra
    expect(retangulos(drawSankey({ nodes, links: [] }, 300).shapes)).toHaveLength(0);
    expect(drawSankey({ nodes: [], links: [] }, 300).shapes).toEqual([]);
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

  it("dica: o mouse escolhe o ponto mais perto; no teclado, setas, Home, End e Esc", async () => {
    const usuario = userEvent.setup();
    const { container } = render(<BarChart width={300} labels={["9h", "10h", "11h"]} values={[3, 9, 4]} highlight="max" aria-label="Entradas por hora" />);
    const controle = screen.getByRole("slider", { name: "Ponto do gráfico" });
    fireEvent.pointerMove(controle, { clientX: 290 });
    expect(container.textContent).toContain("11h4");
    fireEvent.pointerLeave(controle);
    expect(container.querySelector("line[x1='250']")).toBeNull();
    await usuario.tab();
    expect(controle.getAttribute("aria-valuetext")).toBe("9h, 3");
    await usuario.keyboard("{ArrowRight}");
    expect(controle.getAttribute("aria-valuetext")).toBe("10h, 9");
    await usuario.keyboard("{End}");
    expect(controle.getAttribute("aria-valuenow")).toBe("2");
    await usuario.keyboard("{Escape}");
    expect(container.querySelectorAll("svg line")).toHaveLength(1);
    await semViolacoes(container);
  });

  it("todos desenham com a largura dada", async () => {
    const { container } = render(
      <>
        <AreaChart width={300} labels={["a", "b"]} series={[{ name: "Lojas", values: [1, 2] }]} />
        <BarChart width={300} values={[1, 2]} highlight="max" />
        <BarChart width={300} series={[{ name: "Orla", values: [1, 2] }, { name: "Jardins", values: [2, 1] }]} stacked />
        <ComboChart width={300} values={[1, 2]} lines={[{ name: "Meta", values: [2, 2], dashed: true }, { name: "Conversão", values: [0.1, 0.2], axis: "right" }]} />
        <BarList width={300} data={[{ label: "Jardins", value: 2 }]} />
        <FunnelChart width={300} data={[{ label: "Visitantes", value: 180 }, { label: "Compraram", value: 25 }]} />
        <ScatterChart width={300} points={[{ x: 1, y: 2 }]} />
        <Heatmap width={300} rows={["seg"]} columns={["9h"]} values={[[1]]} />
        <PieChart width={300} data={[{ label: "A", value: 1 }]} />
        <DonutChart width={300} data={[{ label: "A", value: 1 }]} centerLabel="100%" />
        <RadarChart width={300} axes={["a", "b", "c"]} values={[1, 2, 3]} />
        <Sparkline width={120} values={[1, 3, 2]} />
        <SankeyChart width={300} {...estoque} />
        <ChartLegend items={[{ label: "Real" }, { label: "Previsto", type: "dashed" }, { label: "Pico", type: "square" }]} />
      </>,
    );
    expect(container.querySelectorAll("figure svg")).toHaveLength(13);
    expect(screen.getByText("Previsto")).toBeTruthy();
    await semViolacoes(container);
  });

  it("Sankey: a tabela de fluxos e a dica do fluxo mais perto (mouse e teclado)", async () => {
    const usuario = userEvent.setup();
    const { container } = render(<SankeyChart width={400} height={200} {...estoque} aria-label="Estoque da semana: 60 de 100 vendidos" />);
    const tabela = screen.getByRole("table");
    expect(tabela.querySelector("thead")?.textContent).toBe("OrigemDestinoValor");
    expect(tabela.querySelector("tbody tr")?.textContent).toBe("RecebidoExposto80");
    const controle = screen.getByRole("slider", { name: "Fluxo do gráfico" });
    // sem linha-guia; o fluxo ativo ganha o realce
    const faixas = () => container.querySelectorAll("svg path").length;
    expect(faixas()).toBe(4);
    const c = drawSankey(estoque, 400, 200);
    fireEvent.pointerMove(controle, { clientX: c.tips?.xs[2], clientY: c.tips?.ys?.[2] });
    expect(container.textContent).toContain("ExpostoDestino: VendidoValor: 60");
    expect(faixas()).toBe(5);
    expect(container.querySelector("svg line")).toBeNull();
    fireEvent.pointerLeave(controle);
    expect(faixas()).toBe(4);
    await usuario.tab();
    expect(controle.getAttribute("aria-valuetext")).toBe("Recebido, Destino: Exposto, Valor: 80");
    await usuario.keyboard("{End}");
    expect(controle.getAttribute("aria-valuetext")).toBe("Exposto, Destino: Perdido, Valor: 20");
    await semViolacoes(container);
  });
});
