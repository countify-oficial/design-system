import { MaskInput, PhoneInput, Stack } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Campos/MaskInput", component: MaskInput, args: { label: "CPF", mask: "999.999.999-99", placeholder: "000.000.000-00" } } satisfies Meta<typeof MaskInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CPF: Story = {};
export const Outras: Story = {
  name: "CNPJ, CEP e placa",
  render: () => (
    <Stack>
      <MaskInput label="CNPJ" mask="99.999.999/9999-99" />
      <MaskInput label="CEP" mask="99999-999" />
      <MaskInput label="Placa" mask="aaa-9*99" />
    </Stack>
  ),
};
export const Telefone: Story = { name: "PhoneInput (fixo e celular)", render: () => <PhoneInput label="Telefone" placeholder="(85) 99999-0000" /> };
