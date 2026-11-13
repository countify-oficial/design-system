import { Paper, Stack, Switch } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Escolhas/Switch", component: Switch, args: { label: "Avisar quando entrar" } } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const Estados: Story = {
  render: (a) => (
    <Stack>
      <Switch {...a} defaultChecked label="Ligado" />
      <Switch {...a} label="Com descrição" description="Receber avisos de entrada" />
      <Switch {...a} disabled label="Desativado" />
      <Switch {...a} labelPosition="right" label="Rótulo à direita" />
    </Stack>
  ),
};
export const NoCartao: Story = {
  name: "No cartão (mockup)",
  render: () => (
    <Paper withBorder style={{ padding: "var(--cf-space-2) var(--cf-space-4)", maxWidth: "var(--cf-side-panel-width)" }}>
      <Switch defaultChecked label="Avisar quando entrar" style={{ minHeight: "var(--cf-compact-row-height)" }} />
    </Paper>
  ),
};
