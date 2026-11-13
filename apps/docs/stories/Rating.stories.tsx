import { Rating, Stack } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Escolhas/Rating", component: Rating, args: { label: "Atendimento", defaultValue: 3 } } satisfies Meta<typeof Rating>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const SoLeitura: Story = { name: "Só leitura", args: { readOnly: true, value: 4 } };
export const Tamanhos: Story = { render: (a) => <Stack><Rating {...a} size="sm" /><Rating {...a} size="lg" /><Rating {...a} color="accent" /></Stack> };
