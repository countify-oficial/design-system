import { Group, Loader } from "@countify-oficial/core";
import type { Size } from "@countify-oficial/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Botões/Loader",
  component: Loader,
  parameters: { docs: { description: { component: "Para o carregamento de uma tela, a Countify usa Skeleton (blocos cinza), não girador." } } },
} satisfies Meta<typeof Loader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };
export const Tamanhos: Story = { render: (args) => <Group>{(["xs", "sm", "md", "lg", "xl"] as Size[]).map((s) => <Loader key={s} {...args} size={s} />)}</Group> };
export const Cores: Story = { render: (args) => <Group>{(["accent", "text", "up", "down", "warn"] as const).map((c) => <Loader key={c} {...args} color={c} />)}</Group> };
