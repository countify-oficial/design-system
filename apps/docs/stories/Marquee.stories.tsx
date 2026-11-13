import { Badge, Marquee, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const lojas = [["Lume Jardins", "+12%", "up"], ["Lume Orla", "−4%", "down"], ["Lume Aldeota", "+7%", "up"], ["Lume Centro", "+1%", "up"]] as const;
const Faixa = () => lojas.map(([l, v, cor]) => <Text key={l} component="span">{l} <Badge color={cor}>{v}</Badge></Text>);

const meta = { title: "Dados/Marquee", component: Marquee, args: { "aria-label": "Entradas de hoje" } } satisfies Meta<typeof Marquee>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "50 px/s (padrão)", render: (a) => <Marquee {...a}><Faixa /></Marquee> };
export const AoContrario: Story = { name: "Ao contrário (reverse)", render: (a) => <Marquee {...a} reverse><Faixa /></Marquee> };
export const Devagar: Story = { name: "Mais devagar (speed 25)", render: (a) => <Marquee {...a} speed={25}><Faixa /></Marquee> };
export const SemPausa: Story = { name: "Sem pausa com o mouse (o foco ainda pausa)", render: (a) => <Marquee {...a} pauseOnHover={false}><Faixa /></Marquee> };
