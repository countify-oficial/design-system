import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Rating } from "../src";
import { semViolacoes } from "./setup";

describe("Rating", () => {
  it("cada estrela é um radio; as até a nota ficam cheias", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(<Rating label="Atendimento" defaultValue={2} onChange={aoMudar} />);
    expect(screen.getAllByRole("radio")).toHaveLength(5);
    await user.click(screen.getByRole("radio", { name: "4 de 5" }));
    expect(aoMudar).toHaveBeenLastCalledWith(4);
    expect(container.querySelectorAll("[data-full]")).toHaveLength(4);
    await semViolacoes(container);
  });

  it("readOnly lê a nota inteira", () => {
    render(<Rating readOnly value={3} label="Nota" />);
    expect(screen.getByRole("img", { name: "Nota: 3 de 5" })).toBeTruthy();
  });
});
