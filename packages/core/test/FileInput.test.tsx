import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FileInput } from "../src";

describe("FileInput", () => {
  it("mostra o nome do arquivo escolhido e limpa", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(<FileInput label="Foto" placeholder="Nenhuma" clearable onChange={aoMudar} />);
    const botao = screen.getByRole("button", { name: /Foto/ });
    expect(botao.textContent).toContain("Nenhuma");
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input) throw new Error("sem input");
    fireEvent.change(input, { target: { files: [new File(["x"], "fachada.jpg")] } });
    expect(aoMudar).toHaveBeenLastCalledWith(expect.objectContaining({ name: "fachada.jpg" }));
    expect(botao.textContent).toContain("fachada.jpg");
    await user.click(screen.getByRole("button", { name: "Limpar" }));
    expect(aoMudar).toHaveBeenLastCalledWith(null);
  });
});
