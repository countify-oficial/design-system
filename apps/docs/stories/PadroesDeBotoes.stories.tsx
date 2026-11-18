import {
  ActionIcon, Burger, Button, CloseButton, CopyButton, FileButton, Group, Icon, SimpleGrid, Stack, Text, Toggle, Toolbar, Tooltip, UnstyledButton,
} from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";

// a página de docs é o GuiaDeBotoes.mdx (ligado a este arquivo); estas histórias são os exemplos dele
const meta = {
  title: "Botões/Guia de uso",
  tags: ["!autodocs"],
  parameters: { docs: { lang: "pt-BR", toc: { headingSelector: "h2, h3", title: "Nesta página" } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Item({ nome, children }: { nome: string; children: ReactNode }) {
  return (
    <Stack gap="sm" style={{ padding: "var(--cf-space-4)", borderRadius: "var(--cf-radius-sm)", background: "var(--cf-color-card)" }}>
      <Text size="sm" weight="medium" color="text2">{nome}</Text>
      <Group gap="sm">{children}</Group>
    </Stack>
  );
}

export const VisaoGeral: Story = {
  name: "Visão geral",
  render: () => (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
      <Item nome="Button">
        <Button>Salvar</Button>
        <Button variant="outline">Cancelar</Button>
      </Item>
      <Item nome="ActionIcon">
        <ActionIcon aria-label="Editar"><Icon name="edit" /></ActionIcon>
        <ActionIcon variant="default" aria-label="Filtrar"><Icon name="sliders" /></ActionIcon>
        <ActionIcon variant="filled" aria-label="Favoritar"><Icon name="bookmark" /></ActionIcon>
      </Item>
      <Item nome="CloseButton"><CloseButton /><CloseButton variant="default" /></Item>
      <Item nome="Toggle"><Toggle defaultPressed>Calçados</Toggle><Toggle>Roupas</Toggle></Item>
      <Item nome="CopyButton">
        <CopyButton value="K7Q-29XM">
          {({ copied, copy }) => (
            <Button variant="outline" onClick={copy} leftSection={<Icon name={copied ? "check" : "key"} size="sm" />}>{copied ? "Copiado" : "Copiar"}</Button>
          )}
        </CopyButton>
      </Item>
      <Item nome="FileButton">
        <FileButton accept="image/*" onChange={() => undefined}>
          {(p) => <Button {...p} variant="outline" leftSection={<Icon name="upload" size="sm" />}>Enviar foto</Button>}
        </FileButton>
      </Item>
      <Item nome="Toolbar">
        <Toolbar aria-label="Ações">
          <ActionIcon variant="default" aria-label="Baixar"><Icon name="download" /></ActionIcon>
          <ActionIcon variant="default" aria-label="Filtrar"><Icon name="sliders" /></ActionIcon>
          <ActionIcon variant="default" aria-label="Apagar" color="down"><Icon name="trash" /></ActionIcon>
        </Toolbar>
      </Item>
      <Item nome="Burger"><BurgerDemo /></Item>
      <Item nome="UnstyledButton"><UnstyledButton><Text size="sm" color="accent">Área clicável</Text></UnstyledButton></Item>
    </SimpleGrid>
  ),
};

function BurgerDemo() {
  const [aberto, setAberto] = useState(false);
  return <Burger opened={aberto} onClick={() => setAberto(!aberto)} />;
}

// contorno tracejado em cada parte, pelo próprio styles do Button
const contorno = (cor: string) => ({ outline: `2px dashed var(--cf-color-${cor})`, outlineOffset: 3 });
export const Anatomia: Story = {
  render: () => (
    <Stack align="flex-start">
      <Button
        variant="outline"
        size="xl"
        leftSection={<Icon name="download" size="sm" />}
        rightSection={<Icon name="chevron-down" size="sm" />}
        styles={{ section: contorno("down"), label: contorno("up") }}
      >
        Exportar
      </Button>
      <Group gap="lg">
        <Text size="sm" color="text2"><Text component="span" size="sm" color="accent" weight="medium">root</Text> o botão inteiro</Text>
        <Text size="sm" color="text2"><Text component="span" size="sm" color="down" weight="medium">section</Text> ícone da esquerda e da direita</Text>
        <Text size="sm" color="text2"><Text component="span" size="sm" color="up" weight="medium">label</Text> o texto</Text>
        <Text size="sm" color="text2"><Text component="span" size="sm" weight="medium">loader</Text> o girador, no lugar da section da esquerda</Text>
      </Group>
    </Stack>
  ),
};

export const IconeComDica: Story = {
  name: "ActionIcon com Tooltip",
  render: () => (
    <Group>
      <Tooltip label="Editar painel">
        <ActionIcon variant="default" aria-label="Editar painel"><Icon name="edit" /></ActionIcon>
      </Tooltip>
      <Tooltip label="Duplicar">
        <ActionIcon variant="default" aria-label="Duplicar"><Icon name="copy" /></ActionIcon>
      </Tooltip>
    </Group>
  ),
};

export const RodapeDeFormulario: Story = {
  name: "Rodapé de formulário",
  render: () => (
    <Group justify="flex-end" gap="sm">
      <Button variant="outline">Cancelar</Button>
      <Button type="submit">Salvar</Button>
    </Group>
  ),
};

export const AcaoDestrutiva: Story = {
  name: "Ação destrutiva",
  render: () => (
    <Group justify="space-between">
      <Button variant="subtle" color="down" leftSection={<Icon name="trash" size="sm" />}>Excluir análise</Button>
      <Group gap="sm">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar</Button>
      </Group>
    </Group>
  ),
};

function Salvar() {
  const [salvando, setSalvando] = useState(false);
  const salvar = () => {
    setSalvando(true);
    setTimeout(() => setSalvando(false), 1500);
  };
  return <Button loading={salvando} onClick={salvar}>{salvando ? "Salvando" : "Salvar"}</Button>;
}
export const CarregarAoClicar: Story = { name: "Carregar ao clicar", render: () => <Salvar /> };

function Filtros() {
  const opcoes = ["Calçados", "Acessórios", "Roupas"];
  const [ligados, setLigados] = useState(["Calçados"]);
  const trocar = (o: string, ligado: boolean) => setLigados((l) => (ligado ? [...l, o] : l.filter((x) => x !== o)));
  return (
    <Stack align="flex-start">
      <Group gap="sm">
        {opcoes.map((o) => <Toggle key={o} pressed={ligados.includes(o)} onPressedChange={(p) => trocar(o, p)}>{o}</Toggle>)}
      </Group>
      <Text size="sm" color="text2">Filtrando: {ligados.length ? ligados.join(", ") : "nada"}</Text>
    </Stack>
  );
}
export const FiltroControlado: Story = { name: "Filtro com Toggle controlado", render: () => <Filtros /> };

export const AdicionarItem: Story = {
  name: "Adicionar item",
  render: () => (
    <Stack style={{ maxWidth: "var(--cf-side-panel-width)" }}>
      <Button fullWidth variant="dashed" leftSection={<Icon name="plus" size="sm" />}>Adicionar bloco</Button>
    </Stack>
  ),
};
