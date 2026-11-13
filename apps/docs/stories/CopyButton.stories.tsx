import { Button, CopyButton, Icon } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Botões/CopyButton",
  component: CopyButton,
  args: { value: "K7Q-29XM", children: () => null },
  parameters: { docs: { description: { component: "Na web, a área de transferência pede página segura (https ou localhost)." } } },
} satisfies Meta<typeof CopyButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  render: (args) => (
    <CopyButton value={args.value}>
      {({ copied, copy }) => (
        <Button variant="outline" onClick={copy} leftSection={<Icon name={copied ? "check" : "key"} size="sm" />}>
          {copied ? "Código copiado" : "Copiar código"}
        </Button>
      )}
    </CopyButton>
  ),
};
