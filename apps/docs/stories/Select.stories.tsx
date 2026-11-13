import { Autocomplete, Button, ComboboxPopover, Icon, MultiSelect, Select, Stack, TagsInput } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const cidades = [{ group: "Ceará", items: ["Fortaleza", "Sobral", "Juazeiro do Norte"] }, { group: "São Paulo", items: ["São Paulo", "Campinas", { value: "santos", label: "Santos (sem lojas)", disabled: true }] }];
const lojas = ["Lume Jardins", "Lume Orla", "Lume Aldeota", "Lume Centro", "Lume Meireles"];

const meta = { title: "Combobox/Select", component: Select, args: { label: "Cidade", placeholder: "Escolha a cidade", data: cidades }, decorators: [(S) => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><S /></div>] } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const ComBusca: Story = { name: "Com busca (searchable) e limpar", args: { searchable: true, clearable: true, defaultValue: "Sobral" } };
export const ComErro: Story = { args: { error: "Escolha uma cidade" } };
export const Varios: Story = { name: "MultiSelect", render: () => <MultiSelect label="Lojas" placeholder="Escolha as lojas" data={lojas} clearable defaultValue={["Lume Jardins"]} /> };
export const Sugestoes: Story = { name: "Autocomplete", render: () => <Autocomplete label="Loja" placeholder="Comece a digitar" data={lojas} /> };
export const Etiquetas: Story = { name: "TagsInput", render: () => <TagsInput label="Categorias" placeholder="Digite e aperte Enter" data={["Calçados", "Acessórios", "Bolsas"]} defaultValue={["Calçados"]} clearable /> };

function ChipDeFiltro() {
  const [valor, setValor] = useState<string | null>("Hoje");
  return (
    <ComboboxPopover data={["Hoje", "Ontem", "Últimos 7 dias", "Este mês"]} value={valor} onChange={setValor}>
      <Button variant="outline" size="sm" rightSection={<Icon name="chevron-down" size="xs" />}>{valor ?? "Período"}</Button>
    </ComboboxPopover>
  );
}
export const Filtro: Story = { name: "ComboboxPopover (o chip de filtro)", render: () => <Stack align="flex-start"><ChipDeFiltro /></Stack> };
