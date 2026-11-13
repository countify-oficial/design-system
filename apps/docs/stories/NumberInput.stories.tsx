import { NumberInput, Stack } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Campos/NumberInput", component: NumberInput, args: { label: "Área da loja", suffix: "m²", defaultValue: 120 } } satisfies Meta<typeof NumberInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão (sem botões, como na identidade)" };
export const ComBotoes: Story = { name: "Com botões − e +", args: { label: "Câmeras", suffix: undefined, defaultValue: 2, min: 1, max: 8, withControls: true } };
export const Decimais: Story = {
  render: () => (
    <Stack>
      <NumberInput label="Meta de conversão" suffix="%" decimalScale={1} defaultValue={21.4} min={0} max={100} />
      <NumberInput label="Ticket médio" suffix="R$" decimalScale={2} fixedDecimalScale defaultValue={87.4} />
    </Stack>
  ),
};
