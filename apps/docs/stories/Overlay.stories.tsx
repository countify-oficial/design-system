import { ActionBar, Affix, Button, Card, Checkbox, Dialog, Group, LoadingOverlay, Overlay, Stack, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = { title: "Sobreposições/Overlay", component: Overlay } satisfies Meta<typeof Overlay>;
export default meta;
type Story = StoryObj<typeof meta>;

const caixa = { position: "relative", minHeight: "calc(var(--cf-list-row-height) * 2)" } as const;

export const Veu: Story = { name: "Overlay (o véu)", render: () => <Card style={caixa}><Text>Conteúdo atrás do véu</Text><Overlay radius="md" /></Card> };
export const Carregando: Story = { name: "LoadingOverlay", render: () => <Card style={caixa}><Text>Salvando a análise…</Text><LoadingOverlay visible overlayProps={{ radius: "md" }} /></Card> };

function Canto() {
  const [aberto, setAberto] = useState(true);
  return (
    <>
      <Button variant="outline" onClick={() => setAberto(!aberto)}>{aberto ? "Esconder" : "Mostrar"} aviso</Button>
      <Dialog opened={aberto} onClose={() => setAberto(false)} withCloseButton aria-label="Nova versão">
        <Text weight="medium">Há uma versão nova do agente.</Text>
        <Group><Button size="sm">Atualizar</Button></Group>
      </Dialog>
    </>
  );
}
export const DialogNoCanto: Story = { name: "Dialog (no canto, sem véu)", render: () => <Canto /> };
export const Fixo: Story = { name: "Affix", render: () => <Affix><Button variant="outline">Voltar ao topo</Button></Affix> };

function Selecao() {
  const [escolhidas, setEscolhidas] = useState<string[]>([]);
  return (
    <Stack>
      <Checkbox.Group label="Lojas" value={escolhidas} onChange={setEscolhidas}>
        {["Jardins", "Orla", "Centro"].map((l) => <Checkbox key={l} value={l} label={`Lume ${l}`} />)}
      </Checkbox.Group>
      <ActionBar opened={escolhidas.length > 0} aria-label="Ações das lojas escolhidas">
        {escolhidas.length} {escolhidas.length === 1 ? "loja" : "lojas"}
        <Button size="sm" variant="subtle">Mover</Button>
        <Button size="sm" variant="subtle" color="down">Excluir</Button>
      </ActionBar>
    </Stack>
  );
}
export const BarraDeAcoes: Story = { name: "ActionBar (escolha lojas)", render: () => <Selecao /> };
