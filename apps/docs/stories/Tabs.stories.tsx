import { Badge, Icon, Tabs, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Navigation/Tabs", component: Tabs } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

const Paineis = () => (
  <>
    <Tabs.Panel value="dia"><Text>Entradas de hoje, hora a hora.</Text></Tabs.Panel>
    <Tabs.Panel value="semana"><Text>Os sete dias, lado a lado.</Text></Tabs.Panel>
    <Tabs.Panel value="mes"><Text>O mês inteiro, com a meta.</Text></Tabs.Panel>
  </>
);

export const Segmentado: Story = {
  name: "Segmentado (padrão)",
  render: () => (
    <Tabs defaultValue="semana">
      <Tabs.List aria-label="Período">
        <Tabs.Tab value="dia">Dia</Tabs.Tab>
        <Tabs.Tab value="semana">Semana</Tabs.Tab>
        <Tabs.Tab value="mes">Mês</Tabs.Tab>
      </Tabs.List>
      <Paineis />
    </Tabs>
  ),
};

export const LarguraToda: Story = {
  name: "Segmentado na largura toda (grow)",
  render: () => (
    <Tabs defaultValue="todos">
      <Tabs.List aria-label="Avisos" grow>
        <Tabs.Tab value="todos">Todos</Tabs.Tab>
        <Tabs.Tab value="pessoas">Pessoas</Tabs.Tab>
        <Tabs.Tab value="sistema">Sistema</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  ),
};

export const Pilulas: Story = {
  name: "Pílulas (pills), com ícone e contagem",
  render: () => (
    <Tabs variant="pills" defaultValue="painel">
      <Tabs.List aria-label="Seções">
        <Tabs.Tab value="painel" leftSection={<Icon name="dashboard" size="sm" />}>Painel</Tabs.Tab>
        <Tabs.Tab value="analises" leftSection={<Icon name="analytics" size="sm" />}>Análises</Tabs.Tab>
        <Tabs.Tab value="avisos" leftSection={<Icon name="bell" size="sm" />} rightSection={<Badge color="down" variant="filled">3</Badge>}>Avisos</Tabs.Tab>
        <Tabs.Tab value="ajustes" leftSection={<Icon name="settings" size="sm" />}>Ajustes</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  ),
};

export const Chips: Story = {
  name: "Chips que rolam (chips)",
  render: () => (
    <div style={{ maxWidth: "var(--cf-side-panel-width)" }}>
      <Tabs variant="chips" defaultValue="panorama">
        <Tabs.List aria-label="Câmeras">
          {["Panorama", "Câm 1", "Câm 2", "Câm 3", "Câm 4", "Câm 5"].map((c) => <Tabs.Tab key={c} value={c.toLowerCase()}>{c}</Tabs.Tab>)}
        </Tabs.List>
      </Tabs>
    </div>
  ),
};

export const Vertical: Story = {
  name: "Vertical (pills ao lado do conteúdo)",
  render: () => (
    <Tabs variant="pills" orientation="vertical" defaultValue="dia">
      <Tabs.List aria-label="Período">
        <Tabs.Tab value="dia">Dia</Tabs.Tab>
        <Tabs.Tab value="semana">Semana</Tabs.Tab>
        <Tabs.Tab value="mes">Mês</Tabs.Tab>
      </Tabs.List>
      <Paineis />
    </Tabs>
  ),
};

export const Desativada: Story = {
  name: "Com aba desativada; setas só movem o foco",
  render: () => (
    <Tabs defaultValue="dia" activateTabWithKeyboard={false}>
      <Tabs.List aria-label="Período">
        <Tabs.Tab value="dia">Dia</Tabs.Tab>
        <Tabs.Tab value="semana" disabled>Semana</Tabs.Tab>
        <Tabs.Tab value="mes">Mês</Tabs.Tab>
      </Tabs.List>
      <Paineis />
    </Tabs>
  ),
};
