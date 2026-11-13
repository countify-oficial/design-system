import { Container, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bloco } from "./_demo";

const meta = {
  title: "Layout/Container",
  component: Container,
  parameters: { layout: "fullscreen", docs: { description: { component: "Margem lateral de 20 no celular e 32 a partir de 768. Mude a largura da janela." } } },
} satisfies Meta<typeof Container>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  render: () => (
    <Container component="main" style={{ background: "var(--cf-color-sheet)", paddingBlock: "var(--cf-space-6)" }}>
      <Text component="h1" size="xl" weight="bold">Painel</Text>
      <Bloco>O conteúdo começa na margem da página</Bloco>
    </Container>
  ),
};
