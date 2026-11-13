import { Divider, Group, Stack, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Feedback/Divider", component: Divider } satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };
export const Tracejado: Story = { args: { variant: "dashed" } };
export const ComTexto: Story = {
  name: "Com texto",
  render: () => <Stack>{(["left", "center", "right"] as const).map((p) => <Divider key={p} label={`texto à ${p}`} labelPosition={p} />)}</Stack>,
};
export const Vertical: Story = { render: () => <Group style={{ height: "var(--cf-touch-target)" }}><Text>Hoje</Text><Divider orientation="vertical" /><Text>Ontem</Text></Group> };
