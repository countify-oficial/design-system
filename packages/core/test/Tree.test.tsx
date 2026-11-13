import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Cascader, Mentions, mentionQuery, Tree, treeCheckState, treePath, TreeSelect, type TreeNode } from "../src";
import { semViolacoes } from "./setup";

const lojas: TreeNode[] = [
  {
    value: "ce",
    label: "Ceará",
    children: [
      { value: "for", label: "Fortaleza", children: [{ value: "lume", label: "Lume Jardins" }, { value: "aldeota", label: "Aldeota" }] },
      { value: "sob", label: "Sobral" },
    ],
  },
  { value: "sp", label: "São Paulo", children: [{ value: "pin", label: "Pinheiros" }] },
];

describe("dados da árvore", () => {
  it("estado das caixas e caminho", () => {
    const ce = lojas[0];
    if (!ce) throw new Error("dados");
    expect(treeCheckState(ce, ["lume"])).toBe("some");
    expect(treeCheckState(ce, ["lume", "aldeota", "sob"])).toBe("all");
    expect(treePath(lojas, "lume")?.map((n) => n.label)).toEqual(["Ceará", "Fortaleza", "Lume Jardins"]);
  });
});

describe("Tree", () => {
  it("setas andam, direita abre, esquerda volta ao pai, Enter escolhe", async () => {
    const user = userEvent.setup();
    const aoEscolher = vi.fn();
    const { container } = render(<Tree aria-label="Lojas" data={lojas} onSelect={aoEscolher} />);
    expect(screen.getAllByRole("treeitem")).toHaveLength(2);
    await user.tab();
    expect(document.activeElement?.textContent).toBe("Ceará");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("treeitem", { name: "Ceará" }).getAttribute("aria-expanded")).toBe("true");
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(document.activeElement?.textContent).toBe("Sobral");
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement?.textContent).toBe("Ceará");
    await user.keyboard("{End}{Enter}");
    expect(aoEscolher).toHaveBeenLastCalledWith("sp", lojas[1]);
    expect(screen.getByRole("treeitem", { name: "São Paulo" }).getAttribute("aria-selected")).toBe("true");
    await semViolacoes(container);
  });

  it("caixas: marcar o pai marca as folhas; o pai fica meio marcado", async () => {
    const user = userEvent.setup();
    const aoMarcar = vi.fn();
    render(<Tree aria-label="Lojas" data={lojas} withCheckboxes defaultExpanded={["ce", "for"]} onCheckedChange={aoMarcar} />);
    await user.click(screen.getByRole("treeitem", { name: "Fortaleza" }));
    expect(aoMarcar).toHaveBeenLastCalledWith(["lume", "aldeota"]);
    expect(screen.getByRole("treeitem", { name: "Ceará" }).getAttribute("aria-checked")).toBe("mixed");
    expect(screen.getByRole("treeitem", { name: "Fortaleza" }).getAttribute("aria-checked")).toBe("true");
  });
});

describe("TreeSelect e Cascader", () => {
  it("TreeSelect: escolhe uma folha e mostra o rótulo", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { baseElement } = render(<TreeSelect label="Loja" data={lojas} leavesOnly onChange={aoMudar} />);
    const campo = screen.getByRole<HTMLInputElement>("textbox", { name: "Loja" });
    await user.click(campo);
    await user.click(screen.getByRole("treeitem", { name: "Ceará" }));
    expect(aoMudar).not.toHaveBeenCalled();
    await user.click(screen.getByRole("treeitem", { name: "Sobral" }));
    expect(aoMudar).toHaveBeenLastCalledWith("sob");
    expect(campo.value).toBe("Sobral");
    await semViolacoes(baseElement);
  });

  it("Cascader: uma coluna por camada; o campo mostra o caminho", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { baseElement } = render(<Cascader label="Loja" data={lojas} onChange={aoMudar} />);
    const campo = screen.getByRole<HTMLInputElement>("textbox", { name: "Loja" });
    await user.click(campo);
    await user.click(screen.getByRole("button", { name: "Ceará" }));
    await user.click(screen.getByRole("button", { name: "Fortaleza" }));
    await semViolacoes(baseElement);
    await user.click(screen.getByRole("button", { name: "Aldeota" }));
    expect(aoMudar).toHaveBeenLastCalledWith(["ce", "for", "aldeota"], expect.any(Array));
    expect(campo.value).toBe("Ceará / Fortaleza / Aldeota");
    await waitFor(() => expect(screen.queryByRole("button", { name: "Aldeota" })).toBeNull());
  });
});

describe("Mentions", () => {
  it("acha a menção antes do cursor", () => {
    expect(mentionQuery("oi @an", 6, "@")).toEqual({ inicio: 3, busca: "an" });
    expect(mentionQuery("mail@x", 6, "@")).toBeNull();
    expect(mentionQuery("@ana oi", 7, "@")).toBeNull();
  });

  it("@ abre a lista; Enter põe o nome no texto", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { baseElement } = render(<Mentions label="Comentário" data={["Ana Lima", "Bruno Reis"]} onChange={aoMudar} />);
    const campo = screen.getByLabelText("Comentário");
    await user.type(campo, "oi @br");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Bruno Reis"]);
    await semViolacoes(baseElement);
    await user.keyboard("{ArrowDown}");
    await semViolacoes(baseElement);
    await user.keyboard("{Enter}");
    expect(aoMudar).toHaveBeenLastCalledWith("oi @Bruno Reis ");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
  });
});
