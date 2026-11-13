import { ActionIcon, Avatar, Group, Icon, Indicator } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Feedback/Indicator", component: Indicator } satisfies Meta<typeof Indicator>;
export default meta;
type Story = StoryObj<typeof meta>;

const sino = <ActionIcon aria-label="Avisos" variant="default"><Icon name="bell" /></ActionIcon>;

export const Contador: Story = { name: "Contador (o do menu)", render: () => <Indicator label={3}>{sino}</Indicator> };
export const Bolinha: Story = { render: () => <Indicator>{sino}</Indicator> };
export const Posicoes: Story = {
  name: "Posições",
  render: () => <Group gap="xl">{(["top-end", "top-start", "bottom-end", "bottom-start"] as const).map((p) => <Indicator key={p} position={p} color="up"><Avatar name="Ana Souza" /></Indicator>)}</Group>,
};
export const Desativado: Story = { render: () => <Indicator label={3} disabled>{sino}</Indicator> };
