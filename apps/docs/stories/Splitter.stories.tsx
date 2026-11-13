import { NavLink, Splitter, Text, Title } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Layout/Splitter", component: Splitter } satisfies Meta<typeof Splitter>;
export default meta;
type Story = StoryObj<typeof meta>;

const moldura = { height: "calc(5 * var(--cf-list-row-height))", boxShadow: "var(--cf-shadow-xs)", borderRadius: "var(--cf-radius-md)", background: "var(--cf-color-card)" };

export const ListaEDetalhe: Story = {
  name: "Lista e detalhe (W-Avisos: 5 + 7 colunas)",
  render: () => (
    <Splitter defaultSizes={[42, 58]} minSize={25} style={moldura}>
      <Splitter.Panel style={{ padding: "var(--cf-space-2)" }}>
        <NavLink href="#1" label="Câmera sem imagem" description="Lume Orla · agora" active />
        <NavLink href="#2" label="Meta batida" description="Lume Jardins · 10:42" />
        <NavLink href="#3" label="Novo acesso" description="Ana Lima · ontem" />
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: "var(--cf-space-6)" }}>
        <Title order={3}>Câmera sem imagem</Title>
        <Text color="text2">A câmera da entrada da Lume Orla parou às 10:58.</Text>
      </Splitter.Panel>
    </Splitter>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Splitter orientation="vertical" style={moldura}>
      <Splitter.Panel style={{ padding: "var(--cf-space-4)" }}><Text>Gráfico</Text></Splitter.Panel>
      <Splitter.Panel style={{ padding: "var(--cf-space-4)" }}><Text>Tabela</Text></Splitter.Panel>
    </Splitter>
  ),
};

export const TresPaineis: Story = {
  name: "Três painéis",
  render: () => (
    <Splitter defaultSizes={[25, 50, 25]} style={moldura}>
      {["Lojas", "Painel", "Detalhe"].map((t) => <Splitter.Panel key={t} style={{ padding: "var(--cf-space-4)" }}><Text>{t}</Text></Splitter.Panel>)}
    </Splitter>
  ),
};
