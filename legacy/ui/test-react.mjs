// Cada componente da web desenha sem erro e com a marcação que o CSS e a acessibilidade esperam.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as ui from "./dist/react/index.js";

const html = (c, p = {}, ...kids) => renderToStaticMarkup(h(ui[c], p, ...kids));
const lojas = [{ value: "lume", label: "Lume Centro" }, { value: "brisa", label: "Brisa Norte" }, { value: "farol", label: "Farol Orla", disabled: true }];

// props mínimas de cada componente; um componente novo sem exemplo aqui faz o teste falhar.
// Recebe o módulo (web ou nativo) para os filhos virem do mesmo lado.
export const exemplos = (ui) => ({
  ThemeProvider: [{ scheme: "dark" }, "x"],
  Icon: [{ name: "store" }],
  Logo: [{}],
  Text: [{ variant: "page" }, "Painel"],
  Screen: [{}, "x"],
  Grid: [{ columns: 2, columnsDesktop: 5 }, "x"],
  Card: [{}, "x"],
  Divider: [{}],
  SectionTitle: [{ help: h(ui.HelpButton, { topic: "vendas" }), action: h(ui.ActionLink, { href: "#" }, "Detalhes") }, "Vendas"],
  SectionLabel: [{}, "Salvas"],
  PageHeader: [{ title: "Lume Centro", eyebrow: "Estabelecimento", subtitle: "Aberta agora", onTitlePress() {}, titleLabel: "Lume Centro. Trocar", back: { label: "Voltar", href: "#" } }],
  NavBar: [{ items: [{ label: "Painel", icon: "dashboard", href: "#", current: true }, { label: "Avisos", icon: "bell", href: "#", badge: 3 }] }],
  Spinner: [{ label: "Carregando" }],
  Button: [{ icon: "plus", loading: true }, "Salvar"],
  IconButton: [{ icon: "close", label: "Fechar" }],
  HelpButton: [{ topic: "conversão" }],
  ActionLink: [{ href: "#" }, "Detalhes"],
  TextField: [{ label: "Senha", type: "password", value: "x", error: "Senha curta" }],
  SearchField: [{ placeholder: "Buscar loja" }],
  Select: [{ label: "Lojas", options: lojas, value: ["lume", "brisa"], multiple: true }],
  Checkbox: [{ label: "Aceito", checked: true }],
  CheckList: [{ items: lojas.map((l) => ({ id: l.value, label: l.label, disabled: l.disabled })), selected: ["lume"], onChange() {} }],
  RadioList: [{ options: lojas, value: "brisa" }],
  Switch: [{ label: "Avisar", checked: true }],
  Segmented: [{ options: ["Todos", "Pessoas"], value: "Todos" }],
  Chip: [{ onRemove() {} }, "Lume Orla"],
  FilterChip: [{}, "Hoje"],
  ChipGroup: [{ label: "Tipo", layout: "tiles" }, h(ui.Chip, { icon: "number", selected: true }, "Número")],
  Calendar: [{ start: new Date(2026, 10, 1), end: new Date(2026, 10, 10), max: new Date(2026, 10, 11) }],
  Stat: [{ label: "Ticket médio", value: "158", unit: "R$", detail: "3,2 peças", change: "3%", trend: "down", base: "vs. qua." }],
  List: [{ label: "Lojas" }, h(ui.ListItem, { title: "Lume", onPress() {} })],
  ListItem: [{ title: "Lume Centro", subtitle: "Fortaleza", trailing: "1.102", href: "#", leading: h(ui.IconTile, { icon: "store" }) }],
  IconTile: [{ icon: "camera", tone: "neutral" }],
  Avatar: [{ initials: "AR" }],
  Badge: [{ tone: "danger" }, "3"],
  Status: [{ tone: "ok" }, "Online"],
  DetailList: [{ items: [{ term: "Entradas", value: "300" }, { term: "Conversão", value: "14%", tone: "up" }] }],
  Table: [{ caption: "Lojas", columns: [{ key: "loja", label: "Loja" }, { key: "n", label: "Entradas", align: "end" }], rows: [{ loja: "Lume", n: "300" }], sort: { key: "n", dir: "desc" }, onSort() {} }],
  ProgressBar: [{ value: 1.08, marker: 0.37, label: "Meta" }],
  BarList: [{ numbered: true, items: [{ label: "Trilha", value: "14,2%", ratio: 0.9, marker: 0.8, detail: "268 entradas", change: "0,6 pt", trend: "up" }] }],
  Accordion: [{ title: "Mais opções" }, "x"],
  Steps: [{ steps: ["Imagem", "Sentido", "Calibração"], current: 1 }],
  Pagination: [{ page: 1, pageSize: 50, total: 312, onChange() {} }],
  LineChart: [{ label: "Entradas", labels: ["8h", "9h"], actual: [1, 2] }],
  BarChart: [{ label: "Entradas", values: [1, 2] }],
  ScatterChart: [{ label: "Lojas", points: [{ x: 1, y: 2 }] }],
  Heatmap: [{ label: "Horários", rows: ["seg"], columns: ["9h"], values: [[1]] }],
  Legend: [{ items: [{ label: "Real", kind: "line" }, { label: "Previsto", kind: "dashed" }] }],
  Sheet: [{ open: true, onClose() {}, title: "Período", footer: "x" }, "corpo"],
  Dialog: [{ open: true, onClose() {}, title: "Convidar" }, "corpo"],
  ConfirmDialog: [{ open: true, title: "Excluir análise?", message: "Sai para todos.", onConfirm() {}, onCancel() {} }],
  Popover: [{ open: true, onClose() {}, title: "Estabelecimento" }, "x"],
  Toast: [{ open: true, onClose() {}, message: "Convite enviado" }],
  Notice: [{ tone: "offline", title: "Sem conexão", action: { label: "Tentar de novo" } }, "Dados das 14:32"],
  EmptyState: [{ title: "Sem histórico", action: { label: "Conectar" } }],
  Skeleton: [{ height: 24 }],
});
const EXEMPLOS = exemplos(ui);

