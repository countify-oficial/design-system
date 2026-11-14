import { ActionIcon, Button, FilterChip, HelpTip, Icon, Menu, PageHeader, Paper, Section, Stack, Table, TextInput } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

const meta = {
  title: "Layout/PageHeader",
  component: PageHeader,
  args: { title: "Layouts" },
} satisfies Meta<typeof PageHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SoTitulo: Story = { name: "Só o título" };

export const ComAcoes: Story = {
  name: "Com as ações à direita (telas W-*)",
  render: (a) => (
    <PageHeader {...a}>
      <Button variant="outline">Importar arquivo</Button>
      <Button leftSection={<Icon name="plus" size="sm" />}>Novo layout</Button>
    </PageHeader>
  ),
};

export const ComVoltar: Story = {
  name: "Com o voltar: link no computador, seta no celular",
  args: { title: "Usuário", backLabel: "Ajustes", onBack: fn() },
  render: (a) => (
    <PageHeader {...a}>
      <ActionIcon variant="default" aria-label="Editar">
        <Icon name="edit" />
      </ActionIcon>
    </PageHeader>
  ),
};

export const VoltarComoLink: Story = { name: "Voltar como link (backHref)", args: { title: "Estabelecimento", backLabel: "Estabelecimentos", backHref: "#estabelecimentos" } };

export const Secao: StoryObj = {
  name: "Section: título de 20, ? e o que vai à direita",
  render: () => (
    <Stack gap="xl">
      <Section title="Fluxo de pessoas" help="O previsto é a média das quatro últimas semanas no mesmo dia e hora." aside="previsto no dia 375">
        <Paper withBorder radius="md" style={{ padding: "var(--cf-space-5)" }}>
          O gráfico vai aqui.
        </Paper>
      </Section>
      <Section title="Impressoras desta estação" help="As impressoras ligadas a este computador, cada uma com um nome." aside={<Button variant="outline">Acrescentar</Button>}>
        <Paper withBorder radius="md" style={{ padding: "var(--cf-space-5)" }}>
          A lista vai aqui.
        </Paper>
      </Section>
      <Section title="Filial" order={3}>
        <TextInput label="Filial desta estação" variant="filled" defaultValue="Lume Orla Fortaleza" />
      </Section>
    </Stack>
  ),
};

export const Ajuda: StoryObj = {
  name: "HelpTip: o ? de ajuda",
  render: () => <HelpTip label="Ajuda: Conversão">Vendas divididas pelas entradas no mesmo período. Dia sem contagem não entra na conta.</HelpTip>,
};

const MARCAS = ["Todas as marcas", "Lume", "Brisa"];

function FiltroDeMarca() {
  const [marca, setMarca] = useState("Lume");
  return (
    <Menu>
      <Menu.Target>
        <FilterChip active={marca !== MARCAS[0]}>{marca === MARCAS[0] ? "Marca · Todas" : `Marca · ${marca}`}</FilterChip>
      </Menu.Target>
      <Menu.Dropdown>
        {MARCAS.map((m) => (
          <Menu.Item key={m} onClick={() => setMarca(m)}>
            {m}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

export const ChipDeFiltro: StoryObj = {
  name: "FilterChip: neutro, com filtro aplicado, com ícone e desligado",
  render: () => (
    <Stack align="flex-start">
      <FilterChip>Hoje</FilterChip>
      <FilterChip active>Marca · Lume</FilterChip>
      <FilterChip leftSection={<Icon name="store" size="sm" />}>Lume Orla Fortaleza</FilterChip>
      <FilterChip disabled>vs. qua. passada</FilterChip>
      <FiltroDeMarca />
    </Stack>
  ),
};

export const PaginaInteira: StoryObj = {
  name: "Página: cabeçalho, filtros e tabela",
  render: () => (
    <Stack gap="lg">
      <PageHeader title="Layouts">
        <Button variant="outline">Importar arquivo</Button>
        <Button leftSection={<Icon name="plus" size="sm" />}>Novo layout</Button>
      </PageHeader>
      <Stack gap="md">
        <Stack gap="sm" style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <TextInput aria-label="Buscar layout pelo nome" placeholder="Buscar layout" variant="filled" size="sm" leftSection={<Icon name="search" size="sm" />} style={{ flexGrow: 1 }} />
          <FiltroDeMarca />
          <FilterChip>Situação · Todas</FilterChip>
        </Stack>
        <Paper withBorder radius="md">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Layout</Table.Th>
                <Table.Th>Situação</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>PREÇO - 50x30x2</Table.Td>
                <Table.Td>Publicado · versão 13</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    </Stack>
  ),
};
