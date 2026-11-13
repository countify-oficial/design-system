import { AspectRatio, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Layout/AspectRatio",
  component: AspectRatio,
} satisfies Meta<typeof AspectRatio>;
export default meta;
type Story = StoryObj<typeof meta>;

const caixa = { background: "var(--cf-color-accent-tint)", borderRadius: "var(--cf-radius-md)", display: "grid", placeItems: "center" } as const;

export const Proporcoes: Story = {
  name: "Proporções (ratio)",
  render: () => (
    <div style={{ display: "flex", gap: "var(--cf-space-6)", alignItems: "flex-start" }}>
      {[{ r: 1, n: "1 (padrão)" }, { r: 4 / 3, n: "4 / 3" }, { r: 16 / 9, n: "16 / 9" }].map(({ r, n }) => (
        <AspectRatio key={n} ratio={r} style={{ ...caixa, width: "calc(var(--cf-side-panel-width) / 1.5)" }}>
          <Text component="span" color="accent">{n}</Text>
        </AspectRatio>
      ))}
    </div>
  ),
};
