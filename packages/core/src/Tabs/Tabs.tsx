import { useControllableState, useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import {
  createContext,
  useContext,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./Tabs.module.css";

export type TabsVariant = "segmented" | "pills" | "chips";

export interface TabsProps
  extends
    StylesApiProps,
    Omit<
      ComponentPropsWithRef<"div">,
      "className" | "style" | "onChange" | "defaultValue"
    > {
  /** A aba aberta (controlado). */
  value?: string | null | undefined;
  defaultValue?: string | null | undefined;
  onChange?: ((value: string | null) => void) | undefined;
  /** segmented: o "Segmentado" do mockup (2 a 4 opções); pills: a pílula do menu; chips: fileira que rola. Padrão: segmented. */
  variant?: TabsVariant | undefined;
  /** Padrão: horizontal. vertical põe a lista ao lado do conteúdo. */
  orientation?: "horizontal" | "vertical" | undefined;
  /** As setas já abrem a aba (true) ou só movem o foco, e Enter/espaço abre (false). Padrão: true. */
  activateTabWithKeyboard?: boolean | undefined;
  /** As setas dão a volta no fim da lista. Padrão: true. */
  loop?: boolean | undefined;
  /** Mantém os painéis fechados no DOM (escondidos). Padrão: false. */
  keepMounted?: boolean | undefined;
}

interface Contexto {
  valor: string | null;
  abrir: (v: string) => void;
  base: string;
  variant: TabsVariant;
  orientation: "horizontal" | "vertical";
  activateTabWithKeyboard: boolean;
  loop: boolean;
  keepMounted: boolean;
}
const TabsContext = createContext<Contexto | null>(null);
function useTabs(): Contexto {
  const c = useContext(TabsContext);
  if (!c)
    throw new Error("Tabs.List, Tabs.Tab e Tabs.Panel ficam dentro de um Tabs");
  return c;
}
const idDe = (base: string, parte: "tab" | "panel", valor: string) =>
  `${base}-${parte}-${valor.replace(/\s+/g, "-")}`;

function TabsRoot(props: TabsProps) {
  const {
    value,
    defaultValue,
    onChange,
    variant = "segmented",
    orientation = "horizontal",
    activateTabWithKeyboard = true,
    loop = true,
    keepMounted = false,
    className,
    style,
    classNames,
    styles,
    ...rest
  } = useComponentProps("Tabs", {}, props);
  const getStyles = useStyles("Tabs", classes, {
    className,
    style,
    classNames,
    styles,
  });
  const [valor, setValor] = useControllableState<string | null>({
    value,
    defaultValue: defaultValue ?? null,
    onChange,
  });
  const base = useId();
  return (
    <TabsContext
      value={{
        valor,
        abrir: setValor,
        base,
        variant,
        orientation,
        activateTabWithKeyboard,
        loop,
        keepMounted,
      }}
    >
      <div data-orientation={orientation} {...rest} {...getStyles("root")} />
    </TabsContext>
  );
}

export interface TabsListProps
  extends
    StylesApiProps<"list">,
    Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** As abas dividem a largura toda. */
  grow?: boolean | undefined;
}

/** A lista de abas (role tablist). */
export function TabsList(props: TabsListProps) {
  const c = useTabs();
  const { grow, className, style, classNames, styles, ...rest } =
    useComponentProps("TabsList", {}, props);
  const getStyles = useStyles(
    "Tabs",
    { list: classes["list"] ?? "" },
    { className, style, classNames, styles },
    "list",
  );
  return (
    <div
      role="tablist"
      aria-orientation={c.orientation}
      data-variant={c.variant}
      data-grow={grow || undefined}
      {...rest}
      {...getStyles("list")}
    />
  );
}

/** Setas andam entre as abas da mesma lista; Home e End vão às pontas. */
function navegar(e: KeyboardEvent<HTMLButtonElement>, c: Contexto) {
  const [antes, depois] =
    c.orientation === "vertical"
      ? ["ArrowUp", "ArrowDown"]
      : ["ArrowLeft", "ArrowRight"];
  const abas = Array.from(
    e.currentTarget
      .closest('[role="tablist"]')
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ??
      [],
  );
  const i = abas.indexOf(e.currentTarget);
  const n = abas.length;
  const passo = (d: number) =>
    c.loop ? (i + d + n) % n : Math.max(0, Math.min(n - 1, i + d));
  const destino = {
    [antes]: passo(-1),
    [depois]: passo(1),
    Home: 0,
    End: n - 1,
  }[e.key];
  if (i < 0 || destino === undefined) return;
  e.preventDefault();
  const aba = abas[destino];
  aba?.focus();
  const v = aba?.dataset["value"];
  if (c.activateTabWithKeyboard && v !== undefined) c.abrir(v);
}

export interface TabsTabProps
  extends
    StylesApiProps<"tab" | "section">,
    Omit<ComponentPropsWithRef<"button">, "className" | "style" | "value"> {
  value: string;
  leftSection?: ReactNode;
  /** Depois do rótulo (um Badge com a contagem, por exemplo). */
  rightSection?: ReactNode;
}

/** Uma aba. Só a aberta entra no Tab; as outras, pelas setas. */
export function TabsTab(props: TabsTabProps) {
  const c = useTabs();
  const {
    value,
    leftSection,
    rightSection,
    children,
    onClick,
    onKeyDown,
    className,
    style,
    classNames,
    styles,
    ...rest
  } = useComponentProps("TabsTab", {}, props);
  const getStyles = useStyles(
    "Tabs",
    { tab: classes["tab"] ?? "", section: classes["section"] ?? "" },
    { className, style, classNames, styles },
    "tab",
  );
  const aberta = c.valor === value;
  return (
    <UnstyledButton
      role="tab"
      id={idDe(c.base, "tab", value)}
      aria-selected={aberta}
      aria-controls={idDe(c.base, "panel", value)}
      tabIndex={aberta || c.valor === null ? 0 : -1}
      data-value={value}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        c.abrir(value);
      }}
      onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);
        navegar(e, c);
      }}
      {...rest}
      {...getStyles("tab")}
    >
      {leftSection !== undefined && (
        <span {...getStyles("section")}>{leftSection}</span>
      )}
      {children}
      {rightSection !== undefined && (
        <span {...getStyles("section")}>{rightSection}</span>
      )}
    </UnstyledButton>
  );
}

export interface TabsPanelProps
  extends
    StylesApiProps<"panel">,
    Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  value: string;
  /** Fica no DOM fechado (escondido). Padrão: o do Tabs. */
  keepMounted?: boolean | undefined;
}

/** O conteúdo de uma aba. */
export function TabsPanel(props: TabsPanelProps) {
  const c = useTabs();
  const { value, keepMounted, className, style, classNames, styles, ...rest } =
    useComponentProps("TabsPanel", {}, props);
  const getStyles = useStyles(
    "Tabs",
    { panel: classes["panel"] ?? "" },
    { className, style, classNames, styles },
    "panel",
  );
  const aberta = c.valor === value;
  if (!aberta && !(keepMounted ?? c.keepMounted)) return null;
  return (
    <div
      role="tabpanel"
      id={idDe(c.base, "panel", value)}
      aria-labelledby={idDe(c.base, "tab", value)}
      tabIndex={0}
      hidden={!aberta}
      {...rest}
      {...getStyles("panel")}
    />
  );
}

/** Abas: Tabs.List com Tabs.Tab e um Tabs.Panel por aba. */
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});
