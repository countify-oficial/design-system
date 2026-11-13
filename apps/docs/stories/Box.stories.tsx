import { Box } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Primitivos/Box",
  component: Box,
  args: { children: "Conteúdo do Box" },
} satisfies Meta<typeof Box>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão (div)" };

export const OutroElemento: Story = {
  name: "Outro elemento (component)",
  render: () => (
    <>
      <Box component="section" aria-label="Seção">Um &lt;section&gt;</Box>
      <Box component="a" href="#lojas">Um link (&lt;a href&gt;)</Box>
    </>
  ),
};
