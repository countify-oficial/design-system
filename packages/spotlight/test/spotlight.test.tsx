import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { semViolacoes } from "@countify-oficial/test-utils";
import { describe, expect, it, vi } from "vitest";
import { createSpotlightStore, matchesShortcut, Spotlight } from "../src";

describe("Spotlight", () => {
  it("Ctrl+K abre; busca filtra; Enter executa e fecha", async () => {
    const user = userEvent.setup();
    const store = createSpotlightStore();
    const irAnalises = vi.fn();
    const { baseElement } = render(
      <Spotlight store={store} actions={[{ id: "a", label: "Análises", group: "Telas", onClick: irAnalises }, { id: "j", label: "Lume Jardins", group: "Lojas", description: "Fortaleza" }]} />,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog", { name: "Buscar" })).toBeTruthy();
    expect(screen.getAllByRole("option")).toHaveLength(2);
    await semViolacoes(baseElement);
    await user.type(screen.getByRole("combobox", { name: "Buscar" }), "analises");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Análises"]);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(irAnalises).toHaveBeenCalledOnce();
    expect(store.getState()).toBe(false);
  });

  it("vazio mostra a mensagem; o atalho reconhece ⌘ e Ctrl", () => {
    const store = createSpotlightStore();
    render(<Spotlight store={store} actions={[]} />);
    act(() => store.open());
    expect(screen.getByText("Nada encontrado")).toBeTruthy();
    expect(matchesShortcut({ key: "K", metaKey: true, ctrlKey: false }, "mod+K")).toBe(true);
    expect(matchesShortcut({ key: "k", metaKey: false, ctrlKey: false }, "mod+K")).toBe(false);
  });
});
