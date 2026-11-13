import { Grid } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bloco } from "./_demo";

const meta = {
  title: "Layout/Grid",
  component: Grid,
} satisfies Meta<typeof Grid>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TelaDoComputador: Story = {
  name: "12 colunas, como as telas do computador",
  render: (args) => (
    <Grid {...args}>
      <Grid.Col span={12}><Bloco>span 12</Bloco></Grid.Col>
      <Grid.Col span={8}><Bloco>span 8</Bloco></Grid.Col>
      <Grid.Col span={4}><Bloco>span 4</Bloco></Grid.Col>
      <Grid.Col span={5}><Bloco>span 5</Bloco></Grid.Col>
      <Grid.Col span={7}><Bloco>span 7</Bloco></Grid.Col>
      <Grid.Col span={4}><Bloco>span 4</Bloco></Grid.Col>
      <Grid.Col span={4}><Bloco>span 4</Bloco></Grid.Col>
      <Grid.Col span={4}><Bloco>span 4</Bloco></Grid.Col>
    </Grid>
  ),
};

export const PorPontoDeQuebra: Story = {
  name: "span por ponto de quebra: 12 → 6 (768) → 4 (1280)",
  render: (args) => (
    <Grid {...args}>
      {[1, 2, 3, 4, 5, 6].map((i) => <Grid.Col key={i} span={{ base: 12, sm: 6, lg: 4 }}><Bloco>Coluna {i}</Bloco></Grid.Col>)}
    </Grid>
  ),
};

export const OutrasColunasEEspaco: Story = {
  name: "6 colunas e gap 3 (12)",
  args: { columns: 6, gap: 3 },
  render: (args) => (
    <Grid {...args}>
      <Grid.Col span={2}><Bloco>2</Bloco></Grid.Col>
      <Grid.Col span={4}><Bloco>4</Bloco></Grid.Col>
      <Grid.Col><Bloco>sem span: a linha toda</Bloco></Grid.Col>
    </Grid>
  ),
};
