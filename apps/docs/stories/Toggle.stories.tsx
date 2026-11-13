import { Group, Icon, Toggle } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = {
  title: "Botões/Toggle",
  component: Toggle,
  args: { children: "Calçados", onPressedChange: fn() },
} satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desligado: Story = {};
export const Ligado: Story = { args: { defaultPressed: true } };
export const Desativado: Story = { args: { disabled: true } };
export const ComIcone: Story = { name: "Com ícone", args: { children: <><Icon name="bookmark" size="sm" />Salvas</> } };
export const Grupo: Story = {
  name: "Vários lado a lado",
  render: () => <Group gap="sm">{["Todos", "Calçados", "Acessórios"].map((c, i) => <Toggle key={c} defaultPressed={i < 2}>{c}</Toggle>)}</Group>,
};
