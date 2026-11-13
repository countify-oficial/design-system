import { Text } from "@countify-oficial/core";
import type { ColorRole, Size } from "@countify-oficial/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Primitivos/Text",
  component: Text,
  args: { children: "Vendas de hoje na loja Centro" },
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

const tamanhos: Size[] = ["xs", "sm", "md", "lg", "xl"];
const cores: ColorRole[] = ["text", "text2", "text3", "label", "accent", "up", "down", "warn"];
const longo = "Fluxo de pessoas por hora na loja Centro, comparado com a semana anterior e com a meta do mês, ".repeat(3);

export const Padrao: Story = { name: "Padrão" };

export const Tamanhos: Story = {
  render: (args) => <>{tamanhos.map((size) => <Text key={size} {...args} size={size}>{size}: {args.children}</Text>)}</>,
};

export const Pesos: Story = {
  render: (args) => <>{(["regular", "medium", "bold"] as const).map((w) => <Text key={w} {...args} weight={w}>{w}: {args.children}</Text>)}</>,
};

export const Cores: Story = {
  render: (args) => <>{cores.map((c) => <Text key={c} {...args} color={c}>{c}: {args.children}</Text>)}</>,
};

export const Alinhamento: Story = {
  render: (args) => <>{(["start", "center", "end"] as const).map((a) => <Text key={a} {...args} align={a}>{a}</Text>)}</>,
};

export const CortarEmUmaLinha: Story = { name: "Cortar em uma linha (truncate)", args: { truncate: true, children: longo } };
export const CortarEmDuasLinhas: Story = { name: "Cortar em 2 linhas (lineClamp)", args: { lineClamp: 2, children: longo } };

export const Herdar: Story = {
  name: "Herdar a letra de fora (inherit)",
  render: () => (
    <Text size="xl" weight="bold">
      Total: <Text component="span" inherit color="up">R$ 12.400</Text>
    </Text>
  ),
};

export const OutroElemento: Story = {
  name: "Outro elemento (component)",
  render: () => (
    <>
      <Text component="h2" size="xl" weight="bold">Um &lt;h2&gt;</Text>
      <Text component="label" htmlFor="campo" color="label">Um &lt;label&gt;</Text>
      <input id="campo" />
    </>
  ),
};
