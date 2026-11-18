import { useId } from "@countify-oficial/hooks";
import { formatNumber, parseNumber, useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { controlHeight } from "@countify-oficial/tokens";
import {
  useLayoutEffect, useRef, useState, type ChangeEvent, type ClipboardEvent, type ComponentPropsWithRef, type CSSProperties, type FocusEvent, type KeyboardEvent, type MouseEvent, type ReactNode,
} from "react";
import { Input } from "../Input/Input";
import { useStyles, type StylesApiProps } from "../styles";
import { Table } from "../Table/Table";
import { Tooltip } from "../Tooltip/Tooltip";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import classes from "./DataGrid.module.css";

/** Valor de uma célula: texto, número (null = vazio). */
export type DataGridValue = string | number | null;

/** Linha da grade: precisa de um id único (o desfazer e o onChange acham a linha por ele). */
export interface DataGridRow {
  id: string | number;
}

export interface DataGridColumn<R extends DataGridRow> {
  /** Campo da linha mostrado na coluna. */
  key: Extract<keyof R, string>;
  /** Título no cabeçalho; também dá nome ao campo de edição. */
  title: ReactNode;
  /** text (padrão), number ou currency. Número e moeda aparecem no formato do idioma (1.284,5 · R$ 12,90) e aceitam colar "R$ 1.284,50". */
  type?: "text" | "number" | "currency" | undefined;
  /** Moeda da coluna currency (código ISO 4217). Padrão: BRL. */
  currency?: string | undefined;
  /** Alinhamento. Padrão: end para número e moeda, start para texto. */
  align?: "start" | "center" | "end" | undefined;
  /** Largura (número = px). Sem largura, a coluna divide o espaço que sobra. */
  width?: number | string | undefined;
  /** A célula pode ser editada (Enter, F2, digitar, colar, Delete). Padrão: false. */
  editable?: boolean | undefined;
  /** Confere o valor antes de gravar: devolve a mensagem de erro, ou undefined se o valor vale. */
  validate?: ((value: DataGridValue, row: R) => string | undefined) | undefined;
}

/** Uma célula alterada: a linha (pelo id), a coluna, o valor de antes e o novo. */
export interface DataGridChange<R extends DataGridRow> {
  rowId: R["id"];
  key: Extract<keyof R, string>;
  previous: DataGridValue;
  value: DataGridValue;
}

export interface DataGridProps<R extends DataGridRow>
  extends StylesApiProps, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "onChange" | "children" | "defaultValue"> {
  /** As colunas, na ordem em que aparecem. */
  columns: DataGridColumn<R>[];
  /** Linhas (modo controlado, com onChange). */
  rows?: R[] | undefined;
  /** Linhas iniciais (modo não controlado). */
  defaultRows?: R[] | undefined;
  /** Cada edição, colagem, limpeza, desfazer ou refazer: as linhas novas e só as células que mudaram. */
  onChange?: ((rows: R[], changes: DataGridChange<R>[]) => void) | undefined;
  /** Altura máxima da área que rola (número = px). Obrigatória: só as linhas visíveis são desenhadas. */
  height: CSSProperties["maxHeight"];
}

type Celula = { r: number; c: number };
type Entrada = Celula & { texto: string };
type Edicao = Entrada & { erro?: string | undefined };

// linhas desenhadas além das visíveis, acima e abaixo, para a rolagem não mostrar o vazio
const SOBRA = 10;

const valorDe = (row: DataGridRow | undefined, key: string): DataGridValue => (row as Record<string, DataGridValue> | undefined)?.[key] ?? null;

/**
 * Grade de edição em massa, como uma planilha (só computador): navegação por teclado, edição na célula com validação,
 * desfazer e refazer, copiar e colar do Excel e só as linhas visíveis desenhadas (10.000 linhas sem travar).
 */
// começo de texto que o Excel e as planilhas leem como fórmula, mesmo depois de espaços ou caracteres de controle
// eslint-disable-next-line no-control-regex
const FORMULA = /^[\s\u0000-\u001f]*[=+\-@]/;

export function DataGrid<R extends DataGridRow>(props: DataGridProps<R>) {
  const {
    columns, rows: controladas, defaultRows, onChange, height, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby,
    className, style, classNames, styles, ...rest
  } = useComponentProps("DataGrid", {}, props);
  const getStyles = useStyles("DataGrid", classes, { className, style, classNames, styles });
  const messages = useMessages();
  const { locale } = useCountifyTheme();
  const id = useId();
  const [internas, setInternas] = useState<R[]>(defaultRows ?? []);
  const rows = controladas ?? internas;
  // célula ativa (o foco) e a âncora da seleção, num estado só: o mousedown e o focus do mesmo clique combinam
  const [cursor, setCursor] = useState<{ ativa: Celula; ancora: Celula }>({ ativa: { r: 0, c: 0 }, ancora: { r: 0, c: 0 } });
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [aviso, setAviso] = useState("");
  const [janela, setJanela] = useState<{ topo: number; altura: number; linha: number }>({ topo: 0, altura: 0, linha: controlHeight.input.sm });
  const tabela = useRef<HTMLTableElement>(null);
  const rolagem = useRef<HTMLDivElement>(null);
  const historico = useRef<{ passado: DataGridChange<R>[][]; futuro: DataGridChange<R>[][] }>({ passado: [], futuro: [] });
  // o foco volta para a célula ativa depois de uma ação do teclado (e não depois de um clique fora)
  const querFoco = useRef(false);
  // o editor some ao confirmar; o blur que vier depois não grava de novo
  const editando = useRef(false);

  const ultimaLinha = rows.length - 1;
  const ultimaColuna = columns.length - 1;
  const limitar = ({ r, c }: Celula): Celula => ({ r: Math.max(0, Math.min(r, ultimaLinha)), c: Math.max(0, Math.min(c, ultimaColuna)) });
  const at = limitar(cursor.ativa);
  const an = limitar(cursor.ancora);
  const sel = { top: Math.min(at.r, an.r), bottom: Math.max(at.r, an.r), left: Math.min(at.c, an.c), right: Math.max(at.c, an.c) };
  const selecionada = (r: number, c: number) => r >= sel.top && r <= sel.bottom && c >= sel.left && c <= sel.right;

  const numerica = (col: DataGridColumn<R>) => col.type === "number" || col.type === "currency";
  const exibir = (v: DataGridValue, col: DataGridColumn<R>) =>
    typeof v === "number" ? formatNumber(v, { locale, ...(col.type === "currency" ? { format: { style: "currency", currency: col.currency ?? "BRL" } } : {}) }) : (v ?? "");
  // o texto da edição e da cópia: número sem separador de milhar, que o Excel em pt-BR lê como número
  const paraTexto = (v: DataGridValue) => (typeof v === "number" ? formatNumber(v, { locale, format: { useGrouping: false, maximumFractionDigits: 20 } }) : (v ?? ""));
  const ler = (texto: string, col: DataGridColumn<R>, row: R): { value: DataGridValue } | { erro: string } => {
    let value: DataGridValue = texto;
    if (numerica(col)) {
      const n = parseNumber(texto, locale);
      if (texto.trim() !== "" && n === undefined) return { erro: messages.invalidNumber };
      value = n ?? null;
    }
    const erro = col.validate?.(value, row);
    return erro === undefined ? { value } : { erro };
  };

  const mudar = (novas: R[], changes: DataGridChange<R>[]) => {
    if (controladas === undefined) setInternas(novas);
    onChange?.(novas, changes);
  };

  /** Grava textos (edição, colagem, limpeza): lê, valida e guarda um passo do desfazer. As recusadas voltam com o erro. */
  const aplicar = (entradas: Entrada[]) => {
    const novas = rows.slice();
    const changes: DataGridChange<R>[] = [];
    const recusadas: Edicao[] = [];
    let aceitas = 0;
    for (const e of entradas) {
      const col = columns[e.c];
      const row = novas[e.r];
      if (!col?.editable || !row) continue;
      const lido = ler(e.texto, col, row);
      if ("erro" in lido) {
        recusadas.push({ ...e, erro: lido.erro });
        continue;
      }
      aceitas++;
      const previous = valorDe(row, col.key);
      if (Object.is(previous, lido.value)) continue;
      novas[e.r] = { ...row, [col.key]: lido.value };
      changes.push({ rowId: row.id, key: col.key, previous, value: lido.value });
    }
    if (changes.length) {
      historico.current = { passado: [...historico.current.passado, changes], futuro: [] };
      mudar(novas, changes);
    }
    return { aceitas, recusadas };
  };

  const desfazer = (voltar: boolean) => {
    const h = historico.current;
    const lote = (voltar ? h.passado : h.futuro).pop();
    if (!lote) return;
    (voltar ? h.futuro : h.passado).push(lote);
    const indice = new Map(rows.map((row, i) => [row.id, i]));
    const novas = rows.slice();
    const changes: DataGridChange<R>[] = [];
    for (const ch of voltar ? [...lote].reverse() : lote) {
      const i = indice.get(ch.rowId);
      const row = i === undefined ? undefined : novas[i];
      if (i === undefined || !row) continue;
      const value = voltar ? ch.previous : ch.value;
      novas[i] = { ...row, [ch.key]: value };
      changes.push({ rowId: ch.rowId, key: ch.key, previous: valorDe(row, ch.key), value });
    }
    mudar(novas, changes);
    setAviso(voltar ? messages.undone : messages.redone);
    // a célula ativa vai para o que mudou, para quem usa leitor de tela saber onde foi
    const primeira = changes[0];
    const r = primeira && indice.get(primeira.rowId);
    if (primeira && r !== undefined) ir({ r, c: columns.findIndex((col) => col.key === primeira.key) });
  };

  function ir(alvo: Celula, estender = false) {
    const celula = limitar(alvo);
    querFoco.current = true;
    setCursor((s) => ({ ativa: celula, ancora: estender ? s.ancora : celula }));
  }

  const editar = (celula: Celula, texto: string, erro?: string) => {
    editando.current = true;
    setEdicao({ ...celula, texto, erro });
  };
  const fechar = () => {
    editando.current = false;
    setEdicao(null);
  };
  const confirmar = (proxima: Celula) => {
    if (!edicao) return;
    const erro = aplicar([edicao]).recusadas[0]?.erro;
    if (erro !== undefined) {
      setEdicao({ ...edicao, erro });
      setAviso(erro);
      return;
    }
    fechar();
    ir(proxima);
  };

  const entradasDaSelecao = (texto: (r: number, c: number) => string | undefined): Entrada[] => {
    const lista: Entrada[] = [];
    for (let r = sel.top; r <= sel.bottom; r++)
      for (let c = sel.left; c <= sel.right; c++) {
        const t = texto(r - sel.top, c - sel.left);
        if (t !== undefined) lista.push({ r, c, texto: t });
      }
    return lista;
  };

  const avisarRecusadas = (prefixo: string, recusadas: Edicao[]) => {
    setAviso([prefixo, recusadas.length ? messages.cellsRejected(recusadas.length) : ""].filter(Boolean).join(". "));
    // a primeira recusada abre em edição, com o texto colado e o erro
    const primeira = recusadas[0];
    if (primeira) {
      ir(primeira);
      editar(primeira, primeira.texto, primeira.erro);
    }
  };

  function aoTeclar(e: KeyboardEvent<HTMLTableElement>) {
    if (edicao || rows.length === 0) return;
    const mod = e.ctrlKey || e.metaKey;
    const letra = e.key.toLowerCase();
    if (mod && (letra === "z" || letra === "y")) {
      e.preventDefault();
      desfazer(letra === "z" && !e.shiftKey);
      return;
    }
    const pagina = Math.max(1, Math.floor(janela.altura / janela.linha) - 1);
    const destinos: Record<string, Celula> = {
      ArrowUp: { r: at.r - 1, c: at.c },
      ArrowDown: { r: at.r + 1, c: at.c },
      ArrowLeft: { r: at.r, c: at.c - 1 },
      ArrowRight: { r: at.r, c: at.c + 1 },
      Home: mod ? { r: 0, c: 0 } : { r: at.r, c: 0 },
      End: mod ? { r: ultimaLinha, c: ultimaColuna } : { r: at.r, c: ultimaColuna },
      PageUp: { r: at.r - pagina, c: at.c },
      PageDown: { r: at.r + pagina, c: at.c },
    };
    const destino = destinos[e.key];
    const editavel = columns[at.c]?.editable;
    if (destino) {
      e.preventDefault();
      ir(destino, e.shiftKey);
    } else if (e.key === "Tab") {
      // na primeira e na última coluna o Tab sai da grade: o teclado não fica preso (WCAG 2.1.2)
      const c = at.c + (e.shiftKey ? -1 : 1);
      if (c < 0 || c > ultimaColuna) return;
      e.preventDefault();
      ir({ r: at.r, c });
    } else if (e.key === "Enter" || e.key === "F2") {
      e.preventDefault();
      if (editavel) editar(at, paraTexto(valorDe(rows[at.r], columns[at.c]?.key ?? "")));
      else if (e.key === "Enter") ir({ r: at.r + (e.shiftKey ? -1 : 1), c: at.c });
    } else if (e.key === "Escape") {
      setCursor({ ativa: at, ancora: at });
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      avisarRecusadas("", aplicar(entradasDaSelecao(() => "")).recusadas);
    } else if (e.key.length === 1 && !mod && !e.altKey && editavel) {
      // digitar começa a edição, trocando o valor
      e.preventDefault();
      editar(at, e.key);
    }
  }

  function teclaNoEditor(e: KeyboardEvent<HTMLInputElement>) {
    if (!edicao || e.nativeEvent.isComposing) return;
    if (e.key === "Escape") {
      e.preventDefault();
      fechar();
      querFoco.current = true;
    } else if (e.key === "Enter") {
      e.preventDefault();
      confirmar({ r: edicao.r + (e.shiftKey ? -1 : 1), c: edicao.c });
    } else if (e.key === "Tab") {
      e.preventDefault();
      confirmar({ r: edicao.r, c: edicao.c + (e.shiftKey ? -1 : 1) });
    }
  }

  // clicar fora grava o que vale; o que não passa na validação é descartado
  const aoSairDoEditor = () => {
    if (!editando.current || !edicao) return;
    aplicar([edicao]);
    fechar();
  };

  function aoCopiar(e: ClipboardEvent<HTMLTableElement>) {
    if (edicao || rows.length === 0) return;
    e.preventDefault();
    const linhas: string[] = [];
    for (let r = sel.top; r <= sel.bottom; r++) {
      const celulas: string[] = [];
      // shortcut: tab e quebra de linha dentro do texto viram espaço (sem as aspas do Excel); se aparecer texto com quebra, citar
      for (let c = sel.left; c <= sel.right; c++) {
        const valor = valorDe(rows[r], columns[c]?.key ?? "");
        const texto = paraTexto(valor).replace(/[\t\r\n]/g, " ");
        // texto que começa com = + - @ vira fórmula ao colar no Excel: o apóstrofo o mantém como texto (números ficam como estão)
        celulas.push(typeof valor === "string" && FORMULA.test(texto) ? `'${texto}` : texto);
      }
      linhas.push(celulas.join("\t"));
    }
    e.clipboardData.setData("text/plain", linhas.join("\n"));
    setAviso(messages.cellsCopied(linhas.length * (sel.right - sel.left + 1)));
  }

  function aoColar(e: ClipboardEvent<HTMLTableElement>) {
    if (edicao || rows.length === 0) return;
    e.preventDefault();
    // shortcut: célula entre aspas do Excel (com tab ou quebra dentro) não é tratada; se precisar, ler o formato CSV
    // o apóstrofo que a cópia põe antes de = + - @ sai de novo ao colar aqui
    const bloco = e.clipboardData.getData("text/plain").replace(/\r?\n$/, "").split(/\r?\n/)
      .map((l) => l.split("\t").map((t) => (t.startsWith("'") && FORMULA.test(t.slice(1)) ? t.slice(1) : t)));
    const unico = bloco.length === 1 && bloco[0]?.length === 1;
    // um valor só preenche a seleção inteira; um bloco começa no canto da seleção
    const entradas = unico
      ? entradasDaSelecao(() => bloco[0]?.[0])
      : bloco.flatMap((linha, i) => linha.map((texto, j) => ({ r: sel.top + i, c: sel.left + j, texto })));
    const { aceitas, recusadas } = aplicar(entradas);
    avisarRecusadas(messages.cellsPasted(aceitas), recusadas);
  }

  const celulaDe = (el: HTMLElement | null | undefined): Celula | undefined => {
    const [r, c] = (el?.dataset["cell"] ?? "").split(":").map(Number);
    return r === undefined || c === undefined || Number.isNaN(r) || Number.isNaN(c) ? undefined : { r, c };
  };
  const celulaDoClique = (e: MouseEvent) => celulaDe((e.target as HTMLElement).closest<HTMLElement>("[data-cell]"));
  // clique: Shift estende a seleção
  function aoApertar(e: MouseEvent) {
    const celula = celulaDoClique(e);
    if (!celula || (edicao?.r === celula.r && edicao.c === celula.c)) return;
    setCursor((s) => ({ ativa: celula, ancora: e.shiftKey ? s.ancora : celula }));
  }
  // o foco chegou a outra célula (clique, ou foco vindo de fora): ela passa a ser a ativa
  function aoFocar(e: FocusEvent) {
    const celula = celulaDe(e.target as HTMLElement);
    if (celula) setCursor((s) => (s.ativa.r === celula.r && s.ativa.c === celula.c ? s : { ativa: celula, ancora: celula }));
  }
  function aoClicarDuasVezes(e: MouseEvent) {
    const celula = celulaDoClique(e);
    if (celula && !edicao && columns[celula.c]?.editable) editar(celula, paraTexto(valorDe(rows[celula.r], columns[celula.c]?.key ?? "")));
  }

  // mede a área visível e a altura da linha (muda com a densidade compacta)
  useLayoutEffect(() => {
    const el = rolagem.current;
    if (!el) return;
    const medir = () => {
      const linha = el.querySelector("[data-row]")?.getBoundingClientRect().height;
      setJanela((j) => ({ topo: el.scrollTop, altura: el.clientHeight, linha: linha || j.linha }));
    };
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // depois de uma ação do teclado, o foco vai para a célula ativa (roving tabindex) e ela entra na área visível
  useLayoutEffect(() => {
    if (!querFoco.current || edicao) return;
    querFoco.current = false;
    const celula = tabela.current?.querySelector<HTMLElement>(`[data-cell="${at.r}:${at.c}"]`);
    celula?.focus({ preventScroll: true });
    celula?.scrollIntoView({ block: "nearest", inline: "nearest" });
  });

  // linhas desenhadas: as da área visível e a ativa (para o foco nunca sumir); os buracos viram uma linha vazia da mesma altura
  const inicio = Math.max(0, Math.floor(janela.topo / janela.linha) - SOBRA);
  const fim = Math.min(rows.length, Math.ceil((janela.topo + janela.altura) / janela.linha) + SOBRA);
  const indices = Array.from({ length: Math.max(0, fim - inicio) }, (_, i) => inicio + i);
  if (rows.length > 0 && (at.r < inicio || at.r >= fim)) indices.push(at.r);
  indices.sort((a, b) => a - b);
  const corpo: ReactNode[] = [];
  const vazio = (de: number, ate: number) =>
    ate > de && corpo.push(<tr key={`vazio-${de}`} aria-hidden style={{ height: (ate - de) * janela.linha }}><td colSpan={columns.length} /></tr>);
  let proxima = 0;
  for (const r of indices) {
    vazio(proxima, r);
    proxima = r + 1;
    const row = rows[r];
    corpo.push(
      <Table.Tr key={String(row?.id)} aria-rowindex={r + 2} data-row={r} className={classes["row"]}>
        {columns.map((col, c) => {
          const ativo = r === at.r && c === at.c;
          const ed = edicao?.r === r && edicao.c === c ? edicao : undefined;
          return (
            <Table.Td
              key={col.key}
              role="gridcell"
              data-cell={`${r}:${c}`}
              data-align={col.align ?? (numerica(col) ? "end" : "start")}
              data-active={ativo || undefined}
              data-editing={ed ? true : undefined}
              tabIndex={ativo ? 0 : -1}
              aria-selected={selecionada(r, c)}
              aria-readonly={!col.editable}
              className={classes["cell"]}
            >
              {ed ? (
                <Tooltip label={ed.erro} opened={ed.erro !== undefined} position="bottom-start">
                  <Input
                    ref={(el: HTMLInputElement | null) => {
                      if (!el || el === document.activeElement) return;
                      el.focus();
                      el.setSelectionRange(el.value.length, el.value.length);
                    }}
                    size="sm"
                    radius="xs"
                    value={ed.texto}
                    error={ed.erro !== undefined}
                    aria-labelledby={`${id}-c${c}`}
                    inputMode={numerica(col) ? "decimal" : undefined}
                    autoComplete="off"
                    onChange={(ev: ChangeEvent<HTMLInputElement>) => setEdicao({ ...ed, texto: ev.target.value, erro: undefined })}
                    onKeyDown={teclaNoEditor}
                    onBlur={aoSairDoEditor}
                  />
                </Tooltip>
              ) : (
                exibir(valorDe(row, col.key), col)
              )}
            </Table.Td>
          );
        })}
      </Table.Tr>,
    );
  }
  vazio(proxima, rows.length);

  return (
    <div {...rest} {...getStyles("root")}>
      <Table.ScrollContainer
        ref={rolagem}
        maxHeight={height}
        tabIndex={-1}
        className={classes["scroll"]}
        onScroll={(e) => {
          const topo = e.currentTarget.scrollTop;
          setJanela((j) => ({ ...j, topo }));
        }}
      >
        <Table
          ref={tabela}
          role="grid"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-rowcount={rows.length + 1}
          aria-colcount={columns.length}
          aria-multiselectable
          stickyHeader
          verticalSpacing={0}
          className={classes["grid"]}
          onKeyDown={aoTeclar}
          onMouseDown={aoApertar}
          onFocus={aoFocar}
          onDoubleClick={aoClicarDuasVezes}
          onCopy={aoCopiar}
          onPaste={aoColar}
        >
          <colgroup>
            {columns.map((col) => <col key={col.key} style={{ width: col.width }} />)}
          </colgroup>
          <Table.Thead>
            <Table.Tr aria-rowindex={1} className={classes["row"]}>
              {columns.map((col, c) => (
                <Table.Th key={col.key} id={`${id}-c${c}`} scope="col" data-align={col.align ?? (numerica(col) ? "end" : "start")} className={classes["cell"]}>
                  {col.title}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{corpo}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <VisuallyHidden role="status">{aviso}</VisuallyHidden>
    </div>
  );
}
