import { Burger } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = { title: "Navegação/Burger", component: Burger, args: { opened: false } } satisfies Meta<typeof Burger>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Fechado: Story = {};
export const Aberto: Story = { args: { opened: true } };
export const Desativado: Story = { args: { disabled: true } };

function AbreFecha() {
  const [aberto, setAberto] = useState(false);
  return <Burger opened={aberto} onClick={() => setAberto(!aberto)} />;
}
export const Interativo: Story = { render: () => <AbreFecha /> };
