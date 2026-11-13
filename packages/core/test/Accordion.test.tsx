import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Accordion } from "../src";
import { semViolacoes } from "./setup";

const Exemplo = (props: { multiple?: boolean; onChange?: (v: string[]) => void }) => (
  <Accordion {...props}>
    {["Contagem", "Câmeras", "Conta"].map((t) => (
      <Accordion.Item key={t} value={t}>
        <Accordion.Control>{t}</Accordion.Control>
        <Accordion.Panel>Sobre {t}</Accordion.Panel>
      </Accordion.Item>
    ))}
  </Accordion>
);

describe("Accordion", () => {
  it("abre um por vez; título é h3 com botão aria-expanded ligado ao painel", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(<Exemplo onChange={aoMudar} />);
    const contagem = screen.getByRole("button", { name: "Contagem" });
    expect(contagem.parentElement?.tagName).toBe("H3");
    await user.click(contagem);
    expect(contagem.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("region", { name: "Contagem" }).textContent).toBe("Sobre Contagem");
    await user.click(screen.getByRole("button", { name: "Câmeras" }));
    expect(contagem.getAttribute("aria-expanded")).toBe("false");
    expect(aoMudar).toHaveBeenLastCalledWith(["Câmeras"]);
    await semViolacoes(container);
  });

  it("multiple deixa vários abertos", async () => {
    const user = userEvent.setup();
    render(<Exemplo multiple />);
    await user.click(screen.getByRole("button", { name: "Contagem" }));
    await user.click(screen.getByRole("button", { name: "Conta" }));
    expect(screen.getAllByRole("button").map((b) => b.getAttribute("aria-expanded"))).toEqual(["true", "false", "true"]);
  });

  it("setas, Home e End andam entre os títulos", async () => {
    const user = userEvent.setup();
    render(<Exemplo />);
    screen.getByRole("button", { name: "Contagem" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement?.textContent).toBe("Câmeras");
    await user.keyboard("{End}");
    expect(document.activeElement?.textContent).toBe("Conta");
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement?.textContent).toBe("Contagem");
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement?.textContent).toBe("Conta");
  });
});
