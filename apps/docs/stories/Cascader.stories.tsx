import { Cascader } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { redeDeLojas } from "./_arvore";

const meta = {
  title: "Combobox/Cascader",
  component: Cascader,
  args: { label: "Loja", placeholder: "Estado / cidade / loja", data: redeDeLojas },
  decorators: [(S) => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><S /></div>],
} satisfies Meta<typeof Cascader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const ComValor: Story = { name: "Com valor e limpar", args: { defaultValue: ["ce", "for", "orla"], clearable: true } };
export const QualquerCamada: Story = { name: "Aceita um pai (changeOnSelect)", args: { changeOnSelect: true } };
export const Separador: Story = { args: { separator: " › ", defaultValue: ["sp", "pinheiros"] } };
export const Contorno: Story = { name: "Variante outline", args: { variant: "outline" } };
export const Tamanhos: Story = { render: (a) => <div style={{ display: "grid", gap: "var(--cf-space-4)" }}>{(["xs", "sm", "md", "lg", "xl"] as const).map((s) => <Cascader key={s} {...a} size={s} label={`Loja (${s})`} />)}</div> };
export const ComErro: Story = { args: { error: "Escolha uma loja" } };
export const Desativado: Story = { args: { disabled: true, defaultValue: ["ce", "sob", "centro"] } };
