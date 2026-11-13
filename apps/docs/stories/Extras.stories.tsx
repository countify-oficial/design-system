import { Badge, Button, Card, Icon, Stack, Text, ThemeIcon } from "@countify-oficial/core";
import { Carousel } from "@countify-oficial/carousel";
import { CodeHighlight } from "@countify-oficial/code-highlight";
import { Dropzone } from "@countify-oficial/dropzone";
import { spotlight, Spotlight } from "@countify-oficial/spotlight";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Extensões/Carousel, Dropzone, Spotlight e CodeHighlight", parameters: { docs: { description: { component: "Os quatro não existem no mockup como componente: usam só valores dele (ver TOKENS_COUNTIFY.md, itens 34 a 36)." } } } } satisfies Meta;
export default meta;
type Story = StoryObj;

const datas = [["Dia das Mães", "10/5", "+38%"], ["Dia dos Namorados", "12/6", "+21%"], ["Dia dos Pais", "9/8", "+17%"], ["Black Friday", "27/11", "+64%"], ["Natal", "25/12", "+52%"]];

export const Carrossel: Story = {
  name: "Carousel: um por vez",
  render: () => (
    <div style={{ maxWidth: "var(--cf-side-panel-width)" }}>
      <Carousel aria-label="Datas comemorativas">
        {datas.map(([nome, dia, efeito]) => (
          <Carousel.Slide key={nome}>
            <Card>
              <Text weight="medium">{nome}</Text>
              <Text size="sm" color="text2">{dia}</Text>
              <Badge color="up">{efeito}</Badge>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  ),
};
export const CarrosselVarios: Story = {
  name: "Carousel: vários à vista",
  render: () => (
    <Carousel aria-label="Datas comemorativas" slideSize="calc(var(--cf-side-panel-width) / 2)" slideGap="md">
      {datas.map(([nome, dia]) => (
        <Carousel.Slide key={nome}>
          <Card><Text weight="medium">{nome}</Text><Text size="sm" color="text2">{dia}</Text></Card>
        </Carousel.Slide>
      ))}
    </Carousel>
  ),
};

export const AreaDeSoltar: Story = {
  name: "Dropzone: estados",
  render: () => (
    <Stack style={{ maxWidth: "var(--cf-side-panel-width)" }}>
      <Dropzone accept={[".csv", ".xml", ".zip"]} maxSize={20 * 1024 * 1024} onDrop={() => undefined}>
        <Dropzone.Idle><Icon name="upload" /> Enviar XML ou planilha</Dropzone.Idle>
        <Dropzone.Accept>Pode soltar</Dropzone.Accept>
        <Dropzone.Reject>Só XML, planilha ou zip, até 20 MB</Dropzone.Reject>
      </Dropzone>
      <Dropzone onDrop={() => undefined} loading />
      <Dropzone onDrop={() => undefined} disabled />
    </Stack>
  ),
};

export const BuscaRapida: Story = {
  name: "Spotlight (Ctrl+K / ⌘K)",
  render: () => (
    <>
      <Button variant="outline" leftSection={<Icon name="search" size="sm" />} onClick={() => spotlight.open()}>Buscar (Ctrl+K)</Button>
      <Spotlight
        actions={[
          { id: "painel", label: "Painel", group: "Telas", leftSection: <ThemeIcon><Icon name="dashboard" /></ThemeIcon> },
          { id: "analises", label: "Análises", group: "Telas", keywords: ["vendas", "gráficos"], leftSection: <ThemeIcon><Icon name="analytics" /></ThemeIcon> },
          { id: "jardins", label: "Lume Jardins", description: "Fortaleza", group: "Lojas", leftSection: <ThemeIcon><Icon name="store" /></ThemeIcon> },
          { id: "orla", label: "Lume Orla", description: "Fortaleza", group: "Lojas", leftSection: <ThemeIcon><Icon name="store" /></ThemeIcon> },
        ]}
      />
    </>
  ),
};

export const Codigo: Story = {
  name: "CodeHighlight",
  render: () => (
    <Stack>
      <CodeHighlight title="Instalar" language="bash" code="pnpm add @countify-oficial/core @countify-oficial/tokens" />
      <CodeHighlight
        title="App.tsx"
        withLineNumbers
        code={`import { Button } from "@countify-oficial/core";\n\n// o botão principal: um por tela\nexport function Salvar({ salvando }: { salvando: boolean }) {\n  return <Button loading={salvando}>Salvar</Button>;\n}`}
      />
      <CodeHighlight title="resposta.json" language="json" code={`{\n  "loja": "Lume Jardins",\n  "entradas": 1428,\n  "ativa": true\n}`} />
    </Stack>
  ),
};
