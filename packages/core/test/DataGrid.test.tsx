import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { DataGrid, type DataGridChange, type DataGridColumn } from "../src";
import { semViolacoes } from "./setup";

interface Produto {
  id: number;
  codigo: string;
  nome: string;
  estoque: number | null;
  preco: number | null;
}

const colunas: DataGridColumn<Produto>[] = [
  { key: "codigo", title: "Código de barras", width: 160 },
  { key: "nome", title: "Produto", editable: true, validate: (v) => (v === "" ? "Informe o nome" : undefined) },
  { key: "estoque", title: "Estoque", type: "number", editable: true, validate: (v) => (typeof v === "number" && v < 0 ? "Estoque não pode ser negativo" : undefined) },
  { key: "preco", title: "Preço", type: "currency", editable: true },
];

const produtos = (n: number): Produto[] =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, codigo: `789100000${String(i).padStart(4, "0")}`, nome: `Produto ${i + 1}`, estoque: 1000 + i, preco: 12.9 }));

function montar(n = 3, props: { onChange?: (rows: Produto[], changes: DataGridChange<Produto>[]) => void } = {}) {
  const r = render(<DataGrid aria-label="Produtos" columns={colunas} defaultRows={produtos(n)} height={400} {...props} />);
  return { ...r, grade: screen.getByRole("grid") };
}

// o Intl separa "R$" do número com espaço sem quebra
const texto = (el: Element) => el.textContent.replace(/\u00a0/g, " ");
const celula = (r: number, c: number) => document.querySelector<HTMLElement>(`[data-cell="${r}:${c}"]`) as HTMLElement;
// focar fora de um evento do Testing Library: o act desenha a célula nova como ativa antes da próxima tecla
const focar = (r: number, c: number) => act(() => celula(r, c).focus());
const ativa = () => document.activeElement as HTMLElement;
const tecla = (key: string, opcoes: Partial<KeyboardEventInit> = {}) => fireEvent.keyDown(ativa(), { key, ...opcoes });
const editor = () => screen.getByRole("textbox");

