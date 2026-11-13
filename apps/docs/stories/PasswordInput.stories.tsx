import { PasswordInput } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Campos/PasswordInput", component: PasswordInput, args: { label: "Senha" } } satisfies Meta<typeof PasswordInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const AMostra: Story = { name: "À mostra", args: { defaultVisible: true, defaultValue: "lume2026" } };
export const ComErro: Story = { args: { error: "Senha incorreta" } };
