import { Center, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bloco, moldura } from "./_demo";

const meta = {
  title: "Layout/Center",
  component: Center,
  args: { children: <Bloco>No centro</Bloco> },
} satisfies Meta<typeof Center>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  render: (args) => <Center {...args} style={{ ...moldura, height: "calc(var(--cf-list-row-height) * 3)" }} />,
};

export const NaLinha: Story = {
  name: "Na linha do texto (inline)",
  render: () => (
    <Text>
      Antes <Center inline component="span"><Bloco>inline</Bloco></Center> depois
    </Text>
  ),
};
