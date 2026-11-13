// Contrato dos componentes do Countify: as mesmas props na web (react/) e no celular (native/).
// Os dois lados tipam cada componente com o tipo daqui; o tsc acusa quando um lado foge dele.
// style fica de fora: cada plataforma põe o seu (CSSProperties na web, StyleProp no celular).
// Diferenças de plataforma estão anotadas: "web:" vale só para React/Electron, "nativo:" só para React Native.
import type { ReactNode } from "react";
import type { IconName } from "./icons.js";

export type { IconName };
export type Trend = "up" | "down" | "flat";
type Tone = "accent" | "neutral" | "up" | "down";

/** Comum a todos. web: className e id vão para o elemento raiz. nativo: testID vai para a View raiz. */
export interface Base {
  className?: string;
  id?: string;
  testID?: string;
}
/** Algo que se toca. web: com href vira <a>, sem href vira <button>. nativo: só onPress (para navegar, envolva em <Link asChild>). */
export interface Pressable {
  href?: string;
  onPress?: () => void;
  disabled?: boolean;
}
export interface Action extends Pressable {
  label: string;
}

// ---------- base
/** Segue o modo do aparelho; scheme força claro ou escuro. web: grava data-theme no <html>. */
export type ThemeProviderProps = { scheme?: "light" | "dark"; children?: ReactNode };
/** Ícone de traço, 22 px, na cor do texto. Com label vira imagem acessível; sem label é decoração. */
export type IconProps = Base & { name: IconName; size?: number; color?: string; label?: string };
/** Logo: "full" (cabeçalho: ícone + nome), "icon", "word" (só o nome) ou "avatar" (nome no círculo; height é o diâmetro).
 *  Cores do modo atual. */
export type LogoProps = Base & { variant?: "full" | "icon" | "word" | "avatar"; height?: number; label?: string };
/** Texto na escala do guia: page 22/28 (computador), section 20, number 28, body 17, label 15, small 13, overline 13 maiúsculo. */
export type TextProps = Base & {
  variant?: "page" | "section" | "number" | "body" | "label" | "small" | "overline";
  tone?: "default" | "muted" | "accent" | "up" | "down";
  weight?: 400 | 500 | 700;
  /** web: tag usada (padrão span; page vira h1, section vira h2) */
  as?: string;
  numberOfLines?: number;
  children?: ReactNode;
};

// ---------- estrutura
/** A tela: margem de 20 (32 no computador), áreas seguras, 24 entre seções. nativo: SafeAreaView + rolagem (scroll=false desliga). */
export type ScreenProps = Base & { scroll?: boolean; children?: ReactNode };
/** Grade de colunas iguais. columnsDesktop vale a partir de 768 px (web). */
export type GridProps = Base & { columns?: number; columnsDesktop?: number; gap?: number; children?: ReactNode };
/** Cartão: fundo de cartão, canto 16, contorno de 1 px. */
export type CardProps = Base & { padding?: number; gap?: number; children?: ReactNode };
export type DividerProps = Base;
/** Título de seção (20/700) com ajuda (?) e ação à direita (ex.: "Detalhes ›"). */
export type SectionTitleProps = Base & { children: ReactNode; help?: ReactNode; action?: ReactNode };
/** Rótulo de grupo: 13/700 maiúsculo (ex.: SALVAS). */
export type SectionLabelProps = Base & { children: ReactNode };
/** Topo da tela: voltar, sobretítulo, título (com seletor ▾ quando onTitlePress), subtítulo e ações (filtros, botões). */
export type PageHeaderProps = Base & {
  title: string;
  subtitle?: ReactNode;
  eyebrow?: string;
  back?: Action;
  onTitlePress?: () => void;
  /** nome acessível do seletor: "Lume Centro. Trocar de estabelecimento" */
  titleLabel?: string;
  actions?: ReactNode;
};
export interface NavItem extends Pressable {
  label: string;
  icon: IconName;
  current?: boolean;
  badge?: number;
}
/** Navegação: quatro abas embaixo no celular; menu superior a partir de 768 px.
 *  start e end (logo, conta, usuário) só aparecem no computador; nativo: ignorados. */
export type NavBarProps = Base & { items: NavItem[]; start?: ReactNode; end?: ReactNode; label?: string };

// ---------- ações
/** Botão (padrão primary; use um primary por tela). 52 px no celular, 44 no computador (size="sm" força 44). loading desabilita e mostra o giro. */
export type ButtonProps = Base & Pressable & {
  variant?: "primary" | "secondary" | "danger" | "danger-text" | "dashed";
  size?: "md" | "sm";
  block?: boolean;
  icon?: IconName;
  loading?: boolean;
  /** web: submit dentro de formulário */
  type?: "button" | "submit";
  /** web: foco ao abrir (o ConfirmDialog põe no Cancelar) */
  autoFocus?: boolean;
  children: ReactNode;
};
/** Botão só com ícone, 44 × 44; label é obrigatório (leitor de tela). */
export type IconButtonProps = Base & Pressable & { icon: IconName; label: string; variant?: "plain" | "filled" };
/** O "?": abre a explicação de como o número é calculado. */
export type HelpButtonProps = Base & Pressable & { topic: string };
/** Link de ação em destaque com › (ex.: "Detalhes"). */
export type ActionLinkProps = Base & Pressable & { children: ReactNode; chevron?: boolean };

