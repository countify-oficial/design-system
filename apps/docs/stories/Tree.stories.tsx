import { Tree } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { redeDeLojas } from "./_arvore";

const meta = {
  title: "Navigation/Tree",
  component: Tree,
  args: { data: redeDeLojas, "aria-label": "Lojas", defaultExpanded: ["ce"] },
  decorators: [(S) => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><S /></div>],
} satisfies Meta<typeof Tree>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { args: { defaultSelected: "sob" } };
export const SoFolhas: Story = { name: "Só folhas (leavesOnly)", args: { leavesOnly: true } };
export const ComCaixas: Story = { name: "Com caixas (withCheckboxes)", args: { withCheckboxes: true, defaultExpanded: ["ce", "for"], defaultChecked: ["jardins"] } };
export const Fechada: Story = { args: { defaultExpanded: [] } };
