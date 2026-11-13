import { useComponentProps } from "@countify-oficial/provider";
import type { ComponentPropsWithRef, CSSProperties, MouseEvent } from "react";
import { Icon } from "../Icon/Icon";
import { useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./Table.module.css";

export interface TableProps extends StylesApiProps, Omit<ComponentPropsWithRef<"table">, "className" | "style"> {
  /** Cabeçalho fica no topo ao rolar (dentro de Table.ScrollContainer com maxHeight). */
  stickyHeader?: boolean | undefined;
  /** Primeira coluna fica à esquerda ao rolar para o lado. */
  stickyFirstColumn?: boolean | undefined;
  /** Véu na linha sob o mouse. */
  highlightOnHover?: boolean | undefined;
  /** Linhas alternadas. */
  striped?: boolean | undefined;
}

type Parte<T extends keyof React.JSX.IntrinsicElements> = StylesApiProps & Omit<ComponentPropsWithRef<T>, "className" | "style">;

function parte<T extends "thead" | "tbody" | "tfoot" | "tr" | "caption">(nome: string, tag: T, classe: string) {
  function ParteDaTabela(props: Parte<T>) {
    const { className, style, classNames, styles, ...rest } = useComponentProps(nome, {}, props);
    const getStyles = useStyles(nome, { root: classes[classe] ?? "" }, { className, style, classNames, styles });
    const Tag = tag as React.ElementType;
    return <Tag {...rest} {...getStyles("root")} />;
  }
  ParteDaTabela.displayName = nome;
  return ParteDaTabela;
}

export const TableThead = parte("TableThead", "thead", "thead");
export const TableTbody = parte("TableTbody", "tbody", "tbody");
export const TableTfoot = parte("TableTfoot", "tfoot", "tfoot");
export const TableTr = parte("TableTr", "tr", "tr");
export const TableCaption = parte("TableCaption", "caption", "caption");

export interface TableTdProps extends StylesApiProps, Omit<ComponentPropsWithRef<"td">, "className" | "style"> {
  /** Número: alinhado à direita. */
  numeric?: boolean | undefined;
}

/** Célula. */
export function TableTd(props: TableTdProps) {
  const { numeric, className, style, classNames, styles, ...rest } = useComponentProps("TableTd", {}, props);
  const getStyles = useStyles("TableTd", { root: classes["td"] ?? "" }, { className, style, classNames, styles });
  return <td {...rest} data-numeric={numeric || undefined} {...getStyles("root")} />;
}

export interface TableThProps extends StylesApiProps<"root" | "sort">, Omit<ComponentPropsWithRef<"th">, "className" | "style"> {
  numeric?: boolean | undefined;
  /** Ordenação desta coluna: o cabeçalho vira botão e ganha aria-sort. */
  sort?: "ascending" | "descending" | "none" | undefined;
  /** Clique no cabeçalho ordenável. */
  onSort?: ((e: MouseEvent<HTMLButtonElement>) => void) | undefined;
}

/** Cabeçalho de coluna (ou de linha, dentro do Tbody). Com sort, ordena ao clicar. */
export function TableTh(props: TableThProps) {
  const { numeric, sort, onSort, children, className, style, classNames, styles, ...rest } = useComponentProps("TableTh", {}, props);
  const getStyles = useStyles("TableTh", { root: classes["th"] ?? "", sort: classes["sort"] ?? "" }, { className, style, classNames, styles });
  return (
    <th {...(sort ? { "aria-sort": sort } : {})} {...rest} data-numeric={numeric || undefined} {...getStyles("root")}>
      {sort ? (
        <UnstyledButton onClick={onSort} {...getStyles("sort")}>
          {children}
          {sort !== "none" && <Icon name={sort === "ascending" ? "arrow-up" : "arrow-down"} size="xs" />}
        </UnstyledButton>
      ) : (
        children
      )}
    </th>
  );
}

export interface TableScrollContainerProps extends StylesApiProps, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** Altura máxima (para o cabeçalho fixo). */
  maxHeight?: CSSProperties["maxHeight"];
}

/** Moldura da tabela: cartão com anel, rola para os lados (e para baixo, com maxHeight). */
export function TableScrollContainer(props: TableScrollContainerProps) {
  const { maxHeight, className, style, classNames, styles, ...rest } = useComponentProps("TableScrollContainer", {}, props);
  const getStyles = useStyles("TableScrollContainer", { root: classes["scroll"] ?? "" }, { className, style, classNames, styles });
  // área que rola precisa entrar no Tab (WCAG 2.1.1; regra scrollable-region-focusable do axe)
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  return <div tabIndex={0} {...rest} {...getStyles("root", { "--table-max-height": typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight })} />;
}

function TableRoot(props: TableProps) {
  const { stickyHeader, stickyFirstColumn, highlightOnHover, striped, className, style, classNames, styles, ...rest } = useComponentProps("Table", {}, props);
  const getStyles = useStyles("Table", classes, { className, style, classNames, styles });
  return (
    <table
      {...rest}
      data-sticky-header={stickyHeader || undefined}
      data-sticky-first-column={stickyFirstColumn || undefined}
      data-highlight-on-hover={highlightOnHover || undefined}
      data-striped={striped || undefined}
      {...getStyles("root")}
    />
  );
}

/** Tabela do computador (no celular, a identidade usa lista). Partes: Table.Thead, Tbody, Tr, Th, Td, Caption, ScrollContainer. */
export const Table = Object.assign(TableRoot, {
  Thead: TableThead,
  Tbody: TableTbody,
  Tfoot: TableTfoot,
  Tr: TableTr,
  Th: TableTh,
  Td: TableTd,
  Caption: TableCaption,
  ScrollContainer: TableScrollContainer,
});
