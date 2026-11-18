import { useControllableState } from "@countify-oficial/hooks";
import { formatNumber, pageLabel, useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import type { Spacing } from "@countify-oficial/tokens";
import { useMemo, type ComponentPropsWithRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { ActionBar } from "../ActionBar/ActionBar";
import { CheckboxItem as Checkbox } from "../Checkbox/Checkbox";
import { EmptyState } from "../EmptyState/EmptyState";
import { Pagination } from "../Pagination/Pagination";
import { Skeleton } from "../Skeleton/Skeleton";
import { useStyles, type StylesApiProps } from "../styles";
import { Table } from "../Table/Table";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import classes from "./DataTable.module.css";

export interface DataTableColumn<T> {
  /** Identifica a coluna (ordenação, chave do React). Sem `render`, a célula mostra `row[key]`. */
  key: string;
  /** Título no cabeçalho. */
  title: ReactNode;
  /** Coluna de número: cabeçalho e célula à direita; sem `render`, o número sai no formato do idioma (1.102). */
  numeric?: boolean | undefined;
  /** Largura da coluna (número em px ou valor CSS). */
  width?: CSSProperties["width"];
  /** Conteúdo da célula. Padrão: `row[key]`; vazio (null, undefined ou "") vira "—", como no mockup. */
  render?: ((row: T) => ReactNode) | undefined;
  /** O cabeçalho ordena ao clicar: texto começa crescente (A a Z); coluna `numeric`, decrescente (do maior); o clique seguinte inverte. */
  sortable?: boolean | undefined;
  /**
   * Comparação crescente própria (negativo: `a` antes de `b`). Padrão: `row[key]`, números e datas pelo valor, texto
   * com a ordem do idioma (localeCompare, "Loja 2" antes de "Loja 10"); vazios sempre no fim.
   */
  compare?: ((a: T, b: T) => number) | undefined;
}

/** A coluna ordenada e o sentido. */
export interface DataTableSort {
  key: string;
  direction: "ascending" | "descending";
}

export interface DataTableProps<T>
  extends StylesApiProps<"root" | "footer" | "check" | "empty">, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "children" | "aria-label"> {
  /** As colunas, na ordem. A primeira é o cabeçalho da linha (o nome que o leitor de tela anuncia em cada célula). */
  columns: DataTableColumn<T>[];
  /** As linhas: todas (paginação no cliente) ou só as da página (`manual`). */
  rows: T[];
  /** Id estável da linha (chave do React e valor da seleção). */
  getRowId: (row: T) => string;
  /** Nome da linha para o leitor de tela ("Selecionar Lume Jardins"). Padrão: o valor da primeira coluna. */
  getRowLabel?: ((row: T) => string) | undefined;
  /** Legenda da tabela (embaixo), que também é o nome dela para o leitor de tela. */
  caption?: ReactNode;
  /** Nome da tabela quando não há legenda. */
  "aria-label"?: string | undefined;

  /** Ordenação atual (controlado); null é sem ordenação. */
  sort?: DataTableSort | null | undefined;
  /** Ordenação inicial (não controlado). */
  defaultSort?: DataTableSort | null | undefined;
  /** Clique num cabeçalho ordenável. */
  onSortChange?: ((sort: DataTableSort | null) => void) | undefined;

  /** Linhas por página: liga a paginação. Sem ela, todas as linhas aparecem. */
  pageSize?: number | undefined;
  /** Página atual, a partir de 1 (controlado). Volta para 1 quando a ordenação muda. */
  page?: number | undefined;
  /** Página inicial (não controlado). Padrão: 1. */
  defaultPage?: number | undefined;
  onPageChange?: ((page: number) => void) | undefined;
  /** Total de linhas, para o número de páginas e o "21–40 de 340". Padrão: `rows.length`. Use com `manual`. */
  total?: number | undefined;
  /**
   * Ordenação e paginação no servidor: a tabela não ordena nem corta `rows` (que já são as da página). Controle
   * `sort` e `page`, busque de novo em `onSortChange` e `onPageChange`, e passe `total`.
   */
  manual?: boolean | undefined;

  /** Caixa de marcar em cada linha e "selecionar todas desta página" no cabeçalho. */
  selectable?: boolean | undefined;
  /** Ids escolhidos (controlado). */
  selectedIds?: string[] | undefined;
  /** Ids escolhidos no começo (não controlado). */
  defaultSelectedIds?: string[] | undefined;
  onSelectedIdsChange?: ((ids: string[]) => void) | undefined;
  /** Botões da barra de ações que sobe com a seleção ("2 selecionadas · Mover · Excluir"). Sem eles, não há barra. */
  actions?: ReactNode;

  /** Carregando: blocos do Skeleton no lugar das linhas (uma página, ou 5) e `aria-busy` na tabela. */
  loading?: boolean | undefined;
  /** O que aparece sem linhas. Padrão: EmptyState com `messages.emptyTable` ("Nada para mostrar"). */
  emptyState?: ReactNode;
  /** Abre o detalhe da linha: clique em qualquer lugar da linha, menos na caixa de marcar e nos botões e links dela; no teclado, o nome da linha vira botão. */
  onRowClick?: ((row: T) => void) | undefined;

  /** Cabeçalho fixo ao rolar (com `maxHeight`). */
  stickyHeader?: boolean | undefined;
  /** Primeira coluna fixa ao rolar para o lado. */
  stickyFirstColumn?: boolean | undefined;
  /** Linhas alternadas. */
  striped?: boolean | undefined;
  /** Véu na linha sob o mouse (sempre ligado com `onRowClick`). */
  highlightOnHover?: boolean | undefined;
  /** Espaço acima e abaixo das células (padrão 3 = 12). */
  verticalSpacing?: Spacing | undefined;
  /** Altura máxima da moldura; mais linhas rolam dentro dela. */
  maxHeight?: CSSProperties["maxHeight"];
}

const ler = (row: unknown, key: string): unknown => (row as Record<string, unknown>)[key];
const vazio = (v: unknown) => v === null || v === undefined || v === "";

/** Tabela pronta: colunas e linhas, com ordenação, seleção com barra de ações, paginação e os estados de carregando e vazio. Só no computador. */
export function DataTable<T>(props: DataTableProps<T>) {
  const { locale, messages } = useCountifyTheme();
  const {
    columns, rows, getRowId, getRowLabel, caption, "aria-label": ariaLabel,
    sort, defaultSort, onSortChange,
    pageSize, page, defaultPage, onPageChange, total, manual,
    selectable, selectedIds, defaultSelectedIds, onSelectedIdsChange, actions,
    loading, emptyState, onRowClick,
    stickyHeader, stickyFirstColumn, striped, highlightOnHover, verticalSpacing, maxHeight,
    className, style, classNames, styles, ...rest
  } = useComponentProps("DataTable", {}, props);
  const getStyles = useStyles("DataTable", classes, { className, style, classNames, styles });

  const [ordem, setOrdem] = useControllableState<DataTableSort | null>({ value: sort, defaultValue: defaultSort ?? null, onChange: onSortChange });
  const ordenadas = useMemo(() => {
    const coluna = ordem && !manual ? columns.find((c) => c.key === ordem.key) : undefined;
    if (!ordem || !coluna) return rows;
    const sinal = ordem.direction === "ascending" ? 1 : -1;
    const texto = new Intl.Collator(locale, { numeric: true });
    return [...rows].sort((a, b) => {
      if (coluna.compare) return sinal * coluna.compare(a, b);
      const va = ler(a, coluna.key);
      const vb = ler(b, coluna.key);
      // vazios ("Sem categoria" com traços) ficam no fim nos dois sentidos
      if (vazio(va) || vazio(vb)) return Number(vazio(va)) - Number(vazio(vb));
      return sinal * (typeof va === "string" && typeof vb === "string" ? texto.compare(va, vb) : Number(va) - Number(vb));
    });
  }, [rows, columns, ordem, manual, locale]);

  const paginas = pageSize ? Math.max(1, Math.ceil((total ?? rows.length) / pageSize)) : 1;
  const [paginaPedida, setPagina] = useControllableState({ value: page, defaultValue: defaultPage ?? 1, onChange: onPageChange });
  // a lista pode encolher (filtro, exclusão) e deixar a página pedida além da última
  const pagina = Math.min(paginaPedida, paginas);
  const visiveis = pageSize && !manual ? ordenadas.slice((pagina - 1) * pageSize, pagina * pageSize) : ordenadas;

  // coluna de números começa do maior para o menor (como o Faturamento do W-Indicadores); texto, de A a Z
  const ordenar = (key: string) => {
    const primeira = columns.find((c) => c.key === key)?.numeric ? "descending" : "ascending";
    const outra = primeira === "ascending" ? "descending" : "ascending";
    setOrdem({ key, direction: ordem?.key === key && ordem.direction === primeira ? outra : primeira });
    if (pageSize) setPagina(1);
  };

  const [escolhidas, setEscolhidas] = useControllableState<string[]>({ value: selectedIds, defaultValue: defaultSelectedIds ?? [], onChange: onSelectedIdsChange });
  const idsDaPagina = visiveis.map(getRowId);
  const naPagina = idsDaPagina.filter((id) => escolhidas.includes(id)).length;
  const todasDaPagina = idsDaPagina.length > 0 && naPagina === idsDaPagina.length;
  const alternar = (id: string) => setEscolhidas((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const alternarPagina = () =>
    setEscolhidas((s) => (todasDaPagina ? s.filter((id) => !idsDaPagina.includes(id)) : [...s, ...idsDaPagina.filter((id) => !s.includes(id))]));

  const [primeira] = columns;
  const rotulo = (row: T) => {
    const v = primeira && ler(row, primeira.key);
    return getRowLabel?.(row) ?? (typeof v === "string" || typeof v === "number" ? String(v) : "");
  };
  const conteudo = (coluna: DataTableColumn<T>, row: T): ReactNode => {
    if (coluna.render) return coluna.render(row);
    const v = ler(row, coluna.key);
    if (vazio(v)) return "—";
    return typeof v === "number" ? formatNumber(v, { locale }) : (v as ReactNode);
  };
  const abrir = onRowClick
    ? (row: T) => (e: MouseEvent<HTMLTableRowElement>) => {
        // a caixa de marcar e os botões e links da linha fazem só o que é deles; no teclado, o nome da linha é o botão que abre
        if (!(e.target as Element).closest("button, a, input, label, select, textarea, [data-row-select]")) onRowClick(row);
      }
    : undefined;
  const colunasNoTotal = columns.length + (selectable ? 1 : 0);

  return (
    <div {...rest} {...getStyles("root")}>
      <Table.ScrollContainer maxHeight={maxHeight}>
        <Table
          aria-label={ariaLabel}
          aria-busy={loading || undefined}
          stickyHeader={stickyHeader}
          stickyFirstColumn={stickyFirstColumn}
          striped={striped}
          highlightOnHover={highlightOnHover || !!onRowClick}
          verticalSpacing={verticalSpacing}
        >
          {caption !== undefined && <Table.Caption>{caption}</Table.Caption>}
          <Table.Thead>
            <Table.Tr>
              {selectable && (
                <Table.Th {...getStyles("check")}>
                  <Checkbox
                    aria-label={messages.selectPageRows}
                    checked={todasDaPagina}
                    indeterminate={naPagina > 0 && !todasDaPagina}
                    disabled={loading || idsDaPagina.length === 0}
                    onChange={alternarPagina}
                  />
                </Table.Th>
              )}
              {columns.map((c) => (
                <Table.Th
                  key={c.key}
                  numeric={c.numeric}
                  style={c.width === undefined ? undefined : { width: c.width }}
                  sort={c.sortable ? (ordem?.key === c.key ? ordem.direction : "none") : undefined}
                  onSort={c.sortable ? () => ordenar(c.key) : undefined}
                >
                  {c.title}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              Array.from({ length: pageSize ?? 5 }, (_, i) => (
                <Table.Tr key={i}>
                  {selectable && <Table.Td {...getStyles("check")} />}
                  {columns.map((c) => (
                    <Table.Td key={c.key}>
                      <Skeleton />
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            ) : visiveis.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={colunasNoTotal} {...getStyles("empty")}>
                  {emptyState ?? <EmptyState title={messages.emptyTable} />}
                </Table.Td>
              </Table.Tr>
            ) : (
              visiveis.map((row) => {
                const id = getRowId(row);
                const nome = rotulo(row);
                return (
                  <Table.Tr key={id} data-clickable={onRowClick ? true : undefined} onClick={abrir?.(row)}>
                    {selectable && (
                      <Table.Td data-row-select {...getStyles("check")}>
                        <Checkbox aria-label={messages.selectRow(nome)} checked={escolhidas.includes(id)} onChange={() => alternar(id)} />
                      </Table.Td>
                    )}
                    {columns.map((c, i) =>
                      i === 0 ? (
                        <Table.Th key={c.key} scope="row" numeric={c.numeric}>
                          {onRowClick ? <UnstyledButton onClick={() => onRowClick(row)}>{conteudo(c, row)}</UnstyledButton> : conteudo(c, row)}
                        </Table.Th>
                      ) : (
                        <Table.Td key={c.key} numeric={c.numeric}>
                          {conteudo(c, row)}
                        </Table.Td>
                      ),
                    )}
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {pageSize !== undefined && paginas > 1 && (
        <div {...getStyles("footer")}>
          <span>{pageLabel(pagina, pageSize, total ?? rows.length)}</span>
          <Pagination total={paginas} value={pagina} onChange={setPagina} />
        </div>
      )}
      {selectable && (
        <>
          <VisuallyHidden role="status">{escolhidas.length > 0 ? messages.selectedCount(escolhidas.length) : ""}</VisuallyHidden>
          {actions !== undefined && (
            <ActionBar opened={escolhidas.length > 0} aria-label={messages.selectionActions}>
              {/* ao sair, a barra some sem o "0 selecionadas" */}
              {escolhidas.length > 0 && messages.selectedCount(escolhidas.length)}
              {actions}
            </ActionBar>
          )}
        </>
      )}
    </div>
  );
}
