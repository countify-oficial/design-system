import { Anchor, Stack, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Tipografia/Anchor", component: Anchor, args: { href: "#analises", children: "ver análises" } } satisfies Meta<typeof Anchor>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NoTexto: Story = { name: "No texto", render: (a) => <Text>Para comparar períodos, <Anchor {...a} />.</Text> };
export const Sublinhado: Story = { render: (a) => <Stack><Anchor {...a} underline="hover">hover</Anchor><Anchor {...a} underline="always">sempre</Anchor><Anchor {...a} underline="never">nunca</Anchor></Stack> };
