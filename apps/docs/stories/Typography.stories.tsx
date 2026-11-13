import { Typography } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Tipografia/Typography", component: Typography } satisfies Meta<typeof Typography>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TextoDeAjuda: Story = {
  name: "Texto de ajuda (HTML comum)",
  render: () => (
    <Typography>
      <h1>Como a conversão é calculada</h1>
      <p>A conversão é a parte das <a href="#entradas">entradas</a> que virou venda no mesmo dia.</p>
      <h2>O que entra na conta</h2>
      <ul><li>Entradas contadas pelas câmeras</li><li>Vendas do sistema da loja</li></ul>
      <blockquote>Loja com contagem parcial aparece com a etiqueta “parcial”.</blockquote>
      <p>Fórmula: <code>vendas ÷ entradas</code></p>
      <hr />
      <table><thead><tr><th>Loja</th><th>Conversão</th></tr></thead><tbody><tr><td>Jardins</td><td>19,8%</td></tr></tbody></table>
    </Typography>
  ),
};
