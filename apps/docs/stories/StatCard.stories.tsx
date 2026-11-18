import { Box, NumberFormatter, RollingNumber, SimpleGrid, StatCard } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Dados/StatCard",
  component: StatCard,
  args: { label: "Entradas", value: "186", unit: "pessoas", diff: 8, diffLabel: "vs. qua." },
  decorators: [(Story) => <Box style={{ maxWidth: "calc(var(--cf-side-panel-width) * 0.75)" }}><Story /></Box>],
} satisfies Meta<typeof StatCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão (número, unidade e variação)" };
export const SoNumero: Story = { name: "Só o número", args: { label: "Saídas", value: "161", unit: undefined, diff: undefined } };
export const Moeda: Story = {
  name: "Prefixo e linha de apoio",
  args: { label: "Faturamento", prefix: "R$", value: <NumberFormatter value={3950} />, unit: undefined, description: "79 peças", diff: 12 },
};
export const Queda: Story = { name: "Queda", args: { label: "Ticket médio", prefix: "R$", value: "158", unit: undefined, description: "3,2 peças por venda", diff: -3 } };
export const SemVariacao: Story = { name: "Sem variação (0)", args: { diff: 0 } };
export const Pontos: Story = {
  name: "Variação em pontos (diffFormat)",
  args: { label: "Conversão", value: "13,9", unit: "%", diff: 1, diffFormat: (n: number) => `${n.toFixed(1).replace(".", ",")} pt` },
};
export const Invertido: Story = {
  name: "Subir é ruim (invertDiff)",
  args: { label: "Venda perdida estimada", prefix: "R$", value: "420", unit: undefined, diff: 15, invertDiff: true },
};
export const Ajuda: Story = {
  name: "Com ajuda",
  args: { label: "Venda perdida estimada", prefix: "R$", value: "420", unit: undefined, diff: undefined, help: "Visitantes que saíram sem comprar vezes o ticket médio do dia." },
};
export const Grafico: Story = {
  name: "Com gráfico (chart)",
  args: {
    chart: (
      // no app, o Sparkline do @countify-oficial/charts; aqui, uma barra só para mostrar o lugar
      <Box style={{ height: "var(--cf-space-8)", borderRadius: "var(--cf-radius-xs)", background: "var(--cf-color-accent-tint)" }} />
    ),
  },
};
export const AoVivo: Story = { name: "Número que rola (RollingNumber)", args: { label: "Dentro agora", value: <RollingNumber value={25} />, unit: undefined, diff: undefined } };
export const Link: Story = { name: "Cartão clicável (component=\"a\")", args: { component: "a", href: "#", label: "Vendas", value: "25", unit: "tickets", diff: 14 } };

export const Painel: Story = {
  name: "Linha do Painel (W-Hoje)",
  decorators: [(Story) => <Story />],
  render: () => (
    <SimpleGrid cols={{ base: 2, sm: 5 }} spacing="md">
      <StatCard label="Entradas" value="186" unit="pessoas" diff={8} diffLabel="vs. qua." />
      <StatCard label="Saídas" value="161" />
      <StatCard label="Dentro agora" value="25" />
      <StatCard label="Conversão" value="13,9" unit="%" diff={1} diffFormat={(n) => `${n.toFixed(1).replace(".", ",")} pt`} diffLabel="vs. qua." />
      <StatCard label="Vendas" value="25" unit="tickets" diff={14} diffLabel="vs. qua." />
    </SimpleGrid>
  ),
};
