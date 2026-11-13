import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Code, Highlight, highlighter, Kbd, Mark } from "../src";
import { semViolacoes } from "./setup";

describe("Code, Mark e Highlight", () => {
  it("Code na linha e em bloco", () => {
    const { container } = render(<><Code>npm i</Code><Code block>{"const a = 1;"}</Code></>);
    expect(screen.getByText("npm i").tagName).toBe("CODE");
    expect(container.querySelector("pre[data-block] > code")?.textContent).toBe("const a = 1;");
  });

  it("Mark com fundo âmbar claro por padrão", () => {
    render(<p><Mark>parcial</Mark></p>);
    expect(screen.getByText("parcial").style.getPropertyValue("--tone-tint")).toBe("var(--cf-color-warn-tint)");
  });

  it("highlighter separa sem diferenciar maiúsculas e escapa símbolos", () => {
    expect(highlighter("Lume Jardins e lume Orla", "lume")).toEqual([
      { chunk: "Lume", highlighted: true }, { chunk: " Jardins e ", highlighted: false }, { chunk: "lume", highlighted: true }, { chunk: " Orla", highlighted: false },
    ]);
    expect(highlighter("R$ 87,40 (+8%)", "(+8%)").map((p) => p.highlighted)).toEqual([false, true]);
    expect(highlighter("texto", ["", " "])).toEqual([{ chunk: "texto", highlighted: false }]);
  });

  it("Highlight marca os termos dentro de um Text", async () => {
    const { container } = render(<Highlight highlight={["jardins", "orla"]}>Lume Jardins e Lume Orla</Highlight>);
    expect(Array.from(container.querySelectorAll("mark")).map((m) => m.textContent)).toEqual(["Jardins", "Orla"]);
    expect(container.firstElementChild?.tagName).toBe("P");
    await semViolacoes(container);
  });

  it("Kbd segue no lugar", () => {
    render(<Kbd>K</Kbd>);
    expect(screen.getByText("K").tagName).toBe("KBD");
  });
});
