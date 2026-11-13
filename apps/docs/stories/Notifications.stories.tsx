import { Button, Group, Icon } from "@countify-oficial/core";
import { Notifications, notifications } from "@countify-oficial/notifications";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Extensões/Notifications",
  component: Notifications,
  parameters: { docs: { description: { component: "Avisos rápidos: notifications.show() de qualquer lugar. Um por vez; some em 4 s (0.1.0); para com o mouse ou o foco em cima." } } },
} satisfies Meta<typeof Notifications>;
export default meta;
type Story = StoryObj<typeof meta>;

function salvar() {
  const id = notifications.show({ message: "Salvando a análise…", loading: true });
  setTimeout(() => notifications.update(id, { message: "Análise salva", loading: false, icon: <Icon name="check" size="sm" /> }), 1500);
}

const Demo: Story["render"] = (a) => (
  <>
    <Group>
      <Button variant="outline" onClick={() => notifications.show({ message: "Análise salva" })}>Simples</Button>
      <Button variant="outline" onClick={() => notifications.show({ title: "Meta batida", message: "Lume Jardins passou de 1.200 entradas", withCloseButton: true })}>Com título</Button>
      <Button variant="outline" onClick={() => notifications.show({ message: "Sem conexão com a câmera", color: "down", autoClose: false, withCloseButton: true })}>Erro (fica)</Button>
      <Button variant="outline" onClick={salvar}>Salvando → salvo</Button>
      <Button variant="outline" onClick={() => notifications.show({ message: "Análise excluída", action: <Button variant="subtle" size="sm" onClick={() => notifications.clean()}>Desfazer</Button> })}>Com ação</Button>
    </Group>
    <Notifications {...a} />
  </>
);

export const Padrao: Story = { name: "Todos os tipos", render: Demo };
export const Varios: Story = { name: "Até três juntos (limit)", args: { limit: 3 }, render: Demo };
