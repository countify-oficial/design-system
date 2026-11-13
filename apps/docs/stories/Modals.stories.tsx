import { Button, Group, Text } from "@countify-oficial/core";
import { modals, ModalsProvider, type ContextModalProps } from "@countify-oficial/modals";
import type { Meta, StoryObj } from "@storybook/react-vite";

function Renomear({ context, id, innerProps }: ContextModalProps<{ nome: string }>) {
  return (
    <>
      <Text color="text2">Hoje: {innerProps.nome}</Text>
      <Group justify="flex-end"><Button onClick={() => context.close(id)}>Pronto</Button></Group>
    </>
  );
}

const meta = {
  title: "Extensões/Modals",
  component: ModalsProvider,
  args: { modals: { renomear: Renomear } },
  parameters: { docs: { description: { component: "Janelas abertas por função. A confirmação é o \"Alerta no centro\" do mockup (W-Confirmar): no celular, os dois botões dividem a largura." } } },
} satisfies Meta<typeof ModalsProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Confirmar, conteúdo e registrada",
  render: (a) => (
    <ModalsProvider {...a}>
      <Group>
        <Button
          color="down"
          onClick={() =>
            modals.openConfirmModal({
              title: "Excluir análise?",
              children: "\"Dia das Mães, 5 anos\" sai para você e para quem ela foi compartilhada.",
              labels: { confirm: "Excluir" },
              confirmColor: "down",
            })
          }
        >
          Excluir análise
        </Button>
        <Button variant="outline" onClick={() => modals.openConfirmModal({ title: "Sair sem salvar?", children: "As mudanças desta tela se perdem." })}>Confirmar (padrão)</Button>
        <Button variant="outline" onClick={() => modals.open({ title: "Sobre a contagem", children: <Text>Quem sai e volta em 30 minutos conta uma vez.</Text> })}>Conteúdo</Button>
        <Button variant="outline" onClick={() => modals.openContextModal({ modal: "renomear", title: "Renomear loja", innerProps: { nome: "Lume Jardins" } })}>Registrada</Button>
      </Group>
    </ModalsProvider>
  ),
};
