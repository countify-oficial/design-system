import { DataGrid, Stack, Text, type DataGridChange, type DataGridColumn } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

interface Produto {
  id: number;
  codigo: string;
  produto: string;
  descricao: string;
  estoque: number | null;
  preco: number | null;
}

// a primeira coluna é o código de barras (regra das tabelas da Countify)
const colunas: DataGridColumn<Produto>[] = [
  { key: "codigo", title: "Código de barras", width: 170 },
  { key: "produto", title: "Produto", width: 200, editable: true, validate: (v) => (v === "" ? "Informe o nome do produto" : undefined) },
  { key: "descricao", title: "Descrição", editable: true },
  {
    key: "estoque", title: "Estoque", type: "number", width: 120, editable: true,
    validate: (v) => (v === null ? undefined : !Number.isInteger(v) ? "A contagem é em unidades inteiras" : (v as number) < 0 ? "Estoque não pode ser negativo" : undefined),
  },
  { key: "preco", title: "Preço", type: "currency", width: 140, editable: true, validate: (v) => (typeof v === "number" && v < 0 ? "Preço não pode ser negativo" : undefined) },
];

const nomes = ["Arroz tipo 1 5 kg", "Feijão carioca 1 kg", "Café torrado 500 g", "Açúcar cristal 1 kg", "Óleo de soja 900 ml", "Leite integral 1 l", "Macarrão espaguete 500 g", "Farinha de trigo 1 kg"];
const produtos = (n: number): Produto[] =>
  Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    codigo: `789${String(1000000000 + i * 7919).slice(0, 10)}`,
    produto: nomes[i % nomes.length] ?? "",
    descricao: i % 3 === 0 ? "Mercearia, corredor 4" : "Mercearia",
    estoque: (i * 37) % 250,
    preco: Math.round((4.99 + ((i * 13) % 40) * 1.25) * 100) / 100,
  }));

// o componente é genérico: a história fixa o tipo da linha para os args conferirem com as colunas
const GradeDeProdutos = DataGrid<Produto>;

const meta = {
  title: "Dados/DataGrid",
  component: GradeDeProdutos,
  args: { columns: colunas, defaultRows: produtos(12), height: 420, "aria-label": "Estoque e preços" },
  parameters: {
    docs: {
      description: {
        component:
          "Edição em massa, como uma planilha (só computador). Setas, Tab, Home/End e Ctrl+Home/End andam; Enter, F2 ou digitar editam; Enter grava e desce, Tab grava e vai à direita, Esc cancela; Shift+setas seleciona; Ctrl+C e Ctrl+V copiam e colam do Excel; Delete limpa; Ctrl+Z desfaz e Ctrl+Shift+Z ou Ctrl+Y refaz.",
      },
    },
  },
} satisfies Meta<typeof GradeDeProdutos>;
export default meta;
type Story = StoryObj<typeof meta>;

function Controlado() {
  const [rows, setRows] = useState(() => produtos(12));
  const [ultima, setUltima] = useState<DataGridChange<Produto>[]>([]);
  return (
    <Stack gap="sm">
      <DataGrid
        aria-label="Estoque e preços"
        columns={colunas}
        rows={rows}
        height={420}
        onChange={(novas, changes) => {
          setRows(novas);
          setUltima(changes);
        }}
      />
      <Text size="sm" color="text2">
        {ultima.length ? `Última mudança: ${String(ultima.length)} célula(s), ${ultima.map((c) => `${c.key} da linha ${String(c.rowId)}`).slice(0, 3).join(", ")}` : "Nenhuma mudança ainda"}
      </Text>
    </Stack>
  );
}

export const Produtos: Story = { name: "Produtos (controlado)", render: () => <Controlado /> };

export const DezMil: Story = { name: "10.000 linhas", args: { defaultRows: produtos(10_000), height: 520, "aria-label": "Estoque de 10.000 produtos" } };
