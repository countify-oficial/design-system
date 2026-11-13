import { FileInput } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Campos/FileInput", component: FileInput, args: { label: "Foto da fachada", placeholder: "Nenhum arquivo", accept: "image/*" } } satisfies Meta<typeof FileInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const ComLimpar: Story = { name: "Com botão de limpar", args: { clearable: true } };
export const Varios: Story = { name: "Vários arquivos", args: { multiple: true, label: "Fotos (1 a 5)", clearable: true } };
