import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, Menu, Popover } from "../src";

// A animação de abrir usa transform (scale): a posição tem de ir em left/top, senão a lista abre no canto da tela.
describe("posição das listas flutuantes", () => {
  it("o Menu abre embaixo do alvo, e não em 0,0", async () => {
    render(<Menu><Menu.Target><Button>Ações</Button></Menu.Target><Menu.Dropdown><Menu.Item>Editar</Menu.Item></Menu.Dropdown></Menu>);
    fireEvent.click(screen.getByRole("button", { name: "Ações" }));
    const lista = await screen.findByRole("menu");
    await new Promise((r) => setTimeout(r, 50));
    expect(lista.style.top).toBe("8px");
  });

  it("o Popover também", async () => {
    render(<Popover><Popover.Target><Button>Abrir</Button></Popover.Target><Popover.Dropdown>Oi</Popover.Dropdown></Popover>);
    fireEvent.click(screen.getByRole("button", { name: "Abrir" }));
    await new Promise((r) => setTimeout(r, 50));
    expect((screen.getByText("Oi").closest("[style]") as HTMLElement).style.top).toBe("8px");
  });
});
