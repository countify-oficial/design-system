import { Stack, Text } from "@countify-oficial/core";
import {
  AreaChart, BarChart, BarList, ChartLegend, ComboChart, DonutChart, FunnelChart, Heatmap, LineChart, PieChart, RadarChart, SankeyChart, ScatterChart, Sparkline,
} from "@countify-oficial/charts";
import type { Meta, StoryObj } from "@storybook/react-vite";

const horas = ["8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h"];
const real = [12, 30, 48, 61, 90, 84, 70, null, null, null, null, null, null];
const previsto = [10, 28, 45, 66, 88, 92, 80, 74, 70, 76, 82, 60, 30];
const faixa: [number[], number[]] = [previsto.map((v) => v * 0.8), previsto.map((v) => v * 1.2)];
const cartao = { padding: "var(--cf-space-5)", borderRadius: "var(--cf-radius-md)", background: "var(--cf-color-card)", boxShadow: "var(--cf-shadow-xs)" };

const meta = {
  title: "Extensões/Charts",
  component: LineChart,
  parameters: { docs: { description: { component: "Gráficos do mockup em SVG. Área, pizza, rosca, radar e minigráfico não existem na identidade: valores aprovados em 13/11/2026, a confirmar com o design. Barras com várias séries e o combinado usam as cores das séries (aprovadas em 18/11/2026). Sankey: a identidade não desenha; usa a barra do funil em pé e as faixas como a área, a confirmar com o design. Linha, área, barras, combinado e Sankey mostram a dica ao passar o mouse, no foco (setas, Home, End, Esc) e no toque." } } },
} satisfies Meta;
export default meta;
// cada gráfico tem os seus dados obrigatórios: as histórias usam render
type Story = StoryObj;

export const PorHora: Story = {
  name: "Linha por hora (W-Hoje)",
  render: () => (
    <Stack style={cartao}>
      <ChartLegend items={[{ label: "Real" }, { label: "Previsto", type: "dashed" }, { label: "Faixa normal", type: "band" }]} />
      <LineChart labels={horas} actual={real} forecast={previsto} band={faixa} partial={7} now={6} labelEvery={2} aria-label="Entradas por hora: 395 até as 14h, previsto no dia 751" />
    </Stack>
  ),
};
export const ComLacuna: Story = {
  name: "Linha com lacuna (sem imagem)",
  render: () => <LineChart labels={horas.slice(0, 7)} actual={[12, 30, null, 61, 90, 84, 70]} gaps={[2]} labelEvery={2} aria-label="Entradas por hora, sem imagem às 10h" />,
};
export const SemPontos: Story = {
  name: "Linha de semanas, sem pontos",
  render: () => (
    <LineChart
      labels={["14/10", "21/10", "28/10", "4/11"]}
      actual={[18000, 22000, 31000, 27000]}
      forecast={[16000, 21000, 24000, 26000]}
      markers={false}
      height={236}
      format={(v) => `${String(v / 1000)} mil`}
      seriesLabels={{ actual: "Últimas 4 semanas", forecast: "Período anterior" }}
    />
  ),
};

