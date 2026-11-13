import { JsonInput, Textarea } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Campos/Textarea", component: Textarea, args: { label: "Observação", placeholder: "O que aconteceu na loja?" } } satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const CresceComOTexto: Story = { name: "Cresce com o texto (autosize)", args: { autosize: true, minRows: 2, maxRows: 6 } };
export const ComErro: Story = { args: { error: "Escreva pelo menos 10 letras" } };
export const Json: Story = { name: "JsonInput", render: () => <JsonInput label="Configuração do agente" formatOnBlur defaultValue='{"camera":"K7Q-29XM","fps":15}' minRows={4} /> };
