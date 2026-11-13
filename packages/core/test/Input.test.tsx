import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Icon, Input, Textarea, TextInput } from "../src";
import { semViolacoes } from "./setup";

describe("Input e TextInput", () => {
  it("TextInput: rótulo ligado ao campo, descrição e erro no aria-describedby", async () => {
    const { container } = render(<TextInput label="E-mail" description="O de acesso" error="E-mail inválido" required defaultValue="ana@" />);
    const campo = screen.getByRole("textbox", { name: /E-mail/ });
    expect(campo.getAttribute("aria-invalid")).toBe("true");
    expect(campo.hasAttribute("required")).toBe(true);
    const descritos = (campo.getAttribute("aria-describedby") ?? "").split(" ").map((id) => document.getElementById(id)?.textContent);
    expect(descritos).toEqual(["O de acesso", "E-mail inválido"]);
    expect(screen.getByRole("alert").textContent).toBe("E-mail inválido");
    expect(campo.parentElement?.hasAttribute("data-error")).toBe(true);
    await semViolacoes(container);
  });

  it("filled por padrão; outline, tamanho e seções", () => {
    render(<TextInput label="Buscar" variant="outline" size="lg" leftSection={<Icon name="search" />} placeholder="Nome, cidade ou código" />);
    const caixa = screen.getByRole("textbox").parentElement as HTMLElement;
    expect(caixa.dataset["variant"]).toBe("outline");
    expect(caixa.style.getPropertyValue("--input-height")).toBe("var(--cf-input-height-lg)");
    expect(caixa.querySelector('[data-position="left"] svg')).not.toBeNull();
  });

  it("digita e chama onChange; disabled desliga", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { rerender } = render(<TextInput label="Nome" onChange={aoMudar} />);
    await user.type(screen.getByRole("textbox"), "Lume");
    expect(aoMudar).toHaveBeenCalledTimes(4);
    rerender(<TextInput label="Nome" disabled />);
    expect(screen.getByRole("textbox").hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("textbox").parentElement?.hasAttribute("data-disabled")).toBe(true);
  });

  it("Input sozinho e Textarea com linhas", () => {
    render(<><Input aria-label="Solto" /><Textarea label="Observação" autosize minRows={2} /></>);
    expect(screen.getByRole("textbox", { name: "Solto" }).tagName).toBe("INPUT");
    const area = screen.getByRole("textbox", { name: "Observação" });
    expect([area.tagName, area.getAttribute("rows"), area.hasAttribute("data-autosize")]).toEqual(["TEXTAREA", "2", true]);
  });
});
