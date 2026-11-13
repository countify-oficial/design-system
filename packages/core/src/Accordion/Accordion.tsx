import { useControllableState, useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import { createContext, useContext, type ComponentPropsWithRef, type KeyboardEvent, type ReactNode } from "react";
import { Collapse } from "../Collapse/Collapse";
import { Icon } from "../Icon/Icon";
import { cx, useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./Accordion.module.css";

export interface AccordionProps extends StylesApiProps, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "onChange" | "defaultValue"> {
  /** Vários abertos ao mesmo tempo. Padrão: false (abrir um fecha o outro). */
  multiple?: boolean | undefined;
  /** Itens abertos (controlado), pelo value de cada Accordion.Item. */
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  /** separated: um cartão por item (0.1.0); contained: um cartão só. Padrão: separated. */
  variant?: "separated" | "contained" | undefined;
  /** Nível do título de cada item (h2 a h6). Padrão: 3. */
  order?: 2 | 3 | 4 | 5 | 6 | undefined;
}

interface Contexto {
  abertos: string[];
  alternar: (valor: string) => void;
  base: string;
  order: 2 | 3 | 4 | 5 | 6;
}

const AccordionContext = createContext<Contexto | null>(null);
const ItemContext = createContext<{ valor: string; disabled: boolean } | null>(null);

function useAccordionContext(): Contexto {
  const c = useContext(AccordionContext);
  if (!c) throw new Error("Accordion.Item, Control e Panel ficam dentro de um Accordion");
  return c;
}
function useAccordionItem() {
  const c = useContext(ItemContext);
  if (!c) throw new Error("Accordion.Control e Panel ficam dentro de um Accordion.Item");
  return c;
}

export interface AccordionItemProps extends StylesApiProps, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** Identifica o item no value do Accordion. */
  value: string;
  disabled?: boolean | undefined;
}

/** Um item: Accordion.Control (o título) e Accordion.Panel (o conteúdo). */
export function AccordionItem(props: AccordionItemProps) {
  const { value, disabled = false, className, style, classNames, styles, ...rest } = useComponentProps("AccordionItem", {}, props);
  const getStyles = useStyles("AccordionItem", { root: classes["item"] ?? "" }, { className, style, classNames, styles });
  return (
    <ItemContext value={{ valor: value, disabled }}>
      <div {...rest} {...getStyles("root")} />
    </ItemContext>
  );
}

export interface AccordionControlProps extends StylesApiProps<"root" | "chevron">, Omit<ComponentPropsWithRef<"button">, "className" | "style"> {
  /** Ícone no lugar da seta. */
  chevron?: ReactNode;
}

const CONTROLE = "[data-accordion-control]:not([disabled])";

/** O título que abre e fecha o item. Setas, Home e End andam entre os títulos. */
export function AccordionControl(props: AccordionControlProps) {
  const { abertos, alternar, base, order } = useAccordionContext();
  const { valor, disabled } = useAccordionItem();
  const { chevron, children, onKeyDown, className, style, classNames, styles, ...rest } = useComponentProps("AccordionControl", {}, props);
  const getStyles = useStyles("AccordionControl", { root: classes["control"] ?? "", chevron: classes["chevron"] ?? "" }, { className, style, classNames, styles });
  const Titulo = `h${order}` as const;
  const aoTeclar = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    const raiz = e.currentTarget.closest("[data-accordion]");
    if (!raiz) return;
    const todos = Array.from(raiz.querySelectorAll<HTMLButtonElement>(CONTROLE)).filter((b) => b.closest("[data-accordion]") === raiz);
    const i = todos.indexOf(e.currentTarget);
    const destino = { ArrowDown: todos[(i + 1) % todos.length], ArrowUp: todos[(i - 1 + todos.length) % todos.length], Home: todos[0], End: todos.at(-1) }[e.key];
    if (destino) {
      e.preventDefault();
      destino.focus();
    }
  };
  return (
    <Titulo className={classes["heading"]}>
      <UnstyledButton
        id={`${base}-${valor}-titulo`}
        aria-expanded={abertos.includes(valor)}
        aria-controls={`${base}-${valor}-painel`}
        data-accordion-control
        disabled={disabled}
        onClick={() => alternar(valor)}
        onKeyDown={aoTeclar}
        {...rest}
        {...getStyles("root")}
      >
        <span>{children}</span>
        <span {...getStyles("chevron")}>{chevron ?? <Icon name="chevron-down" />}</span>
      </UnstyledButton>
    </Titulo>
  );
}

export type AccordionPanelProps = StylesApiProps<"root" | "content"> & Omit<ComponentPropsWithRef<"div">, "className" | "style">;

/** O conteúdo do item, que abre com animação. */
export function AccordionPanel(props: AccordionPanelProps) {
  const { abertos, base } = useAccordionContext();
  const { valor } = useAccordionItem();
  const { children, className, style, classNames, styles, ...rest } = useComponentProps("AccordionPanel", {}, props);
  const getStyles = useStyles("AccordionPanel", { root: "", content: classes["content"] ?? "" }, { className, style, classNames, styles });
  const { className: raiz, style: estilo } = getStyles("root");
  return (
    <Collapse in={abertos.includes(valor)} className={cx(raiz)} style={estilo}>
      <div id={`${base}-${valor}-painel`} role="region" aria-labelledby={`${base}-${valor}-titulo`} {...rest} {...getStyles("content")}>
        {children}
      </div>
    </Collapse>
  );
}

function AccordionRoot(props: AccordionProps) {
  const { multiple, value, defaultValue, onChange, variant = "separated", order = 3, id, className, style, classNames, styles, ...rest } =
    useComponentProps("Accordion", {}, props);
  const getStyles = useStyles("Accordion", classes, { className, style, classNames, styles });
  const base = useId(id);
  const [abertos, setAbertos] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange });
  const alternar = (v: string) => {
    if (abertos.includes(v)) setAbertos(abertos.filter((a) => a !== v));
    else setAbertos(multiple ? [...abertos, v] : [v]);
  };
  return (
    <AccordionContext value={{ abertos, alternar, base, order }}>
      <div id={id} {...rest} data-accordion data-variant={variant} {...getStyles("root")} />
    </AccordionContext>
  );
}

/** Acordeão: títulos que abrem e fecham o conteúdo. Partes: Accordion.Item, Accordion.Control, Accordion.Panel. */
export const Accordion = Object.assign(AccordionRoot, { Item: AccordionItem, Control: AccordionControl, Panel: AccordionPanel });
