import { Blockquote, Icon } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Tipografia/Blockquote", component: Blockquote, args: { children: "O painel mudou a reunião de segunda: agora começamos pelas lojas que caíram.", cite: "— Ana Souza, gerente" } } satisfies Meta<typeof Blockquote>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const ComIcone: Story = { name: "Com ícone e tom", args: { color: "up", icon: <Icon name="people" /> } };
