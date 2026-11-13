import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Box } from "../src";
import { semViolacoes } from "./setup";

describe("Box", () => {
  it("é um div e repassa props e ref", async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Box ref={ref} id="caixa" className="x" data-testid="b">Olá</Box>);
    const el = screen.getByTestId("b");
    expect(el.tagName).toBe("DIV");
    expect(el.id).toBe("caixa");
    expect(el.className).toBe("x");
    expect(ref.current).toBe(el);
    await semViolacoes(container);
  });

  it("troca o elemento por component, com as props dele", () => {
    render(<Box component="a" href="/lojas">Lojas</Box>);
    expect(screen.getByRole("link", { name: "Lojas" }).getAttribute("href")).toBe("/lojas");
  });
});
