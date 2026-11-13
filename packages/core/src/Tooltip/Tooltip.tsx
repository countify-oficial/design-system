/* eslint-disable react-hooks/refs, @typescript-eslint/unbound-method -- Floating UI: refs.setReference e refs.setFloating são
   callback refs (funções soltas), não leitura de .current; é o uso documentado da biblioteca. */
import { useComponentProps } from "@countify-oficial/provider";
import { duration } from "@countify-oficial/tokens";
import { FloatingPortal, useDismiss, useFocus, useHover, useInteractions, useMergeRefs, useRole, type Placement } from "@floating-ui/react";
import { cloneElement, type ReactElement, type ReactNode, type Ref } from "react";
import { usePopoverBase } from "../Popover/usePopover";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Tooltip.module.css";

export interface TooltipProps extends StylesApiProps<"tooltip"> {
  /** O texto. */
  label: ReactNode;
  /** O elemento que mostra a dica (um só filho). */
  children: ReactElement<Record<string, unknown> & { ref?: Ref<unknown> }>;
  /** Padrão: top. */
  position?: Placement | undefined;
  /** Espera antes de abrir, em ms. Padrão: 150 (duração base). */
  openDelay?: number | undefined;
  closeDelay?: number | undefined;
  disabled?: boolean | undefined;
  opened?: boolean | undefined;
  /** Largura máxima (quebra em várias linhas). */
  width?: number | string | undefined;
}

/**
 * Dica no hover e no foco do teclado (só computador). Não ponha nela o que a pessoa precisa para agir: a identidade
 * explica no "?" (Popover). O texto também vira a descrição do alvo para o leitor de tela.
 */
export function Tooltip(props: TooltipProps) {
  const { label, children, position = "top", openDelay = duration.base, closeDelay = 0, disabled, opened, width, className, style, classNames, styles } = useComponentProps("Tooltip", {}, props);
  const getStyles = useStyles("Tooltip", classes, { className, style, classNames, styles });
  const p = usePopoverBase({ opened, position, offset: "sm" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(p.context, { enabled: !disabled && opened === undefined, delay: { open: openDelay, close: closeDelay } }),
    useFocus(p.context, { enabled: !disabled && opened === undefined }),
    useDismiss(p.context),
    useRole(p.context, { role: "tooltip" }),
  ]);
  const ref = useMergeRefs([p.refs.setReference, children.props.ref]);
  const { className: classe, style: estilo } = getStyles("tooltip", width === undefined ? undefined : { "--tooltip-width": typeof width === "number" ? `${width}px` : width });
  return (
    <>
      {cloneElement(children, getReferenceProps({ ...children.props, ref }))}
      {p.animacao.isMounted && (
        <FloatingPortal>
          <div ref={p.refs.setFloating} {...getFloatingProps()} className={classe} style={{ ...p.floatingStyles, ...estilo, ...p.animacao.styles }}>
            {label}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
