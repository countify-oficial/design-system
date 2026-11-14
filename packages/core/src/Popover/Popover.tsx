/* eslint-disable react-hooks/refs, @typescript-eslint/unbound-method -- Floating UI: refs.setReference e refs.setFloating são
   callback refs (funções soltas), não leitura de .current; é o uso documentado da biblioteca. */
import { useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import {
  FloatingFocusManager,
  FloatingPortal,
  useClick,
  useDismiss,
  useInteractions,
  useMergeRefs,
  useRole,
  type ExtendedRefs,
  type FloatingContext,
  type ReferenceType,
} from "@floating-ui/react";
import {
  cloneElement,
  createContext,
  useContext,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Popover.module.css";
import { usePopoverBase, type FloatingOptions } from "./usePopover";

export interface PopoverProps extends FloatingOptions {
  /** Prende o Tab dentro do conteúdo (um formulário curto). Padrão: false. */
  trapFocus?: boolean | undefined;
  /** Esc fecha. Padrão: true. */
  closeOnEscape?: boolean | undefined;
  /** Clique fora fecha. Padrão: true. */
  closeOnClickOutside?: boolean | undefined;
  /** Devolve o foco ao alvo ao fechar. Padrão: true. */
  returnFocus?: boolean | undefined;
  /** Desenha no fim do <body>. Padrão: true. */
  withinPortal?: boolean | undefined;
  /** Papel do conteúdo. Padrão: dialog. */
  role?: "dialog" | "listbox" | undefined;
  disabled?: boolean | undefined;
  id?: string | undefined;
  /** Popover.Target e Popover.Dropdown. */
  children?: ReactNode;
}

interface Contexto {
  aberto: boolean;
  refs: ExtendedRefs<ReferenceType>;
  context: FloatingContext;
  floatingStyles: CSSProperties;
  getReferenceProps: (p?: Record<string, unknown>) => Record<string, unknown>;
  getFloatingProps: (p?: Record<string, unknown>) => Record<string, unknown>;
  animacao: { isMounted: boolean; styles: CSSProperties };
  larguraFixa: CSSProperties;
  trapFocus: boolean;
  returnFocus: boolean;
  withinPortal: boolean;
  id: string;
}

const PopoverContext = createContext<Contexto | null>(null);
function usePopoverContext(): Contexto {
  const c = useContext(PopoverContext);
  if (!c)
    throw new Error(
      "Popover.Target e Popover.Dropdown ficam dentro de um Popover",
    );
  return c;
}

/** O elemento que abre o Popover (um só filho, que recebe o ref e o clique). */
export function PopoverTarget({
  children,
}: {
  children: ReactElement<Record<string, unknown> & { ref?: Ref<unknown> }>;
}) {
  const { refs, getReferenceProps } = usePopoverContext();
  const ref = useMergeRefs([refs.setReference, children.props.ref]);
  return cloneElement(children, getReferenceProps({ ...children.props, ref }));
}

export type PopoverDropdownProps = StylesApiProps<"dropdown"> &
  Omit<ComponentPropsWithRef<"div">, "className" | "style">;

/** O conteúdo que abre junto do alvo. */
export function PopoverDropdown(props: PopoverDropdownProps) {
  const {
    refs,
    context,
    floatingStyles,
    getFloatingProps,
    animacao,
    larguraFixa,
    trapFocus,
    returnFocus,
    withinPortal,
    id,
  } = usePopoverContext();
  const { className, style, classNames, styles, ...rest } = useComponentProps(
    "PopoverDropdown",
    {},
    props,
  );
  const getStyles = useStyles(
    "Popover",
    { dropdown: classes["dropdown"] ?? "" },
    { className, style, classNames, styles },
    "dropdown",
  );
  if (!animacao.isMounted) return null;
  const { className: classe, style: estilo } = getStyles("dropdown");
  const caixa = (
    <FloatingFocusManager
      context={context}
      modal={trapFocus}
      returnFocus={returnFocus}
      initialFocus={trapFocus ? 0 : -1}
    >
      <div
        ref={refs.setFloating}
        {...getFloatingProps({ ...rest, id })}
        className={classe}
        style={{
          ...floatingStyles,
          ...larguraFixa,
          ...estilo,
          ...animacao.styles,
        }}
      />
    </FloatingFocusManager>
  );
  return withinPortal ? <FloatingPortal>{caixa}</FloatingPortal> : caixa;
}

/** Conteúdo que abre ao clicar num alvo, posicionado junto dele (ajuda "?", filtros curtos). */
function PopoverRoot(props: PopoverProps) {
  const {
    trapFocus = false,
    closeOnEscape = true,
    closeOnClickOutside = true,
    returnFocus = true,
    withinPortal = true,
    role = "dialog",
    disabled,
    id,
    children,
    ...opcoes
  } = useComponentProps("Popover", {}, props);
  const base = useId(id);
  const p = usePopoverBase(opcoes);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(p.context, { enabled: !disabled }),
    useDismiss(p.context, {
      escapeKey: closeOnEscape,
      outsidePress: closeOnClickOutside,
    }),
    useRole(p.context, { role }),
  ]);
  return (
    <PopoverContext
      value={{
        aberto: p.aberto,
        refs: p.refs,
        context: p.context,
        floatingStyles: p.floatingStyles,
        getReferenceProps,
        getFloatingProps,
        animacao: p.animacao,
        larguraFixa: p.larguraFixa,
        trapFocus,
        returnFocus,
        withinPortal,
        id: base,
      }}
    >
      {children}
    </PopoverContext>
  );
}

/** Popover: Popover.Target (o alvo) e Popover.Dropdown (o conteúdo). */
export const Popover = Object.assign(PopoverRoot, {
  Target: PopoverTarget,
  Dropdown: PopoverDropdown,
});
