import { render, screen } from "@testing-library/react";
import { semViolacoes } from "@countify-oficial/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Carousel } from "../src";

describe("Carousel (web)", () => {
  it("região com nome, um grupo por cartão e o contador", async () => {
    const { container } = render(
      <Carousel aria-label="Datas comemorativas">
        <Carousel.Slide>Dia das Mães</Carousel.Slide>
        <Carousel.Slide>Dia dos Pais</Carousel.Slide>
        <Carousel.Slide>Natal</Carousel.Slide>
      </Carousel>,
    );
    const regiao = screen.getByRole("region", { name: "Datas comemorativas" });
    expect(regiao.getAttribute("aria-roledescription")).toBe("carrossel");
    expect(screen.getAllByRole("group").map((g) => g.getAttribute("aria-label"))).toEqual(["1 de 3", "2 de 3", "3 de 3"]);
    expect(container.textContent).toContain("1 de 3");
    expect(screen.getByRole("button", { name: "Rolar para a frente" })).toBeTruthy();
    await semViolacoes(container);
  });

  afterEach(() => vi.restoreAllMocks());

  it("cartões que chegam depois mostram a seta; onSlideChange só quando o cartão muda", () => {
    // o jsdom não mede: 100 de largura à vista, 100 por cartão
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100);
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (this: HTMLElement) {
      return this.children.length * 100;
    });
    const aoMudar = vi.fn<(i: number) => void>();
    const datas = (n: number, avisar: (i: number) => void) => (
      <Carousel aria-label="Datas" onSlideChange={avisar}>
        {["Mães", "Pais", "Natal"].slice(0, n).map((d) => (
          <Carousel.Slide key={d}>{d}</Carousel.Slide>
        ))}
      </Carousel>
    );
    const { rerender } = render(datas(0, aoMudar));
    const frente = screen.getByRole("button", { name: "Rolar para a frente" });
    expect(frente.hasAttribute("data-hidden")).toBe(true);
    rerender(datas(3, (i) => aoMudar(i)));
    expect(frente.hasAttribute("data-hidden")).toBe(false);
    expect(aoMudar).not.toHaveBeenCalled();
  });
});
