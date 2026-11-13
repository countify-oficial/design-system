import { render, screen } from "@testing-library/react";
import { semViolacoes } from "@countify-oficial/test-utils";
import { describe, expect, it } from "vitest";
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
});
