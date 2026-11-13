import { Button, Drawer, Group, Modal, Radio, Stack, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = { title: "Sobreposições/Modal e Drawer", component: Modal, args: { opened: false, onClose: () => undefined } } satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;

function ConfirmarExclusao() {
  const [aberta, setAberta] = useState(false);
  return (
    <>
      <Button variant="subtle" color="down" onClick={() => setAberta(true)}>Excluir análise</Button>
      <Modal opened={aberta} onClose={() => setAberta(false)} title="Excluir análise?" withCloseButton={false}>
        <Text size="sm" color="text2">Sai de Salvas para todos que a veem.</Text>
        <Group grow style={{ paddingTop: "var(--cf-space-4)" }}>
          <Button variant="outline" size="sm" onClick={() => setAberta(false)}>Cancelar</Button>
          <Button color="down" size="sm" onClick={() => setAberta(false)}>Excluir</Button>
        </Group>
      </Modal>
    </>
  );
}
export const Confirmar: Story = { name: "Confirmar exclusão (mockup)", render: () => <ConfirmarExclusao /> };

function Periodo() {
  const [aberta, setAberta] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setAberta(true)}>Período: Hoje</Button>
      <Drawer opened={aberta} onClose={() => setAberta(false)} title="Período">
        <Radio.Group label="Mostrar" defaultValue="hoje">
          <Radio value="hoje" label="Hoje" />
          <Radio value="ontem" label="Ontem" />
          <Radio value="semana" label="Últimos 7 dias" />
        </Radio.Group>
        <Button fullWidth onClick={() => setAberta(false)}>Aplicar</Button>
      </Drawer>
    </>
  );
}
export const FolhaOuPainel: Story = {
  name: "Drawer: folha no celular, painel no computador",
  render: () => <Stack align="flex-start"><Periodo /><Text size="sm" color="text2">Mude a largura da janela (768) para ver a folha virar painel.</Text></Stack>,
};
