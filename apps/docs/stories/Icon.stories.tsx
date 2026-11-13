import { Group, Icon, Stack, Text, type IconName } from "@countify-oficial/core";
import { icons, type Size } from "@countify-oficial/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Botões/Icon",
  component: Icon,
  args: { name: "store" },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

const nomes = Object.keys(icons) as IconName[];
const tamanhos: Size[] = ["xs", "sm", "md", "lg", "xl"];

export const Padrao: Story = { name: "Padrão" };

export const Todos: Story = {
  name: "Todos os ícones",
  render: () => (
    <Group gap="lg">
      {nomes.map((n) => (
        <Stack key={n} gap="xs" align="center" style={{ width: "calc(var(--cf-list-row-height) * 1.5)" }}>
          <Icon name={n} />
          <Text component="span" size="xs" color="text2">{n}</Text>
        </Stack>
      ))}
    </Group>
  ),
};

export const Tamanhos: Story = {
  render: (args) => <Group>{tamanhos.map((s) => <Icon key={s} {...args} size={s} />)}</Group>,
};

export const Cores: Story = {
  name: "Cor do texto em volta",
  render: (args) => <Group>{(["text", "text2", "accent", "up", "down", "warn"] as const).map((c) => <Text key={c} component="span" color={c}><Icon {...args} /></Text>)}</Group>,
};
