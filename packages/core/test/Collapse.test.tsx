import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Collapse, Spoiler } from "../src";

describe("Collapse e Spoiler", () => {
  it("Collapse fechado tira o conteúdo do Tab (inert) e do leitor de tela", () => {
    const { rerender, container } = render(<Collapse in={false}><button>Dentro</button></Collapse>);
    const interno = container.querySelector("[inert]");
    expect(interno?.getAttribute("aria-hidden")).toBe("true");
    rerender(<Collapse in><button>Dentro</button></Collapse>);
    expect(container.querySelector("[inert]")).toBeNull();
    expect(container.firstElementChild?.hasAttribute("data-open")).toBe(true);
  });

  it("Spoiler: o botão só aparece se o conteúdo passar da altura; abre e fecha", () => {
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", { configurable: true, get: () => 400 });
    try {
      render(<Spoiler maxHeight={100}>Texto longo</Spoiler>);
      const botao = screen.getByRole("button", { name: "Mostrar mais" });
      expect(botao.getAttribute("aria-expanded")).toBe("false");
      fireEvent.click(botao);
      expect(screen.getByRole("button", { name: "Mostrar menos" }).getAttribute("aria-expanded")).toBe("true");
    } finally {
      // o scrollHeight de verdade fica em Element.prototype: basta tirar o daqui
      Reflect.deleteProperty(HTMLElement.prototype, "scrollHeight");
    }
  });

  it("Spoiler curto não mostra botão", () => {
    render(<Spoiler maxHeight={100}>Curto</Spoiler>);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
