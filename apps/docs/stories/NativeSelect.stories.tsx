import { NativeSelect } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Campos/NativeSelect",
  component: NativeSelect,
  args: { label: "Cidade", placeholder: "Escolha a cidade", defaultValue: "", data: ["Fortaleza", "Sobral", { value: "crato", label: "Crato (sem lojas)", disabled: true }] },
} satisfies Meta<typeof NativeSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const ComErro: Story = { args: { error: "Escolha uma cidade" } };
export const Desativado: Story = { args: { disabled: true } };
