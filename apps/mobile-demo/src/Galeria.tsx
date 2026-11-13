import { Carousel } from "@countify-oficial/carousel";
import { BarList, ChartLegend, LineChart } from "@countify-oficial/charts";
import { CodeHighlight } from "@countify-oficial/code-highlight";
import { addDays, DatePicker } from "@countify-oficial/dates";
import { modals, ModalsProvider } from "@countify-oficial/modals";
import {
  AppShell, Badge, Button, Card, Checkbox, Icon, NavLink, SegmentedControl, Select, SimpleGrid, Stack, Switch, Tabs, Text, TextInput, ThemeIcon, Title,
} from "@countify-oficial/native";
import { Notifications, notifications } from "@countify-oficial/notifications";
import { useCountifyTheme, type ColorSchemeSetting } from "@countify-oficial/provider";
import type { IconName } from "@countify-oficial/tokens";
import { useState } from "react";

type Aba = "inicio" | "campos" | "listas" | "mais";
const ABAS: { id: Aba; icon: IconName; label: string }[] = [
  { id: "inicio", icon: "dashboard", label: "Início" },
  { id: "campos", icon: "edit", label: "Campos" },
  { id: "listas", icon: "table", label: "Listas" },
  { id: "mais", icon: "settings", label: "Mais" },
];
const previsto = [10, 28, 45, 66, 88, 92, 80, 74, 70];

function Inicio() {
  return (
    <Stack gap="lg">
      <Title order={1}>Hoje</Title>
      <SimpleGrid cols={2}>
        <Card>
          <Text size="sm" color="text2">Entradas</Text>
          <Text size="xl" weight="bold">395</Text>
          <Text size="sm" color="up">▲ 12% vs. qua.</Text>
        </Card>
        <Card>
          <Text size="sm" color="text2">Conversão</Text>
          <Text size="xl" weight="bold">13,9%</Text>
          <Text size="sm" color="up">▲ 1,0 pt</Text>
        </Card>
      </SimpleGrid>
      <Card>
        <Text weight="medium">Entradas por hora</Text>
        <ChartLegend items={[{ label: "Real" }, { label: "Previsto", type: "dashed" }]} />
        <LineChart labels={["8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h"]} actual={[12, 30, 48, 61, 90, 84, 70, null, null]} forecast={previsto} partial={7} now={6} labelEvery={2} height={184} accessibilityLabel="Entradas por hora: 395 até as 14h" />
      </Card>
      <Card>
        <Text weight="medium">Conversão por loja</Text>
        <BarList data={[{ label: "Lume Jardins", value: 14.2, valueLabel: "14,2%" }, { label: "Lume Orla", value: 9.8, valueLabel: "9,8%" }]} reference={12.6} accessibilityLabel="Conversão por loja" />
      </Card>
    </Stack>
  );
}

function Campos() {
  const hoje = new Date();
  return (
    <Stack gap="lg">
      <Title order={1}>Campos</Title>
      <TextInput label="Nome da loja" placeholder="Lume Jardins" />
      <Select label="Cidade" data={["Fortaleza", "Sobral", "São Paulo"]} placeholder="Escolha a cidade" />
      <DatePicker type="range" label="Período" maxDate={hoje} defaultValue={[addDays(hoje, -6), hoje]} presets={[{ label: "Hoje", value: [hoje, hoje] }, { label: "Últimos 7 dias", value: [addDays(hoje, -6), hoje] }]} />
      <Switch label="Avisar quando a câmera parar" defaultChecked />
      <Checkbox label="Só lojas comparáveis" />
    </Stack>
  );
}

function Listas() {
  return (
    <Stack gap="lg">
      <Title order={1}>Listas</Title>
      <Tabs variant="chips" defaultValue="todos">
        <Tabs.List accessibilityLabel="Avisos">
          <Tabs.Tab value="todos">Todos</Tabs.Tab>
          <Tabs.Tab value="pessoas">Pessoas</Tabs.Tab>
          <Tabs.Tab value="sistema">Sistema</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Card padding="xs" gap={1}>
        <NavLink label="Câmera sem imagem" description="Lume Orla · agora" active leftSection={<ThemeIcon color="down"><Icon name="camera" /></ThemeIcon>} rightSection={<Icon name="chevron-right" size="xs" />} />
        <NavLink label="Meta batida" description="Lume Jardins · 10:42" leftSection={<ThemeIcon color="up"><Icon name="check" /></ThemeIcon>} rightSection={<Icon name="chevron-right" size="xs" />} />
      </Card>
      <Text weight="medium">Datas comemorativas</Text>
      <Carousel accessibilityLabel="Datas comemorativas" slideSize={0.8}>
        {[["Dia das Mães", "+38%"], ["Dia dos Pais", "+17%"], ["Natal", "+52%"]].map(([nome, efeito]) => (
          <Carousel.Slide key={nome}>
            <Card>
              <Text weight="medium">{nome}</Text>
              <Badge color="up">{efeito}</Badge>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Stack>
  );
}

function Mais() {
  const { colorSchemeSetting, setColorScheme } = useCountifyTheme();
  return (
    <Stack gap="lg">
      <Title order={1}>Mais</Title>
      <SegmentedControl
        accessibilityLabel="Modo"
        data={[{ value: "auto", label: "Auto" }, { value: "light", label: "Claro" }, { value: "dark", label: "Escuro" }]}
        value={colorSchemeSetting}
        onChange={(v) => setColorScheme(v as ColorSchemeSetting)}
      />
      <Button onPress={() => notifications.show({ message: "Análise salva" })}>Mostrar aviso</Button>
      <Button
        variant="outline"
        color="down"
        onPress={() => modals.openConfirmModal({ title: "Excluir análise?", children: "Ela sai para quem foi compartilhada.", labels: { confirm: "Excluir" }, confirmColor: "down" })}
      >
        Excluir análise
      </Button>
      <CodeHighlight title="Instalar" language="bash" code="pnpm add @countify-oficial/native" />
    </Stack>
  );
}

/** A galeria: as quatro abas embaixo, como no mockup, com as telas de exemplo. */
export function Galeria({ insets }: { insets: { top: number; bottom: number } }) {
  const [aba, setAba] = useState<Aba>("inicio");
  return (
    <ModalsProvider>
      <AppShell safeAreaInsets={insets}>
        <AppShell.Main>
          {aba === "inicio" && <Inicio />}
          {aba === "campos" && <Campos />}
          {aba === "listas" && <Listas />}
          {aba === "mais" && <Mais />}
        </AppShell.Main>
        <AppShell.TabBar>
          {ABAS.map((a) => <AppShell.NavItem key={a.id} icon={a.icon} label={a.label} active={aba === a.id} onPress={() => setAba(a.id)} />)}
        </AppShell.TabBar>
        <Notifications bottomInset={insets.bottom} />
      </AppShell>
    </ModalsProvider>
  );
}
