import { render, screen, waitFor } from "@testing-library/react";
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
