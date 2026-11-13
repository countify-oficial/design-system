import { Avatar, Group, type Tone } from "@countify-oficial/core";
import type { Size } from "@countify-oficial/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Feedback/Avatar", component: Avatar, args: { name: "Ana Souza" } } satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Iniciais: Story = {};
export const SemNome: Story = { name: "Sem nome (ícone)", args: { name: undefined } };
export const FotoQueFalha: Story = { name: "Foto que não carrega (volta às iniciais)", args: { src: "foto-que-nao-existe.jpg" } };
export const Tamanhos: Story = { render: (a) => <Group>{(["xs", "sm", "md", "lg", "xl"] as Size[]).map((s) => <Avatar key={s} {...a} size={s} />)}</Group> };
export const Tons: Story = { render: (a) => <Group>{(["accent", "gray", "up", "down", "warn"] as Tone[]).map((t) => <Avatar key={t} {...a} color={t} />)}</Group> };
