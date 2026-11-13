import { BackgroundImage, ColorSwatch, Group, Image, Text } from "@countify-oficial/core";
import { palette } from "@countify-oficial/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

// imagem de exemplo gerada aqui (SVG), para a história não depender de internet
const exemplo = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="${palette.blue[3]}"/><circle cx="160" cy="90" r="50" fill="${palette.blue[6]}"/></svg>`)}`;

const meta = { title: "Dados/Image", component: Image, args: { src: exemplo, alt: "Ilustração de exemplo", width: 320, height: 180 } } satisfies Meta<typeof Image>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const ComCanto: Story = { name: "Com canto", args: { radius: "md" } };
export const Reserva: Story = { name: "Não carrega: mostra a reserva", args: { src: "nao-existe.jpg", fallbackSrc: exemplo, radius: "md" } };
export const Fundo: Story = {
  name: "BackgroundImage",
  render: () => <BackgroundImage src={exemplo} radius="md" style={{ padding: "var(--cf-space-6)" }}><Text weight="bold" style={{ color: "var(--cf-color-on-button)" }}>Texto sobre a imagem</Text></BackgroundImage>,
};
export const Amostras: Story = { name: "ColorSwatch", render: () => <Group>{[palette.blue[6], palette.green[6], palette.red[6], palette.gray[0]].map((c) => <ColorSwatch key={c} color={c} aria-label={c} />)}</Group> };
