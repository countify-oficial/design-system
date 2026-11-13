import { Button, Group, Stack, Stepper, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = { title: "Navegação/Stepper", component: Stepper, args: { active: 1 } } satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

const passos = [
  { label: "Lojas", texto: "Escolha as lojas que vão contar." },
  { label: "Câmeras", texto: "Ligue as câmeras na rede da loja." },
  { label: "Pronto", texto: "Revise e comece a contar." },
];

export const Padrao: Story = {
  render: (a) => (
    <Stepper {...a}>
      {passos.map((p) => <Stepper.Step key={p.label} label={p.label}><Text>{p.texto}</Text></Stepper.Step>)}
    </Stepper>
  ),
};

export const ComDescricao: Story = {
  name: "Com descrição",
  render: () => (
    <Stepper active={0}>
      <Stepper.Step label="Lojas" description="Pode mudar depois em Ajustes" />
      <Stepper.Step label="Câmeras" />
    </Stepper>
  ),
};

function Fluxo() {
  const [ativo, setAtivo] = useState(0);
  return (
    <Stack>
      <Stepper active={ativo} onStepClick={setAtivo}>
        {passos.map((p) => <Stepper.Step key={p.label} label={p.label}><Text>{p.texto}</Text></Stepper.Step>)}
        <Stepper.Completed><Text>Instalação concluída.</Text></Stepper.Completed>
      </Stepper>
      <Group>
        <Button variant="outline" disabled={ativo === 0} onClick={() => setAtivo(ativo - 1)}>Voltar</Button>
        <Button disabled={ativo === passos.length} onClick={() => setAtivo(ativo + 1)}>Próximo</Button>
      </Group>
    </Stack>
  );
}
export const Interativo: Story = { name: "Interativo (barras voltam)", render: () => <Fluxo /> };
