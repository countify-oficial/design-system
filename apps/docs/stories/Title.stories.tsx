import { Stack, Title, type TitleSize } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Tipografia/Title", component: Title, args: { children: "Painel da rede" } } satisfies Meta<typeof Title>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "h1 (22 no celular, 28 a partir de 768)" };
export const Escala: Story = {
  name: "A escala do guia",
  render: () => <Stack>{(["tabTitle", "pageTitle", "screenTitle", "section", "number", "overline"] as TitleSize[]).map((s) => <Title key={s} order={2} size={s}>{s === "number" ? "1.284" : s}</Title>)}</Stack>,
};
export const Niveis: Story = { name: "Níveis h1–h3", render: () => <Stack><Title>h1</Title><Title order={2}>h2 (seção)</Title><Title order={3}>h3</Title></Stack> };
