import { Button, DataTable, EmptyState, Group, Icon, NumberFormatter, Progress, Text, type DataTableColumn, type DataTableSort } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";


// W-Indicadores, "Por categoria"
interface Categoria {
  nome: string;
  faturamento: number;
  participacao: number;
  pecas: number | null;
  expositores: number | null;
  porExpositor: number | null;
  vsMedia: number | null;
}
const categorias: Categoria[] = [
  { nome: "Cozinha", faturamento: 1520, participacao: 38, pecas: 31, expositores: 12, porExpositor: 126.67, vsMedia: 1.3 },
  { nome: "Papelaria", faturamento: 1110, participacao: 28, pecas: 14, expositores: 8, porExpositor: 138.75, vsMedia: 1.4 },
  { nome: "Utilidades", faturamento: 640, participacao: 16, pecas: 15, expositores: 9, porExpositor: 71.11, vsMedia: 0.7 },
  { nome: "Brinquedos", faturamento: 410, participacao: 10, pecas: 11, expositores: 7, porExpositor: 58.57, vsMedia: 0.6 },
  { nome: "Beleza", faturamento: 230, participacao: 6, pecas: 8, expositores: 4, porExpositor: 57.5, vsMedia: 0.6 },
  { nome: "Sem categoria", faturamento: 40, participacao: 1, pecas: null, expositores: null, porExpositor: null, vsMedia: null },
];
const reais = (v: number, casas = 0) => <NumberFormatter value={v} prefix="R$ " decimalScale={casas} fixedDecimalScale />;
const colunasCategoria: DataTableColumn<Categoria>[] = [
  { key: "nome", title: "Categoria", sortable: true },
  { key: "faturamento", title: "Faturamento", numeric: true, sortable: true, render: (c) => reais(c.faturamento) },
  {
    key: "participacao",
    title: "Participação",
    numeric: true,
    sortable: true,
    width: "20%",
    render: (c) => (
      <Group gap={3} justify="flex-end" wrap={false}>
        {/* a porcentagem ao lado já diz o valor: a barra é só desenho */}
        {c.pecas !== null && <Progress value={c.participacao} aria-hidden style={{ flex: 1 }} />}
        <span>{c.participacao}%</span>
      </Group>
    ),
  },
  { key: "pecas", title: "Peças", numeric: true, sortable: true },
  { key: "expositores", title: "Expositores", numeric: true, sortable: true },
  { key: "porExpositor", title: "Venda por expositor", numeric: true, sortable: true, render: (c) => (c.porExpositor === null ? "—" : reais(c.porExpositor, 2)) },
  {
    key: "vsMedia",
    title: "vs. média",
    numeric: true,
    sortable: true,
    render: (c) =>
      c.vsMedia === null ? "—" : (
        <Text component="span" inherit color={c.vsMedia >= 1 ? "up" : "down"}>
          {c.vsMedia >= 1 ? "▲" : "▼"} <NumberFormatter value={c.vsMedia} decimalScale={1} fixedDecimalScale suffix="×" />
        </Text>
      ),
  },
];

const meta = {
  title: "Dados/DataTable",
  component: DataTable<Categoria>,
  args: { columns: colunasCategoria, rows: categorias, getRowId: (c) => c.nome, "aria-label": "Por categoria" },
  parameters: {
    docs: {
      description: {
        component:
          "Tabela pronta: recebe colunas e linhas e resolve ordenação, seleção com barra de ações, paginação, carregando e vazio. " +
          "Só no computador: no celular, a identidade troca a tabela por lista (NavLink, DataList), com os campos juntos na linha.",
      },
    },
  },
} satisfies Meta<typeof DataTable<Categoria>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PorCategoria: Story = {
  name: "Números, participação e variação (W-Indicadores)",
  args: { defaultSort: { key: "faturamento", direction: "descending" } },
};

