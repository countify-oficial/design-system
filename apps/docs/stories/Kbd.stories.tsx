import { Kbd, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Feedback/Kbd", component: Kbd, args: { children: "K" } } satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const Atalho: Story = { render: () => <Text>Busca: <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd></Text> };
