import { Group, Progress, RingProgress, SemiCircleProgress, Stack, Text, type Tone } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Feedback/Progress", component: Progress, args: { value: 62, "aria-label": "Meta do mês" } } satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Barra: Story = {};
export const ComMeta: Story = { name: "Com meta (marker)", args: { marker: 80 } };
export const Tons: Story = { render: (a) => <Stack>{(["accent", "up", "down", "warn", "gray"] as Tone[]).map((t) => <Progress key={t} {...a} color={t} aria-label={t} />)}</Stack> };
export const Anel: Story = {
  name: "RingProgress",
  render: () => (
    <Group gap="xl">
      <RingProgress sections={[{ value: 21, color: "accent", label: "Compraram" }]} label={<Text weight="bold">21%</Text>} />
      <RingProgress roundCaps sections={[{ value: 40, color: "up" }, { value: 25, color: "warn" }, { value: 10, color: "down" }]} label={<Text size="sm" color="text2">3 partes</Text>} />
      <RingProgress size={64} sections={[{ value: 70, color: "accent" }]} />
    </Group>
  ),
};
export const MeioAnel: Story = {
  name: "SemiCircleProgress",
  render: () => (
    <Group gap="xl" align="flex-start">
      <SemiCircleProgress value={64} aria-label="Conversão" label={<Text weight="bold">64%</Text>} />
      <SemiCircleProgress value={30} color="down" orientation="down" aria-label="Queda" label={<Text weight="bold">30%</Text>} />
    </Group>
  ),
};
