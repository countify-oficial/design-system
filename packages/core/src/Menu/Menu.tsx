/* eslint-disable react-hooks/refs, @typescript-eslint/unbound-method -- Floating UI: refs.setReference e refs.setFloating são
   callback refs (funções soltas), não leitura de .current; é o uso documentado da biblioteca. */
import { useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import type { ColorRole } from "@countify-oficial/tokens";
import {
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  useClick,
  useDismiss,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
  type VirtualElement,
} from "@floating-ui/react";
import {
  cloneElement,
  createContext,
  type KeyboardEvent,
  useContext,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { flushSync } from "react-dom";
import { usePopoverBase, type FloatingOptions } from "../Popover/usePopover";
import { colorVar, useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./Menu.module.css";

export interface MenuProps extends FloatingOptions {
  /** Fecha ao escolher um item. Padrão: true. */
  closeOnItemClick?: boolean | undefined;
  disabled?: boolean | undefined;
  id?: string | undefined;
  /**
   * O que abre o menu. "click": o clique no Menu.Target (um botão). "context": menu de contexto; o Menu.Target vira a
   * área-alvo e o menu abre no ponto do clique direito, ou no elemento focado com Shift+F10 ou a tecla Menu. Deixe
   * algo focável dentro da área (ou a própria área com tabIndex) para quem usa o teclado. Padrão: "click".
   */
  trigger?: "click" | "context" | undefined;
  /** Menu.Target e Menu.Dropdown. */
  children?: ReactNode;
}

type Valor = ReturnType<typeof usePopoverBase> & {
  getReferenceProps: (p?: Record<string, unknown>) => Record<string, unknown>;
  getFloatingProps: (p?: Record<string, unknown>) => Record<string, unknown>;
  getItemProps: (p?: Record<string, unknown>) => Record<string, unknown>;
  ativo: number | null;
  elementos: React.RefObject<(HTMLElement | null)[]>;
  rotulos: React.RefObject<(string | null)[]>;
  fecharAoEscolher: boolean;
  id: string;
  contexto: boolean;
  desligado: boolean;
  abrirNoContexto: (
    referencia: Element | VirtualElement,
    porTeclado: boolean,
  ) => void;
};

const MenuContext = createContext<Valor | null>(null);
function useMenuContext(): Valor {
  const c = useContext(MenuContext);
  if (!c)
    throw new Error("Menu.Target, Dropdown e Item ficam dentro de um Menu");
  return c;
}

type Alvo = ReactElement<
  Record<string, unknown> & {
    ref?: Ref<unknown>;
    onContextMenu?: (e: MouseEvent) => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    onPointerDown?: (e: unknown) => void;
  }
>;

/** O botão que abre o menu (um só filho); com trigger="context", a área onde o clique direito abre o menu. */
export function MenuTarget({ children }: { children: Alvo }) {
  const c = useMenuContext();
  const ref = useMergeRefs([c.contexto ? null : c.refs.setReference, children.props.ref]);
  // Shift+F10 abre pelo keydown; o navegador ainda pode mandar o contextmenu dele depois, que não deve mover o menu
  const abertoPorTecla = useRef(false);
  if (!c.contexto)
    return cloneElement(children, c.getReferenceProps({ ...children.props, ref }));
  const p = children.props;
  return cloneElement(children, {
    ref,
    onPointerDown: (e: unknown) => {
      abertoPorTecla.current = false;
      p.onPointerDown?.(e);
    },
    onContextMenu: (e: MouseEvent) => {
      p.onContextMenu?.(e);
      if (c.desligado || e.defaultPrevented) return;
      e.preventDefault();
      if (abertoPorTecla.current) {
        abertoPorTecla.current = false;
        return;
      }
      const { clientX: x, clientY: y } = e;
      // um ponto sem tamanho no cursor: o flip e o shift do usePopoverBase o mantêm na tela
      const ponto = { x, y, top: y, left: x, right: x, bottom: y, width: 0, height: 0 };
      c.abrirNoContexto({ getBoundingClientRect: () => ponto }, false);
    },
    onKeyDown: (e: KeyboardEvent) => {
      p.onKeyDown?.(e);
      if (c.desligado || e.defaultPrevented) return;
      if (!((e.shiftKey && e.key === "F10") || e.key === "ContextMenu")) return;
      e.preventDefault();
      abertoPorTecla.current = true;
      c.abrirNoContexto(e.target as Element, true);
    },
  });
}

/** A lista do menu. */
export function MenuDropdown(
  props: StylesApiProps<"dropdown"> &
    Omit<ComponentPropsWithRef<"div">, "className" | "style">,
) {
  const c = useMenuContext();
  const { children, className, style, classNames, styles, ...rest } =
    useComponentProps("MenuDropdown", {}, props);
  const getStyles = useStyles(
    "Menu",
    { dropdown: classes["dropdown"] ?? "" },
    { className, style, classNames, styles },
    "dropdown",
  );
  if (!c.animacao.isMounted) return null;
  const { className: classe, style: estilo } = getStyles("dropdown");
  return (
    <FloatingPortal>
      <FloatingFocusManager
        context={c.context}
        modal={false}
        initialFocus={0}
        returnFocus
      >
        <div
          ref={c.refs.setFloating}
          {...c.getFloatingProps({
            ...rest,
            id: c.id,
            // no menu de contexto o useRole fica desligado (não há botão que o nomeie); o papel vem daqui
            ...(c.contexto && {
              role: "menu",
              onContextMenu: (e: MouseEvent) => e.preventDefault(),
            }),
          })}
          className={classe}
          style={{
            ...c.floatingStyles,
            ...c.larguraFixa,
            ...estilo,
            ...c.animacao.styles,
          }}
        >
          <FloatingList elementsRef={c.elementos} labelsRef={c.rotulos}>
            {children}
          </FloatingList>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}

export interface MenuItemProps
  extends
    StylesApiProps<"item" | "itemLabel" | "itemSection">,
    Omit<ComponentPropsWithRef<"button">, "className" | "style" | "color"> {
  /** Ícone antes do texto. */
  leftSection?: ReactNode;
  /** Atalho ou seta depois do texto. */
  rightSection?: ReactNode;
  /** Papel de cor (down para "Excluir"). */
  color?: ColorRole | undefined;
  /** Mantém o menu aberto ao escolher este item. */
  closeMenuOnClick?: boolean | undefined;
  disabled?: boolean | undefined;
  children?: ReactNode;
}

/** Um item do menu (setas andam, letras buscam, Enter escolhe). */
export function MenuItem(props: MenuItemProps) {
  const c = useMenuContext();
  const {
    leftSection,
    rightSection,
    color,
    closeMenuOnClick,
    disabled,
    onClick,
    children,
    className,
    style,
    classNames,
    styles,
    ...rest
  } = useComponentProps("MenuItem", {}, props);
  const getStyles = useStyles(
    "MenuItem",
    {
      item: classes["item"] ?? "",
      itemLabel: classes["itemLabel"] ?? "",
      itemSection: classes["itemSection"] ?? "",
    },
    { className, style, classNames, styles },
    "item",
  );
  const { ref, index } = useListItem({
    label: disabled ? null : typeof children === "string" ? children : null,
  });
  const ativo = c.ativo === index;
  return (
    <UnstyledButton
      ref={ref}
      role="menuitem"
      tabIndex={ativo ? 0 : -1}
      disabled={disabled}
      data-active={ativo || undefined}
      {...c.getItemProps({
        ...rest,
        onClick: (e: MouseEvent<HTMLButtonElement>) => {
          onClick?.(e);
          if (closeMenuOnClick ?? c.fecharAoEscolher) c.setAberto(false);
        },
      })}
      {...getStyles(
        "item",
        color ? { "--item-color": colorVar(color) } : undefined,
      )}
    >
      {leftSection !== undefined && (
        <span {...getStyles("itemSection")}>{leftSection}</span>
      )}
      <span {...getStyles("itemLabel")}>{children}</span>
      {rightSection !== undefined && (
        <span {...getStyles("itemSection")}>{rightSection}</span>
      )}
    </UnstyledButton>
  );
}

/** Título de um grupo de itens. */
export function MenuLabel({ children }: { children?: ReactNode }) {
  return (
    <div role="presentation" className={classes["label"]}>
      {children}
    </div>
  );
}

/** Linha entre grupos. */
export function MenuDivider() {
  return <div role="separator" className={classes["divider"]} />;
}

/** Menu de ações que abre num botão (Editar, Duplicar, Excluir). */
function MenuRoot(props: MenuProps) {
  const {
    closeOnItemClick = true,
    disabled,
    id,
    children,
    position = "bottom-start",
    trigger = "click",
    ...opcoes
  } = useComponentProps("Menu", {}, props);
  const contexto = trigger === "context";
  const base = useId(id);
  // o menu de contexto nasce colado no ponto do clique (sem a distância do botão)
  const p = usePopoverBase({ ...opcoes, offset: opcoes.offset ?? (contexto ? 0 : undefined), position });
  const elementos = useRef<(HTMLElement | null)[]>([]);
  const rotulos = useRef<(string | null)[]>([]);
  const [ativo, setAtivo] = useState<number | null>(null);
  // aberto pelo teclado, o foco vai ao primeiro item; pelo mouse, à lista (como no Menu de botão)
  const [porTeclado, setPorTeclado] = useState(false);
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [
      useClick(p.context, { enabled: !disabled && !contexto }),
      useDismiss(p.context),
      useRole(p.context, { role: "menu", enabled: !contexto }),
      useListNavigation(p.context, {
        listRef: elementos,
        activeIndex: ativo,
        onNavigate: setAtivo,
        loop: true,
        focusItemOnOpen: contexto ? porTeclado : "auto",
      }),
      useTypeahead(p.context, {
        listRef: rotulos,
        activeIndex: ativo,
        onMatch: (i) => p.aberto && setAtivo(i),
      }),
    ],
  );
  return (
    <MenuContext
      value={{
        ...p,
        getReferenceProps,
        getFloatingProps,
        getItemProps,
        ativo,
        elementos,
        rotulos,
        fecharAoEscolher: closeOnItemClick,
        id: base,
        contexto,
        desligado: !!disabled,
        abrirNoContexto: (referencia, teclado) => {
          // o useListNavigation lê focusItemOnOpen enquanto o menu está fechado: grava antes de abrir
          flushSync(() => setPorTeclado(teclado));
          p.refs.setPositionReference(referencia);
          p.setAberto(true);
        },
      }}
    >
      {children}
    </MenuContext>
  );
}

/** Menu: Menu.Target, Menu.Dropdown, Menu.Item, Menu.Label e Menu.Divider. */
export const Menu = Object.assign(MenuRoot, {
  Target: MenuTarget,
  Dropdown: MenuDropdown,
  Item: MenuItem,
  Label: MenuLabel,
  Divider: MenuDivider,
});
