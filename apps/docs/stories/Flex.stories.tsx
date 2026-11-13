import { Flex } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bloco, moldura } from "./_demo";

const itens = ["Lojas", "Vendas", "Fluxo", "Conversão", "Ticket médio", "Metas"].map((t) => <Bloco key={t}>{t}</Bloco>);

const meta = {
  title: "Layout/Flex",
  component: Flex,
  args: { gap: "md", children: itens.slice(0, 3) },
} satisfies Meta<typeof Flex>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão (linha)" };
export const Coluna: Story = { name: "Coluna (direction)", args: { direction: "column", align: "flex-start" } };
export const LinhaInvertida: Story = { name: "Linha invertida", args: { direction: "row-reverse" } };

export const Quebra: Story = {
  name: "Quebra com rowGap e columnGap",
  args: { wrap: "wrap", rowGap: "xs", columnGap: "xl", children: itens },
  render: (args) => <div style={{ ...moldura, width: "var(--cf-side-panel-width)" }}><Flex {...args} /></div>,
};

export const Alinhamento: Story = {
  name: "Alinhamento (align e justify)",
  args: { align: "center", justify: "space-between" },
  render: (args) => <Flex {...args} style={{ ...moldura, minHeight: "calc(var(--cf-list-row-height) * 2)" }} />,
};
