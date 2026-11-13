import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Center } from "../src";

describe("Center", () => {
  it("é um div; inline marca data-inline; component troca o elemento", () => {
    render(<><Center data-testid="a">x</Center><Center data-testid="b" inline component="span">y</Center></>);
    expect(screen.getByTestId("a").hasAttribute("data-inline")).toBe(false);
    expect(screen.getByTestId("b").hasAttribute("data-inline")).toBe(true);
    expect(screen.getByTestId("b").tagName).toBe("SPAN");
  });
});
