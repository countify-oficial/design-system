import { Badge, Group, Stack, type BadgeVariant, type Tone } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Feedback/Badge", component: Badge, args: { children: "parcial" } } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

const tons: Tone[] = ["gray", "accent", "up", "down", "warn"];

export const Padrao: Story = { name: "Padrão (etiqueta 'parcial')" };
export const VariantesETons: Story = {
  name: "Variantes × tons",
  render: () => (
    <Stack>
      {(["light", "filled", "outline", "dot"] as BadgeVariant[]).map((v) => (
        <Group key={v}>{tons.map((t) => <Badge key={t} variant={v} color={t}>{v === "filled" ? "3" : t}</Badge>)}</Group>
      ))}
    </Stack>
  ),
};
export const Situacao: Story = { name: "Situação (dot)", render: () => <Group gap="lg"><Badge variant="dot" color="up">Online</Badge><Badge variant="dot" color="down">Sem imagem</Badge></Group> };
