import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button, DataTable, type DataTableColumn } from "../src";
import { semViolacoes } from "./setup";

interface Loja {
  id: string;
  nome: string;
  cidade: string;
  vendas: number | null;
}
const lojas: Loja[] = [
  { id: "1", nome: "Lume Jardins", cidade: "Fortaleza", vendas: 1520 },
  { id: "2", nome: "Ávila Centro", cidade: "Sobral", vendas: 640 },
  { id: "3", nome: "Brisa", cidade: "Maceió", vendas: null },
  { id: "4", nome: "Lume Orla", cidade: "Fortaleza", vendas: 1110 },
];
const colunas: DataTableColumn<Loja>[] = [
  { key: "nome", title: "Loja", sortable: true },
  { key: "cidade", title: "Cidade" },
  { key: "vendas", title: "Vendas", numeric: true, sortable: true },
];
const id = (l: Loja) => l.id;
const nomes = () => screen.getAllByRole("rowheader").map((c) => c.textContent);

describe("DataTable", () => {
  it("cabeçalho de linha, números no formato do idioma, vazio vira traço, legenda e axe", async () => {
    const { container } = render(<DataTable columns={colunas} rows={lojas} getRowId={id} caption="Hoje" />);
    expect(screen.getByRole("table", { name: "Hoje" })).toBeTruthy();
    expect(nomes()).toEqual(["Lume Jardins", "Ávila Centro", "Brisa", "Lume Orla"]);
    const jardins = screen.getByRole("row", { name: /^Lume Jardins/ });
    expect(within(jardins).getByRole("cell", { name: "1.520" }).hasAttribute("data-numeric")).toBe(true);
    expect(within(screen.getByRole("row", { name: /^Brisa/ })).getByRole("cell", { name: "—" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "Cidade" }).hasAttribute("aria-sort")).toBe(false);
    await semViolacoes(container);
  });

  it("ordena ao clicar: texto em pt-BR (Á com o A), números de verdade, vazios no fim nos dois sentidos", () => {
    const onSortChange = vi.fn();
    render(<DataTable columns={colunas} rows={lojas} getRowId={id} onSortChange={onSortChange} />);
    const loja = screen.getByRole("columnheader", { name: "Loja" });
    expect(loja.getAttribute("aria-sort")).toBe("none");
    fireEvent.click(screen.getByRole("button", { name: "Loja" }));
    expect(loja.getAttribute("aria-sort")).toBe("ascending");
    expect(nomes()).toEqual(["Ávila Centro", "Brisa", "Lume Jardins", "Lume Orla"]);
    fireEvent.click(screen.getByRole("button", { name: "Loja" }));
    expect(loja.getAttribute("aria-sort")).toBe("descending");
    expect(onSortChange).toHaveBeenLastCalledWith({ key: "nome", direction: "descending" });

    // coluna de números: primeiro do maior para o menor, depois o contrário
    fireEvent.click(screen.getByRole("button", { name: "Vendas" }));
    expect(nomes()).toEqual(["Lume Jardins", "Lume Orla", "Ávila Centro", "Brisa"]);
    expect(loja.getAttribute("aria-sort")).toBe("none");
    fireEvent.click(screen.getByRole("button", { name: "Vendas" }));
    expect(nomes()).toEqual(["Ávila Centro", "Lume Orla", "Lume Jardins", "Brisa"]);
  });

  it("ordenação controlada e comparação própria da coluna", () => {
    const porCidade: DataTableColumn<Loja>[] = [{ key: "nome", title: "Loja", sortable: true, compare: (a, b) => a.cidade.localeCompare(b.cidade, "pt-BR") }];
    const { rerender } = render(<DataTable columns={porCidade} rows={lojas} getRowId={id} sort={null} onSortChange={() => undefined} />);
    fireEvent.click(screen.getByRole("button", { name: "Loja" }));
    expect(nomes()).toEqual(["Lume Jardins", "Ávila Centro", "Brisa", "Lume Orla"]);
    rerender(<DataTable columns={porCidade} rows={lojas} getRowId={id} sort={{ key: "nome", direction: "ascending" }} onSortChange={() => undefined} />);
    expect(nomes()).toEqual(["Lume Jardins", "Lume Orla", "Brisa", "Ávila Centro"]);
  });

  it("paginação no cliente: corta, mostra o intervalo e volta à 1 ao ordenar", () => {
    const onPageChange = vi.fn();
    render(<DataTable columns={colunas} rows={lojas} getRowId={id} pageSize={3} onPageChange={onPageChange} />);
    expect(nomes()).toEqual(["Lume Jardins", "Ávila Centro", "Brisa"]);
    expect(screen.getByText("1–3 de 4")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Página 2" }));
    expect(nomes()).toEqual(["Lume Orla"]);
    expect(screen.getByText("4–4 de 4")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Loja" }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
    expect(nomes()).toEqual(["Ávila Centro", "Brisa", "Lume Jardins"]);
  });

  it("sem paginação quando cabe numa página", () => {
    render(<DataTable columns={colunas} rows={lojas} getRowId={id} pageSize={10} />);
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("manual (servidor): não ordena nem corta; o total dá as páginas", () => {
    const onSortChange = vi.fn();
    render(
      <DataTable columns={colunas} rows={lojas.slice(0, 2)} getRowId={id} manual pageSize={2} page={3} total={40} sort={null} onSortChange={onSortChange} onPageChange={() => undefined} />,
    );
    expect(screen.getByText("5–6 de 40")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Vendas" }));
    // coluna de números começa do maior para o menor
    expect(onSortChange).toHaveBeenCalledWith({ key: "vendas", direction: "descending" });
    expect(nomes()).toEqual(["Lume Jardins", "Ávila Centro"]);
  });

  it("seleção: caixa por linha com o nome, todas da página (meio marcada), anúncio e barra de ações", async () => {
    const onSelectedIdsChange = vi.fn();
    const { container } = render(
      <DataTable columns={colunas} rows={lojas} getRowId={id} pageSize={3} selectable onSelectedIdsChange={onSelectedIdsChange} actions={<Button size="sm">Mover</Button>} />,
    );
    const todas = screen.getByRole<HTMLInputElement>("checkbox", { name: "Selecionar todas desta página" });
    fireEvent.click(screen.getByRole("checkbox", { name: "Selecionar Lume Jardins" }));
    expect(onSelectedIdsChange).toHaveBeenLastCalledWith(["1"]);
    expect([todas.checked, todas.indeterminate]).toEqual([false, true]);
    expect(screen.getByRole("status").textContent).toBe("1 selecionada");
    expect(within(screen.getByRole("toolbar", { name: "Ações das linhas selecionadas" })).getByRole("button", { name: "Mover" })).toBeTruthy();

    fireEvent.click(todas);
    expect(onSelectedIdsChange).toHaveBeenLastCalledWith(["1", "2", "3"]);
    expect([todas.checked, todas.indeterminate]).toEqual([true, false]);
    expect(screen.getByRole("status").textContent).toBe("3 selecionadas");
    await semViolacoes(container);

    // a outra página tem o próprio "todas"; a seleção de antes continua
    fireEvent.click(screen.getByRole("button", { name: "Página 2" }));
    expect(todas.checked).toBe(false);
    fireEvent.click(todas);
    expect(onSelectedIdsChange).toHaveBeenLastCalledWith(["1", "2", "3", "4"]);
    fireEvent.click(todas);
    expect(onSelectedIdsChange).toHaveBeenLastCalledWith(["1", "2", "3"]);
  });

  it("seleção controlada: as caixas seguem selectedIds; a barra sai sem a contagem", async () => {
    const { rerender } = render(<DataTable columns={colunas} rows={lojas} getRowId={id} selectable selectedIds={["2"]} onSelectedIdsChange={() => undefined} actions="Mover" />);
    expect(screen.getByRole("toolbar").textContent).toBe("1 selecionadaMover");
    expect(screen.getByRole<HTMLInputElement>("checkbox", { name: "Selecionar Ávila Centro" }).checked).toBe(true);
    fireEvent.click(screen.getByRole("checkbox", { name: "Selecionar Brisa" }));
    expect(screen.getByRole<HTMLInputElement>("checkbox", { name: "Selecionar Brisa" }).checked).toBe(false);
    rerender(<DataTable columns={colunas} rows={lojas} getRowId={id} selectable selectedIds={[]} onSelectedIdsChange={() => undefined} actions="Mover" />);
    expect(screen.getByRole("toolbar").textContent).toBe("Mover");
    await waitFor(() => expect(screen.queryByRole("toolbar")).toBeNull());
  });

  it("linha clicável: abre pela linha e pelo botão do nome; a caixa de marcar não abre", () => {
    const abrir = vi.fn();
    render(<DataTable columns={colunas} rows={lojas} getRowId={id} selectable onRowClick={abrir} getRowLabel={(l) => `loja ${l.nome}`} />);
    fireEvent.click(screen.getByRole("cell", { name: "Sobral" }));
    expect(abrir).toHaveBeenLastCalledWith(lojas[1]);
    fireEvent.click(screen.getByRole("button", { name: "Lume Orla" }));
    expect(abrir).toHaveBeenLastCalledWith(lojas[3]);
    expect(abrir).toHaveBeenCalledTimes(2);
    const caixa = screen.getByRole("checkbox", { name: "Selecionar loja Brisa" });
    fireEvent.click(caixa);
    const celula = caixa.closest("td");
    if (!celula) throw new Error("a caixa fica numa célula");
    fireEvent.click(celula);
    expect(abrir).toHaveBeenCalledTimes(2);
  });

  it("carregando: blocos no lugar das linhas e aria-busy; vazio: o texto padrão ou o do app", async () => {
    const { container, rerender } = render(<DataTable columns={colunas} rows={[]} getRowId={id} loading pageSize={3} selectable />);
    expect(screen.getByRole("table").getAttribute("aria-busy")).toBe("true");
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getByRole<HTMLInputElement>("checkbox", { name: "Selecionar todas desta página" }).disabled).toBe(true);
    await semViolacoes(container);
    rerender(<DataTable columns={colunas} rows={[]} getRowId={id} />);
    expect(screen.getByRole("table").hasAttribute("aria-busy")).toBe(false);
    expect(screen.getByRole("cell", { name: "Nada para mostrar" }).getAttribute("colspan")).toBe("3");
    rerender(<DataTable columns={colunas} rows={[]} getRowId={id} emptyState="Nenhuma loja" />);
    expect(screen.getByRole("cell", { name: "Nenhuma loja" })).toBeTruthy();
  });
});
