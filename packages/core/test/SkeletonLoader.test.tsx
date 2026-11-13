import { CountifyProvider } from "@countify-oficial/provider";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkeletonLoader } from "../src";
import { semViolacoes } from "./setup";

const blocos = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>('[aria-hidden="true"]'));

describe("SkeletonLoader", () => {
  it("text: 3 linhas, a última mais curta; anuncia 'Carregando' e aria-busy", async () => {
    const { container } = render(<SkeletonLoader />);
    const s = screen.getByRole("status", { name: "Carregando" });
    expect(s.getAttribute("aria-busy")).toBe("true");
    expect(blocos(s).map((b) => b.style.getPropertyValue("--sk-width"))).toEqual(["100%", "100%", "60%"]);
    await semViolacoes(container);
  });

  it("stat: os três blocos do cartão de número do mockup (96, 140, 112)", () => {
    render(<SkeletonLoader variant="stat" count={2} cols={2} />);
    const s = screen.getByRole("status");
    expect(s.style.getPropertyValue("--sg-cols")).toBe("2");
    expect(blocos(s).slice(0, 3).map((b) => [b.style.getPropertyValue("--sk-width"), b.style.getPropertyValue("--sk-height")]))
      .toEqual([["96px", "16px"], ["140px", "32px"], ["112px", "16px"]]);
    expect(blocos(s)).toHaveLength(6);
  });

  it("list: linhas com avatar redondo e duas linhas de texto", () => {
    render(<SkeletonLoader variant="list" count={2} />);
    const s = screen.getByRole("status");
    expect(s.querySelectorAll("[data-circle]")).toHaveLength(2);
    expect(blocos(s)).toHaveLength(6);
  });

  it("card, animate={false} e texto do provider", () => {
    render(<CountifyProvider messages={{ loading: "Loading" }}><SkeletonLoader variant="card" animate={false} /></CountifyProvider>);
    const s = screen.getByRole("status", { name: "Loading" });
    expect(s.querySelector("[data-animate]")).toBeNull();
    expect(blocos(s)).toHaveLength(4);
  });
});
