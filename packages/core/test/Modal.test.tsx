import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button, Drawer, Modal, TextInput } from "../src";
import { semViolacoes } from "./setup";

function Janela({ tipo }: { tipo: "modal" | "drawer" }) {
  const [aberta, setAberta] = useState(false);
  const C = tipo === "modal" ? Modal : Drawer;
  return (
    <>
      <Button onClick={() => setAberta(true)}>Excluir</Button>
      <C opened={aberta} onClose={() => setAberta(false)} title="Excluir análise?">
        <p>Sai de Salvas para todos que a veem.</p>
        <TextInput label="Motivo" />
      </C>
    </>
  );
}

afterEach(() => vi.useRealTimers());

describe("Modal e Drawer", () => {
  it("Modal: janela com nome, foco dentro, Esc fecha e devolve o foco; trava a rolagem", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Janela tipo="modal" />);
    await user.click(screen.getByRole("button", { name: "Excluir" }));
    const janela = screen.getByRole("dialog", { name: "Excluir análise?" });
    expect(janela.getAttribute("aria-modal")).toBe("true");
    expect(janela.contains(document.activeElement)).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    await semViolacoes(baseElement);
    await user.keyboard("{Escape}");
    await act(() => new Promise((r) => setTimeout(r, 200)));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Excluir" }));
    expect(document.body.style.overflow).toBe("");
  });

  it("Modal: botão de fechar e clique no véu chamam onClose", async () => {
    const user = userEvent.setup();
    const fechar = vi.fn();
    render(<Modal opened onClose={fechar} title="Aviso">Texto</Modal>);
    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(fechar).toHaveBeenCalledTimes(1);
    const fundo = screen.getByRole("dialog").closest('[role="presentation"]') as HTMLElement;
    await user.click(fundo);
    expect(fechar).toHaveBeenCalledTimes(2);
  });

  it("Modal: selecionar o texto de um campo arrastando até o véu não fecha", () => {
    const fechar = vi.fn();
    render(<Modal opened onClose={fechar} title="Aviso"><input aria-label="CPF" /></Modal>);
    const fundo = screen.getByRole("dialog").closest('[role="presentation"]') as HTMLElement;
    // apertou no campo e soltou no véu: o navegador manda o clique para o véu (o ancestral comum)
    fireEvent.mouseDown(screen.getByRole("textbox", { name: "CPF" }));
    fireEvent.click(fundo);
    expect(fechar).not.toHaveBeenCalled();
  });

  it("janela sobre janela: o Tab anda na de cima e o Esc fecha só ela", async () => {
    const user = userEvent.setup();
    const fecharDeBaixo = vi.fn();
    const fecharDeCima = vi.fn();
    render(
      <>
        <Modal opened onClose={fecharDeBaixo} title="Produtos">
          <Button>Foto</Button>
        </Modal>
        <Modal opened onClose={fecharDeCima} title="Foto ampliada" withCloseButton={false}>
          <Button>Um</Button>
          <Button>Dois</Button>
          <Button>Três</Button>
        </Modal>
      </>,
    );
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Um" }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Dois" }));
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Um" }));
    await user.keyboard("{Escape}");
    expect(fecharDeCima).toHaveBeenCalledTimes(1);
    expect(fecharDeBaixo).not.toHaveBeenCalled();
  });

  it("Drawer: folha no celular e painel a partir de 768 (por padrão)", async () => {
    const user = userEvent.setup();
    render(<Janela tipo="drawer" />);
    await user.click(screen.getByRole("button", { name: "Excluir" }));
    const fundo = screen.getByRole("dialog").closest('[role="presentation"]') as HTMLElement;
    expect([fundo.dataset["position"], fundo.dataset["positionSm"]]).toEqual(["bottom", "right"]);
    await user.keyboard("{Escape}");
    await act(() => new Promise((r) => setTimeout(r, 250)));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
