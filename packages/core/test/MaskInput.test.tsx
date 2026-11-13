import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MaskInput, PhoneInput, phoneMask } from "../src";

describe("MaskInput e PhoneInput", () => {
  it("MaskInput aplica a máscara e entrega o texto e só o digitado", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<MaskInput label="CPF" mask="999.999.999-99" onChange={aoMudar} />);
    await user.type(screen.getByRole("textbox"), "12345678901");
    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe("123.456.789-01");
    expect(aoMudar).toHaveBeenLastCalledWith("123.456.789-01", "12345678901");
  });

  it("PhoneInput troca entre fixo e celular", async () => {
    expect([phoneMask("8533330000"), phoneMask("85999990000")]).toEqual(["(99) 9999-99999", "(99) 99999-9999"]);
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<PhoneInput label="Telefone" onChange={aoMudar} />);
    const campo = screen.getByRole("textbox", { name: "Telefone" });
    expect(campo.getAttribute("type")).toBe("tel");
    await user.type(campo, "8533330000");
    expect((campo as HTMLInputElement).value).toBe("(85) 3333-0000");
    await user.type(campo, "1");
    expect((campo as HTMLInputElement).value).toBe("(85) 33330-0001");
    expect(aoMudar).toHaveBeenLastCalledWith("(85) 33330-0001", "85333300001");
  });
});
