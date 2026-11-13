import { Avatar, Badge, Icon, NavLink, Stack, ThemeIcon } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Navegação/NavLink",
  component: NavLink,
  args: { label: "Segurança", href: "#seguranca" },
  decorators: [(S) => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><S /></div>],
} satisfies Meta<typeof NavLink>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const Completo: Story = {
  name: "Ícone, descrição e seta",
  args: { leftSection: <ThemeIcon><Icon name="key" /></ThemeIcon>, description: "Senha e segundo fator", rightSection: <Icon name="chevron-right" size="xs" /> },
};
export const ComValor: Story = { name: "Com valor à direita", args: { label: "Lojas", rightSection: "88" } };
export const Ativo: Story = { name: "A tela atual (active)", args: { active: true, leftSection: <Avatar name="Ana Lima" />, description: "Gerente, Lume Jardins" } };
export const Desativado: Story = { args: { disabled: true } };
export const ComFilhos: Story = {
  name: "Com filhos (abre um nível)",
  render: () => (
    <Stack gap={1}>
      <NavLink label="Ceará" leftSection={<ThemeIcon><Icon name="store" /></ThemeIcon>} rightSection={<Badge>3</Badge>} defaultOpened>
        <NavLink href="#jardins" label="Lume Jardins" active />
        <NavLink href="#aldeota" label="Lume Aldeota" />
        <NavLink href="#orla" label="Lume Orla" />
      </NavLink>
      <NavLink label="São Paulo" leftSection={<ThemeIcon><Icon name="store" /></ThemeIcon>}>
        <NavLink href="#pinheiros" label="Lume Pinheiros" />
      </NavLink>
    </Stack>
  ),
};
