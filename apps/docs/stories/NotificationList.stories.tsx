import { Avatar, Icon, NotificationList, SegmentedControl, Stack, ThemeIcon, type NotificationListItem } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

// datas relativas a agora, para os grupos "hoje" e "ontem" valerem em qualquer dia
const as = (diasAtras: number, h: number, m: number) => {
  const d = new Date();
  d.setDate(d.getDate() - diasAtras);
  d.setHours(h, m, 0, 0);
  return d;
};
const sistema = (icone: "camera" | "wifi" | "upload" | "store") => <ThemeIcon color="down"><Icon name={icone} /></ThemeIcon>;

type Aviso = NotificationListItem & { tipo: "Pessoas" | "Sistema" };
// os avisos do mockup W-Avisos
const avisos: Aviso[] = [
  { id: "1", tipo: "Sistema", title: "Câmera 2 sem imagem", description: "Lume Orla Fortaleza", date: as(0, 10, 40), icon: sistema("camera"), unread: true },
  { id: "2", tipo: "Pessoas", title: "Pessoa 0012", description: "Lume Orla Fortaleza", date: as(0, 10, 12), icon: <Avatar />, unread: true },
  { id: "3", tipo: "Pessoas", title: "Ana Souza", description: "Lume Orla Fortaleza", date: as(0, 8, 57), icon: <Avatar name="Ana Souza" /> },
  { id: "4", tipo: "Pessoas", title: "Bruno Lima", description: "Lume Jardins Bosque", date: as(0, 8, 41), icon: <Avatar name="Bruno Lima" /> },
  { id: "5", tipo: "Sistema", title: "Atualização do agente falhou", description: "Lume Orla Fortaleza", date: as(0, 7, 10), icon: sistema("upload") },
  { id: "6", tipo: "Sistema", title: "Agente sem contato", description: "Lume Jardins Bosque", date: as(1, 21, 15), icon: sistema("wifi") },
  { id: "7", tipo: "Pessoas", title: "Carla Dias", description: "Lume Centro Porto Velho", date: as(1, 18, 40), icon: <Avatar name="Carla Dias" /> },
  { id: "8", tipo: "Sistema", title: "Sem vendas", description: "Lume Centro Porto Velho", date: as(1, 17, 0), icon: sistema("store") },
  { id: "9", tipo: "Pessoas", title: "Ana Souza", description: "Lume Orla Fortaleza", date: as(6, 9, 2), icon: <Avatar name="Ana Souza" /> },
];

const meta = {
  title: "Dados/NotificationList",
  component: NotificationList,
  args: { items: avisos, defaultSelected: "3" },
  decorators: [(S) => <div style={{ maxWidth: "var(--cf-side-panel-width)" }}><S /></div>],
} satisfies Meta<typeof NotificationList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão (mockup W-Avisos)" };
export const SemEscolhido: Story = { name: "Sem aviso escolhido", args: { defaultSelected: null } };
export const TodosLidos: Story = { name: "Todos lidos", args: { items: avisos.map((a) => ({ ...a, unread: false })) } };
export const Vazio: Story = { args: { items: [] } };
export const VazioDoApp: Story = { name: "Vazio com texto do app", args: { items: [], emptyState: <p>Nenhum aviso do sistema nos últimos 30 dias.</p> } };
export const Carregando: Story = { args: { loading: true } };

function ComFiltroDemo() {
  const [filtro, setFiltro] = useState("Todos");
  const [escolhido, setEscolhido] = useState<string | null>("3");
  return (
    <Stack gap={2}>
      <SegmentedControl fullWidth aria-label="Filtro" data={["Todos", "Pessoas", "Sistema"]} value={filtro} onChange={setFiltro} />
      <NotificationList items={avisos.filter((a) => filtro === "Todos" || a.tipo === filtro)} selected={escolhido} onSelect={setEscolhido} />
    </Stack>
  );
}

/** Os filtros do topo são do app: um SegmentedControl acima da lista, que filtra os itens. */
export const ComFiltro: Story = { name: "Com o filtro Todos · Pessoas · Sistema", render: () => <ComFiltroDemo /> };
