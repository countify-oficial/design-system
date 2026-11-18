import { addDays, EventCalendar, startOfMonth, type CalendarEvent } from "@countify-oficial/dates";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const hoje = new Date();
const inicio = startOfMonth(hoje);
const eventos: CalendarEvent[] = [
  { id: 1, date: addDays(inicio, 4), title: "Inventário Lume Orla" },
  { id: 2, date: addDays(inicio, 4), title: "Entrega 14h", color: "up" },
  { id: 3, date: hoje, title: "Promoção Dia das Mães", color: "warn" },
  { id: 4, date: hoje, title: "Inventário Lume Jardins" },
  { id: 5, date: hoje, title: "Entrega 9h", color: "up" },
  { id: 6, date: hoje, title: "Câmera da entrada sem sinal", color: "down" },
  { id: 7, date: addDays(inicio, 19), title: "Reunião de gerentes", color: "gray" },
  { id: 8, date: addDays(inicio, 26), title: "Balanço do mês" },
];

const meta = {
  title: "Extensões/EventCalendar",
  component: EventCalendar,
  args: { events: eventos, onEventClick: fn(), onDayClick: fn() },
  parameters: {
    docs: {
      description: {
        component:
          "Os eventos do mês sobre a grade e o dia do Calendar (M-Periodo): chips do Badge com o tom do evento e \"+N mais\" que abre a lista do dia. No celular, o mês tem pontos nos dias com evento e a lista do dia escolhido fica embaixo.",
      },
    },
  },
} satisfies Meta<typeof EventCalendar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Eventos e \"+N mais\"" };
export const MaisLinhas: Story = { name: "Quatro linhas por dia", args: { maxEventsPerDay: 4 } };
export const Segunda: Story = { name: "Semana começando na segunda", args: { firstDayOfWeek: 1 } };
export const ComLimite: Story = { name: "Dias futuros bloqueados (maxDate)", args: { maxDate: hoje } };
export const Vazio: Story = { name: "Sem eventos", args: { events: [] } };
