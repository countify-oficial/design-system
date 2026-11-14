import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, FilterChip, HelpTip, Menu, PageHeader, Section } from "../src";
import { semViolacoes } from "./setup";

describe("PageHeader, Section, HelpTip e FilterChip", () => {
  it("PageHeader: título em h1 e as ações; sem voltar por padrão", async () => {
    const { container } = render(
      <PageHeader title="Layouts">
        <Button>Novo layout</Button>
      </PageHeader>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Layouts" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Novo layout" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Voltar" })).toBeNull();
    expect(container.querySelector("header")?.hasAttribute("data-with-back")).toBe(false);
    await semViolacoes(container);
  });

  it("PageHeader: o voltar é botão com onBack e link com backHref, com o nome da tela de origem", async () => {
    const aoVoltar = vi.fn();
    const { container, rerender } = render(<PageHeader title="Usuário" onBack={aoVoltar} />);
    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
    expect(aoVoltar).toHaveBeenCalledTimes(1);
    rerender(<PageHeader title="Usuário" backHref="/ajustes" backLabel="Ajustes" />);
    expect(screen.getByRole("link", { name: "Ajustes" }).getAttribute("href")).toBe("/ajustes");
    expect(container.querySelector("header")?.hasAttribute("data-with-back")).toBe(true);
    await semViolacoes(container);
  });

  it("Section: região com o nome do título, o ? e o que vai à direita", async () => {
    const { container } = render(
      <Section title="Impressoras" help="As impressoras ligadas a este computador." aside={<Button variant="outline">Acrescentar</Button>}>
        <p>conteúdo</p>
      </Section>,
    );
    const secao = screen.getByRole("region", { name: "Impressoras" });
    expect(secao.querySelector("h2")?.textContent).toBe("Impressoras");
    expect(screen.getByRole("button", { name: "Ajuda: Impressoras" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Acrescentar" })).toBeTruthy();
    expect(secao.textContent).toContain("conteúdo");
    await semViolacoes(container);
  });

  it("Section: sem help não há ?; order muda o nível do título", () => {
    render(<Section title="Filial" order={3} />);
    expect(screen.getByRole("heading", { level: 3, name: "Filial" })).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("HelpTip: o clique abre a explicação com o nome do botão e Esc fecha", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<HelpTip label="Ajuda: Conversão">Vendas divididas pelas entradas.</HelpTip>);
    const botao = screen.getByRole("button", { name: "Ajuda: Conversão" });
    await user.click(botao);
    expect(botao.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("dialog", { name: "Ajuda: Conversão" }).textContent).toBe("Vendas divididas pelas entradas.");
    await semViolacoes(baseElement);
    await user.keyboard("{Escape}");
    expect(botao.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(botao);
  });

  it("FilterChip: mostra a escolha, marca o filtro aplicado e é o alvo de um Menu", async () => {
    const user = userEvent.setup();
    const aoEscolher = vi.fn();
    const { baseElement } = render(
      <Menu>
        <Menu.Target>
          <FilterChip active>Marca · Lume</FilterChip>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={aoEscolher}>Todas as marcas</Menu.Item>
          <Menu.Item>Lume</Menu.Item>
        </Menu.Dropdown>
      </Menu>,
    );
    const chip = screen.getByRole("button", { name: "Marca · Lume" });
    expect(chip.hasAttribute("data-active")).toBe(true);
    await user.click(chip);
    expect(chip.getAttribute("aria-expanded")).toBe("true");
    await semViolacoes(baseElement);
    await user.click(screen.getByRole("menuitem", { name: "Todas as marcas" }));
    expect(aoEscolher).toHaveBeenCalledTimes(1);
  });

  it("FilterChip: neutro sem active; disabled não clica", () => {
    const aoClicar = vi.fn();
    render(
      <FilterChip disabled onClick={aoClicar}>
        Hoje
      </FilterChip>,
    );
    const chip = screen.getByRole("button", { name: "Hoje" });
    expect(chip.hasAttribute("data-active")).toBe(false);
    fireEvent.click(chip);
    expect(aoClicar).not.toHaveBeenCalled();
  });
});
