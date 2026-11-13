import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NativeSelect } from "../src";
import { semViolacoes } from "./setup";

describe("NativeSelect", () => {
  it("opções de texto ou objeto, com placeholder", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(<NativeSelect label="Cidade" placeholder="Escolha" defaultValue="" data={["Fortaleza", { value: "sob", label: "Sobral" }, { value: "x", label: "Crato", disabled: true }]} onChange={aoMudar} />);
    const sel = screen.getByRole("combobox", { name: "Cidade" });
    expect(Array.from((sel as HTMLSelectElement).options).map((o) => o.text)).toEqual(["Escolha", "Fortaleza", "Sobral", "Crato"]);
    await user.selectOptions(sel, "sob");
    expect(aoMudar).toHaveBeenCalled();
    await semViolacoes(container);
  });
});
