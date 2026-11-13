import { CountifyProvider, createTheme } from "@countify-oficial/provider";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Grid, GridCol } from "../src";

describe("Grid", () => {
  it("12 colunas e gap lg (24) por padrão, como nas telas", () => {
    render(<Grid data-testid="g"><Grid.Col data-testid="c">a</Grid.Col></Grid>);
    const g = screen.getByTestId("g").style;
    expect([g.getPropertyValue("--grid-columns"), g.getPropertyValue("--grid-gap")]).toEqual(["12", "var(--cf-spacing-lg)"]);
    // sem span, a coluna ocupa a linha toda (o CSS usa --grid-columns)
    expect(screen.getByTestId("c").style.getPropertyValue("--col-span")).toBe("");
  });

  it("Grid.Col com span por ponto de quebra", () => {
    render(<Grid columns={6} gap={3}><Grid.Col data-testid="c" span={{ base: 6, sm: 3, lg: 2 }}>a</Grid.Col></Grid>);
    const c = screen.getByTestId("c").style;
    expect([c.getPropertyValue("--col-span"), c.getPropertyValue("--col-span-sm"), c.getPropertyValue("--col-span-lg")]).toEqual(["6", "3", "2"]);
  });

  it("Grid.Col é o GridCol, com tema próprio", () => {
    expect(Grid.Col).toBe(GridCol);
    const theme = createTheme({ components: { GridCol: { classNames: { root: "coluna" } } } });
    render(<CountifyProvider theme={theme}><Grid><Grid.Col data-testid="c" span={4}>a</Grid.Col></Grid></CountifyProvider>);
    expect(screen.getByTestId("c").className).toMatch(/col.* coluna$/);
  });
});
