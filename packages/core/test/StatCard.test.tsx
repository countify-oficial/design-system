import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NumberFormatter, StatCard } from "../src";
import { semViolacoes } from "./setup";

describe("StatCard", () => {
  it("rótulo, prefixo, número, unidade, apoio e a alta lida com o sentido", async () => {
    const { container } = render(
      <StatCard label="Faturamento" prefix="R$" value={<NumberFormatter value={3950} />} unit="hoje" description="79 peças" diff={12} diffLabel="vs. qua." />,
    );
    expect(screen.getByText("Faturamento")).toBeTruthy();
    expect(screen.getByText("R$")).toBeTruthy();
    expect(screen.getByText("3.950")).toBeTruthy();
    expect(screen.getByText("79 peças")).toBeTruthy();
    const variacao = container.querySelector("[data-trend]") as HTMLElement;
    expect(variacao.dataset["trend"]).toBe("up");
    expect(variacao.style.getPropertyValue("--diff-color")).toBe("var(--cf-color-up)");
    // a seta fica fora do leitor de tela; ele lê "alta de 12% vs. qua."
    expect(variacao.querySelector("[aria-hidden]")?.textContent).toBe("▲ 12%");
    expect(screen.getByText("alta de 12%")).toBeTruthy();
    expect(variacao.textContent).toContain("vs. qua.");
    await semViolacoes(container);
  });

  it("queda em down; com invertDiff, a alta fica em down e a queda em up; 0 sem seta", () => {
    const { container } = render(
      <>
        <StatCard label="Ticket médio" value="158" diff={-3} />
        <StatCard label="Venda perdida" value="420" diff={5} invertDiff />
        <StatCard label="Espera" value="2" diff={-5} invertDiff />
        <StatCard label="Saídas" value="161" diff={0} />
      </>,
    );
    const [queda, altaRuim, quedaBoa, igual] = Array.from(container.querySelectorAll<HTMLElement>("[data-trend]"));
    expect([queda?.dataset["trend"], queda?.style.getPropertyValue("--diff-color")]).toEqual(["down", "var(--cf-color-down)"]);
    expect(screen.getByText("queda de 3%")).toBeTruthy();
    expect([altaRuim?.dataset["trend"], altaRuim?.style.getPropertyValue("--diff-color")]).toEqual(["up", "var(--cf-color-down)"]);
    expect(quedaBoa?.style.getPropertyValue("--diff-color")).toBe("var(--cf-color-up)");
    expect([igual?.dataset["trend"], igual?.style.getPropertyValue("--diff-color")]).toEqual(["flat", "var(--cf-color-text2)"]);
    expect(igual?.querySelector("[aria-hidden]")?.textContent).toBe("0%");
    expect(screen.getByText("sem variação")).toBeTruthy();
  });

  it("diffFormat troca o texto da variação (pontos)", () => {
    render(<StatCard label="Conversão" value="13,9" unit="%" diff={1} diffFormat={(n) => `${n.toFixed(1).replace(".", ",")} pt`} />);
    expect(screen.getByText("alta de 1,0 pt")).toBeTruthy();
  });

  it("sem diff, help e chart, não desenha essas partes; com help, o \"?\" abre a explicação", async () => {
    const { container, rerender } = render(<StatCard label="Saídas" value="161" />);
    expect(container.querySelector("[data-trend]")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<StatCard label="Venda perdida estimada" prefix="R$" value="420" help="Visitantes que saíram sem comprar × ticket médio." chart={<svg data-testid="grafico" />} />);
    fireEvent.click(screen.getByRole("button", { name: "Ajuda: Venda perdida estimada" }));
    expect(await screen.findByText("Visitantes que saíram sem comprar × ticket médio.")).toBeTruthy();
    expect(screen.getByTestId("grafico")).toBeTruthy();
  });

  it("component=\"a\": o cartão inteiro é o link", async () => {
    const { container } = render(<StatCard component="a" href="/vendas" label="Vendas" value="25" unit="tickets" />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/vendas");
    expect(link.textContent).toContain("tickets");
    await semViolacoes(container);
  });
});
