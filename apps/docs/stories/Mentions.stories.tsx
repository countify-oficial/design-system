import { Mentions } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const equipe = [{ group: "Lume Jardins", items: ["Ana Lima", "Bruno Reis"] }, { group: "Lume Orla", items: ["Carla Souza", "Diego Alves"] }];

const meta = {
  title: "Combobox/Mentions",
  component: Mentions,
  args: { label: "Comentário", placeholder: "Escreva @ para mencionar alguém", data: equipe },
  decorators: [(S) => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><S /></div>],
} satisfies Meta<typeof Mentions>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const ComTexto: Story = { args: { defaultValue: "Fechamento conferido, @Ana Lima " } };
export const OutroPrefixo: Story = { name: "Outro prefixo (#)", args: { prefix: "#", label: "Nota", placeholder: "Escreva # para citar uma loja", data: ["Lume Jardins", "Lume Orla"] } };
export const Contorno: Story = { name: "Variante outline", args: { variant: "outline" } };
export const ComErro: Story = { args: { error: "Escreva o comentário" } };
export const Desativado: Story = { args: { disabled: true, defaultValue: "Sem permissão para comentar" } };
