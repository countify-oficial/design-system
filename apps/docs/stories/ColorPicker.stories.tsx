import { ColorPicker } from "@countify-oficial/core";
import { palette } from "@countify-oficial/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Escolhas/ColorPicker", component: ColorPicker, args: { defaultValue: palette.blue[6] }, decorators: [(S) => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><S /></div>] } satisfies Meta<typeof ColorPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const ComTransparencia: Story = { name: "Com transparência (rgba)", args: { format: "rgba", defaultValue: "rgba(34, 91, 165, 0.6)" } };
export const CoresProntas: Story = { name: "Cores prontas", args: { swatches: [palette.blue[6], palette.green[6], palette.red[6], palette.amber[6], palette.gray[6]] } };
export const SoAsProntas: Story = { name: "Só as cores prontas", args: { withPicker: false, swatches: [palette.blue[6], palette.green[6], palette.red[6], palette.amber[6]] } };
