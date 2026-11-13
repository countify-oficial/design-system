import { AppShell, Avatar, Badge, Button, Icon, Text, Title } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Layout/AppShell", component: AppShell, parameters: { layout: "fullscreen" } } satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;

const secoes = [
  { icon: "dashboard", label: "Painel", active: true },
  { icon: "analytics", label: "Análises" },
  { icon: "bell", label: "Avisos", badge: <Badge color="down" variant="filled">3</Badge> },
  { icon: "settings", label: "Ajustes" },
] as const;
const Itens = () => secoes.map((s) => <AppShell.NavItem key={s.label} href={`#${s.label}`} icon={s.icon} label={s.label} active={"active" in s} badge={"badge" in s ? s.badge : undefined} />);

export const Padrao: Story = {
  name: "Mude a largura: abas embaixo (<768), só ícones (768–1279), com nomes (≥1280)",
  render: () => (
    <AppShell>
      <AppShell.Header
        logo={<Text weight="bold" color="accent">countify</Text>}
        end={
          <>
            <Button variant="outline" leftSection={<Icon name="store" size="sm" />} rightSection={<Icon name="chevron-down" size="xs" />}>Lume</Button>
            <Avatar name="Ana Lima" />
          </>
        }
      >
        <Itens />
      </AppShell.Header>
      <AppShell.Main>
        <Title order={1}>Painel</Title>
        <Text color="text2">Hoje, até agora.</Text>
      </AppShell.Main>
      <AppShell.TabBar>
        <Itens />
      </AppShell.TabBar>
    </AppShell>
  ),
};
