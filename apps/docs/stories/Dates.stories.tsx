import { Stack } from "@countify-oficial/core";
import { addDays, Calendar, DateInput, DatePicker, DateTimePicker, startOfMonth, TimeInput, type DatesRange } from "@countify-oficial/dates";
import type { Meta, StoryObj } from "@storybook/react-vite";

const hoje = new Date();
const ontem = addDays(hoje, -1);
const atalhos: { label: string; value: DatesRange }[] = [
  { label: "Hoje", value: [hoje, hoje] },
  { label: "Ontem", value: [ontem, ontem] },
  { label: "Últimos 7 dias", value: [addDays(hoje, -6), hoje] },
  { label: "Últimos 30 dias", value: [addDays(hoje, -29), hoje] },
  { label: "Este mês", value: [startOfMonth(hoje), hoje] },
];

const meta = {
  title: "Extensões/Dates",
  component: Calendar,
  decorators: [(S) => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><S /></div>],
  parameters: { docs: { description: { component: "O calendário do M-Periodo (o mesmo na web e no celular): dia em círculo de 40, hoje com anel, futuros apagados com maxDate." } } },
} satisfies Meta;
export default meta;
// as props de Calendar são uma união (dia ou período): as histórias usam render
type Story = StoryObj;

export const UmDia: Story = { name: "Calendar: um dia, futuros apagados", render: () => <Calendar maxDate={hoje} defaultValue={addDays(hoje, -3)} /> };
export const Periodo: Story = { name: "Calendar: período", render: () => <Calendar type="range" maxDate={hoje} defaultValue={[addDays(hoje, -8), addDays(hoje, -2)]} /> };
export const Seletor: Story = { name: "DatePicker: um dia", render: () => <DatePicker label="Vale a partir de" placeholder="Escolha o dia" /> };
export const SeletorDePeriodo: Story = {
  name: "DatePicker: período com atalhos",
  render: () => <DatePicker type="range" label="Período da análise" maxDate={hoje} presets={atalhos} defaultValue={[addDays(hoje, -6), hoje]} />,
};
export const Estados: Story = {
  name: "DatePicker: erro e desativado",
  render: () => (
    <Stack>
      <DatePicker label="Competência" error="Escolha o mês da competência" />
      <DatePicker label="Vale a partir de" disabled defaultValue={hoje} />
    </Stack>
  ),
};
export const Digitado: Story = { name: "DateInput", render: () => <DateInput label="Dia" description="dd/mm/aaaa" maxDate={hoje} /> };
export const Hora: Story = {
  name: "TimeInput (24 h)",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--cf-space-3)" }}>
      <TimeInput label="Abre" defaultValue="10:00" />
      <TimeInput label="Fecha" defaultValue="22:00" />
    </div>
  ),
};
export const DiaEHora: Story = { name: "DateTimePicker", render: () => <DateTimePicker label="Começa" /> };
