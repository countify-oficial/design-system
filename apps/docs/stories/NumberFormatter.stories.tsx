import { Button, Group, NumberFormatter, RollingNumber, Stack, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = { title: "Dados/NumberFormatter", component: NumberFormatter, args: { value: 1284.5 } } satisfies Meta<typeof NumberFormatter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão (pt-BR)" };
export const Formatos: Story = {
  render: () => (
    <Stack gap="xs">
      <NumberFormatter value={87.4} format={{ style: "currency", currency: "BRL" }} />
      <NumberFormatter value={0.214} format={{ style: "percent", minimumFractionDigits: 1 }} />
      <NumberFormatter value={0.08} format={{ style: "percent", signDisplay: "exceptZero" }} suffix=" vs. qua." />
      <NumberFormatter value={21.4} decimalScale={2} fixedDecimalScale suffix=" %" />
    </Stack>
  ),
};

function Contador() {
  const [n, setN] = useState(1284);
  return (
    <Group>
      <Text size="xl" weight="bold" component="span"><RollingNumber value={n} /></Text>
      <Button size="sm" variant="outline" onClick={() => setN((v) => v + Math.ceil(Math.random() * 40))}>Entrou gente</Button>
    </Group>
  );
}
export const Rolando: Story = { name: "RollingNumber", render: () => <Contador /> };
