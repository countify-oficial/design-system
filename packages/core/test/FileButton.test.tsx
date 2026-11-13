import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button, FileButton } from "../src";

const arquivo = (nome: string) => new File(["x"], nome, { type: "image/png" });

describe("FileButton", () => {
  it("o botão abre o seletor; um arquivo vai para onChange e o campo é limpo", () => {
    const aoEscolher = vi.fn();
    const { container } = render(<FileButton onChange={aoEscolher} accept="image/*">{(p) => <Button {...p}>Enviar foto</Button>}</FileButton>);
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input) throw new Error("sem input");
    expect(input.accept).toBe("image/*");
    const clicar = vi.spyOn(input, "click");
    fireEvent.click(screen.getByRole("button", { name: "Enviar foto" }));
    expect(clicar).toHaveBeenCalled();
    fireEvent.change(input, { target: { files: [arquivo("a.png")] } });
    expect(aoEscolher).toHaveBeenCalledWith(expect.objectContaining({ name: "a.png" }));
    expect(input.value).toBe("");
  });

  it("multiple entrega a lista", () => {
    const aoEscolher = vi.fn();
    const { container } = render(<FileButton multiple onChange={aoEscolher}>{(p) => <Button {...p}>Fotos</Button>}</FileButton>);
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input) throw new Error("sem input");
    fireEvent.change(input, { target: { files: [arquivo("a.png"), arquivo("b.png")] } });
    expect((aoEscolher.mock.calls[0]?.[0] as File[]).map((f) => f.name)).toEqual(["a.png", "b.png"]);
  });
});