test("todo componente da web tem exemplo e desenha", () => {
  for (const nome of Object.keys(ui)) {
    assert.ok(EXEMPLOS[nome], `${nome} sem exemplo em test-react.mjs`);
    const [p, ...kids] = EXEMPLOS[nome];
    assert.doesNotThrow(() => html(nome, p, ...kids), nome);
  }
});

test("regras do guia na marcação", () => {
  const cl = html("CheckList", EXEMPLOS.CheckList[0]);
  assert.match(cl, /Selecionar todos/);
  assert.match(cl, /disabled=""/);
  const st = html("Stat", EXEMPLOS.Stat[0]);
  assert.match(st, /▼ /);
  assert.match(st, /class="cf-sr">queda de /);
  assert.ok(st.indexOf("R$") < st.indexOf("158"), "R$ vem antes do número");
  const cd = html("ConfirmDialog", EXEMPLOS.ConfirmDialog[0]);
  assert.match(cd, /role="alertdialog"/);
  assert.ok(cd.indexOf(">Cancelar</button>") < cd.indexOf(">Excluir</button>"), "Cancelar antes de Excluir");
  assert.match(html("HelpButton", { topic: "conversão" }), /aria-label="Ajuda: conversão"/);
  assert.match(html("IconButton", { icon: "close", label: "Fechar" }), /aria-label="Fechar"/);
  assert.match(html("TextField", EXEMPLOS.TextField[0]), /aria-invalid="true".*Mostrar senha/s);
  assert.match(html("Select", EXEMPLOS.Select[0]), />Todos</, "os livres marcados viram Todos");
  assert.match(html("ProgressBar", EXEMPLOS.ProgressBar[0]), /aria-valuenow="100".*width:100%/s);
  assert.match(html("Calendar", EXEMPLOS.Calendar[0]), /data-range="start".*data-range="in".*data-range="end"/s);
  assert.match(html("Button", { href: "#" }, "Ir"), /^<a /);
  assert.throws(() => html("Icon", { name: "nao-existe" }), /Ícone desconhecido/);
  // as quatro versões da marca: cabeçalho, ícone, nome e avatar (height é a altura; o avatar é redondo)
  assert.match(html("Logo", { height: 40 }), /viewBox="0 0 175 40".*width="175".*cf-logo__tile.*cf-logo__word/s);
  assert.doesNotMatch(html("Logo", { variant: "icon" }), /cf-logo__word/);
  assert.doesNotMatch(html("Logo", { variant: "word" }), /cf-logo__tile/);
  assert.match(html("Logo", { variant: "avatar", height: 96 }), /cf-logo--avatar.*width="96".*<circle class="cf-logo__tile".*cf-logo__word/s);
});
