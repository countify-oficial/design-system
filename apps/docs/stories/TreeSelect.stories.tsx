import { TreeSelect } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { redeDeLojas } from "./_arvore";

const meta = {
  title: "Combobox/TreeSelect",
  component: TreeSelect,
  args: { label: "Loja", placeholder: "Escolha a loja", data: redeDeLojas },
  decorators: [(S) => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><S /></div>],
} satisfies Meta<typeof TreeSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const SoFolhas: Story = { name: "Só folhas (leavesOnly)", args: { leavesOnly: true, defaultExpanded: ["ce"] } };
export const Varias: Story = { name: "Várias (multiple)", args: { multiple: true, defaultValue: ["jardins", "orla"], defaultExpanded: ["ce", "for"] } };
export const Contorno: Story = { name: "Variante outline", args: { variant: "outline" } };
export const Tamanhos: Story = { render: (a) => <div style={{ display: "grid", gap: "var(--cf-space-4)" }}>{(["xs", "sm", "md", "lg", "xl"] as const).map((s) => <TreeSelect key={s} {...a} size={s} label={`Loja (${s})`} />)}</div> };
export const ComErro: Story = { args: { error: "Escolha uma loja" } };
export const Desativado: Story = { args: { disabled: true, defaultValue: "jardins" } };
