import { BarList, ChartLegend, Heatmap, LineChart } from "@countify-oficial/charts";
import { AppShell, Avatar, Badge, Button, Card, DataList, Group, Icon, NavLink, SegmentedControl, SimpleGrid, Stack, Text, ThemeIcon, Title } from "@countify-oficial/core";
import { addDays, DatePicker, startOfMonth, type DatesRange } from "@countify-oficial/dates";
import { modals, ModalsProvider } from "@countify-oficial/modals";
import { Notifications, notifications } from "@countify-oficial/notifications";
import { CountifyProvider, useCountifyTheme, type ColorSchemeSetting } from "@countify-oficial/provider";
import { Spotlight, spotlight } from "@countify-oficial/spotlight";
import type { IconName } from "@countify-oficial/tokens";
import { useEffect, useState } from "react";
import type { AppInfo } from "../../preload/api";

type Secao = "painel" | "analises" | "avisos" | "ajustes";
const SECOES: { id: Secao; icon: IconName; label: string }[] = [
  { id: "painel", icon: "dashboard", label: "Painel" },
  { id: "analises", icon: "analytics", label: "Análises" },
  { id: "avisos", icon: "bell", label: "Avisos" },
  { id: "ajustes", icon: "settings", label: "Ajustes" },
];

const horas = ["8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h"];
const previsto = [10, 28, 45, 66, 88, 92, 80, 74, 70, 76, 82, 60, 30];

function Painel() {
  return (
    <Stack gap="lg">
      <Title order={1}>Painel</Title>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        {[["Entradas hoje", "395", "▲ 12% vs. qua."], ["Conversão", "13,9%", "▲ 1,0 pt"], ["Peças por venda", "2,4", "igual a qua."]].map(([nome, valor, variacao]) => (
          <Card key={nome}>
            <Text size="sm" color="text2">{nome}</Text>
            <Text size="xl" weight="bold">{valor}</Text>
            <Text size="sm" color="up">{variacao}</Text>
          </Card>
        ))}
      </SimpleGrid>
      <Card>
        <Group justify="space-between">
          <Text weight="medium">Entradas por hora</Text>
          <ChartLegend items={[{ label: "Real" }, { label: "Previsto", type: "dashed" }, { label: "Faixa normal", type: "band" }]} />
        </Group>
        <LineChart labels={horas} actual={[12, 30, 48, 61, 90, 84, 70, null, null, null, null, null, null]} forecast={previsto} band={[previsto.map((v) => v * 0.8), previsto.map((v) => v * 1.2)]} partial={7} now={6} labelEvery={2} aria-label="Entradas por hora: 395 até as 14h" />
      </Card>
      <Card>
        <Text weight="medium">Conversão por loja</Text>
        <BarList data={[{ label: "Lume Jardins", value: 14.2, valueLabel: "14,2%" }, { label: "Lume Aldeota", value: 12.9, valueLabel: "12,9%" }, { label: "Lume Orla", value: 9.8, valueLabel: "9,8%" }]} reference={12.6} aria-label="Conversão por loja; média 12,6%" />
      </Card>
    </Stack>
  );
}

