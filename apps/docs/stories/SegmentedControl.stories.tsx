import { SegmentedControl } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Escolhas/SegmentedControl", component: SegmentedControl, args: { data: ["Todos", "Pessoas", "Sistema"], "aria-label": "Filtro" } } satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão (mockup)" };
export const LarguraToda: Story = { name: "Largura toda", args: { fullWidth: true } };
export const Duas: Story = { name: "Duas opções", args: { data: ["Dia", "Semana"] } };
export const ComDesativada: Story = { name: "Uma desativada", args: { data: ["Hoje", "7 dias", { value: "ano", label: "Ano", disabled: true }] } };
