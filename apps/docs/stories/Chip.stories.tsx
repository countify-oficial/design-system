import { Button, Chip, Group, Icon } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Escolhas/Chip", component: Chip, args: { children: "Calçados" } } satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const Escolhido: Story = { args: { defaultChecked: true } };
export const ChipsDeEscolha: Story = {
  name: "Chips de escolha (mockup)",
  render: () => (
    <Group gap="sm" align="flex-start">
      <Chip.Group label="Categorias" multiple defaultValue={["todos", "calcados"]}>
        <Chip value="todos">Todos</Chip>
        <Chip value="calcados">Calçados</Chip>
        <Chip value="acessorios">Acessórios</Chip>
      </Chip.Group>
      <Button variant="dashed" size="sm" leftSection={<Icon name="plus" size="xs" />} style={{ alignSelf: "flex-end" }}>Outra</Button>
    </Group>
  ),
};
export const UmSo: Story = { name: "Um só (radio)", render: () => <Chip.Group label="Período" defaultValue={["hoje"]}><Chip value="hoje">Hoje</Chip><Chip value="ontem">Ontem</Chip><Chip value="semana">7 dias</Chip></Chip.Group> };
