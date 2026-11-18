import { Anchor, Announcement, Button, Icon, NavLink, Stack, type Tone } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

const meta = {
  title: "Feedback/Announcement",
  component: Announcement,
  args: {
    title: "Agora dá para exportar em CSV",
    children: "Na tabela de lojas, use o botão Exportar.",
    action: <Anchor href="#novidades" size="sm">Ver o que mudou</Anchor>,
    onDismiss: fn(),
  },
  decorators: [(Story) => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><Story /></div>],
} satisfies Meta<typeof Announcement>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão (com link)" };
export const ComBotao: Story = {
  name: "Com botão",
  args: { title: "Nova versão do agente", children: "A 1.2.0 conta pessoas em duas portas.", icon: <Icon name="computer" />, action: <Button size="sm" variant="outline">Atualizar agora</Button> },
};
export const SoTitulo: Story = { name: "Só título, sem ícone", args: { icon: null, children: undefined, action: undefined } };
export const Tons: Story = {
  render: (a) => <Stack>{(["accent", "up", "warn", "gray"] as Tone[]).map((t) => <Announcement key={t} {...a} color={t} title={`Tom ${t}`} />)}</Stack>,
};

// lembra a dispensa no localStorage: depois de dispensar, só volta limpando a chave
export const Lembrado: Story = {
  name: "Lembra a dispensa (storageKey)",
  args: { storageKey: "storybook-novidade-csv" },
  render: (a) => (
    <Stack>
      <Announcement {...a} />
      <Anchor
        component="button"
        size="sm"
        onClick={() => {
          try {
            window.localStorage.removeItem("storybook-novidade-csv");
          } catch {
            // sem localStorage: nada a limpar
          }
          window.location.reload();
        }}
      >
        Esquecer a dispensa e recarregar
      </Anchor>
    </Stack>
  ),
};

export const Controlado: Story = {
  name: "Controlado (opened e onDismiss)",
  render: function Render(a) {
    const [aberto, setAberto] = useState(true);
    return (
      <Stack align="flex-start">
        <Announcement {...a} opened={aberto} onDismiss={() => setAberto(false)} />
        {!aberto && <Button variant="subtle" onClick={() => setAberto(true)}>Mostrar de novo</Button>}
      </Stack>
    );
  },
};

// no rodapé do menu lateral: ao dispensar, o foco vai para o próximo focável (aqui, "Ajustes")
export const RodapeDoMenu: Story = {
  name: "No rodapé do menu lateral",
  render: (a) => (
    <Stack gap="xs">
      <NavLink label="Painel" leftSection={<Icon name="dashboard" />} active />
      <NavLink label="Análises" leftSection={<Icon name="analytics" />} />
      <Announcement {...a} title="Nova versão do agente">Veja o que mudou na 1.2.0.</Announcement>
      <NavLink label="Ajustes" leftSection={<Icon name="settings" />} />
    </Stack>
  ),
};
