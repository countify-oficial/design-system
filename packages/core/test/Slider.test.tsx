import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AlphaSlider, AngleSlider, HueSlider, RangeSlider, Slider } from "../src";
import { semViolacoes } from "./setup";

describe("Slider e companhia", () => {
  it("Slider: papel slider; setas, PageUp, Home e End; onChangeEnd a cada tecla", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const fim = vi.fn();
    const { container } = render(<Slider label="Meta" defaultValue={50} step={5} onChange={aoMudar} onChangeEnd={fim} marks={[{ value: 0, label: "0%" }, { value: 100, label: "100%" }]} />);
    const s = screen.getByRole("slider", { name: "Meta" });
    s.focus();
    await user.keyboard("{ArrowRight}");
    expect(s.getAttribute("aria-valuenow")).toBe("55");
    await user.keyboard("{PageUp}");
    expect(s.getAttribute("aria-valuenow")).toBe("65");
    await user.keyboard("{End}");
    expect(aoMudar).toHaveBeenLastCalledWith(100);
    await user.keyboard("{Home}{ArrowLeft}");
    expect(fim).toHaveBeenLastCalledWith(0);
    await semViolacoes(container);
  });

  it("Slider: clique no trilho leva ao ponto (pelo tamanho do trilho)", () => {
    const aoMudar = vi.fn();
    const { container } = render(<Slider label="X" onChange={aoMudar} />);
    const trilho = container.querySelector("[role=slider]")?.parentElement as HTMLElement;
    trilho.getBoundingClientRect = () => ({ left: 0, width: 200, top: 0, height: 8, right: 200, bottom: 8, x: 0, y: 0, toJSON: () => ({}) });
    const raiz = trilho.parentElement as HTMLElement;
    raiz.setPointerCapture = () => undefined;
    fireEvent.pointerDown(raiz, { clientX: 150, pointerId: 1 });
    expect(aoMudar).toHaveBeenLastCalledWith(75);
  });

  it("RangeSlider: duas bolinhas que não se cruzam", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<RangeSlider defaultValue={[20, 30]} step={5} onChange={aoMudar} />);
    const [minimo, maximo] = screen.getAllByRole("slider");
    expect(minimo?.getAttribute("aria-label")).toBe("Mínimo");
    minimo?.focus();
    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
    expect(aoMudar).toHaveBeenLastCalledWith([25, 30]);
    expect(maximo?.getAttribute("aria-valuenow")).toBe("30");
  });

  it("HueSlider e AlphaSlider leem matiz e transparência", async () => {
    const user = userEvent.setup();
    render(<><HueSlider defaultValue={200} /><AlphaSlider color="#225ba5" defaultValue={0.5} /></>);
    const matiz = screen.getByRole("slider", { name: "Matiz" });
    expect(matiz.getAttribute("aria-valuetext")).toBe("200°");
    const alfa = screen.getByRole("slider", { name: "Transparência" });
    alfa.focus();
    await user.keyboard("{ArrowRight}");
    expect(alfa.getAttribute("aria-valuetext")).toBe("51%");
  });

  it("AngleSlider gira com as setas e dá a volta", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(<AngleSlider label="Direção da câmera" defaultValue={0} onChange={aoMudar} />);
    const a = screen.getByRole("slider", { name: "Direção da câmera" });
    a.focus();
    await user.keyboard("{ArrowLeft}");
    expect(aoMudar).toHaveBeenLastCalledWith(359);
    expect(a.getAttribute("aria-valuetext")).toBe("359 graus");
    await semViolacoes(container);
  });
});