// ---------- entrada
/** Campo com rótulo sempre visível. type: password tem o olho para mostrar; code é o código de ativação ou verificação;
 *  time formata HH:MM; decimal abre o teclado numérico. multiline vira área de texto. */
export type TextFieldProps = Base & {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: "text" | "email" | "password" | "tel" | "decimal" | "code" | "time";
  placeholder?: string;
  suffix?: string;
  icon?: IconName;
  hint?: string;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  maxLength?: number;
  autoComplete?: string;
};
export type SearchFieldProps = Base & { value?: string; onChange?: (value: string) => void; placeholder?: string; label?: string };
export interface Option {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
/** Escolha de uma opção (ou várias, com "Selecionar todos") que abre uma folha. Aparência de campo.
 *  Uma opção: tocar escolhe e fecha. Várias: cada toque já vale; "Pronto" fecha. Texto fechado: lib.selectSummary. */
export type SelectProps = Base & {
  label: string;
  options: Option[];
  value?: string | string[];
  onChange?: (value: any) => void;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
};
/** Uma caixa de marcar com texto (ex.: aceite). Para lista, use CheckList. */
export type CheckboxProps = Base & { label: string; description?: string; checked?: boolean; onChange?: (checked: boolean) => void; disabled?: boolean };
export interface CheckItem {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
/** Lista de seleção múltipla; a primeira linha é sempre "Selecionar todos" (fica indeterminada quando há parte marcada). */
export type CheckListProps = Base & { items: CheckItem[]; selected: string[]; onChange: (ids: string[]) => void; allLabel?: string; label?: string };
/** Lista de escolha única (rádio). */
export type RadioListProps = Base & { options: Option[]; value?: string; onChange?: (value: string) => void; label?: string };
/** Interruptor em linha: aplica na hora, sem botão Salvar. */
export type SwitchProps = Base & { label: string; description?: string; checked?: boolean; onChange?: (checked: boolean) => void; disabled?: boolean };
/** Segmentado: de 2 a 4 opções. */
export type SegmentedProps = Base & { options: string[]; value?: string; onChange?: (value: string) => void; label?: string };
/** Chip de escolha (liga e desliga). dashed: "+ Adicionar". onRemove põe o × (ex.: loja na comparação). */
export type ChipProps = Base & Pressable & { selected?: boolean; dashed?: boolean; icon?: IconName; onRemove?: () => void; removeLabel?: string; children: ReactNode };
/** Chip de filtro com ▾: único padrão de filtro (período, comparação). */
export type FilterChipProps = Base & Pressable & { children: ReactNode };
/** Grupo de chips: quebra linha, rola de lado (scroll) ou vira grade de blocos com ícone (tiles). Escolha sempre com "Todos". */
export type ChipGroupProps = Base & { label?: string; layout?: "wrap" | "scroll" | "tiles"; children: ReactNode };
/** Calendário de um mês com período (início e fim). min/max limitam (ex.: nada depois de hoje). */
export type CalendarProps = Base & {
  start?: Date | null;
  end?: Date | null;
  onChange?: (range: { start: Date; end: Date | null }) => void;
  min?: Date;
  max?: Date;
};

// ---------- dados
/** Número com contexto: rótulo, valor grande, unidade pequena (R$ antes, o resto depois), detalhe (peças) e variação ▲▼ com a base. */
export type StatProps = Base & {
  label: string;
  value: string;
  unit?: string;
  detail?: ReactNode;
  change?: string;
  trend?: Trend;
  base?: string;
  help?: ReactNode;
  badge?: ReactNode;
};
/** Lista em cartão; as linhas são ListItem. */
export type ListProps = Base & { label?: string; children: ReactNode };
/** Linha de 64: ícone, título, subtítulo, valor à direita e › quando se toca. */
export type ListItemProps = Base & Pressable & {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  chevron?: boolean;
  tone?: "accent" | "down";
};
/** Ícone em bloco de 40 (canto 12, ou redondo). */
export type IconTileProps = Base & { icon: IconName; tone?: Tone; round?: boolean };
/** Pessoa: foto (src) ou iniciais; 40 por padrão. */
export type AvatarProps = Base & { initials?: string; src?: string; size?: number; label?: string };
/** Etiqueta: número (danger, ex.: avisos) ou texto curto (neutral, ex.: "parcial"). */
export type BadgeProps = Base & { tone?: "neutral" | "accent" | "danger"; children: ReactNode };
/** Situação: bolinha + texto, nunca só a cor. */
export type StatusProps = Base & { tone?: "ok" | "danger" | "neutral"; children: ReactNode };
/** Termo à esquerda, valor à direita, linhas de 48. */
export type DetailListProps = Base & { items: { term: ReactNode; value: ReactNode; tone?: "up" | "down" | "accent" }[] };
export interface Column {
  key: string;
  label: string;
  align?: "start" | "end";
  sortable?: boolean;
}
/** Tabela com cabeçalho fixo; números à direita. Rola de lado quando não cabe (também no celular). */
export type TableProps = Base & {
  caption: string;
  columns: Column[];
  rows: Record<string, ReactNode>[];
  sort?: { key: string; dir: "asc" | "desc" };
  onSort?: (key: string) => void;
};
/** Barra de progresso (meta): value e marker de 0 a 1; marker é onde deveria estar hoje. */
export type ProgressBarProps = Base & { value: number; marker?: number; label: string };
export interface BarListItem {
  label: string;
  value: string;
  /** de 0 a 1 */
  ratio: number;
  marker?: number;
  detail?: ReactNode;
  change?: string;
  trend?: Trend;
}
/** Ranking: posição, nome, valor, barra, detalhe e variação. Serve também ao funil. */
export type BarListProps = Base & { items: BarListItem[]; numbered?: boolean; label?: string };
/** Abre e fecha um bloco (ex.: opções avançadas). web: <details>. */
export type AccordionProps = Base & { title: string; defaultOpen?: boolean; children: ReactNode };
/** Passos de um fluxo (ex.: instalação): barras e "2 de 5 · Calibração". */
export type StepsProps = Base & { steps: string[]; /** índice do passo atual (0 = primeiro) */ current: number };
/** Página de uma lista longa: ‹ 1–50 de 312 ›. */
export type PaginationProps = Base & { page: number; pageSize: number; total: number; onChange: (page: number) => void };

// ---------- gráficos (SVG; mesma conta na web e no celular, em charts.ts)
export interface ChartBase extends Base {
  /** frase que o leitor de tela lê: o que o gráfico mostra e o ponto principal */
  label: string;
  height?: number;
  format?: (v: number) => string;
}
export type LineChartProps = ChartBase & {
  labels: string[];
  actual: (number | null)[];
  forecast?: (number | null)[];
  band?: [number[], number[]];
  gaps?: number[];
  partial?: number;
  now?: number;
  max?: number;
};
export type BarChartProps = ChartBase & { values: (number | null)[]; labels?: string[]; forecast?: (number | null)[]; highlight?: number; axis?: boolean; max?: number };
export type ScatterChartProps = ChartBase & { points: { x: number; y: number; label?: string }[]; formatX?: (v: number) => string; formatY?: (v: number) => string };
export type HeatmapProps = ChartBase & { rows: string[]; columns: string[]; values: (number | null)[][] };
export type LegendProps = Base & { items: { label: string; kind: "line" | "dashed" | "bar" | "highlight" | "band" | "gap" }[] };

// ---------- camadas
/** Folha: sobe de baixo no celular; painel lateral de 380 px no computador. */
export type SheetProps = Base & { open: boolean; onClose: () => void; title: string; subtitle?: string; footer?: ReactNode; children?: ReactNode };
/** Janela no centro, fundo escurecido. */
export type DialogProps = Base & { open: boolean; onClose: () => void; title: string; footer?: ReactNode; children?: ReactNode };
/** Pergunta antes de apagar: título, consequência, Cancelar e Excluir. Foco começa em Cancelar. */
export type ConfirmDialogProps = Base & {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};
/** Lista que desce de um botão (seletor no computador). nativo: vira folha.
 *  web: anchor é o ref do botão de onde ela desce (sem anchor, abre no canto superior direito). */
export type PopoverProps = Base & { open: boolean; onClose: () => void; title: string; children?: ReactNode; width?: number; anchor?: { current: unknown } };
/** Aviso curto que some sozinho (padrão 4 s): "Convite enviado". nativo: ponha na raiz da tela (fica por cima, preso embaixo). */
export type ToastProps = Base & { open: boolean; onClose: () => void; message: string; tone?: "neutral" | "danger"; duration?: number; action?: Action };

// ---------- estados
/** Faixa de aviso: sem conexão (com a hora do último dado), erro, muitas tentativas, conta suspensa. */
export type NoticeProps = Base & { tone?: "info" | "danger" | "offline"; title: string; children?: ReactNode; action?: Action };
/** Vazio não é zero: diz o que falta e oferece a ação. Também para erro ("Tentar de novo"). */
export type EmptyStateProps = Base & { icon?: IconName; title: string; description?: string; action?: Action };
/** Bloco cinza do tamanho do conteúdo, enquanto carrega. */
export type SkeletonProps = Base & { width?: number | string; height?: number; radius?: number };
/** nativo: no iOS o tamanho vira "small" (até 24) ou "large". */
export type SpinnerProps = Base & { size?: number; label?: string };
