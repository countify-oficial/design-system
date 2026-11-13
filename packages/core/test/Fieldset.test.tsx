import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Fieldset, TextInput } from "../src";
import { semViolacoes } from "./setup";

describe("Fieldset", () => {
  it("agrupa com legenda; disabled desliga os de dentro", async () => {
    const { container } = render(<Fieldset legend="Endereço" disabled><TextInput label="CEP" /></Fieldset>);
    expect(screen.getByRole("group", { name: "Endereço" })).toBeTruthy();
    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "CEP" }).matches(":disabled")).toBe(true);
    await semViolacoes(container);
  });
});
