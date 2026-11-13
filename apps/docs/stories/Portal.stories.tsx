import { Portal, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Primitivos/Portal",
  component: Portal,
  parameters: { docs: { description: { component: "Desenha fora da árvore: veja no inspetor do navegador, no fim do <body>." } } },
} satisfies Meta<typeof Portal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão (fim do <body>)",
  render: () => (
    <div style={{ overflow: "hidden", height: 0 }}>
      <Text>Este texto fica escondido pelo pai…</Text>
      <Portal><Text color="accent">…e este aparece, porque foi para o fim do &lt;body&gt;.</Text></Portal>
    </div>
  ),
};

export const ComDestino: Story = {
  name: "Com destino (target)",
  render: () => (
    <>
      <div id="destino-do-portal" />
      <Portal target="#destino-do-portal"><Text>Desenhado dentro de #destino-do-portal.</Text></Portal>
    </>
  ),
};
