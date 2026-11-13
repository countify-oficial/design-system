import { SimpleGrid } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bloco } from "./_demo";

const cartoes = Array.from({ length: 8 }, (_, i) => <Bloco key={i}>Cartão {i + 1}</Bloco>);

const meta = {
  title: "Layout/SimpleGrid",
  component: SimpleGrid,
  args: { cols: 3, children: cartoes.slice(0, 6) },
} satisfies Meta<typeof SimpleGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "3 colunas" };
export const DuasColunas: Story = { name: "2 colunas (cartões do celular)", args: { cols: 2, spacing: 3 } };
export const QuatroColunas: Story = { name: "4 colunas", args: { cols: 4, children: cartoes } };
export const PorPontoDeQuebra: Story = {
  name: "Por ponto de quebra: 1 → 2 (768) → 4 (1280)",
  args: { cols: { base: 1, sm: 2, lg: 4 }, children: cartoes },
  parameters: { docs: { description: { story: "Mude a largura da janela para ver a troca." } } },
};
export const EspacoVertical: Story = { name: "Espaço vertical diferente", args: { spacing: "sm", verticalSpacing: "xl" } };
