import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SimpleGrid } from "../src";

const vars = (el: HTMLElement, ...nomes: string[]) => nomes.map((n) => el.style.getPropertyValue(n));

describe("SimpleGrid", () => {
  it("1 coluna e spacing md por padrão", () => {
    render(<SimpleGrid data-testid="g" />);
    expect(vars(screen.getByTestId("g"), "--sg-cols", "--sg-cols-sm", "--sg-spacing", "--sg-vertical-spacing")).toEqual(["1", "", "var(--cf-spacing-md)", ""]);
  });

  it("colunas por ponto de quebra; o que falta fica vazio (o CSS herda o menor)", () => {
    render(<SimpleGrid data-testid="g" cols={{ base: 2, lg: 4 }} spacing={3} verticalSpacing="lg" />);
    expect(vars(screen.getByTestId("g"), "--sg-cols", "--sg-cols-sm", "--sg-cols-lg", "--sg-spacing", "--sg-vertical-spacing"))
      .toEqual(["2", "", "4", "var(--cf-space-3)", "var(--cf-spacing-lg)"]);
  });
});
