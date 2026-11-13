import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Portal } from "../src";

describe("Portal", () => {
  it("desenha num div novo no fim do <body> e tira ao desmontar", () => {
    const { container, unmount } = render(<div><Portal><p>no portal</p></Portal></div>);
    const p = screen.getByText("no portal");
    expect(container.contains(p)).toBe(false);
    expect(p.parentElement?.hasAttribute("data-cf-portal")).toBe(true);
    expect(document.body.lastElementChild).toBe(p.parentElement);
    unmount();
    expect(document.querySelector("[data-cf-portal]")).toBeNull();
  });

  it("target por seletor ou elemento", () => {
    const alvo = document.createElement("section");
    alvo.id = "camada";
    document.body.appendChild(alvo);
    render(<><Portal target="#camada"><p>por seletor</p></Portal><Portal target={alvo}><p>por elemento</p></Portal></>);
    expect(screen.getByText("por seletor").parentElement).toBe(alvo);
    expect(screen.getByText("por elemento").parentElement).toBe(alvo);
    alvo.remove();
  });
});
