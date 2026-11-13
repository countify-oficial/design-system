import { Card, Group, Paper, Text } from "@countify-oficial/core";
import type { Size } from "@countify-oficial/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Feedback/Paper e Card", component: Paper, args: { children: "Conteúdo" } } satisfies Meta<typeof Paper>;
export default meta;
type Story = StoryObj<typeof meta>;

const caixa = { padding: "var(--cf-space-4)", width: "calc(var(--cf-side-panel-width) / 2)" };

export const Elevacao: Story = {
  name: "Paper: elevação (shadow)",
  render: () => <Group gap="lg">{(["xs", "md", "lg", "xl"] as Size[]).map((s) => <Paper key={s} shadow={s} style={caixa}>shadow {s}</Paper>)}<Paper withBorder style={caixa}>withBorder</Paper></Group>,
};

export const Cartao: Story = {
  name: "Card com seção",
  render: () => (
    <Card style={{ width: "var(--cf-side-panel-width)" }}>
      <Card.Section withBorder style={{ padding: "var(--cf-space-4)", background: "var(--cf-color-accent-tint)" }}><Text color="accent" weight="medium">Seção que encosta nas bordas</Text></Card.Section>
      <Text weight="medium">Lume Jardins</Text>
      <Text size="sm" color="text2">Fortaleza · 1.102 entradas hoje</Text>
    </Card>
  ),
};
