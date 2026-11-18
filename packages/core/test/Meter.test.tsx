import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Meter } from "../src";
import { semViolacoes } from "./setup";

describe("Meter", () => {
  it("meta: role meter na escala do app, a porcentagem em destaque, o esperado e as legendas", async () => {
    const { container } = render(
      <Meter
        label="Faturamento"
        value={71400}
        max={180000}
        marker={66000}
        startLabel="R$ 71.400 de R$ 180.000"
        endLabel="dia 11 de 30"
        footer="1.428 peças vendidas no mês"
      />,
    );
    const m = screen.getByRole("meter", { name: "Faturamento" });
    expect([m.getAttribute("aria-valuemin"), m.getAttribute("aria-valuemax"), m.getAttribute("aria-valuenow")]).toEqual(["0", "180000", "71400"]);
    expect(m.getAttribute("aria-valuetext")).toBe("39,7%");
    expect(screen.getByText("39,7%")).toBeTruthy();
    expect((m.firstElementChild as HTMLElement).style.getPropertyValue("--progress-value")).toMatch(/^39\.66/);
    expect((m.lastElementChild as HTMLElement).style.getPropertyValue("--progress-marker")).toMatch(/^36\.66/);
    expect(screen.getByText("dia 11 de 30")).toBeTruthy();
    expect(screen.getByText("1.428 peças vendidas no mês")).toBeTruthy();
    expect(screen.queryByRole("progressbar")).toBeNull();
    await semViolacoes(container);
  });

  it("valor fora da escala fica preso; valueText e aria-label trocam o que o leitor de tela diz", () => {
    render(<Meter value={250} min={50} max={150} valueText="Passou da meta" aria-label="Meta de vendas" />);
    const m = screen.getByRole("meter", { name: "Meta de vendas" });
    expect(m.getAttribute("aria-valuenow")).toBe("150");
    expect(m.getAttribute("aria-valuetext")).toBe("Passou da meta");
    expect((m.firstElementChild as HTMLElement).style.getPropertyValue("--progress-value")).toBe("100%");
  });

  it("lg (conversão): sem rótulo, valor com a variação, tom e legenda; valueLabel null esconde o número", async () => {
    const { container, rerender } = render(
      <Meter size="lg" value={25} max={180} color="up" diff={1} diffFormat={() => "1,0 pt"} diffLabel="vs. qua." aria-label="Conversão" startLabel="25 compraram" endLabel="155 sem comprar · 180 visitantes" />,
    );
    expect(container.firstElementChild?.getAttribute("data-size")).toBe("lg");
    expect(screen.getByText("13,9%")).toBeTruthy();
    expect(screen.getByText("alta de 1,0 pt")).toBeTruthy();
    const m = screen.getByRole("meter", { name: "Conversão" });
    expect((m.firstElementChild as HTMLElement).style.getPropertyValue("--tone-fill")).toBe("var(--cf-color-up)");
    await semViolacoes(container);
    rerender(<Meter value={25} max={180} valueLabel={null} aria-label="Conversão" />);
    expect(screen.queryByText("13,9%")).toBeNull();
  });
});
