import { Group, Skeleton, SkeletonLoader, Stack, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

const meta = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  parameters: { docs: { description: { component: "Carregando: blocos cinza do tamanho do conteúdo, sem girador (X-DocEstados). O SkeletonLoader traz as formas prontas." } } },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Bloco: Story = { name: "Skeleton (um bloco)", args: { width: 140, height: 32 } };
export const Formas: Story = { name: "Skeleton: círculo e linhas", render: () => <Group><Skeleton circle height={40} /><Stack gap="xs" style={{ flex: 1 }}><Skeleton width="60%" /><Skeleton width="40%" /></Stack></Group> };
export const SemPulsar: Story = { name: "Sem pulsar", args: { animate: false, width: 140, height: 32 } };

export const LoaderTexto: Story = { name: "SkeletonLoader: texto", render: () => <SkeletonLoader /> };
export const LoaderNumeros: Story = { name: "SkeletonLoader: cartões de número", render: () => <SkeletonLoader variant="stat" count={2} cols={2} /> };
export const LoaderLista: Story = { name: "SkeletonLoader: lista", render: () => <SkeletonLoader variant="list" /> };
export const LoaderCartao: Story = { name: "SkeletonLoader: cartão", render: () => <SkeletonLoader variant="card" count={3} cols={{ base: 1, sm: 3 }} /> };

function Chegando() {
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPronto(true), 2500);
    return () => clearTimeout(t);
  }, []);
  return pronto ? <Stack gap="xs"><Text weight="bold" size="xl">1.284</Text><Text size="sm" color="up">+8% vs. qua.</Text></Stack> : <SkeletonLoader count={2} />;
}
export const ConteudoChegando: Story = { name: "O conteúdo chega (2,5 s)", render: () => <Chegando /> };
