import { SearchInput, Stack, Text, type SearchInputProps } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = { title: "Campos/SearchInput", component: SearchInput, args: { placeholder: "Nome, cidade ou código" } } satisfies Meta<typeof SearchInput>;
export default meta;
type Story = StoryObj<typeof meta>;

/** O do mockup (W-Lojas, M-Lojas): sem rótulo à vista; o nome "Buscar" vai para o leitor de tela. */
export const Padrao: Story = {};
export const ComTexto: Story = { name: "Com texto (×)", args: { defaultValue: "Lume" } };
export const AtalhoBarra: Story = { name: "Atalho /", args: { shortcut: "/" } };
export const AtalhoCtrlK: Story = { name: "Atalho Ctrl+K", args: { shortcut: "mod+K" } };
export const ComRotulo: Story = { name: "Com rótulo", args: { label: "Lojas", description: "Busca pelo nome, pela cidade ou pelo código." } };
export const Contorno: Story = { name: "Sobre cartão (outline)", args: { variant: "outline" } };
export const ComErro: Story = { name: "Com erro", args: { defaultValue: "%", error: "Use letras ou números" } };
export const Desligado: Story = { args: { disabled: true, defaultValue: "Lume" } };

const lojas = ["Lume Jardins", "Lume Moema", "Lume Pinheiros", "Casa Aurora Centro", "Casa Aurora Savassi"];

function BuscaNaLista(args: SearchInputProps) {
  const [busca, setBusca] = useState("");
  const achadas = lojas.filter((l) => l.toLowerCase().includes(busca.toLowerCase()));
  return (
    <Stack gap="sm">
      <SearchInput {...args} debounce={300} shortcut="/" onSearch={setBusca} />
      {achadas.map((l) => <Text key={l}>{l}</Text>)}
      {achadas.length === 0 && <Text color="text2">Nada encontrado</Text>}
    </Stack>
  );
}
/** onSearch com debounce de 300 ms: a lista só filtra quando a digitação para. */
export const NaLista: Story = { name: "Busca no topo da lista (debounce)", render: (args) => <BuscaNaLista {...args} /> };
