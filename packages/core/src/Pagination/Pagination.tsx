import { useControllableState } from "@countify-oficial/hooks";
import { paginationRange, useComponentProps, useMessages } from "@countify-oficial/provider";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import { useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./Pagination.module.css";

export interface PaginationProps extends StylesApiProps<"root" | "control" | "dots" | "label">, Omit<ComponentPropsWithRef<"nav">, "className" | "style" | "onChange"> {
  /** Quantas páginas. */
  total: number;
  /** A página atual, a partir de 1 (controlado). */
  value?: number | undefined;
  defaultValue?: number | undefined;
  onChange?: ((page: number) => void) | undefined;
  /** Páginas de cada lado da atual. Padrão: 1. */
  siblings?: number | undefined;
  /** Páginas sempre visíveis nas pontas. Padrão: 1. */
  boundaries?: number | undefined;
  /** Setas de anterior e próxima. Padrão: true. */
  withControls?: boolean | undefined;
  /** Os números das páginas. false mostra só as setas e o rótulo (a forma compacta da 0.1.0). Padrão: true. */
  withPages?: boolean | undefined;
  /** O texto entre as setas sem os números. Padrão: "3 de 17"; para itens, use pageLabel ("21–40 de 340"). */
  label?: ReactNode;
  disabled?: boolean | undefined;
}

/** Paginação: setas e números das páginas, com "…" nos saltos. A atual é anunciada (aria-current). */
export function Pagination(props: PaginationProps) {
  const messages = useMessages();
  const {
    total, value, defaultValue, onChange, siblings = 1, boundaries = 1, withControls = true, withPages = true, label, disabled,
    className, style, classNames, styles, ...rest
  } = useComponentProps("Pagination", {}, props);
  const getStyles = useStyles("Pagination", classes, { className, style, classNames, styles });
  const ultima = Math.max(1, total);
  const [pagina, setPagina] = useControllableState({ value, defaultValue: defaultValue ?? 1, onChange });
  const ir = (p: number) => setPagina(Math.max(1, Math.min(ultima, p)));
  return (
    <nav aria-label={messages.pagination} {...rest} {...getStyles("root")}>
      {withControls && (
        <UnstyledButton aria-label={messages.previousPage} disabled={disabled || pagina <= 1} onClick={() => ir(pagina - 1)} {...getStyles("control")}>
          <Icon name="back" />
        </UnstyledButton>
      )}
      {withPages
        ? paginationRange(ultima, pagina, siblings, boundaries).map((p, i) =>
            p === "dots" ? (
              <span key={`d${String(i)}`} aria-hidden {...getStyles("dots")}>
                …
              </span>
            ) : (
              <UnstyledButton
                key={p}
                aria-label={messages.page(p)}
                aria-current={p === pagina ? "page" : undefined}
                disabled={disabled}
                onClick={() => ir(p)}
                {...getStyles("control")}
              >
                {p}
              </UnstyledButton>
            ),
          )
        : <span {...getStyles("label")}>{label ?? messages.stepOf(pagina, ultima)}</span>}
      {withControls && (
        <UnstyledButton aria-label={messages.nextPage} disabled={disabled || pagina >= ultima} onClick={() => ir(pagina + 1)} {...getStyles("control")}>
          <Icon name="chevron-right" />
        </UnstyledButton>
      )}
    </nav>
  );
}
