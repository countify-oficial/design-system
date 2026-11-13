import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { JsonInput } from "../src";

describe("JsonInput", () => {
  it("avisa JSON inválido ao sair do campo e reorganiza o válido", async () => {
    const user = userEvent.setup();
    render(<JsonInput label="Configuração" formatOnBlur />);
    const campo = screen.getByRole("textbox", { name: "Configuração" });
    await user.type(campo, "{{ruim");
    await user.tab();
    expect(screen.getByRole("alert").textContent).toBe("JSON inválido");
    await user.clear(campo);
    await user.type(campo, '{{"a":1}');
    await user.tab();
    expect(screen.queryByRole("alert")).toBeNull();
    expect((campo as HTMLTextAreaElement).value).toBe('{\n  "a": 1\n}');
  });
});
