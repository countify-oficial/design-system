import { Code, Highlight, Mark, Stack, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Tipografia/Code, Mark e Highlight", component: Code, args: { children: "pnpm check" } } satisfies Meta<typeof Code>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NaLinha: Story = { name: "Code na linha", render: (a) => <Text>Rode <Code {...a} /> antes do PR.</Text> };
export const Bloco: Story = { name: "Code em bloco", args: { block: true, children: 'import { Button } from "@countify-oficial/core";\n\n<Button>Salvar</Button>' } };
export const Marca: Story = { name: "Mark", render: () => <Stack><Text>Conversão 19,8% <Mark>parcial</Mark></Text><Text>Tom accent: <Mark color="accent">marcado</Mark></Text></Stack> };
export const Destaque: Story = { name: "Highlight (resultado de busca)", render: () => <Highlight highlight={["lume", "orla"]}>Lume Jardins, Lume Orla e Lume Aldeota</Highlight> };
