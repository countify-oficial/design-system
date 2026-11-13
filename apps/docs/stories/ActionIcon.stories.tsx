import { ActionIcon, CloseButton, Group, Icon, type ActionIconVariant } from "@countify-oficial/core";
import type { Size } from "@countify-oficial/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = {
  title: "Botões/ActionIcon",
  component: ActionIcon,
  args: { "aria-label": "Editar painel", children: <Icon name="edit" />, onClick: fn() },
  parameters: { docs: { description: { component: "Ícone sempre com nome para o leitor de tela (aria-label)." } } },
} satisfies Meta<typeof ActionIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão (subtle)" };
export const Variantes: Story = { render: (args) => <Group>{(["subtle", "default", "filled"] as ActionIconVariant[]).map((v) => <ActionIcon key={v} {...args} variant={v} />)}</Group> };
export const Tamanhos: Story = { render: (args) => <Group>{(["xs", "sm", "md", "lg", "xl"] as Size[]).map((s) => <ActionIcon key={s} {...args} size={s} variant="default" />)}</Group> };
export const Estados: Story = { render: (args) => <Group><ActionIcon {...args} /><ActionIcon {...args} disabled /><ActionIcon {...args} loading /></Group> };
export const Cores: Story = { render: (args) => <Group>{(["text", "text2", "accent", "down"] as const).map((c) => <ActionIcon key={c} {...args} color={c} />)}</Group> };
export const BotaoDeFechar: Story = { name: "CloseButton", render: () => <Group><CloseButton /><CloseButton variant="default" /><CloseButton aria-label="Fechar aviso" disabled /></Group> };
