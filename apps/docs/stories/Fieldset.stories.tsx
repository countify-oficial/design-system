import { Fieldset, TextInput } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Campos/Fieldset", component: Fieldset, args: { legend: "Endereço da loja" } } satisfies Meta<typeof Fieldset>;
export default meta;
type Story = StoryObj<typeof meta>;

const campos = <><TextInput label="CEP" variant="outline" /><TextInput label="Rua" variant="outline" /></>;
export const Padrao: Story = { render: (a) => <Fieldset {...a}>{campos}</Fieldset> };
export const Cheio: Story = { name: "filled", render: (a) => <Fieldset {...a} variant="filled">{campos}</Fieldset> };
export const Desativado: Story = { render: (a) => <Fieldset {...a} disabled>{campos}</Fieldset> };
