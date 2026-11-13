import { DataList, Timeline, Icon } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Dados/DataList", component: DataList } satisfies Meta<typeof DataList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Pares: Story = {
  name: "Pares de dados (mockup)",
  render: () => (
    <DataList style={{ maxWidth: "var(--cf-side-panel-width)" }}>
      <DataList.Item label="Ticket médio" value="R$ 87,40" />
      <DataList.Item label="Peças por atendimento" value="2,3" />
      <DataList.Item label="Variação" color="up" value="+8%" />
      <DataList.Item label="Conversão" color="down" value="−1,2 p.p." />
    </DataList>
  ),
};

export const LinhaDoTempo: Story = {
  name: "Timeline",
  render: () => (
    <Timeline active={1}>
      <Timeline.Item title="Câmera instalada" bullet={<Icon name="check" size="xs" />}>Ontem, 16:10</Timeline.Item>
      <Timeline.Item title="Agente conectado" bullet={<Icon name="check" size="xs" />}>Hoje, 08:02</Timeline.Item>
      <Timeline.Item title="Primeira contagem" lineVariant="dashed">Aguardando dados</Timeline.Item>
      <Timeline.Item title="Relatório da semana">Segunda-feira</Timeline.Item>
    </Timeline>
  ),
};
