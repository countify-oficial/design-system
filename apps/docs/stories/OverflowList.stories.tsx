import { Badge, OverflowList } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const lojas = ["Jardins", "Orla", "Aldeota", "Centro", "Meireles", "Iguatemi"];
const meta = {
  title: "Dados/OverflowList",
  component: OverflowList<string>,
  args: { items: lojas, maxVisible: 3, renderItem: (l: string) => <Badge key={l} color="accent">{l}</Badge> },
} satisfies Meta<typeof OverflowList<string>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const ResumoProprio: Story = { name: "Resumo próprio", args: { renderOverflow: (h: string[]) => <Badge variant="outline">e mais {h.length} lojas</Badge> } };