function Analises() {
  const hoje = new Date();
  const [periodo, setPeriodo] = useState<DatesRange>([addDays(hoje, -6), hoje]);
  return (
    <Stack gap="lg">
      <Title order={1}>Análises</Title>
      <div style={{ maxWidth: "var(--cf-side-panel-width)" }}>
        <DatePicker
          type="range"
          label="Período"
          maxDate={hoje}
          value={periodo}
          onChange={setPeriodo}
          presets={[
            { label: "Hoje", value: [hoje, hoje] },
            { label: "Últimos 7 dias", value: [addDays(hoje, -6), hoje] },
            { label: "Este mês", value: [startOfMonth(hoje), hoje] },
          ]}
        />
      </div>
      <Card>
        <Text weight="medium">Movimento por dia e hora</Text>
        <Heatmap
          rows={["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]}
          columns={["9h", "", "", "12h", "", "", "15h", "", "", "18h", "", ""]}
          values={Array.from({ length: 7 }, (_, d) => Array.from({ length: 12 }, (_, h) => (d === 6 && h > 8 ? null : Math.round(10 + 40 * Math.sin((h / 11) * Math.PI) + d * 3))))}
          aria-label="Movimento por dia e hora"
        />
      </Card>
    </Stack>
  );
}

function Avisos() {
  return (
    <Stack gap="lg">
      <Title order={1}>Avisos</Title>
      <Card padding="xs" gap={1}>
        <NavLink href="#camera" label="Câmera sem imagem" description="Lume Orla · agora" active leftSection={<ThemeIcon color="down"><Icon name="camera" /></ThemeIcon>} />
        <NavLink href="#meta" label="Meta batida" description="Lume Jardins · 10:42" leftSection={<ThemeIcon color="up"><Icon name="check" /></ThemeIcon>} />
      </Card>
      <Group>
        <Button variant="outline" onClick={() => notifications.show({ message: "Aviso marcado como lido" })}>Marcar como lido</Button>
        <Button
          color="down"
          onClick={() =>
            modals.openConfirmModal({
              title: "Apagar o aviso?",
              children: "Ele sai para todos que acompanham a Lume Orla.",
              labels: { confirm: "Apagar" },
              confirmColor: "down",
              onConfirm: () => notifications.show({ message: "Aviso apagado" }),
            })
          }
        >
          Apagar aviso
        </Button>
      </Group>
    </Stack>
  );
}

function Ajustes({ info }: { info: AppInfo | null }) {
  const { colorSchemeSetting, setColorScheme } = useCountifyTheme();
  return (
    <Stack gap="lg">
      <Title order={1}>Ajustes</Title>
      <Card>
        <Text weight="medium">Modo</Text>
        <SegmentedControl
          aria-label="Modo"
          data={[{ value: "auto", label: "Automático" }, { value: "light", label: "Claro" }, { value: "dark", label: "Escuro" }]}
          value={colorSchemeSetting}
          onChange={(v) => setColorScheme(v as ColorSchemeSetting)}
        />
      </Card>
      <Card>
        <Text weight="medium">Sobre</Text>
        <DataList>
          <DataList.Item label="Versão">{info?.version ?? "—"}</DataList.Item>
          <DataList.Item label="Sistema">{info?.platform ?? "—"}</DataList.Item>
          <DataList.Item label="Electron">{info?.electron ?? "—"}</DataList.Item>
        </DataList>
      </Card>
    </Stack>
  );
}

/** O app de demonstração: a moldura da identidade (menu no topo; abas embaixo em janela estreita), com os pacotes juntos. */
export function App() {
  const [secao, setSecao] = useState<Secao>("painel");
  const [info, setInfo] = useState<AppInfo | null>(null);
  useEffect(() => {
    void window.countify.getInfo().then(setInfo);
  }, []);
  const itens = SECOES.map((s) => (
    <AppShell.NavItem
      key={s.id}
      component="button"
      type="button"
      icon={s.icon}
      label={s.label}
      active={secao === s.id}
      badge={s.id === "avisos" ? <Badge color="down" variant="filled">2</Badge> : undefined}
      onClick={() => setSecao(s.id)}
    />
  ));
  return (
    <CountifyProvider>
      <ModalsProvider>
        <AppShell>
          <AppShell.Header
            logo={<Text weight="bold" color="accent">countify</Text>}
            end={
              <>
                <Button variant="outline" leftSection={<Icon name="search" size="sm" />} onClick={() => spotlight.open()}>Buscar</Button>
                <Avatar name="Ana Lima" />
              </>
            }
          >
            {itens}
          </AppShell.Header>
          <AppShell.Main>
            {secao === "painel" && <Painel />}
            {secao === "analises" && <Analises />}
            {secao === "avisos" && <Avisos />}
            {secao === "ajustes" && <Ajustes info={info} />}
          </AppShell.Main>
          <AppShell.TabBar>{itens}</AppShell.TabBar>
        </AppShell>
        <Spotlight actions={SECOES.map((s) => ({ id: s.id, label: s.label, group: "Telas", onClick: () => setSecao(s.id) }))} />
        <Notifications />
      </ModalsProvider>
    </CountifyProvider>
  );
}