describe("DataGrid", () => {
  it("padrão ARIA grid, formato pt-BR e sem violações", async () => {
    const { container, grade } = montar();
    expect(grade.getAttribute("aria-rowcount")).toBe("4");
    expect(grade.getAttribute("aria-multiselectable")).toBe("true");
    expect(screen.getAllByRole("columnheader").map((th) => th.textContent)).toEqual(["Código de barras", "Produto", "Estoque", "Preço"]);
    const linhas = screen.getAllByRole("row");
    expect(linhas.map((l) => l.getAttribute("aria-rowindex"))).toEqual(["1", "2", "3", "4"]);
    expect(within(linhas[1] as HTMLElement).getAllByRole("gridcell").map(texto)).toEqual(["7891000000000", "Produto 1", "1.000", "R$ 12,90"]);
    // roving tabindex: só a célula ativa entra no Tab
    expect(screen.getAllByRole("gridcell").filter((c) => c.tabIndex === 0)).toEqual([celula(0, 0)]);
    expect(celula(0, 0).getAttribute("aria-selected")).toBe("true");
    expect(celula(0, 0).getAttribute("aria-readonly")).toBe("true");
    expect(celula(0, 2).getAttribute("data-align")).toBe("end");
    await semViolacoes(container);
  });

  it("teclado: setas, Tab, Home/End e Ctrl+Home/End", () => {
    montar();
    focar(0, 0);
    tecla("ArrowRight");
    expect(ativa()).toBe(celula(0, 1));
    tecla("ArrowDown");
    expect(ativa()).toBe(celula(1, 1));
    tecla("Tab");
    expect(ativa()).toBe(celula(1, 2));
    tecla("Tab", { shiftKey: true });
    expect(ativa()).toBe(celula(1, 1));
    tecla("End");
    expect(ativa()).toBe(celula(1, 3));
    // na última coluna, o Tab sai da grade (não é impedido)
    expect(tecla("Tab")).toBe(true);
    tecla("Home");
    expect(ativa()).toBe(celula(1, 0));
    tecla("End", { ctrlKey: true });
    expect(ativa()).toBe(celula(2, 3));
    tecla("Home", { ctrlKey: true });
    expect(ativa()).toBe(celula(0, 0));
    tecla("ArrowUp");
    expect(ativa()).toBe(celula(0, 0));
    expect(celula(0, 0).tabIndex).toBe(0);
    expect(celula(1, 1).tabIndex).toBe(-1);
  });

  it("edita com Enter, F2 ou digitando; Enter grava e desce, Tab grava e vai à direita, Esc cancela", () => {
    const onChange = vi.fn();
    montar(3, { onChange });
    focar(0, 2);
    tecla("Enter");
    expect((editor() as HTMLInputElement).value).toBe("1000");
    expect(ativa()).toBe(editor());
    fireEvent.change(editor(), { target: { value: "1.250,5" } });
    tecla("Enter");
    expect(texto(celula(0, 2))).toBe("1.250,5");
    expect(ativa()).toBe(celula(1, 2));
    expect(onChange).toHaveBeenLastCalledWith(expect.any(Array), [{ rowId: 1, key: "estoque", previous: 1000, value: 1250.5 }]);
    expect((onChange.mock.lastCall?.[0] as Produto[])[0]?.estoque).toBe(1250.5);

    // digitar começa a edição com a tecla
    tecla("7");
    expect((editor() as HTMLInputElement).value).toBe("7");
    tecla("Tab");
    expect(texto(celula(1, 2))).toBe("7");
    expect(ativa()).toBe(celula(1, 3));

    // F2 e Esc: nada muda
    tecla("F2");
    fireEvent.change(editor(), { target: { value: "99" } });
    tecla("Escape");
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(texto(celula(1, 3))).toBe("R$ 12,90");
    expect(ativa()).toBe(celula(1, 3));
    expect(onChange).toHaveBeenCalledTimes(2);

    // coluna só de leitura: Enter só desce
    focar(0, 0);
    tecla("Enter");
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(ativa()).toBe(celula(1, 0));
  });

  it("validação: número inválido e regra da coluna mostram o erro e mantêm a edição", async () => {
    const onChange = vi.fn();
    const { container } = montar(3, { onChange });
    focar(0, 2);
    tecla("a");
    tecla("Enter");
    expect(editor().getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("tooltip").textContent).toBe("Digite um número");
    expect(editor().getAttribute("aria-describedby")).toBe(screen.getByRole("tooltip").id);
    expect(screen.getByRole("status").textContent).toBe("Digite um número");
    await semViolacoes(container);

    fireEvent.change(editor(), { target: { value: "-3" } });
    expect(editor().getAttribute("aria-invalid")).toBeNull();
    tecla("Enter");
    expect(screen.getByRole("tooltip").textContent).toBe("Estoque não pode ser negativo");
    expect(onChange).not.toHaveBeenCalled();

    // sair da célula com valor inválido descarta a edição
    fireEvent.blur(editor());
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(texto(celula(0, 2))).toBe("1.000");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("desfazer e refazer: Ctrl+Z, Ctrl+Shift+Z e Ctrl+Y", () => {
    const onChange = vi.fn();
    montar(3, { onChange });
    focar(0, 1);
    tecla("B");
    tecla("Enter");
    expect(texto(celula(0, 1))).toBe("B");
    tecla("z", { ctrlKey: true });
    expect(texto(celula(0, 1))).toBe("Produto 1");
    expect(ativa()).toBe(celula(0, 1));
    expect(screen.getByRole("status").textContent).toBe("Edição desfeita");
    expect(onChange).toHaveBeenLastCalledWith(expect.any(Array), [{ rowId: 1, key: "nome", previous: "B", value: "Produto 1" }]);
    tecla("Z", { ctrlKey: true, shiftKey: true });
    expect(texto(celula(0, 1))).toBe("B");
    tecla("z", { metaKey: true });
    expect(texto(celula(0, 1))).toBe("Produto 1");
    tecla("y", { ctrlKey: true });
    expect(texto(celula(0, 1))).toBe("B");
    expect(screen.getByRole("status").textContent).toBe("Edição refeita");
    // sem mais passos: nada acontece
    tecla("y", { ctrlKey: true });
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it("cola um bloco do Excel a partir da célula ativa, num passo só do desfazer; pula colunas só de leitura", () => {
    const onChange = vi.fn();
    montar(3, { onChange });
    focar(1, 0);
    fireEvent.paste(ativa(), { clipboardData: { getData: () => "x\tArroz\t10\tR$ 1.234,50\r\ny\tFeijão\t20,5\t3,99\r\n" } });
    expect([0, 1, 2, 3].map((c) => texto(celula(1, c)))).toEqual(["7891000000001", "Arroz", "10", "R$ 1.234,50"]);
    expect([0, 1, 2, 3].map((c) => texto(celula(2, c)))).toEqual(["7891000000002", "Feijão", "20,5", "R$ 3,99"]);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.lastCall?.[1] as unknown[]).length).toBe(6);
    expect(screen.getByRole("status").textContent).toBe("6 células coladas");
    tecla("z", { ctrlKey: true });
    expect(texto(celula(2, 1))).toBe("Produto 3");
    expect(texto(celula(1, 3))).toBe("R$ 12,90");
  });

  it("colar: valor inválido é recusado e abre em edição com o erro; um valor só preenche a seleção", () => {
    montar(3);
    focar(0, 2);
    fireEvent.paste(ativa(), { clipboardData: { getData: () => "5\nabc\n7" } });
    expect(texto(celula(0, 2))).toBe("5");
    expect(texto(celula(2, 2))).toBe("7");
    expect(screen.getByRole("status").textContent).toBe("2 células coladas. 1 valor recusado");
    expect((editor() as HTMLInputElement).value).toBe("abc");
    expect(screen.getByRole("tooltip").textContent).toBe("Digite um número");
    tecla("Escape");

    // Shift+setas seleciona; um valor colado vai para todas as células
    focar(0, 2);
    tecla("ArrowDown", { shiftKey: true });
    tecla("ArrowDown", { shiftKey: true });
    expect([0, 1, 2].map((r) => celula(r, 2).getAttribute("aria-selected"))).toEqual(["true", "true", "true"]);
    fireEvent.paste(ativa(), { clipboardData: { getData: () => "42" } });
    expect([0, 1, 2].map((r) => texto(celula(r, 2)))).toEqual(["42", "42", "42"]);

    // Delete limpa a seleção
    tecla("Delete");
    expect([0, 1, 2].map((r) => texto(celula(r, 2)))).toEqual(["", "", ""]);
  });

  it("cópia não leva fórmula para a planilha, e a colagem tira o apóstrofo de volta", () => {
    montar(1);
    focar(0, 1);
    tecla("Enter");
    fireEvent.change(editor(), { target: { value: "=HYPERLINK(\"x\")" } });
    tecla("Enter");
    focar(0, 1);
    tecla("ArrowRight", { shiftKey: true });
    const setData = vi.fn();
    fireEvent.copy(ativa(), { clipboardData: { setData } });
    // o texto ganha o apóstrofo; o número segue número
    expect(setData).toHaveBeenCalledWith("text/plain", "'=HYPERLINK(\"x\")\t1000");
    focar(0, 1);
    fireEvent.paste(ativa(), { clipboardData: { getData: () => "'=SOMA(A1)" } });
    expect(texto(celula(0, 1))).toBe("=SOMA(A1)");
  });

  it("copia a seleção com tab e quebra de linha", () => {
    montar(3);
    focar(0, 1);
    tecla("ArrowRight", { shiftKey: true });
    tecla("ArrowRight", { shiftKey: true });
    tecla("ArrowDown", { shiftKey: true });
    const setData = vi.fn();
    fireEvent.copy(ativa(), { clipboardData: { setData } });
    expect(setData).toHaveBeenCalledWith("text/plain", "Produto 1\t1000\t12,9\nProduto 2\t1001\t12,9");
    expect(screen.getByRole("status").textContent).toBe("6 células copiadas");
    // Esc volta a seleção para a célula ativa
    tecla("Escape");
    expect(screen.getAllByRole("gridcell").filter((c) => c.getAttribute("aria-selected") === "true")).toEqual([celula(1, 3)]);
  });

  it("10.000 linhas: só as visíveis no DOM, com aria-rowindex certo; Ctrl+End leva à última", () => {
    montar(10_000);
    expect(screen.getByRole("grid").getAttribute("aria-rowcount")).toBe("10001");
    expect(document.querySelectorAll("[data-row]").length).toBeLessThan(50);
    focar(0, 0);
    tecla("End", { ctrlKey: true });
    expect(ativa()).toBe(celula(9999, 3));
    expect(ativa().closest("tr")?.getAttribute("aria-rowindex")).toBe("10001");
    expect(texto(ativa())).toBe("R$ 12,90");
    tecla("ArrowUp");
    expect(ativa()).toBe(celula(9998, 3));
  });

  it("modo controlado: o valor só muda quando o pai aceita", () => {
    function Controlado({ aceitar }: { aceitar: boolean }) {
      const [rows, setRows] = useState(produtos(2));
      return <DataGrid aria-label="Produtos" columns={colunas} rows={rows} height={400} onChange={(novas) => aceitar && setRows(novas)} />;
    }
    const { rerender } = render(<Controlado aceitar={false} />);
    focar(0, 2);
    tecla("5");
    tecla("Enter");
    expect(texto(celula(0, 2))).toBe("1.000");
    rerender(<Controlado aceitar />);
    focar(0, 2);
    tecla("5");
    tecla("Enter");
    expect(texto(celula(0, 2))).toBe("5");
  });
});