// W-Lojas, "Estabelecimentos"
interface Loja {
  id: string;
  nome: string;
  cidade: string;
  grupos: string;
  ativa: boolean;
}
const lojas: Loja[] = [
  ["Farol Jardins Ribeirão", "Ribeirão Preto · SP", ""],
  ["Farol Centro Ribeirão", "Ribeirão Preto · SP", ""],
  ["Trilha Parque Maceió", "Maceió · AL", ""],
  ["Lume Bosque Belém", "Belém · PA", "Lume, Lume Norte"],
  ["Lume Jardins Bosque", "Fortaleza · CE", "Lume, Lume Nordeste"],
  ["Lume Ilha", "São Luís · MA", "Lume, Lume Nordeste"],
  ["Lume Centro Maceió", "Maceió · AL", "Lume, Lume Nordeste"],
  ["Lume Centro Natal", "Natal · RN", "Lume, Lume Nordeste"],
  ["Lume Parque", "Belém · PA", "Lume, Lume Norte"],
  ["Lume Praça Belém", "Belém · PA", "Lume, Lume Norte"],
  ["Brisa Orla", "Fortaleza · CE", "Brisa"],
  ["Brisa Aldeota", "Fortaleza · CE", "Brisa"],
].map(([nome = "", cidade = "", grupos = ""], i) => ({ id: String(i + 1), nome, cidade, grupos, ativa: i !== 6 }));
const colunasLoja: DataTableColumn<Loja>[] = [
  { key: "nome", title: "Estabelecimento", sortable: true },
  { key: "cidade", title: "Cidade", sortable: true },
  { key: "grupos", title: "Grupos" },
  {
    key: "ativa",
    title: "Vendas",
    sortable: true,
    compare: (a, b) => Number(b.ativa) - Number(a.ativa),
    render: (l) => (
      <Text component="span" inherit color={l.ativa ? "up" : "text2"}>
        {l.ativa ? "● Ativa" : "Pausada"}
      </Text>
    ),
  },
];

function Selecao() {
  const [escolhidas, setEscolhidas] = useState<string[]>([]);
  const [aberta, setAberta] = useState<Loja | null>(null);
  return (
    <>
      <DataTable
        columns={colunasLoja}
        rows={lojas}
        getRowId={(l) => l.id}
        aria-label="Estabelecimentos"
        pageSize={5}
        selectable
        selectedIds={escolhidas}
        onSelectedIdsChange={setEscolhidas}
        onRowClick={setAberta}
        actions={
          <>
            <Button size="sm" variant="subtle">Mover para grupo</Button>
            <Button size="sm" variant="subtle" color="down" onClick={() => setEscolhidas([])}>Excluir</Button>
          </>
        }
      />
      <Text size="sm" color="text2">{aberta ? `Aberta: ${aberta.nome}` : "Clique numa linha para abrir o detalhe."}</Text>
    </>
  );
}
export const Selecionavel: Story = { name: "Seleção, barra de ações, paginação e linha clicável (W-Lojas)", render: () => <Selecao /> };

export const CabecalhoFixo: Story = {
  name: "Cabeçalho fixo, listrada e legenda",
  render: () => <DataTable columns={colunasLoja} rows={lojas} getRowId={(l) => l.id} caption="88 estabelecimentos · 4 grupos" maxHeight={260} stickyHeader stickyFirstColumn striped />,
};

export const Carregando: Story = {
  name: "Carregando",
  render: () => <DataTable columns={colunasLoja} rows={[]} getRowId={(l) => l.id} aria-label="Estabelecimentos" loading pageSize={5} selectable />,
};

export const Vazia: Story = { name: "Vazia (texto padrão)", render: () => <DataTable columns={colunasLoja} rows={[]} getRowId={(l) => l.id} aria-label="Estabelecimentos" /> };

export const VaziaDoApp: Story = {
  name: "Vazia (EmptyState do app)",
  render: () => (
    <DataTable
      columns={colunasLoja}
      rows={[]}
      getRowId={(l) => l.id}
      aria-label="Estabelecimentos"
      emptyState={
        <EmptyState icon={<Icon name="search" />} title="Nenhum estabelecimento encontrado" description="Tente outro nome, cidade ou código.">
          <Button variant="dashed">+ Novo estabelecimento</Button>
        </EmptyState>
      }
    />
  ),
};

// paginação e ordenação no servidor: a página atual vem de uma "busca" que demora
function NoServidor() {
  const [sort, setSort] = useState<DataTableSort | null>({ key: "nome", direction: "ascending" });
  const [page, setPage] = useState(1);
  const pedido = JSON.stringify([sort, page]);
  const [resposta, setResposta] = useState<{ pedido: string; rows: Loja[]; total: number } | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const sinal = sort?.direction === "descending" ? -1 : 1;
      const todas = sort ? [...lojas].sort((a, b) => sinal * a[sort.key as "nome"].localeCompare(b[sort.key as "nome"], "pt-BR")) : lojas;
      setResposta({ pedido, rows: todas.slice((page - 1) * 4, page * 4), total: todas.length });
    }, 600);
    return () => clearTimeout(t);
  }, [pedido, sort, page]);
  const pronta = resposta?.pedido === pedido ? resposta : null;
  return (
    <DataTable
      columns={colunasLoja.slice(0, 3)}
      rows={pronta?.rows ?? []}
      total={resposta?.total ?? lojas.length}
      loading={!pronta}
      getRowId={(l) => l.id}
      aria-label="Estabelecimentos"
      manual
      pageSize={4}
      page={page}
      onPageChange={setPage}
      sort={sort}
      onSortChange={setSort}
    />
  );
}
export const Servidor: Story = { name: "Paginação e ordenação no servidor (manual)", render: () => <NoServidor /> };
