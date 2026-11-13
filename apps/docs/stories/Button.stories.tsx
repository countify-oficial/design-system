import { Button, Group, Icon, Stack, Text, type ButtonColor, type ButtonVariant } from "@countify-oficial/core";
import type { Size } from "@countify-oficial/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = {
  title: "Botões/Button",
  component: Button,
  args: { children: "Salvar", onClick: fn() },
  parameters: { docs: { description: { component: "Principal: um por tela. Excluir: cor de queda e confirmação. Tracejado: adicionar." } } },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

const variantes: ButtonVariant[] = ["filled", "outline", "subtle", "dashed"];
const cores: ButtonColor[] = ["accent", "down", "up", "warn"];
const tamanhos: Size[] = ["xs", "sm", "md", "lg", "xl"];

export const Padrao: Story = { name: "Padrão (md no celular, sm a partir de 768)" };

export const DaIdentidade: Story = {
  name: "Os quatro da identidade",
  render: () => (
    <Stack style={{ maxWidth: "var(--cf-side-panel-width)" }}>
      <Button fullWidth>Salvar</Button>
      <Button fullWidth variant="outline">Cancelar</Button>
      <Button fullWidth variant="subtle" color="down">Excluir análise</Button>
      <Button fullWidth variant="dashed" leftSection={<Icon name="plus" size="sm" />}>Adicionar bloco</Button>
    </Stack>
  ),
};

export const VariantesECores: Story = {
  name: "Variantes × cores",
  render: (args) => (
    <Stack>
      {variantes.map((v) => (
        <Group key={v}>
          <Text component="span" size="sm" color="text2" style={{ width: "calc(var(--cf-list-row-height) * 1.2)" }}>{v}</Text>
          {cores.map((c) => <Button key={c} {...args} variant={v} color={c}>{c}</Button>)}
        </Group>
      ))}
    </Stack>
  ),
};

export const Tamanhos: Story = { render: (args) => <Group>{tamanhos.map((s) => <Button key={s} {...args} size={s}>{s}</Button>)}</Group> };

export const Estados: Story = {
  render: (args) => (
    <Group>
      <Button {...args}>Normal</Button>
      <Button {...args} disabled>Desativado</Button>
      <Button {...args} loading>Salvando</Button>
      <Button {...args} variant="outline" loading>Carregando</Button>
    </Group>
  ),
};

export const ComIcones: Story = {
  name: "Com ícones (seções)",
  render: (args) => (
    <Group>
      <Button {...args} leftSection={<Icon name="download" size="sm" />}>Baixar</Button>
      <Button {...args} variant="outline" rightSection={<Icon name="chevron-right" size="sm" />}>Continuar</Button>
    </Group>
  ),
};

export const ComoLink: Story = { name: "Como link", args: { component: "a", href: "#analises", variant: "subtle", children: "Ver análises" } };
