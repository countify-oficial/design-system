import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Radio } from "../src";
import { semViolacoes } from "./setup";

describe("Radio", () => {
  it("Radio.Group: uma escolha só, com setas do teclado", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(
      <Radio.Group label="Período" defaultValue="hoje" onChange={aoMudar}>
        <Radio value="hoje" label="Hoje" />
        <Radio value="semana" label="Esta semana" />
      </Radio.Group>,
    );
    expect(screen.getByRole("radiogroup", { name: "Período" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Hoje" })).toHaveProperty("checked", true);
    await user.click(screen.getByRole("radio", { name: "Esta semana" }));
    expect(aoMudar).toHaveBeenLastCalledWith("semana");
    expect(screen.getByRole("radio", { name: "Hoje" })).toHaveProperty("checked", false);
    await semViolacoes(container);
  });
});
