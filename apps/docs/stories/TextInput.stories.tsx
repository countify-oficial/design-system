import { Icon, Stack, TextInput } from "@countify-oficial/core";
import type { Size } from "@countify-oficial/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Campos/TextInput",
  component: TextInput,
  args: { label: "E-mail", placeholder: "ana@loja.com.br" },
  parameters: { docs: { description: { component: "Rótulo sempre visível; altura 48 (mockup, “Campo e busca”). outline é para campo sobre cartão." } } },
} satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão (filled)" };
export const Contorno: Story = { name: "outline (sobre cartão)", args: { variant: "outline" } };
export const Busca: Story = { args: { label: "Buscar", placeholder: "Nome, cidade ou código", leftSection: <Icon name="search" />, type: "search" } };
export const Estados: Story = {
  render: (a) => (
    <Stack>
      <TextInput {...a} description="O e-mail de acesso à conta" />
      <TextInput {...a} required label="E-mail (obrigatório)" />
      <TextInput {...a} error="E-mail inválido" defaultValue="ana@" />
      <TextInput {...a} disabled defaultValue="ana@loja.com.br" />
    </Stack>
  ),
};
export const Tamanhos: Story = { render: (a) => <Stack>{(["xs", "sm", "md", "lg", "xl"] as Size[]).map((s) => <TextInput key={s} {...a} size={s} label={`size ${s}`} />)}</Stack> };
