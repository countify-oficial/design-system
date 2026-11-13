import { Button, FloatingIndicator, FloatingWindow, Group, Menu, Menubar, Stack, Text, Tour, UnstyledButton } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = { title: "Sobreposições/Computador", component: Menubar } satisfies Meta<typeof Menubar>;
export default meta;
type Story = StoryObj<typeof meta>;

function Abas() {
  const [pai, setPai] = useState<HTMLDivElement | null>(null);
  const [itens, setItens] = useState<Record<string, HTMLButtonElement | null>>({});
  const [ativa, setAtiva] = useState("Todos");
  return (
    <div ref={setPai} style={{ position: "relative", display: "inline-flex", gap: "var(--cf-space-1)", padding: "var(--cf-space-1)", borderRadius: "var(--cf-radius-sm)", background: "var(--cf-color-card)" }}>
      <FloatingIndicator target={itens[ativa]} parent={pai} />
      {["Todos", "Pessoas", "Sistema"].map((a) => (
        <UnstyledButton
          key={a}
          ref={(el: HTMLButtonElement | null) => { if (itens[a] !== el) setItens((v) => ({ ...v, [a]: el })); }}
          aria-pressed={ativa === a}
          onClick={() => setAtiva(a)}
          style={{ position: "relative", minHeight: "var(--cf-touch-target)", padding: "0 var(--cf-space-3)", color: ativa === a ? "var(--cf-color-accent)" : "var(--cf-color-text)", fontWeight: 500 }}
        >
          {a}
        </UnstyledButton>
      ))}
    </div>
  );
}
export const Indicador: Story = { name: "FloatingIndicator", render: () => <Abas /> };

function Janela() {
  const [aberta, setAberta] = useState(true);
  return (
    <>
      <Button variant="outline" onClick={() => setAberta(true)}>Abrir câmera</Button>
      <FloatingWindow opened={aberta} onClose={() => setAberta(false)} title="Câmera ao vivo · Lume Jardins" defaultPosition={{ x: 80, y: 120 }}>
        <Text size="sm" color="text2">Arraste pelo título ou use as setas com o foco nele.</Text>
      </FloatingWindow>
    </>
  );
}
export const Janelinha: Story = { name: "FloatingWindow", render: () => <Janela /> };

function Guiado() {
  const [aberto, setAberto] = useState(false);
  return (
    <Stack align="flex-start">
      <Group><Button id="tour-salvar">Salvar análise</Button><Button id="tour-exportar" variant="outline">Exportar</Button></Group>
      <Button variant="subtle" onClick={() => setAberto(true)}>Começar o tour</Button>
      <Tour
        opened={aberto}
        onClose={() => setAberto(false)}
        steps={[
          { target: "#tour-salvar", title: "Salve a análise", description: "Ela fica em Salvas para todos da conta." },
          { target: "#tour-exportar", title: "Exporte", description: "Baixa os números em CSV.", position: "right" },
        ]}
      />
    </Stack>
  );
}
export const TourGuiado: Story = { name: "Tour", render: () => <Guiado /> };

export const BarraDeMenus: Story = {
  name: "Menubar (Electron)",
  render: () => (
    <Menubar aria-label="Menu do aplicativo">
      <Menubar.Menu label="Arquivo"><Menu.Item>Nova análise</Menu.Item><Menu.Item>Exportar CSV</Menu.Item><Menu.Divider /><Menu.Item>Sair</Menu.Item></Menubar.Menu>
      <Menubar.Menu label="Editar"><Menu.Item>Desfazer</Menu.Item><Menu.Item>Refazer</Menu.Item></Menubar.Menu>
      <Menubar.Menu label="Ver"><Menu.Item>Modo escuro</Menu.Item></Menubar.Menu>
    </Menubar>
  ),
};
