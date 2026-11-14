import { Badge, Button, Card, Group, Select, SimpleGrid, SkeletonMask, Stack, Table, Tabs, Text, TextInput, Title } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const lojas = [
  { nome: "Lume Jardins", cidade: "Fortaleza", entradas: 1102 },
  { nome: "Lume Orla", cidade: "Fortaleza", entradas: 980 },
  { nome: "Lume Centro", cidade: "Sobral", entradas: 640 },
];

const meta = {
  title: "Feedback/SkeletonMask",
  component: SkeletonMask,
  args: { visible: true, animate: true },
  parameters: {
    docs: {
      description: {
        component:
          "O \"Carregando\" no formato exato da tela: os filhos de verdade (com dados de exemplo) viram os blocos do Skeleton, no mesmo lugar e tamanho; os cartões ficam. Troque `visible` para ver que nada pula.",
      },
    },
  },
} satisfies Meta<typeof SkeletonMask>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FormularioETabela: Story = {
  name: "Formulário e tabela no cartão",
  render: (a) => (
    <SkeletonMask {...a}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={4}>
        <Card>
          <Group justify="space-between">
            <Title order={3}>Nova meta</Title>
            <Badge>parcial</Badge>
          </Group>
          <Tabs defaultValue="dia">
            <Tabs.List aria-label="Período">
              <Tabs.Tab value="dia">Dia</Tabs.Tab>
              <Tabs.Tab value="semana">Semana</Tabs.Tab>
              <Tabs.Tab value="mes">Mês</Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <Stack gap="md">
            <TextInput label="Nome da meta" defaultValue="Entradas de dezembro" />
            <Select label="Loja" data={lojas.map((l) => l.nome)} defaultValue="Lume Orla" />
            <Text size="sm" color="text2">A meta vale para todos os dias do período.</Text>
          </Stack>
          <Group justify="flex-end">
            <Button variant="outline">Cancelar</Button>
            <Button>Salvar</Button>
          </Group>
        </Card>
        <Card>
          <Title order={3}>Entradas hoje</Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Loja</Table.Th>
                <Table.Th>Cidade</Table.Th>
                <Table.Th numeric>Entradas</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {lojas.map((l) => (
                <Table.Tr key={l.nome}>
                  <Table.Th scope="row">{l.nome}</Table.Th>
                  <Table.Td>{l.cidade}</Table.Td>
                  <Table.Td numeric>{l.entradas.toLocaleString("pt-BR")}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </SimpleGrid>
    </SkeletonMask>
  ),
};

export const SemPulsar: Story = { ...FormularioETabela, name: "Sem pulsar", args: { visible: true, animate: false } };
