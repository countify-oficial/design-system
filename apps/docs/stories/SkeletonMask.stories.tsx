import {
  ActionIcon, Avatar, Badge, Button, Card, Checkbox, Chip, EmptyState, Fieldset, Group, HelpTip, Icon, Kbd, NumberInput, Pagination, Progress, Radio, RangeSlider,
  Section, SegmentedControl, Select, SimpleGrid, SkeletonMask, Slider, Stack, Switch, Table, Tabs, Text, TextInput, Title, Tooltip,
} from "@countify-oficial/core";
import { DateInput } from "@countify-oficial/dates";
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

const grupos = ["ADMINISTRAÇÃO", "AUDITORIA", "CAIXA LOJA"];

/** Os casos que a máscara precisa cobrir: texto em bloco, escolhas, ícones, seções dos campos e uma prévia desenhada. */
export const Controles: Story = {
  name: "Textos, escolhas e ícones",
  render: (a) => (
    <SkeletonMask {...a}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={4}>
        <Card>
          <Section title="Totais do período" help="Soma das impressões concluídas." aside={<Button variant="outline" size="sm" leftSection={<Icon name="refresh" />}>Atualizar</Button>}>
            <Text>Impressões concluídas no período escolhido.</Text>
            <Text size="sm" color="text2">
              Um texto longo que quebra em mais de uma linha continua com a largura toda, porque o texto ocupa a largura toda nas linhas de cima.
            </Text>
          </Section>
          <SegmentedControl aria-label="Período" data={["Hoje", "7 dias", "30 dias"]} defaultValue="7 dias" />
          <Group gap="md">
            <DateInput label="De" defaultValue={new Date(2026, 10, 1)} />
            <NumberInput label="Etiquetas" defaultValue={12} min={0} />
            <Select label="Filial" data={["Lume Orla", "Lume Centro"]} defaultValue="Lume Orla" />
          </Group>
          <Chip.Group label="Situação" multiple defaultValue={["concluida"]}>
            <Chip value="concluida">Concluída</Chip>
            <Chip value="erro">Com erro</Chip>
          </Chip.Group>
          <Group gap="lg" align="flex-start">
            <Stack gap="sm">
              <Checkbox label="Imprimir a data" description="Sai no canto da etiqueta" defaultChecked />
              <Checkbox label="Só promoções" />
              <Switch label="Completar a fileira" defaultChecked />
              <Switch label="Cortar ao final" />
            </Stack>
            <Radio.Group label="Ordem" defaultValue="nome">
              <Radio value="nome" label="Nome" />
              <Radio value="codigo" label="Código" />
            </Radio.Group>
          </Group>
          <Slider label="Escala" defaultValue={40} />
          <RangeSlider defaultValue={[8, 18]} min={0} max={24} labels={["Abre", "Fecha"]} />
          <Progress value={64} marker={80} aria-label="Fila" />
          <Group justify="space-between">
            <Group gap="sm">
              <Badge variant="dot" color="up">Ligada</Badge>
              <Badge>parcial</Badge>
              <Badge variant="filled" color="down">3</Badge>
              <Avatar name="Koji Yamamoto" />
              <Avatar />
            </Group>
            <Group gap="sm">
              <ActionIcon aria-label="Editar"><Icon name="edit" /></ActionIcon>
              <ActionIcon aria-label="Filtrar" variant="default"><Icon name="filter" /></ActionIcon>
              <ActionIcon aria-label="Excluir" variant="filled"><Icon name="trash" /></ActionIcon>
              <Tooltip label="Ajuda"><ActionIcon aria-label="Ajuda" radius="xl"><Icon name="help" /></ActionIcon></Tooltip>
            </Group>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Imprimir <Kbd>F9</Kbd></Text>
            <Button leftSection={<Icon name="printer" />}>Imprimir</Button>
          </Group>
        </Card>
        <Stack gap="md">
          <Card>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Grupo</Table.Th>
                  <Table.Th><Group gap={1} wrap={false}>Visualizar <HelpTip label="Ajuda: Visualizar">Vê os layouts.</HelpTip></Group></Table.Th>
                  <Table.Th><Group gap={1} wrap={false}>Editar <HelpTip label="Ajuda: Editar">Muda e publica.</HelpTip></Group></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {grupos.map((g, i) => (
                  <Table.Tr key={g}>
                    <Table.Th scope="row">{g}</Table.Th>
                    <Table.Td><Checkbox aria-label={`${g}: visualizar`} defaultChecked /></Table.Td>
                    <Table.Td><Checkbox aria-label={`${g}: editar`} defaultChecked={i === 0} indeterminate={i === 1} /></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            <Group justify="space-between">
              <Text size="sm" color="text2">1–3 de 40</Text>
              <Pagination total={14} defaultValue={2} />
            </Group>
          </Card>
          <Card>
            <Fieldset legend="Etiqueta">
              <dl>
                <dt>Tamanho</dt>
                <dd>50 × 30 mm</dd>
              </dl>
              <label><input type="checkbox" defaultChecked /> Etiqueta têxtil (caixa do sistema)</label>
              <figure style={{ margin: 0 }}>
                {/* uma prévia desenhada com caixas (o código de barras é um degradê): role="img" vira um bloco só */}
                <div role="img" aria-label="Prévia da etiqueta" style={{ width: 200, height: 120, padding: 12, background: "#fff", boxSizing: "border-box" }}>
                  <span style={{ fontWeight: 700 }}>ORGANIZADOR PLÁSTICO</span>
                  <div style={{ height: 40, marginTop: 8, background: "repeating-linear-gradient(90deg, #000 0 2px, #fff 2px 4px)" }} />
                </div>
                <figcaption>produto de exemplo</figcaption>
              </figure>
            </Fieldset>
          </Card>
          <Card>
            <EmptyState icon={<Icon name="tag" size="lg" />} title="Nenhum produto na lista" description="Pesquise acima para começar." />
          </Card>
        </Stack>
      </SimpleGrid>
    </SkeletonMask>
  ),
};

/** Direto no fundo da página, como Impressões e Etiquetas do countify-label: filtros, campos, cartões de número e a busca. */
export const NaPagina: Story = {
  name: "Filtros e números no fundo da página",
  render: (a) => (
    <SkeletonMask {...a}>
      <Stack gap="lg">
        <Group align="flex-end" gap="md">
          <DateInput label="De" defaultValue={new Date(2026, 10, 1)} />
          <DateInput label="Até" defaultValue={new Date(2026, 10, 14)} />
          <SegmentedControl aria-label="Período" data={["Hoje", "7 dias", "30 dias"]} defaultValue="Hoje" />
          <Select label="Filial" data={["Lume Orla", "Lume Centro"]} defaultValue="Lume Orla" style={{ flex: 1 }} />
          <TextInput label="Buscar" leftSection={<Icon name="search" />} placeholder="Etiqueta ou usuário" />
        </Group>
        <Section title="Totais do período" help="Soma das impressões concluídas.">
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg">
            {[["Impressões concluídas", "1.524"], ["Etiquetas impressas", "5.623"], ["Produtos distintos (SKUs)", "1.934"], ["Não concluídas", "3"]].map(([rotulo, numero], i) => (
              <Card key={rotulo} padding="lg" gap={1}>
                <Text size="sm" color="text2">{rotulo}</Text>
                <Title order={3} size="number">{numero}</Title>
                {i === 3 && <Text size="sm" color="text2">3 canceladas · 0 erros</Text>}
              </Card>
            ))}
          </SimpleGrid>
        </Section>
        <Card>
          <Text color="text2" align="center">Sem dados no período.</Text>
        </Card>
        <Stack gap="md">
          <Radio.Group label="Pesquisar por" orientation="row" gap="lg" defaultValue="barras">
            <Radio value="barras" label="Código de barras" />
            <Radio value="produto" label="Produto" />
            <Radio value="referencia" label="Referência" />
          </Radio.Group>
          <Group align="flex-end" gap={3} wrap={false}>
            <TextInput label="Código" placeholder="Leia ou digite o código" defaultValue="4549131000023" style={{ flexGrow: 1 }} />
            <Button variant="outline" leftSection={<Icon name="search" />}>Pesquisar</Button>
          </Group>
        </Stack>
      </Stack>
    </SkeletonMask>
  ),
};
