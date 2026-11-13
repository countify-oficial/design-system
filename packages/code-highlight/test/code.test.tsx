import { render, screen } from "@testing-library/react";
import { semViolacoes } from "@countify-oficial/test-utils";
import { describe, expect, it } from "vitest";
import { CodeHighlight } from "../src";

describe("CodeHighlight (web)", () => {
  it("pinta, numera e tem o Copiar", async () => {
    const { container } = render(<CodeHighlight code={'const loja = "Jardins";\n// fim'} language="ts" withLineNumbers title="loja.ts" />);
    expect(screen.getByRole("button", { name: "Copiar" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "loja.ts" }).tabIndex).toBe(0);
    expect(container.querySelectorAll("pre code > span")).toHaveLength(2);
    expect(container.textContent).toContain('const loja = "Jardins";');
    await semViolacoes(container);
  });
});
