import { CountifyProvider, createTheme } from "@countify-oficial/provider";
import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { UnstyledButton } from "../src";
import { semViolacoes } from "./setup";

describe("UnstyledButton", () => {
  it("é um <button type=button> com ref", async () => {
    const ref = createRef<HTMLButtonElement>();
    const aoClicar = vi.fn();
    const { container } = render(<UnstyledButton ref={ref} onClick={aoClicar}>Salvar</UnstyledButton>);
    const botao = screen.getByRole("button", { name: "Salvar" });
    expect(botao.getAttribute("type")).toBe("button");
    expect(ref.current).toBe(botao);
    fireEvent.click(botao);
    expect(aoClicar).toHaveBeenCalledOnce();
    await semViolacoes(container);
  });

  it("type passado vale (submit)", () => {
    render(<UnstyledButton type="submit">Enviar</UnstyledButton>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("submit");
  });

  it("disabled no <button>: atributo disabled e data-disabled", () => {
    const aoClicar = vi.fn();
    render(<UnstyledButton disabled onClick={aoClicar}>Salvar</UnstyledButton>);
    const botao = screen.getByRole("button");
    expect(botao.hasAttribute("disabled")).toBe(true);
    expect(botao.hasAttribute("data-disabled")).toBe(true);
    fireEvent.click(botao);
    expect(aoClicar).not.toHaveBeenCalled();
  });

  it("disabled em outro elemento: aria-disabled e o clique não navega nem chama onClick", () => {
    const aoClicar = vi.fn();
    render(<UnstyledButton component="a" href="/sair" disabled onClick={aoClicar}>Sair</UnstyledButton>);
    const link = screen.getByRole("link");
    expect(link.getAttribute("aria-disabled")).toBe("true");
    expect(link.hasAttribute("type")).toBe(false);
    expect(fireEvent.click(link)).toBe(false); // preventDefault
    expect(aoClicar).not.toHaveBeenCalled();
  });

  it("Styles API: classe do módulo < tema < props; className e style na raiz", () => {
    const theme = createTheme({ components: { UnstyledButton: { classNames: { root: "do-tema" }, styles: { root: { color: "red", margin: 1 } } } } });
    render(
      <CountifyProvider theme={theme}>
        <UnstyledButton className="solta" classNames={{ root: "da-prop" }} styles={{ root: { color: "blue" } }} style={{ padding: 2 }}>
          Ok
        </UnstyledButton>
      </CountifyProvider>,
    );
    const botao = screen.getByRole("button");
    expect(botao.className).toMatch(/root.* do-tema da-prop solta$/);
    expect(botao.style.color).toBe("blue");
    expect(botao.style.margin).toBe("1px");
    expect(botao.style.padding).toBe("2px");
  });
});
