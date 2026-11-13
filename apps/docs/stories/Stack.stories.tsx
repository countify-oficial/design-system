import { Stack, type Spacing } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bloco, moldura } from "./_demo";

const meta = {
  title: "Layout/Stack",
  component: Stack,
  args: { children: [<Bloco key={1}>1</Bloco>, <Bloco key={2}>2</Bloco>, <Bloco key={3}>3</Bloco>] },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

const gaps: Spacing[] = ["xs", "sm", 3, "md", 5, "lg", "xl"];

export const Padrao: Story = { name: "Padrão (gap md)" };

export const Espacos: Story = {
  name: "Espaços (gap)",
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--cf-space-6)" }}>
      {gaps.map((g) => <Stack key={g} {...args} gap={g}><Bloco>{String(g)}</Bloco><Bloco>{String(g)}</Bloco></Stack>)}
    </div>
  ),
};

export const Alinhamento: Story = {
  name: "Alinhamento (align)",
  render: (args) => <>{(["stretch", "flex-start", "center", "flex-end"] as const).map((a) => <Stack key={a} {...args} align={a} style={{ ...moldura, marginBottom: "var(--cf-space-4)" }} />)}</>,
};

export const Distribuicao: Story = {
  name: "Distribuição (justify)",
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--cf-space-6)" }}>
      {(["flex-start", "center", "space-between", "flex-end"] as const).map((j) => <Stack key={j} {...args} justify={j} style={{ ...moldura, height: "calc(var(--cf-side-panel-width) / 1.2)" }} />)}
    </div>
  ),
};
