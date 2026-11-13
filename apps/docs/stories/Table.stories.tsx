import { Table } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const lojas = [
  { nome: "Lume Jardins", cidade: "Fortaleza", entradas: 1102, conversao: 19.8 },
  { nome: "Lume Orla", cidade: "Fortaleza", entradas: 980, conversao: 23.1 },
  { nome: "Lume Aldeota", cidade: "Fortaleza", entradas: 1311, conversao: 17.4 },
  { nome: "Lume Centro", cidade: "Sobral", entradas: 640, conversao: 25.0 },
];
const meta = { title: "Dados/Table", component: Table, parameters: { docs: { description: { component: "Só no computador: no celular, a identidade troca a tabela por lista." } } } } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

function Ordenavel(props: { stickyHeader?: boolean; striped?: boolean; highlightOnHover?: boolean }) {
  const [desc, setDesc] = useState(true);
  const linhas = [...lojas].sort((a, b) => (desc ? b.entradas - a.entradas : a.entradas - b.entradas));
  return (
    <Table.ScrollContainer maxHeight={220} aria-label="Lojas">
      <Table stickyHeader stickyFirstColumn {...props}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Loja</Table.Th>
            <Table.Th>Cidade</Table.Th>
            <Table.Th numeric sort={desc ? "descending" : "ascending"} onSort={() => setDesc(!desc)}>Entradas</Table.Th>
            <Table.Th numeric>Conversão</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {linhas.map((l) => (
            <Table.Tr key={l.nome}>
              <Table.Th scope="row">{l.nome}</Table.Th>
              <Table.Td>{l.cidade}</Table.Td>
              <Table.Td numeric>{l.entradas.toLocaleString("pt-BR")}</Table.Td>
              <Table.Td numeric>{l.conversao.toLocaleString("pt-BR")}%</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        <Table.Caption>Hoje, até 14:32</Table.Caption>
      </Table>
    </Table.ScrollContainer>
  );
}
export const Padrao: Story = { name: "Cabeçalho fixo e ordenação", render: () => <Ordenavel /> };
export const Listrada: Story = { name: "Listrada e com hover", render: () => <Ordenavel striped highlightOnHover /> };
