import { Anchor, Breadcrumbs } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Navigation/Breadcrumbs", component: Breadcrumbs } satisfies Meta<typeof Breadcrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: () => (
    <Breadcrumbs>
      <Anchor href="#ajustes">Ajustes</Anchor>
      <Anchor href="#seguranca">Segurança</Anchor>
      Dispositivos
    </Breadcrumbs>
  ),
};
export const OutroSeparador: Story = {
  name: "Outro separador",
  render: () => (
    <Breadcrumbs separator="/">
      <Anchor href="#lojas">Lojas</Anchor>
      <Anchor href="#ce">Ceará</Anchor>
      Lume Jardins
    </Breadcrumbs>
  ),
};
