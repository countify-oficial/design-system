import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Table } from "../src";
import { semViolacoes } from "./setup";

describe("Table", () => {
  it("cabeçalho fixo, números à direita, ordenação com aria-sort", async () => {
    const ordenar = vi.fn();
    const { container } = render(
      <Table.ScrollContainer maxHeight={300} aria-label="Lojas">
        <Table stickyHeader stickyFirstColumn>
          <Table.Caption>Hoje</Table.Caption>
          <Table.Thead>
            <Table.Tr><Table.Th>Loja</Table.Th><Table.Th numeric sort="descending" onSort={ordenar}>Entradas</Table.Th></Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr><Table.Th scope="row">Jardins</Table.Th><Table.Td numeric>1.102</Table.Td></Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>,
    );
    const tabela = screen.getByRole("table");
    expect([tabela.hasAttribute("data-sticky-header"), tabela.hasAttribute("data-sticky-first-column")]).toEqual([true, true]);
    const th = screen.getByRole("columnheader", { name: "Entradas" });
    expect(th.getAttribute("aria-sort")).toBe("descending");
    fireEvent.click(screen.getByRole("button", { name: "Entradas" }));
    expect(ordenar).toHaveBeenCalled();
    expect(screen.getByRole("cell", { name: "1.102" }).hasAttribute("data-numeric")).toBe(true);
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue("--table-max-height")).toBe("300px");
    await semViolacoes(container);
  });
});
