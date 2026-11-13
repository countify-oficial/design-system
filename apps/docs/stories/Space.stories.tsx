import { Space, type Spacing } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bloco } from "./_demo";

const meta = {
  title: "Layout/Space",
  component: Space,
  args: { h: "md" },
} satisfies Meta<typeof Space>;
export default meta;
type Story = StoryObj<typeof meta>;

const valores: Spacing[] = ["xs", "sm", 3, "md", 5, "lg", "xl"];

export const Altura: Story = {
  name: "Altura (h)",
  render: (args) => <><Bloco>Acima</Bloco><Space {...args} /><Bloco>Abaixo</Bloco></>,
};

export const Largura: Story = {
  name: "Largura (w), todos os valores",
  render: () => <>{valores.map((w) => <div key={w} style={{ display: "flex", marginBottom: "var(--cf-space-2)" }}><Bloco>{String(w)}</Bloco><Space w={w} /><Bloco>→</Bloco></div>)}</>,
};
