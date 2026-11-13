import { Radio } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Escolhas/Radio", component: Radio } satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Grupo: Story = {
  render: () => (
    <Radio.Group label="Período" defaultValue="hoje" description="A comparação usa o mesmo dia da semana anterior">
      <Radio value="hoje" label="Hoje" />
      <Radio value="semana" label="Esta semana" />
      <Radio value="mes" label="Este mês" />
      <Radio value="ano" label="Este ano" disabled description="Disponível em janeiro" />
    </Radio.Group>
  ),
};
export const EmLinha: Story = { name: "Em linha", render: () => <Radio.Group label="Gráfico" orientation="row" gap="lg" defaultValue="linha"><Radio value="linha" label="Linha" /><Radio value="barra" label="Barras" /></Radio.Group> };
