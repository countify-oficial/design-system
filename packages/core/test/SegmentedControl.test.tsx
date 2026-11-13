import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "../src";
import { semViolacoes } from "./setup";

describe("SegmentedControl", () => {
  it("o primeiro vem escolhido; clique e setas trocam", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(<SegmentedControl aria-label="Filtro" data={["Todos", "Pessoas", "Sistema"]} onChange={aoMudar} />);
    expect(screen.getByRole("radiogroup", { name: "Filtro" }).style.getPropertyValue("--seg-count")).toBe("3");
    expect(screen.getByRole("radio", { name: "Todos" })).toHaveProperty("checked", true);
    await user.click(screen.getByText("Sistema"));
    expect(aoMudar).toHaveBeenLastCalledWith("Sistema");
    await user.keyboard("{ArrowLeft}");
    expect(aoMudar).toHaveBeenLastCalledWith("Pessoas");
    await semViolacoes(container);
  });
});
