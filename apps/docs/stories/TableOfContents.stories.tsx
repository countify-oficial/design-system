import { TableOfContents } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const links = [
  { id: "marca", label: "Marca" },
  { id: "cores", label: "Cores" },
  { id: "claro", label: "Modo claro", depth: 1 },
  { id: "escuro", label: "Modo escuro", depth: 1 },
  { id: "letra", label: "Letra" },
];

const meta = {
  title: "Navigation/TableOfContents",
  component: TableOfContents,
  args: { links, active: "cores" },
  decorators: [(S) => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><S /></div>],
} satisfies Meta<typeof TableOfContents>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const SemNumeros: Story = { name: "Sem números", args: { withNumbers: false } };
