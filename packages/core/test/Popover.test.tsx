import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ActionIcon, Button, ColorInput, HoverCard, Icon, Menu, Popover, Tooltip } from "../src";
import { semViolacoes } from "./setup";

describe("Popover, Tooltip, HoverCard, Menu e ColorInput", () => {
  it("Popover: abre no clique, aria-expanded, Esc fecha e devolve o foco", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(
      <Popover>
        <Popover.Target><ActionIcon aria-label="Ajuda: Conversão"><Icon name="help" /></ActionIcon></Popover.Target>
        <Popover.Dropdown aria-label="Como calculamos">Vendas ÷ entradas</Popover.Dropdown>
      </Popover>,
    );
    const alvo = screen.getByRole("button", { name: "Ajuda: Conversão" });
    await user.click(alvo);
    expect(alvo.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("dialog", { name: "Como calculamos" }).textContent).toBe("Vendas ÷ entradas");
    await semViolacoes(baseElement);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(alvo);
  });

  it("Tooltip: aparece no foco e descreve o alvo", async () => {
    const user = userEvent.setup();
    render(<Tooltip label="Exportar CSV" openDelay={0}><Button>Exportar</Button></Tooltip>);
    await user.tab();
    const dica = await screen.findByRole("tooltip");
    expect(dica.textContent).toBe("Exportar CSV");
    expect(screen.getByRole("button", { name: "Exportar" }).getAttribute("aria-describedby")).toBe(dica.id);
  });

  it("HoverCard abre no hover", async () => {
    const user = userEvent.setup();
    render(<HoverCard><HoverCard.Target><Button>Lume Jardins</Button></HoverCard.Target><HoverCard.Dropdown>1.102 entradas hoje</HoverCard.Dropdown></HoverCard>);
    await user.hover(screen.getByRole("button", { name: "Lume Jardins" }));
    expect(await screen.findByText("1.102 entradas hoje")).toBeTruthy();
  });

  it("Menu: itens com setas e Enter; escolher fecha", async () => {
    const user = userEvent.setup();
    const duplicar = vi.fn();
    render(
      <Menu>
        <Menu.Target><Button>Ações</Button></Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Análise</Menu.Label>
          <Menu.Item>Editar</Menu.Item>
          <Menu.Item onClick={duplicar}>Duplicar</Menu.Item>
          <Menu.Divider />
          <Menu.Item color="down">Excluir</Menu.Item>
        </Menu.Dropdown>
      </Menu>,
    );
    await user.click(screen.getByRole("button", { name: "Ações" }));
    expect(screen.getByRole("menu")).toBeTruthy();
    expect(screen.getAllByRole("menuitem").map((i) => i.textContent)).toEqual(["Editar", "Duplicar", "Excluir"]);
    // aberto com o mouse, o foco vai à lista; a primeira seta vai ao primeiro item (padrão WAI-ARIA)
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(document.activeElement?.textContent).toBe("Editar"));
    await user.keyboard("{ArrowDown}{Enter}");
    expect(duplicar).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("Menu comprido: a lista não passa da tela e a seta rola o item ativo para a vista", async () => {
    const user = userEvent.setup();
    const rolar = vi.spyOn(Element.prototype, "scrollIntoView");
    // o jsdom não tem altura de tela: uma de 600
    const altura = vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(600);
    const itens = Array.from({ length: 30 }, (_, i) => `Loja ${i + 1}`);
    render(
      <Menu>
        <Menu.Target><Button>Lojas</Button></Menu.Target>
        <Menu.Dropdown>{itens.map((t) => <Menu.Item key={t}>{t}</Menu.Item>)}</Menu.Dropdown>
      </Menu>,
    );
    await user.click(screen.getByRole("button", { name: "Lojas" }));
    const menu = screen.getByRole("menu");
    // a altura que cabe na tela vira o max-height do CSS (Menu.module.css)
    await waitFor(() => {
      const cabe = parseInt(menu.style.getPropertyValue("--popover-available-height"), 10);
      expect(cabe > 0 && cabe < 600).toBe(true);
    });
    // seta para cima no começo vai ao último item (loop), lá embaixo da lista
    await user.keyboard("{ArrowUp}");
    await waitFor(() => expect(document.activeElement?.textContent).toBe("Loja 30"));
    await waitFor(() => expect(rolar.mock.contexts).toContain(document.activeElement));
    rolar.mockRestore();
    altura.mockRestore();
  });

  it("Menu de contexto: abre no ponto do clique direito, sem o menu do navegador; Esc fecha e devolve o foco", async () => {
    const user = userEvent.setup();
    // o jsdom não tem tamanho de tela: uma de 1024 × 768
    const largura = vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(1024);
    const altura = vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(768);
    const { baseElement } = render(
      <Menu trigger="context">
        <Menu.Target><button type="button" data-testid="area">Lume Jardins</button></Menu.Target>
        <Menu.Dropdown aria-label="Ações da loja">
          <Menu.Item>Abrir</Menu.Item>
          <Menu.Item>Duplicar</Menu.Item>
        </Menu.Dropdown>
      </Menu>,
    );
    const area = screen.getByTestId("area");
    // o clique esquerdo não abre
    await user.click(area);
    expect(screen.queryByRole("menu")).toBeNull();
    await user.pointer({ keys: "[MouseRight]", target: area, coords: { clientX: 120, clientY: 80 } });
    const menu = screen.getByRole("menu", { name: "Ações da loja" });
    // canto do menu no cursor (bottom-start, sem distância)
    await waitFor(() => expect([menu.style.left, menu.style.top]).toEqual(["120px", "80px"]));
    // o contextmenu foi cancelado: o navegador não abre o menu dele
    expect(fireEvent.contextMenu(area)).toBe(false);
    await semViolacoes(baseElement);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(area));
    // perto da borda direita, o shift traz o menu para dentro da tela (8 de folga)
    await user.pointer({ keys: "[MouseRight]", target: area, coords: { clientX: 2000, clientY: 80 } });
    await waitFor(() => expect(screen.getByRole("menu").style.left).toBe("1016px"));
    largura.mockRestore();
    altura.mockRestore();
  });

  it("Menu de contexto pelo teclado: Shift+F10 e a tecla Menu abrem no elemento focado; setas, Home/End e letras", async () => {
    const user = userEvent.setup();
    const abrir = vi.fn();
    render(
      <Menu trigger="context">
        <Menu.Target>
          <div><button type="button">Linha 1</button><button type="button">Linha 2</button></div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={abrir}>Abrir</Menu.Item>
          <Menu.Item disabled>Mover</Menu.Item>
          <Menu.Item>Duplicar</Menu.Item>
          <Menu.Item color="down">Excluir</Menu.Item>
        </Menu.Dropdown>
      </Menu>,
    );
    const linha2 = screen.getByRole("button", { name: "Linha 2" });
    linha2.focus();
    await user.keyboard("{Shift>}{F10}{/Shift}");
    // aberto pelo teclado, o foco vai ao primeiro item
    await waitFor(() => expect(document.activeElement?.textContent).toBe("Abrir"));
    // o contextmenu que o navegador manda depois da tecla é cancelado e não move o menu para o canto
    expect(fireEvent.contextMenu(linha2, { clientX: 500, clientY: 500 })).toBe(false);
    expect(screen.getByRole("menu").style.top).not.toBe("500px");
    // o item desativado fica de fora das setas
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement?.textContent).toBe("Duplicar");
    await user.keyboard("{End}");
    expect(document.activeElement?.textContent).toBe("Excluir");
    await user.keyboard("{Home}");
    expect(document.activeElement?.textContent).toBe("Abrir");
    await user.keyboard("d");
    await waitFor(() => expect(document.activeElement?.textContent).toBe("Duplicar"));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(linha2));
    // a tecla Menu (ContextMenu) também abre; Enter escolhe e fecha
    fireEvent.keyDown(linha2, { key: "ContextMenu" });
    await waitFor(() => expect(document.activeElement?.textContent).toBe("Abrir"));
    await user.keyboard("{Enter}");
    expect(abrir).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("Menu de contexto: clique fora fecha; desativado deixa o menu do navegador", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <>
        <button type="button">Fora</button>
        <Menu trigger="context">
          <Menu.Target><div data-testid="area">Área</div></Menu.Target>
          <Menu.Dropdown><Menu.Item>Abrir</Menu.Item></Menu.Dropdown>
        </Menu>
      </>,
    );
    await user.pointer({ keys: "[MouseRight]", target: screen.getByTestId("area") });
    expect(screen.getByRole("menu")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Fora" }));
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    rerender(
      <Menu trigger="context" disabled>
        <Menu.Target><div data-testid="area">Área</div></Menu.Target>
        <Menu.Dropdown><Menu.Item>Abrir</Menu.Item></Menu.Dropdown>
      </Menu>,
    );
    expect(fireEvent.contextMenu(screen.getByTestId("area"))).toBe(true);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("ColorInput: escrever uma cor válida muda o valor; o seletor abre no clique", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<ColorInput label="Cor da categoria" onChange={aoMudar} />);
    const campo = screen.getByRole("combobox", { name: "Cor da categoria" });
    await user.type(campo, "#225ba5");
    expect(aoMudar).toHaveBeenLastCalledWith("#225ba5");
    await user.click(campo);
    expect(await screen.findByRole("slider", { name: "Matiz" })).toBeTruthy();
  });
});
