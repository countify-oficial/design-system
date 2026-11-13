import { Group, Icon, ThemeIcon, type Tone } from "@countify-oficial/core";
import type { Size } from "@countify-oficial/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Feedback/ThemeIcon", component: ThemeIcon, args: { children: <Icon name="store" /> } } satisfies Meta<typeof ThemeIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão (o quadrado das listas)" };
export const Tons: Story = { render: (a) => <Group>{(["accent", "gray", "up", "down", "warn"] as Tone[]).map((t) => <ThemeIcon key={t} {...a} color={t} />)}</Group> };
export const Cheio: Story = { name: "Cheio (filled)", render: (a) => <Group>{(["accent", "up", "down"] as Tone[]).map((t) => <ThemeIcon key={t} {...a} variant="filled" color={t} />)}</Group> };
export const Tamanhos: Story = { render: (a) => <Group>{(["xs", "sm", "md", "lg", "xl"] as Size[]).map((s) => <ThemeIcon key={s} {...a} size={s} />)}</Group> };
export const Redondo: Story = { args: { round: true } };