export const Barras: Story = {
  name: "Barras por hora, mesma escala (W-Comparar)",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--cf-space-6)" }}>
      {[["Lume Jardins", [8, 14, 20, 26, 42, 30, 22, 18, 20, 26, 30, 14]], ["Lume Orla", [4, 9, 12, 18, 22, 28, 30, 24, 20, 16, 12, 8]]].map(([nome, v]) => (
        <Stack key={nome as string} gap="xs" style={cartao}>
          <Text size="sm" weight="medium">{nome as string}</Text>
          <BarChart values={v as number[]} highlight="max" max={50} labels={["9h", "", "", "", "", "", "15h", "", "", "", "", "20h"]} forecast={[6, 12, 18, 24, 36, 32, 24, 20, 20, 24, 26, 12]} aria-label={`${nome as string}: pico às 13h`} />
        </Stack>
      ))}
    </div>
  ),
};
const dias = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
const lojas = [
  { name: "Orla", values: [42, 38, 45, 50, 61, 88, 70] },
  { name: "Jardins", values: [35, 40, 39, 47, 58, 92, 64] },
  { name: "P. Velho", values: [20, 22, 25, 24, 30, 41, 33] },
];
const legendaLojas = lojas.map((l, i) => ({ label: l.name, type: "square" as const, color: (["series-1", "series-2", "series-3"] as const)[i] }));
export const BarrasAgrupadas: Story = {
  name: "Barras com várias séries, lado a lado",
  render: () => (
    <Stack style={cartao}>
      <ChartLegend items={legendaLojas} />
      <BarChart series={lojas} labels={dias} axis height={236} aria-label="Tickets por dia: Orla, Jardins e Porto Velho" />
    </Stack>
  ),
};
export const BarrasEmpilhadas: Story = {
  name: "Barras empilhadas",
  render: () => (
    <Stack style={cartao}>
      <ChartLegend items={legendaLojas} />
      <BarChart series={lojas} stacked labels={dias} axis height={236} aria-label="Tickets por dia, somando as três lojas" />
    </Stack>
  ),
};
export const Combinado: Story = {
  name: "Combinado: vendas, meta e conversão à direita",
  render: () => (
    <Stack style={cartao}>
      <ChartLegend items={[{ label: "Faturamento", type: "square", color: "border" }, { label: "Meta", type: "dashed" }, { label: "Conversão", color: "series-2" }]} />
      <ComboChart
        values={[5200, 4800, 6100, 5900, 7400, 9800, 8200]}
        highlight="max"
        labels={dias}
        lines={[
          { name: "Meta", values: [6000, 6000, 6000, 6000, 7000, 9000, 8000], dashed: true },
          { name: "Conversão", values: [0.11, 0.1, 0.12, 0.12, 0.13, 0.15, 0.14], axis: "right" },
        ]}
        format={(v) => `R$ ${String(v / 1000).replace(".", ",")} mil`}
        formatRight={(v) => `${String(Math.round(v * 1000) / 10).replace(".", ",")}%`}
        aria-label="Faturamento por dia com a meta e a conversão: pico no sábado, R$ 9,8 mil"
      />
    </Stack>
  ),
};
export const Ranking: Story = {
  name: "Ranking (BarList) com a média",
  render: () => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><BarList data={[{ label: "Lume Jardins", value: 14.2, valueLabel: "14,2%" }, { label: "Lume Aldeota", value: 12.9, valueLabel: "12,9%" }, { label: "Lume Orla", value: 9.8, valueLabel: "9,8%" }]} reference={12.6} aria-label="Conversão por loja; média 12,6%" /></div>,
};
export const Funil: Story = { name: "Funil (barra de conversão)", render: () => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><FunnelChart data={[{ label: "Visitantes", value: 180 }, { label: "Compraram", value: 25 }]} /></div> };
export const Sankey: Story = {
  name: "Sankey: da calçada ao caixa",
  render: () => (
    <div style={cartao}>
      <SankeyChart
        nodes={[
          { id: "passaram", label: "Passaram" },
          { id: "entraram", label: "Entraram" },
          { id: "naoEntraram", label: "Não entraram" },
          { id: "experimentaram", label: "Experimentaram" },
          { id: "compraram", label: "Compraram" },
          { id: "saiuSem", label: "Saíram sem comprar" },
        ]}
        links={[
          { source: "passaram", target: "entraram", value: 420 },
          { source: "passaram", target: "naoEntraram", value: 1380 },
          { source: "entraram", target: "experimentaram", value: 190 },
          { source: "entraram", target: "saiuSem", value: 230 },
          { source: "experimentaram", target: "compraram", value: 72 },
          { source: "experimentaram", target: "saiuSem", value: 118 },
        ]}
        aria-label="Visitantes de hoje: 1.800 passaram, 420 entraram, 72 compraram"
      />
    </div>
  ),
};
export const SankeyEstoque: Story = {
  name: "Sankey: estoque recebido, exposto e vendido",
  render: () => (
    <div style={cartao}>
      <SankeyChart
        height={220}
        nodes={[{ id: "rec", label: "Recebido" }, { id: "exp", label: "Exposto" }, { id: "ven", label: "Vendido" }, { id: "per", label: "Perdido" }, { id: "loja", label: "Ainda na loja" }]}
        links={[
          { source: "rec", target: "exp", value: 940 },
          { source: "rec", target: "per", value: 60 },
          { source: "exp", target: "ven", value: 610 },
          { source: "exp", target: "per", value: 35 },
          { source: "exp", target: "loja", value: 295 },
        ]}
        format={(v) => `${new Intl.NumberFormat("pt-BR").format(v)} pç`}
        aria-label="Estoque do mês: 1.000 peças recebidas, 610 vendidas, 95 perdidas"
      />
    </div>
  ),
};
export const Dispersao: Story = {
  name: "Dispersão (M-Montar)",
  render: () => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><ScatterChart points={[{ x: 1200, y: 18000 }, { x: 1500, y: 24000, label: "Jardins" }, { x: 800, y: 9000 }, { x: 1100, y: 15000, label: "Orla" }]} formatX={(v) => `${String(v / 1000).replace(".", ",")} mil`} formatY={(v) => `R$ ${String(v / 1000)} mil`} aria-label="Faturamento por peças, um ponto por loja" /></div>,
};
export const MapaDeCalor: Story = {
  name: "Mapa de calor (W-Analises)",
  render: () => (
    <Heatmap
      rows={["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]}
      columns={["9h", "", "", "12h", "", "", "15h", "", "", "18h", "", ""]}
      values={Array.from({ length: 7 }, (_, d) => Array.from({ length: 12 }, (_, h) => (d === 6 && h > 8 ? null : Math.round(10 + 40 * Math.sin((h / 11) * Math.PI) + d * 3))))}
      aria-label="Movimento por dia e hora"
    />
  ),
};
export const Area: Story = { name: "Área", render: () => <AreaChart labels={["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]} series={[{ name: "Jardins", values: [120, 140, 180, 160, 220, 310, 260] }, { name: "Orla", values: [80, 90, 110, 100, 150, 240, 200] }]} /> };
export const PizzaERosca: Story = {
  name: "Pizza e rosca",
  render: () => {
    const dados = [{ label: "Calçados", value: 42 }, { label: "Bolsas", value: 28 }, { label: "Acessórios", value: 18 }, { label: "Outros", value: 12 }];
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--cf-space-6)" }}>
        <PieChart data={dados} format={(v) => `${String(v)}%`} />
        <DonutChart data={dados} format={(v) => `${String(v)}%`} centerLabel="42%" />
      </div>
    );
  },
};
export const Radar: Story = { name: "Radar", render: () => <RadarChart axes={["Entradas", "Conversão", "Ticket", "Peças", "Meta"]} values={[80, 60, 70, 50, 90]} compare={[70, 65, 60, 60, 75]} /> };
export const Minigrafico: Story = { name: "Minigráfico", render: () => <div style={{ width: "var(--cf-side-panel-width)" }}><Sparkline values={[12, 18, 15, 22, 30, 26, 34]} aria-label="Últimos 7 dias, subindo" /></div> };
