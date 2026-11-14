/* eslint-disable react-hooks/refs, @typescript-eslint/unbound-method -- Floating UI: refs.setReference e refs.setFloating são
   callback refs (funções soltas), não leitura de .current; é o uso documentado da biblioteca. */
import { useControllableState, useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import {
  FloatingList,
  FloatingPortal,
  useDismiss,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  type Placement,
} from "@floating-ui/react";
import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type FocusEvent,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { Icon } from "../Icon/Icon";
import { usePopoverBase, type PopoverBase } from "../Popover/usePopover";
import { useStyles, type StylesApiProps } from "../styles";
import inputClasses from "../Input/Input.module.css";
import classes from "./Combobox.module.css";

export interface ComboboxProps {
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenedChange?: ((opened: boolean) => void) | undefined;
  /** Chamado ao escolher uma opção (clique ou Enter). */
  onOptionSubmit?: ((value: string) => void) | undefined;
  /** Padrão: bottom-start. */
  position?: Placement | undefined;
  /** Lista solta, sempre aberta, sem flutuar (dentro de um Popover ou de uma folha). */
  inline?: boolean | undefined;
  /** select: o alvo é um botão (escolhe sem digitar); combobox: o alvo é um campo de texto. Padrão: combobox. */
  role?: "combobox" | "select" | undefined;
  /** Altura máxima da lista. Padrão: 6 linhas de 44. */
  maxDropdownHeight?: number | string | undefined;
  disabled?: boolean | undefined;
  children?: ReactNode;
}

interface Contexto {
  aberto: boolean;
  setAberto: (v: boolean) => void;
  ativo: number | null;
  base: PopoverBase;
  getReferenceProps: (p?: Record<string, unknown>) => Record<string, unknown>;
  getFloatingProps: (p?: Record<string, unknown>) => Record<string, unknown>;
  getItemProps: (
    p?: Record<string, unknown> & { active?: boolean; selected?: boolean },
  ) => Record<string, unknown>;
  elementos: React.RefObject<(HTMLElement | null)[]>;
  enviar: (v: string) => void;
  inline: boolean;
  altura: string;
  id: string;
}

const ComboboxContext = createContext<Contexto | null>(null);
export function useComboboxContext(): Contexto {
  const c = useContext(ComboboxContext);
  if (!c) throw new Error("As partes do Combobox ficam dentro de um Combobox");
  return c;
}

/** O alvo: um campo (role combobox) ou um botão. Setas abrem e andam; Enter escolhe; Esc fecha. */
export function ComboboxTarget({
  children,
}: {
  children: ReactElement<
    Record<string, unknown> & {
      ref?: Ref<unknown>;
      onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
      onBlur?: (e: FocusEvent<HTMLElement>) => void;
    }
  >;
}) {
  const c = useComboboxContext();
  // A lista se alinha à caixa do campo, e não ao <input> de dentro (mais estreito e recuado): sem isso ela abria mais
  // estreita que a caixa e quebrava o texto das opções. Quem usa Combobox.Anchor troca a referência depois.
  const posicionarEm = c.base.refs.setPositionReference;
  const naCaixa = useCallback(
    (el: Element | null) => {
      const caixa = el?.closest(`.${inputClasses["root"] ?? ""}`);
      if (caixa) posicionarEm(caixa);
    },
    [posicionarEm],
  );
  const ref = useMergeRefs([c.base.refs.setReference, naCaixa, children.props.ref]);
  return cloneElement(
    children,
    c.getReferenceProps({
      ...children.props,
      ref,
      onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        // a opção marcada vem antes do campo: o Enter do TagsInput vê o defaultPrevented e não cria o texto digitado
        if (e.key === "Enter" && c.aberto && c.ativo !== null) {
          e.preventDefault();
          const v = c.elementos.current[c.ativo]?.dataset["value"];
          if (v !== undefined) c.enviar(v);
        }
        children.props.onKeyDown?.(e);
      },
      // sair do campo (Tab) fecha a lista; clicar nela não conta (o foco fica no campo ou vai para a própria lista)
      onBlur: (e: FocusEvent<HTMLElement>) => {
        children.props.onBlur?.(e);
        if (!c.inline && !c.base.refs.floating.current?.contains(e.relatedTarget)) c.setAberto(false);
      },
      "aria-autocomplete": "list",
      // solta (inline), o papel não vem do useRole
      ...(c.inline
        ? { role: "combobox", "aria-controls": c.id, "aria-expanded": true }
        : {}),
    }),
  );
}

/** Onde a lista se alinha, quando não é o próprio alvo (a caixa inteira do MultiSelect, por exemplo). */
export function ComboboxAnchor({
  children,
}: {
  children: ReactElement<Record<string, unknown> & { ref?: Ref<unknown> }>;
}) {
  const c = useComboboxContext();
  const ref = useMergeRefs([
    c.base.refs.setPositionReference,
    children.props.ref,
  ]);
  return cloneElement(children, { ref });
}

export type ComboboxDropdownProps = StylesApiProps<"dropdown"> &
  Omit<ComponentPropsWithRef<"div">, "className" | "style">;

