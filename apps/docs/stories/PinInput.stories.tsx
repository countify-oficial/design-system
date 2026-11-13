import { PinInput } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = { title: "Campos/PinInput", component: PinInput, args: { onComplete: fn() } } satisfies Meta<typeof PinInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Código de 4 algarismos" };
export const CodigoDaCamera: Story = { name: "Código da câmera (6, letras e números)", args: { length: 6, type: "alphanumeric", label: "Código da câmera" } };
export const Oculto: Story = { name: "Oculto (senha)", args: { mask: true } };
export const ComErro: Story = { args: { error: true, defaultValue: "1234" } };
