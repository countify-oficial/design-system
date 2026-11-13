import { UnstyledButton } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = {
  title: "Primitivos/UnstyledButton",
  component: UnstyledButton,
  args: { children: "Botão sem aparência", onClick: fn() },
  parameters: { docs: { description: { component: "Use Tab para ver o anel de foco." } } },
} satisfies Meta<typeof UnstyledButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };
export const Desativado: Story = { args: { disabled: true } };
export const ComoLink: Story = { name: "Como link", args: { component: "a", href: "#lojas", children: "Ir para Lojas" } };
export const LinkDesativado: Story = { name: "Link desativado", args: { component: "a", href: "#lojas", disabled: true, children: "Ir para Lojas" } };
