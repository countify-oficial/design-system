import { ActionIcon, Button, ColorInput, Group, HoverCard, Icon, Kbd, Menu, Paper, Popover, Stack, Text, Tooltip } from "@countify-oficial/core";
import { palette } from "@countify-oficial/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Sobreposições/Popover, Menu e Tooltip", component: Popover } satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Ajuda: Story = {
  name: "Popover: o “?” que mostra o cálculo",
  render: () => (
    <Group gap="xs">
      <Text color="text2" size="sm">Conversão</Text>
      <Popover width={320} position="bottom-start">
        <Popover.Target><ActionIcon aria-label="Ajuda: Conversão" color="text2"><Icon name="help" /></ActionIcon></Popover.Target>
        <Popover.Dropdown aria-label="Como calculamos a conversão">
          <Stack gap="xs"><Text weight="bold">Conversão</Text><Text size="sm" color="text2">Vendas do dia ÷ entradas contadas pelas câmeras.</Text></Stack>
        </Popover.Dropdown>
      </Popover>
    </Group>
  ),
};

export const MenuDeAcoes: Story = {
  name: "Menu",
  render: () => (
    <Menu>
      <Menu.Target><Button variant="outline" rightSection={<Icon name="chevron-down" size="sm" />}>Ações</Button></Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Análise</Menu.Label>
        <Menu.Item leftSection={<Icon name="edit" size="sm" />}>Editar</Menu.Item>
        <Menu.Item leftSection={<Icon name="download" size="sm" />}>Exportar CSV</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="down" leftSection={<Icon name="trash" size="sm" />}>Excluir</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ),
};

export const MenuComprido: Story = {
  name: "Menu com 30 itens (rola por dentro)",
  render: () => (
    <Menu>
      <Menu.Target><Button variant="outline" rightSection={<Icon name="chevron-down" size="sm" />}>Loja</Button></Menu.Target>
      <Menu.Dropdown>
        {Array.from({ length: 30 }, (_, i) => <Menu.Item key={i}>{`Loja ${String(i + 1).padStart(2, "0")}`}</Menu.Item>)}
      </Menu.Dropdown>
    </Menu>
  ),
};

// O menu de contexto é o mesmo Menu com trigger="context": fica junto do Menu para comparar os dois e reaproveitar os itens.
export const MenuDeContexto: Story = {
  name: "Menu de contexto (clique direito)",
  render: () => (
    <Menu trigger="context">
      <Menu.Target>
        <Paper withBorder style={{ padding: "var(--cf-space-4)", maxWidth: "var(--cf-side-panel-width)" }}>
          <Stack gap="xs">
            <Text size="sm" color="text2">Clique com o botão direito numa loja, ou foque uma e use <Kbd>Shift</Kbd> + <Kbd>F10</Kbd>.</Text>
            {["Lume Jardins", "Lume Aldeota", "Lume Iguatemi"].map((loja) => <Button key={loja} variant="subtle">{loja}</Button>)}
          </Stack>
        </Paper>
      </Menu.Target>
      <Menu.Dropdown aria-label="Ações da loja">
        <Menu.Item leftSection={<Icon name="edit" size="sm" />}>Editar</Menu.Item>
        <Menu.Item leftSection={<Icon name="download" size="sm" />}>Exportar CSV</Menu.Item>
        <Menu.Item disabled>Mover (sem permissão)</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="down" leftSection={<Icon name="trash" size="sm" />}>Excluir</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ),
};

export const Dica: Story = { name: "Tooltip (hover e foco)", render: () => <Tooltip label="Baixa a tabela em CSV"><Button variant="outline">Exportar</Button></Tooltip> };

export const CartaoNoHover: Story = {
  name: "HoverCard",
  render: () => (
    <HoverCard width={280}>
      <HoverCard.Target><Button variant="subtle">Lume Jardins</Button></HoverCard.Target>
      <HoverCard.Dropdown><Stack gap="xs"><Text weight="bold">Lume Jardins</Text><Text size="sm" color="text2">Fortaleza · 1.102 entradas hoje</Text></Stack></HoverCard.Dropdown>
    </HoverCard>
  ),
};

export const CampoDeCor: Story = {
  name: "ColorInput",
  render: () => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><ColorInput label="Cor da categoria" defaultValue={palette.blue[6]} swatches={[palette.blue[6], palette.green[6], palette.red[6], palette.amber[6]]} /></div>,
};
