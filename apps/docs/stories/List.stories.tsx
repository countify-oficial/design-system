import { Icon, List } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const itens = ["Câmera sem imagem", "Agente sem contato", "Loja sem vendas"];
const meta = { title: "Tipografia/List", component: List, args: { children: itens.map((i) => <List.Item key={i}>{i}</List.Item>) } } satisfies Meta<typeof List>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Marcadores: Story = {};
export const Numerada: Story = { args: { type: "ordered" } };
export const ComIcones: Story = { name: "Com ícones", args: { icon: <Icon name="check" size="sm" />, spacing: "sm" } };
export const Pequena: Story = { args: { size: "sm" } };
