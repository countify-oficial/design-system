import { Button, FileButton, Icon, Stack, Text } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = {
  title: "Botões/FileButton",
  component: FileButton,
  args: { onChange: () => undefined, children: () => null },
} satisfies Meta<typeof FileButton>;
export default meta;

function Exemplo({ multiple }: { multiple?: boolean }) {
  const [nomes, setNomes] = useState<string[]>([]);
  const botao = (p: { onClick: () => void; disabled: boolean | undefined }) => (
    <Button {...p} variant="outline" leftSection={<Icon name="upload" size="sm" />}>{multiple ? "Enviar fotos" : "Enviar foto"}</Button>
  );
  return (
    <Stack align="flex-start">
      {multiple ? (
        <FileButton multiple accept="image/*" onChange={(fs) => setNomes(fs.map((f) => f.name))}>{botao}</FileButton>
      ) : (
        <FileButton accept="image/*" onChange={(f) => setNomes(f ? [f.name] : [])}>{botao}</FileButton>
      )}
      <Text size="sm" color="text2">{nomes.length ? nomes.join(", ") : "Nenhum arquivo"}</Text>
    </Stack>
  );
}

export const UmArquivo: StoryObj = { name: "Um arquivo", render: () => <Exemplo /> };
export const VariosArquivos: StoryObj = { name: "Vários (multiple)", render: () => <Exemplo multiple /> };
