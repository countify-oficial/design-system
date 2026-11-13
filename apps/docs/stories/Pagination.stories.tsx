import { Pagination, pageLabel } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = { title: "Navigation/Pagination", component: Pagination, args: { total: 17, defaultValue: 6 } } satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const Poucas: Story = { name: "Poucas páginas", args: { total: 5, defaultValue: 2 } };
export const MaisVizinhas: Story = { name: "Mais vizinhas e pontas", args: { siblings: 2, boundaries: 2 } };
export const SemSetas: Story = { args: { withControls: false } };
export const Desativada: Story = { args: { disabled: true } };

function Compacta() {
  const [pagina, setPagina] = useState(2);
  return <Pagination total={17} value={pagina} onChange={setPagina} withPages={false} label={pageLabel(pagina, 20, 340)} />;
}
export const Itens: Story = { name: "Compacta: \"21–40 de 340\" (0.1.0)", render: () => <Compacta /> };
