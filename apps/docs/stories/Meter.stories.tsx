import { Card, Meter, Stack, Text, type Tone } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Dados/Meter",
  component: Meter,
  args: {
    label: "Faturamento",
    value: 71400,
    max: 180000,
    marker: 66000,
    startLabel: <>R$ 71.400 <Text component="span" size="sm" color="text2">de R$ 180.000</Text></>,
    endLabel: "dia 11 de 30",
    footer: "1.428 peças vendidas no mês",
    valueText: "Alcançado 39,7% da meta. Até hoje, dia 11 de 30, o esperado era 36,7%.",
  },
  decorators: [(Story) => <Card style={{ maxWidth: "var(--cf-side-panel-width)" }}><Story /></Card>],
} satisfies Meta<typeof Meter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MetaDoMes: Story = { name: "Meta do mês (W-Hoje)" };
export const SemEsperado: Story = { name: "Sem o esperado (marker)", args: { marker: undefined } };
export const SoBarra: Story = {
  name: "Só rótulo, valor e barra",
  args: { label: "Ocupação", value: 62, max: 100, marker: undefined, startLabel: undefined, endLabel: undefined, footer: undefined, valueText: undefined },
};
export const ValorProprio: Story = { name: "Valor em destaque do app (valueLabel)", args: { valueLabel: "R$ 71.400" } };
export const Tons: Story = {
  name: "Tons (color)",
  render: (a) => (
    <Stack gap="lg">
      {(["accent", "up", "warn", "down", "gray"] as Tone[]).map((t) => <Meter key={t} {...a} label={t} color={t} footer={undefined} valueText={undefined} />)}
    </Stack>
  ),
};
export const Conversao: Story = {
  name: "Conversão (size lg, W-Indicadores)",
  decorators: [(Story) => <Card padding={5} style={{ maxWidth: "var(--cf-side-panel-width)" }}><Story /></Card>],
  args: {
    size: "lg",
    label: undefined,
    "aria-label": "Conversão",
    value: 25,
    max: 180,
    marker: undefined,
    diff: 1,
    diffFormat: (n: number) => `${n.toFixed(1).replace(".", ",")} pt`,
    diffLabel: "vs. qua.",
    startLabel: <><strong>25</strong> compraram</>,
    endLabel: <><Text component="span" size="sm" weight="bold" color="text">155</Text> sem comprar · 180 visitantes</>,
    footer: undefined,
    valueText: "De 180 visitantes, 25 compraram e 155 saíram sem comprar.",
  },
};
export const Passou: Story = { name: "Passou da meta (preso em 100%)", args: { value: 194700, color: "up", valueLabel: "108%", valueText: "Meta batida: 108%." } };
