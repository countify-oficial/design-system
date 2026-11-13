import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ColorPicker } from "../src";
import { semViolacoes } from "./setup";

describe("ColorPicker", () => {
  it("setas mudam saturação e brilho; o matiz pelo trilho", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(<ColorPicker defaultValue="#ff0000" onChange={aoMudar} />);
    const area = screen.getByRole("slider", { name: "Saturação e brilho" });
    area.focus();
    await user.keyboard("{Shift>}{ArrowDown}{/Shift}");
    expect(aoMudar).toHaveBeenLastCalledWith("#e60000");
    const matiz = screen.getByRole("slider", { name: "Matiz" });
    matiz.focus();
    await user.keyboard("{End}");
    expect(aoMudar).toHaveBeenLastCalledWith("#e60000");
    expect(screen.queryByRole("slider", { name: "Transparência" })).toBeNull();
    await semViolacoes(container);
  });

  it("formato com transparência mostra o trilho; cores prontas", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<ColorPicker format="rgba" defaultValue="rgba(34, 91, 165, 1)" swatches={["#326b53", "#b42318"]} onChange={aoMudar} />);
    expect(screen.getByRole("slider", { name: "Transparência" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "#b42318" }));
    expect(aoMudar).toHaveBeenLastCalledWith("rgba(180, 35, 24, 1)");
  });
});
