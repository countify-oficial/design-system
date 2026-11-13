import { Alert, Button, EmptyState, Icon, Notification, Stack, ThemeIcon, type Tone } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = { title: "Feedback/Alert", component: Alert, args: { title: "Não foi possível carregar", children: "Tente de novo em instantes." } } satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tons: Story = { render: (a) => <Stack>{(["accent", "down", "warn", "up", "gray"] as Tone[]).map((t) => <Alert key={t} {...a} color={t} title={`Tom ${t}`} />)}</Stack> };
export const Erro: Story = { name: "Erro com ação (X-DocEstados)", render: () => <Alert color="down" title="Não foi possível carregar"><Button variant="outline" fullWidth style={{ marginTop: "var(--cf-space-2)" }}>Tentar de novo</Button></Alert> };
export const SemConexao: Story = { name: "Sem conexão", args: { color: "gray", title: undefined, children: "Sem conexão · atualizado às 14:32" } };
export const ComFechar: Story = { name: "Com botão de fechar", args: { color: "accent", withCloseButton: true, onClose: fn() } };

export const Notificacao: StoryObj = {
  name: "Notification",
  render: () => (
    <Stack align="flex-start">
      <Notification icon={<Icon name="check" size="sm" />} action={<Button size="sm" variant="subtle" style={{ color: "inherit" }}>Desfazer</Button>}>Análise salva</Notification>
      <Notification loading>Salvando…</Notification>
      <Notification color="down" title="Falha ao enviar" withCloseButton>Verifique a conexão.</Notification>
    </Stack>
  ),
};

export const Vazio: StoryObj = {
  name: "EmptyState",
  render: () => (
    <EmptyState icon={<ThemeIcon size="lg" color="gray"><Icon name="bookmark" /></ThemeIcon>} title="Nenhuma análise salva" description="As análises salvas aparecem aqui para todos da conta.">
      <Button variant="dashed" leftSection={<Icon name="plus" size="sm" />}>Nova análise</Button>
    </EmptyState>
  ),
};
