import { UnstyledButton, VisuallyHidden } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Primitivos/VisuallyHidden",
  component: VisuallyHidden,
  parameters: { docs: { description: { component: "O texto some da tela e o leitor de tela continua lendo." } } },
} satisfies Meta<typeof VisuallyHidden>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BotaoSoComIcone: Story = {
  name: "Botão só com ícone",
  render: () => (
    <UnstyledButton>
      <span aria-hidden>✕</span>
      <VisuallyHidden>Fechar</VisuallyHidden>
    </UnstyledButton>
  ),
};
