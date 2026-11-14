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
} from "@floating-ui/react";
import {
  cloneElement,
  createContext,
  useContext,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { usePopoverBase, type FloatingOptions } from "../Popover/usePopover";
import { colorVar, useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./Menu.module.css";

export interface MenuProps extends FloatingOptions {
  /** Fecha ao escolher um item. Padrão: true. */
  closeOnItemClick?: boolean | undefined;
  disabled?: boolean | undefined;
  id?: string | undefined;
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
};

const MenuContext = createContext<Valor | null>(null);
function useMenuContext(): Valor {
  const c = useContext(MenuContext);
  if (!c)
    throw new Error("Menu.Target, Dropdown e Item ficam dentro de um Menu");
  return c;
}

/** O botão que abre o menu (um só filho). */
export function MenuTarget({
  children,
}: {
  children: ReactElement<Record<string, unknown> & { ref?: Ref<unknown> }>;
}) {
  const { refs, getReferenceProps } = useMenuContext();
  const ref = useMergeRefs([refs.setReference, children.props.ref]);
  return cloneElement(children, getReferenceProps({ ...children.props, ref }));
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
          {...c.getFloatingProps({ ...rest, id: c.id })}
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
    ...opcoes
  } = useComponentProps("Menu", {}, props);
  const base = useId(id);
  const p = usePopoverBase({ ...opcoes, position });
  const elementos = useRef<(HTMLElement | null)[]>([]);
  const rotulos = useRef<(string | null)[]>([]);
  const [ativo, setAtivo] = useState<number | null>(null);
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [
      useClick(p.context, { enabled: !disabled }),
      useDismiss(p.context),
      useRole(p.context, { role: "menu" }),
      useListNavigation(p.context, {
        listRef: elementos,
        activeIndex: ativo,
        onNavigate: setAtivo,
        loop: true,
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
