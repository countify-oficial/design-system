import { Group, type Spacing } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bloco, moldura } from "./_demo";

const meta = {
  title: "Layout/Group",
  component: Group,
  args: { children: [<Bloco key={1}>Primeiro</Bloco>, <Bloco key={2}>Segundo</Bloco>, <Bloco key={3}>Terceiro</Bloco>] },
} satisfies Meta<typeof Group>;
export default meta;
type Story = StoryObj<typeof meta>;

const gaps: Spacing[] = ["xs", "sm", 3, "md", "lg", "xl"];

export const Padrao: Story = { name: "Padrão (gap md, centrado)" };

export const Espacos: Story = {
  name: "Espaços (gap)",
  render: (args) => <>{gaps.map((g) => <Group key={g} {...args} gap={g} style={{ marginBottom: "var(--cf-space-4)" }} />)}</>,
};

export const Distribuicao: Story = {
  name: "Distribuição (justify)",
  render: (args) => <>{(["flex-start", "center", "space-between", "flex-end"] as const).map((j) => <Group key={j} {...args} justify={j} style={{ ...moldura, marginBottom: "var(--cf-space-4)" }} />)}</>,
};

export const Crescer: Story = { name: "Itens crescem (grow)", args: { grow: true } };

export const SemQuebra: Story = {
  name: "Sem quebrar a linha (wrap={false})",
  args: { wrap: false },
  render: (args) => <div style={{ ...moldura, width: "var(--cf-side-panel-width)", overflow: "auto" }}><Group {...args} /></div>,
};
