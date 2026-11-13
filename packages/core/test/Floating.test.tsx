import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { FloatingIndicator, FloatingWindow, Menu, Menubar, Tour } from "../src";
import { semViolacoes } from "./setup";

const caixa = (left: number, top: number, width: number, height: number) => () => ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) });

describe("FloatingIndicator, FloatingWindow, Tour e Menubar", () => {
  it("FloatingIndicator vai até o alvo, relativo ao pai", () => {
    function Abas() {
      const [pai, setPai] = useState<HTMLDivElement | null>(null);
      const [alvo, setAlvo] = useState<HTMLButtonElement | null>(null);
      if (pai) pai.getBoundingClientRect = caixa(100, 50, 400, 44);
      if (alvo) alvo.getBoundingClientRect = caixa(220, 50, 90, 44);
      return (
        <div ref={setPai}>
          <button ref={setAlvo}>Pessoas</button>
          <FloatingIndicator target={alvo} parent={pai} data-testid="fi" />
        </div>
      );
    }
    render(<Abas />);
    const fi = screen.getByTestId("fi");
    expect([fi.style.getPropertyValue("--fi-left"), fi.style.getPropertyValue("--fi-width"), fi.style.getPropertyValue("--fi-top")]).toEqual(["120px", "90px", "0px"]);
  });

  it("FloatingWindow: o título move pelas setas; fechar", async () => {
    const user = userEvent.setup();
    const fechar = vi.fn();
    const mudou = vi.fn();
    const { baseElement } = render(<FloatingWindow opened title="Câmera ao vivo" defaultPosition={{ x: 40, y: 40 }} onPositionChange={mudou} onClose={fechar}>Imagem</FloatingWindow>);
    expect(screen.getByRole("dialog", { name: "Câmera ao vivo" })).toBeTruthy();
    screen.getByRole("button", { name: "Câmera ao vivo" }).focus();
    await user.keyboard("{ArrowRight}{Shift>}{ArrowDown}{/Shift}");
    expect(mudou).toHaveBeenLastCalledWith({ x: 48, y: 72 });
    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(fechar).toHaveBeenCalled();
    await semViolacoes(baseElement);
  });

  it("Tour: passo a passo, com contador, Voltar e Concluir", async () => {
    const user = userEvent.setup();
    const fechar = vi.fn();
    render(
      <>
        <div id="painel">Painel</div>
        <div id="filtro">Filtro</div>
        <Tour opened onClose={fechar} steps={[{ target: "#painel", title: "Seu painel", description: "Os números de hoje" }, { target: "#filtro", title: "Filtros" }]} />
      </>,
    );
    const card = await screen.findByRole("dialog", { name: "Seu painel" });
    expect(card.textContent).toContain("1 de 2");
    await user.click(screen.getByRole("button", { name: "Próximo" }));
    expect(screen.getByRole("dialog", { name: "Filtros" }).textContent).toContain("2 de 2");
    await user.click(screen.getByRole("button", { name: "Concluir" }));
    expect(fechar).toHaveBeenCalled();
  });

  it("Menubar: setas andam entre os menus; para baixo abre", async () => {
    const user = userEvent.setup();
    render(
      <Menubar aria-label="Menu do aplicativo">
        <Menubar.Menu label="Arquivo"><Menu.Item>Nova análise</Menu.Item></Menubar.Menu>
        <Menubar.Menu label="Editar"><Menu.Item>Desfazer</Menu.Item></Menubar.Menu>
      </Menubar>,
    );
    expect(screen.getByRole("menubar", { name: "Menu do aplicativo" })).toBeTruthy();
    const [arquivo, editar] = screen.getAllByRole("menuitem");
    arquivo?.focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(editar);
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());
    expect(screen.getByRole("menuitem", { name: "Desfazer" })).toBeTruthy();
  });
});

