import { Checkbox, Paper, Stack, selectAllState } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = { title: "Escolhas/Checkbox", component: Checkbox, args: { label: "Lume Jardins" } } satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const Estados: Story = {
  render: (a) => (
    <Stack>
      <Checkbox {...a} defaultChecked label="Marcada" />
      <Checkbox {...a} indeterminate label="Meio marcada" />
      <Checkbox {...a} disabled label="Lume Aldeota" description="Sem acesso" />
      <Checkbox {...a} error="Escolha pelo menos uma loja" label="Com erro" />
    </Stack>
  ),
};

const lojas = [{ v: "jardins", l: "Lume Jardins" }, { v: "orla", l: "Lume Orla" }, { v: "centro", l: "Lume Centro" }];
function SelecionarTodos() {
  const [marcadas, setMarcadas] = useState<string[]>(["jardins"]);
  const todas = lojas.map((l) => l.v);
  const estado = selectAllState(todas, marcadas);
  return (
    <Paper withBorder style={{ padding: "var(--cf-space-4)", maxWidth: "var(--cf-side-panel-width)" }}>
      <Stack>
        <Checkbox label="Selecionar todos" checked={estado === "all"} indeterminate={estado === "some"} onChange={() => setMarcadas(estado === "all" ? [] : todas)} />
        <Checkbox.Group value={marcadas} onChange={setMarcadas} label="Lojas" style={{ paddingInlineStart: "var(--cf-space-6)" }}>
          {lojas.map((l) => <Checkbox key={l.v} value={l.v} label={l.l} />)}
        </Checkbox.Group>
      </Stack>
    </Paper>
  );
}
export const ListaComCaixas: Story = { name: "Lista com caixas (mockup)", render: () => <SelecionarTodos /> };
