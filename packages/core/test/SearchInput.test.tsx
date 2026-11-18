import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchInput, TextInput } from "../src";
import { semViolacoes } from "./setup";

describe("SearchInput", () => {
  afterEach(() => vi.useRealTimers());

  it("sem rótulo: searchbox chamado \"Buscar\", com a lupa e sem o × enquanto vazio", async () => {
    const { container } = render(<SearchInput />);
    const campo = screen.getByRole("searchbox", { name: "Buscar" });
    expect(campo.getAttribute("type")).toBe("search");
    expect(campo.getAttribute("placeholder")).toBe("Buscar");
    expect(container.querySelector("svg")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
    await semViolacoes(container);
  });

  it("o × aparece com texto, limpa e devolve o foco ao campo", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(<SearchInput label="Lojas" onChange={aoMudar} />);
    const campo = screen.getByRole("searchbox", { name: "Lojas" });
    await user.type(campo, "lume");
    expect(aoMudar).toHaveBeenLastCalledWith("lume");
    await semViolacoes(container);
    await user.click(screen.getByRole("button", { name: "Limpar busca" }));
    expect((campo as HTMLInputElement).value).toBe("");
    expect(aoMudar).toHaveBeenLastCalledWith("");
    expect(document.activeElement).toBe(campo);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("Esc com texto limpa e não chega a quem está em volta; vazio, segue", () => {
    const fora = vi.fn();
    document.addEventListener("keydown", fora);
    render(<SearchInput defaultValue="lume" />);
    const campo = screen.getByRole<HTMLInputElement>("searchbox");
    fireEvent.keyDown(campo, { key: "Escape" });
    expect(campo.value).toBe("");
    expect(fora).not.toHaveBeenCalled();
    fireEvent.keyDown(campo, { key: "Escape" });
    expect(fora).toHaveBeenCalledTimes(1);
    document.removeEventListener("keydown", fora);
  });

  it("onSearch espera o debounce sem digitar e não roda ao montar", async () => {
    vi.useFakeTimers();
    const aoBuscar = vi.fn();
    render(<SearchInput defaultValue="a" debounce={300} onSearch={aoBuscar} />);
    const campo = screen.getByRole("searchbox");
    await act(() => vi.advanceTimersByTime(500));
    expect(aoBuscar).not.toHaveBeenCalled();
    fireEvent.change(campo, { target: { value: "lu" } });
    await act(() => vi.advanceTimersByTime(200));
    fireEvent.change(campo, { target: { value: "lume" } });
    await act(() => vi.advanceTimersByTime(200));
    expect(aoBuscar).not.toHaveBeenCalled();
    await act(() => vi.advanceTimersByTime(100));
    expect(aoBuscar).toHaveBeenCalledTimes(1);
    expect(aoBuscar).toHaveBeenLastCalledWith("lume");
  });

  it("controlado: mostra o value e pede a mudança", () => {
    const aoMudar = vi.fn();
    render(<SearchInput value="jardins" onChange={aoMudar} />);
    const campo = screen.getByRole<HTMLInputElement>("searchbox");
    expect(campo.value).toBe("jardins");
    fireEvent.click(screen.getByRole("button", { name: "Limpar busca" }));
    expect(aoMudar).toHaveBeenCalledWith("");
    expect(campo.value).toBe("jardins");
  });

  it("atalho \"/\": Kbd à direita enquanto vazio, foca o campo, mas não rouba a tecla de outro campo", async () => {
    const user = userEvent.setup();
    const { container } = render(<><TextInput label="Nome" /><SearchInput shortcut="/" /></>);
    const busca = screen.getByRole("searchbox");
    expect(busca.getAttribute("aria-keyshortcuts")).toBe("/");
    expect(container.querySelector("kbd")?.textContent).toBe("/");
    await semViolacoes(container);
    await user.click(screen.getByLabelText("Nome"));
    await user.keyboard("/");
    expect(screen.getByLabelText<HTMLInputElement>("Nome").value).toBe("/");
    await user.click(document.body);
    await user.keyboard("/");
    expect(document.activeElement).toBe(busca);
    expect((busca as HTMLInputElement).value).toBe("");
    await user.keyboard("x");
    expect(container.querySelector("kbd")).toBeNull();
  });

  it("atalho \"mod+K\": Ctrl+K foca de qualquer lugar; aria-keyshortcuts com Control e Meta", async () => {
    const user = userEvent.setup();
    render(<><TextInput label="Nome" /><SearchInput shortcut="mod+K" /></>);
    const busca = screen.getByRole("searchbox");
    expect(busca.getAttribute("aria-keyshortcuts")).toBe("Control+K Meta+K");
    expect(screen.getByText("Ctrl K")).toBeTruthy();
    await user.click(screen.getByLabelText("Nome"));
    await user.keyboard("{Control>}k{/Control}");
    expect(document.activeElement).toBe(busca);
  });

  it("desligado: sem atalho, sem Kbd e o × não age", async () => {
    const user = userEvent.setup();
    const { container } = render(<SearchInput shortcut="/" disabled defaultValue="lume" />);
    expect(screen.getByRole("searchbox").getAttribute("aria-keyshortcuts")).toBeNull();
    expect(container.querySelector("kbd")).toBeNull();
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Limpar busca" }).disabled).toBe(true);
    await user.keyboard("/");
    expect(document.activeElement).not.toBe(screen.getByRole("searchbox"));
  });

  it("ref de quem usa chega ao input", () => {
    let campo: HTMLInputElement | null = null;
    render(<SearchInput ref={(el: HTMLInputElement | null) => { campo = el; }} />);
    expect(campo).toBe(screen.getByRole("searchbox"));
  });
});
