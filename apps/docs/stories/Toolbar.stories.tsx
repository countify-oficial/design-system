import { ActionIcon, Button, Icon, Toolbar } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Botões/Toolbar", component: Toolbar, args: { "aria-label": "Ações da tabela" } } satisfies Meta<typeof Toolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

const Botoes = () => (
  <>
    <Button variant="outline" leftSection={<Icon name="download" size="sm" />}>Exportar</Button>
    <ActionIcon variant="default" aria-label="Filtrar"><Icon name="sliders" /></ActionIcon>
    <ActionIcon variant="default" aria-label="Ordenar"><Icon name="funnel" /></ActionIcon>
    <ActionIcon variant="default" aria-label="Apagar" color="down"><Icon name="trash" /></ActionIcon>
  </>
);

export const Horizontal: Story = { render: (a) => <Toolbar {...a}><Botoes /></Toolbar> };
export const Vertical: Story = { render: (a) => <Toolbar {...a} orientation="vertical" style={{ width: "fit-content" }}><Botoes /></Toolbar> };
