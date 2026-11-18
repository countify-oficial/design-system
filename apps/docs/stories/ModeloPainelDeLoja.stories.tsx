import { ChartLegend, Heatmap, LineChart } from "@countify-oficial/charts";
import {
  Button, Card, Container, Divider, FilterChip, Grid, Group, Icon, Meter, PageHeader, Section, SimpleGrid, Stack, StatCard, Text,
} from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

// o painel de uma loja, como o W-Hoje do mockup: indicadores, fluxo de pessoas, meta do mês e horários mais cheios
const horas = ["8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h"];
const real = [14, 26, 34, 42, 38, 20, 12, null, null, null, null, null, null];
const previsto = [12, 22, 30, 34, 38, 30, 27, 30, 34, 42, 46, 38, 30];
const faixa: [number[], number[]] = [previsto.map((v) => v * 0.85), previsto.map((v) => v * 1.15)];
const dias = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
const colunas = ["9h", "", "", "12h", "", "", "15h", "", "", "18h", "", ""];
const cheios = dias.map((_, d) => colunas.map((_, h) => (d === 6 && h < 3 ? null : Math.round(10 + 40 * Math.sin((h / 11) * Math.PI) + d * 4))));

function PainelDeLoja() {
  return (
    <Container style={{ paddingBlock: "var(--cf-space-6)" }}>
      <Stack gap="lg">
        <PageHeader title="Lume Orla Fortaleza">
          <FilterChip>Hoje</FilterChip>
          <FilterChip>vs. qua. passada</FilterChip>
          <Button variant="outline" leftSection={<Icon name="chart-bar" size="sm" />}>Vendas em detalhe</Button>
          <Button variant="outline" leftSection={<Icon name="edit" size="sm" />}>Editar</Button>
        </PageHeader>
        <Text size="sm" color="text2" style={{ marginTop: "calc(var(--cf-space-4) * -1)" }}>Aberta agora · fecha às 20:00</Text>

        <SimpleGrid cols={{ base: 2, sm: 3, lg: 5 }}>
          <StatCard label="Entradas" value="186" unit="pessoas" diff={8} diffLabel="vs. qua." />
          <StatCard label="Saídas" value="161" />
          <StatCard label="Dentro agora" value="25" />
          <StatCard label="Conversão" value="13,9" unit="%" diff={1} diffFormat={(n) => `${n.toFixed(1).replace(".", ",")} pt`} diffLabel="vs. qua." />
          <StatCard label="Vendas" value="25" unit="tickets" diff={14} diffLabel="vs. qua." />
        </SimpleGrid>
        <SimpleGrid cols={{ base: 2, lg: 4 }}>
          <StatCard label="Faturamento" prefix="R$" value="3.950" description="79 peças" diff={12} diffLabel="vs. qua." />
          <StatCard label="Ticket médio" prefix="R$" value="158" description="3,2 peças" diff={-3} diffLabel="vs. qua." />
          <StatCard label="Venda por m²" prefix="R$" value="32,92" description="0,7 peça" diff={12} diffLabel="vs. qua." />
          <StatCard label="Venda por expositor" prefix="R$" value="98,75" description="2,0 peças" diff={12} diffLabel="vs. qua." />
        </SimpleGrid>

        <Grid gap="lg">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Section title="Fluxo de pessoas" help="O previsto é a média das quatro últimas semanas no mesmo dia e hora." aside="previsto no dia 375">
              <Card>
                <Stack>
                  <Text weight="medium">Entradas por hora</Text>
                  <LineChart labels={horas} actual={real} forecast={previsto} band={faixa} partial={6} now={6} labelEvery={2} aria-label="Entradas por hora: 186 até as 14h, previsto no dia 375" />
                  <ChartLegend items={[{ label: "Real" }, { label: "Previsto", type: "dashed" }, { label: "Faixa normal", type: "band" }]} />
                </Stack>
              </Card>
            </Section>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="lg">
              <Section title="Meta de novembro" help="A meta do mês cadastrada em Ajustes. O traço na barra é onde a loja deveria estar hoje.">
                <Card>
                  <Stack>
                    <Meter
                      label="Faturamento"
                      value={71400}
                      max={180000}
                      marker={66000}
                      startLabel={<>R$ 71.400 <Text component="span" size="sm" color="text2">de R$ 180.000</Text></>}
                      endLabel="dia 11 de 30"
                      footer="1.428 peças vendidas no mês"
                      valueText="Alcançado 39,7% da meta. Até hoje, dia 11 de 30, o esperado era 36,7%."
                    />
                    <Divider />
                    <Group justify="space-between">
                      <Text size="sm" color="text2">Projeção para 30/11</Text>
                      <Text weight="bold">R$ 194.700 <Text component="span" size="sm" color="up">▲ 108%</Text></Text>
                    </Group>
                  </Stack>
                </Card>
              </Section>
              <Section title="Horários mais cheios" help="Entradas por dia da semana e hora, nas últimas quatro semanas." aside="4 semanas">
                <Card>
                  <Heatmap rows={dias} columns={colunas} values={cheios} aria-label="Horários mais cheios nas últimas quatro semanas" />
                </Card>
              </Section>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

const meta = {
  title: "Modelos/Painel de loja",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Tela inteira montada só com componentes do design system, como o W-Hoje do mockup: PageHeader com FilterChip, StatCard em duas fileiras, " +
          "LineChart com previsto e faixa normal, Meter da meta do mês e Heatmap dos horários. Use como ponto de partida e troque os dados pelos da API.",
      },
    },
  },
} satisfies Meta;
export default meta;

export const Painel: StoryObj = { name: "Painel (W-Hoje)", render: () => <PainelDeLoja /> };
