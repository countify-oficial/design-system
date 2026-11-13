import { AlphaSlider, AngleSlider, HueSlider, RangeSlider, Slider, Stack } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Escolhas/Slider", component: Slider, args: { label: "Meta de conversão", defaultValue: 21 } } satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const ComMarcas: Story = {
  name: "Com marcas",
  args: { step: 5, defaultValue: 25, marks: [{ value: 0, label: "0%" }, { value: 25, label: "25%" }, { value: 50, label: "50%" }, { value: 75, label: "75%" }, { value: 100, label: "100%" }], getValueText: (v: number) => `${v}%` },
};
export const Tons: Story = { render: (a) => <Stack>{(["accent", "up", "down", "warn"] as const).map((t) => <Slider key={t} {...a} color={t} label={t} />)}</Stack> };
export const Desativado: Story = { args: { disabled: true } };
export const Intervalo: Story = { name: "RangeSlider", render: () => <RangeSlider defaultValue={[8, 18]} min={0} max={24} labels={["Abre", "Fecha"]} getValueText={(v) => `${v}h`} marks={[{ value: 0, label: "0h" }, { value: 12, label: "12h" }, { value: 24, label: "24h" }]} /> };
export const MatizETransparencia: Story = { name: "HueSlider e AlphaSlider", render: () => <Stack><HueSlider defaultValue={214} /><AlphaSlider color="#225ba5" defaultValue={0.6} /></Stack> };
export const Angulo: Story = { name: "AngleSlider", render: () => <AngleSlider label="Direção da câmera" defaultValue={90} /> };
