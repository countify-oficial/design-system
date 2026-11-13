import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress, RingProgress, SemiCircleProgress } from "../src";
import { semViolacoes } from "./setup";

describe("Progress, RingProgress e SemiCircleProgress", () => {
  it("Progress: barra com valor limitado a 0–100 e meta", async () => {
    const { container } = render(<Progress value={130} marker={80} aria-label="Meta do mês" />);
    const p = screen.getByRole("progressbar", { name: "Meta do mês" });
    expect(p.getAttribute("aria-valuenow")).toBe("100");
    expect((p.firstElementChild as HTMLElement).style.getPropertyValue("--progress-value")).toBe("100%");
    expect((p.lastElementChild as HTMLElement).style.getPropertyValue("--progress-marker")).toBe("80%");
    await semViolacoes(container);
  });

  it("RingProgress: 120 por padrão, espessura de 1/5, partes em sequência", () => {
    const { container } = render(<RingProgress sections={[{ value: 25, color: "accent", label: "Compraram" }, { value: 25, color: "up" }]} label="50%" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("120");
    const [trilho, a, b] = Array.from(container.querySelectorAll("circle"));
    expect(trilho?.getAttribute("stroke-width")).toBe("24");
    const volta = 2 * Math.PI * 48;
    expect(Number(a?.getAttribute("stroke-dasharray")?.split(" ")[0])).toBeCloseTo(volta / 4);
    expect(Number(b?.getAttribute("stroke-dashoffset"))).toBeCloseTo(-volta / 4);
    expect(a?.querySelector("title")?.textContent).toBe("Compraram");
    expect(screen.getByText("50%")).toBeTruthy();
  });

  it("SemiCircleProgress: barra de progresso com o meio arco preenchido", async () => {
    const { container } = render(<SemiCircleProgress value={50} aria-label="Conversão" />);
    const p = screen.getByRole("progressbar", { name: "Conversão" });
    expect(p.getAttribute("aria-valuenow")).toBe("50");
    const [, cheio] = Array.from(container.querySelectorAll("path"));
    const meio = Math.PI * 80;
    expect(Number(cheio?.getAttribute("stroke-dasharray")?.split(" ")[0])).toBeCloseTo(meio / 2);
    await semViolacoes(container);
  });
});
