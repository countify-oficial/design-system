import { Accordion, Button, Collapse, Spoiler, Stack, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = { title: "Dados/Accordion", component: Accordion } satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

const itens = [
  { v: "contagem", t: "Como a contagem funciona", c: "As câmeras contam quem entra; quem sai e volta em 30 minutos conta uma vez." },
  { v: "cameras", t: "Câmeras sem imagem", c: "Verifique a energia e a rede da câmera. O aviso some quando a imagem volta." },
  { v: "conta", t: "Quem vê os dados", c: "Gerentes veem as suas lojas; administradores, a rede toda." },
];
const Itens = () => itens.map((i) => (
  <Accordion.Item key={i.v} value={i.v}>
    <Accordion.Control>{i.t}</Accordion.Control>
    <Accordion.Panel>{i.c}</Accordion.Panel>
  </Accordion.Item>
));

export const Separado: Story = { name: "Separado (padrão)", render: () => <Accordion defaultValue={["contagem"]}><Itens /></Accordion> };
export const Junto: Story = { name: "Num cartão só (contained)", render: () => <Accordion variant="contained"><Itens /></Accordion> };
export const Varios: Story = { name: "Vários abertos (multiple)", render: () => <Accordion multiple defaultValue={["contagem", "conta"]}><Itens /></Accordion> };

function AbreFecha() {
  const [aberto, setAberto] = useState(false);
  return (
    <Stack align="flex-start">
      <Button variant="outline" onClick={() => setAberto(!aberto)}>{aberto ? "Esconder" : "Mostrar"} detalhes</Button>
      <Collapse in={aberto}><Text>Detalhes que aparecem com animação de altura.</Text></Collapse>
    </Stack>
  );
}
export const AbrirEFechar: Story = { name: "Collapse", render: () => <AbreFecha /> };
export const TextoLongo: Story = {
  name: "Spoiler",
  render: () => (
    <Spoiler maxHeight={48}>
      <Text>{"A conversão é a parte das entradas que virou venda no mesmo dia. ".repeat(6)}</Text>
    </Spoiler>
  ),
};
