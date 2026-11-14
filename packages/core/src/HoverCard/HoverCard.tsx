/* eslint-disable react-hooks/refs, @typescript-eslint/unbound-method -- Floating UI: refs.setReference e refs.setFloating são
   callback refs (funções soltas), não leitura de .current; é o uso documentado da biblioteca. */
import { useId } from "@countify-oficial/hooks";
import { useComponentProps } from "@countify-oficial/provider";
import { duration } from "@countify-oficial/tokens";
import {
  FloatingFocusManager,
  FloatingPortal,
  safePolygon,
  useDismiss,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from "@floating-ui/react";
import {
  cloneElement,
  createContext,
  useContext,
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import classes from "../Popover/Popover.module.css";
import { usePopoverBase, type FloatingOptions } from "../Popover/usePopover";
import { useStyles, type StylesApiProps } from "../styles";

export interface HoverCardProps extends FloatingOptions {
  /** Espera antes de abrir, em ms. Padrão: 0. */
  openDelay?: number | undefined;
  /** Espera antes de fechar, em ms (dá tempo de levar o mouse ao cartão). Padrão: 150. */
  closeDelay?: number | undefined;
  disabled?: boolean | undefined;
  id?: string | undefined;
  children?: ReactNode;
}

type Valor = ReturnType<typeof usePopoverBase> & {
  getReferenceProps: (p?: Record<string, unknown>) => Record<string, unknown>;
  getFloatingProps: (p?: Record<string, unknown>) => Record<string, unknown>;
  id: string;
};
const HoverCardContext = createContext<Valor | null>(null);
function useHoverCardContext(): Valor {
  const c = useContext(HoverCardContext);
  if (!c)
    throw new Error(
      "HoverCard.Target e HoverCard.Dropdown ficam dentro de um HoverCard",
    );
  return c;
}

/** O alvo do HoverCard. */
export function HoverCardTarget({
  children,
}: {
  children: ReactElement<Record<string, unknown> & { ref?: Ref<unknown> }>;
}) {
  const { refs, getReferenceProps } = useHoverCardContext();
  const ref = useMergeRefs([refs.setReference, children.props.ref]);
  return cloneElement(children, getReferenceProps({ ...children.props, ref }));
}

/** O cartão. */
export function HoverCardDropdown(
  props: StylesApiProps<"dropdown"> &
    Omit<ComponentPropsWithRef<"div">, "className" | "style">,
) {
  const c = useHoverCardContext();
  const { className, style, classNames, styles, ...rest } = useComponentProps(
    "HoverCardDropdown",
    {},
    props,
  );
  const getStyles = useStyles(
    "HoverCard",
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
        initialFocus={-1}
        returnFocus={false}
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
        />
      </FloatingFocusManager>
    </FloatingPortal>
  );
}

/** Cartão que abre no hover (e no foco do teclado): detalhes de uma loja na tabela. Só computador. */
function HoverCardRoot(props: HoverCardProps) {
  const {
    openDelay = 0,
    closeDelay = duration.base,
    disabled,
    id,
    children,
    ...opcoes
  } = useComponentProps("HoverCard", {}, props);
  const base = useId(id);
  const p = usePopoverBase(opcoes);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(p.context, {
      enabled: !disabled,
      delay: { open: openDelay, close: closeDelay },
      handleClose: safePolygon(),
    }),
    useFocus(p.context, { enabled: !disabled }),
    useDismiss(p.context),
    useRole(p.context, { role: "dialog" }),
  ]);
  return (
    <HoverCardContext
      value={{ ...p, getReferenceProps, getFloatingProps, id: base }}
    >
      {children}
    </HoverCardContext>
  );
}

/** HoverCard: HoverCard.Target e HoverCard.Dropdown. */
export const HoverCard = Object.assign(HoverCardRoot, {
  Target: HoverCardTarget,
  Dropdown: HoverCardDropdown,
});