/** A lista que abre (ou fica solta, com inline). */
export function ComboboxDropdown(props: ComboboxDropdownProps) {
  const c = useComboboxContext();
  const { children, className, style, classNames, styles, ...rest } =
    useComponentProps("ComboboxDropdown", {}, props);
  const getStyles = useStyles(
    "Combobox",
    { dropdown: classes["dropdown"] ?? "" },
    { className, style, classNames, styles },
    "dropdown",
  );
  const { className: classe, style: estilo } = getStyles("dropdown", {
    "--combobox-max-height": c.altura,
  });
  const lista = (
    <FloatingList elementsRef={c.elementos}>{children}</FloatingList>
  );
  if (c.inline)
    return (
      <div
        role="listbox"
        id={c.id}
        data-inline
        {...rest}
        className={classe}
        style={estilo}
      >
        {lista}
      </div>
    );
  if (!c.base.animacao.isMounted) return null;
  return (
    <FloatingPortal>
      <div
        ref={c.base.refs.setFloating}
        {...c.getFloatingProps({ ...rest, id: c.id })}
        className={classe}
        style={{
          ...c.base.floatingStyles,
          ...estilo,
          ...c.base.animacao.styles,
        }}
      >
        {lista}
      </div>
    </FloatingPortal>
  );
}

export interface ComboboxOptionProps
  extends
    StylesApiProps<"option" | "optionLabel" | "check">,
    Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  value: string;
  /** Escolhida: marca com o check e anuncia selecionada. */
  selected?: boolean | undefined;
  disabled?: boolean | undefined;
  /** Mostra o check na escolhida. Padrão: true. */
  withCheckIcon?: boolean | undefined;
  children?: ReactNode;
}

/** Uma opção da lista. */
export function ComboboxOption(props: ComboboxOptionProps) {
  const c = useComboboxContext();
  const {
    value,
    selected,
    disabled,
    withCheckIcon = true,
    children,
    onClick,
    className,
    style,
    classNames,
    styles,
    ...rest
  } = useComponentProps("ComboboxOption", {}, props);
  const getStyles = useStyles(
    "ComboboxOption",
    {
      option: classes["option"] ?? "",
      optionLabel: classes["optionLabel"] ?? "",
      check: classes["check"] ?? "",
    },
    { className, style, classNames, styles },
    "option",
  );
  const { ref, index } = useListItem();
  const ativo = c.ativo === index;
  return (
    <div
      ref={ref}
      role="option"
      id={`${c.id}-op-${index}`}
      data-value={value}
      aria-selected={!!selected}
      aria-disabled={disabled || undefined}
      data-active={ativo || undefined}
      // sem `active`: o Floating UI trocaria o id da ativa e o aria-activedescendant apontaria para um id que não existe
      {...c.getItemProps({
        ...rest,
        selected: !!selected,
        // mantém o foco no campo ao clicar
        onMouseDown: (e: React.MouseEvent) => e.preventDefault(),
        onClick: (e: React.MouseEvent<HTMLDivElement>) => {
          onClick?.(e);
          if (!disabled) c.enviar(value);
        },
      })}
      {...getStyles("option")}
    >
      {withCheckIcon && (
        <span {...getStyles("check")}>
          {selected && <Icon name="check" size="sm" />}
        </span>
      )}
      <span {...getStyles("optionLabel")}>{children}</span>
    </div>
  );
}

/** Grupo de opções com título. */
export function ComboboxGroup({
  label,
  children,
}: {
  label: ReactNode;
  children?: ReactNode;
}) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id}>
      <div id={id} className={classes["groupLabel"]}>
        {label}
      </div>
      {children}
    </div>
  );
}

/** Mensagem quando nada bate com a busca. */
export function ComboboxEmpty({ children }: { children?: ReactNode }) {
  return <div className={classes["empty"]}>{children}</div>;
}

/** A base dos campos de escolha (Select, Autocomplete, MultiSelect, TagsInput…): alvo, lista, opções, grupos e vazio. */
function ComboboxRoot(props: ComboboxProps) {
  const {
    opened,
    defaultOpened,
    onOpenedChange,
    onOptionSubmit,
    position = "bottom-start",
    inline = false,
    role = "combobox",
    maxDropdownHeight,
    disabled,
    children,
  } = useComponentProps("Combobox", {}, props);
  const id = useId();
  const [aberto, setAberto] = useControllableState({
    value: opened,
    defaultValue: defaultOpened ?? false,
    onChange: onOpenedChange,
  });
  const base = usePopoverBase({
    opened: inline || aberto,
    onChange: setAberto,
    position,
    offset: "xs",
    width: "target",
  });
  const elementos = useRef<(HTMLElement | null)[]>([]);
  const [ativo, setAtivo] = useState<number | null>(null);
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [
      useRole(base.context, { role, enabled: !inline }),
      useDismiss(base.context, { enabled: !inline }),
      useListNavigation(base.context, {
        listRef: elementos,
        activeIndex: ativo,
        onNavigate: setAtivo,
        virtual: true,
        loop: true,
        enabled: !disabled,
      }),
    ],
  );
  const altura =
    maxDropdownHeight === undefined
      ? "calc(6 * var(--cf-touch-target) + 2 * var(--cf-space-1))"
      : typeof maxDropdownHeight === "number"
        ? `${maxDropdownHeight}px`
        : maxDropdownHeight;
  return (
    <ComboboxContext
      value={{
        aberto: inline || aberto,
        setAberto,
        ativo,
        base,
        getReferenceProps,
        getFloatingProps,
        getItemProps,
        elementos,
        enviar: (v) => onOptionSubmit?.(v),
        inline,
        altura,
        id,
      }}
    >
      {children}
    </ComboboxContext>
  );
}

/** Combobox: Target, Anchor, Dropdown, Option, Group e Empty. */
export const Combobox = Object.assign(ComboboxRoot, {
  Target: ComboboxTarget,
  Anchor: ComboboxAnchor,
  Dropdown: ComboboxDropdown,
  Option: ComboboxOption,
  Group: ComboboxGroup,
  Empty: ComboboxEmpty,
});
