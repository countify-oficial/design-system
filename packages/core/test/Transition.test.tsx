import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Transition, type TransitionProps } from "../src";

const Caixa = (props: Omit<TransitionProps, "children">) => (
  <Transition {...props}>{(style) => <div data-testid="caixa" style={style} />}</Transition>
);
const caixa = () => screen.queryByTestId("caixa");

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Transition", () => {
  it("entra: estado de fora, depois o de dentro, e avisa ao terminar", () => {
    const aoEntrar = vi.fn();
    const { rerender } = render(<Caixa mounted={false} transition="scale" onEntered={aoEntrar} />);
    expect(caixa()).toBeNull();
    rerender(<Caixa mounted transition="scale" onEntered={aoEntrar} />);
    expect(caixa()?.style.opacity).toBe("0");
    expect(caixa()?.style.transform).toBe("scale(var(--cf-transition-scale))");
    act(() => {
      vi.advanceTimersToNextFrame();
    });
    expect(caixa()?.style.opacity).toBe("1");
    expect(caixa()?.style.transitionDuration).toBe("150ms");
    expect(aoEntrar).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(aoEntrar).toHaveBeenCalledOnce();
  });

  it("sai: anima e só então desmonta, e avisa", () => {
    const aoSair = vi.fn();
    const { rerender } = render(<Caixa mounted duration="slow" transition="slide-up" onExited={aoSair} />);
    expect(caixa()?.style.opacity).toBe("1");
    rerender(<Caixa mounted={false} duration="slow" transition="slide-up" onExited={aoSair} />);
    expect(caixa()?.style.transform).toBe("translateY(var(--cf-transition-slide))");
    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(caixa()).not.toBeNull();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(caixa()).toBeNull();
    expect(aoSair).toHaveBeenCalledOnce();
  });

  it("keepMounted deixa no DOM com display: none", () => {
    render(<Caixa mounted={false} keepMounted />);
    expect(caixa()?.style.display).toBe("none");
  });

  it("com reduzir movimento, a duração é 0", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((q) => ({ matches: q.includes("reduced-motion"), media: q, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList);
    const { rerender } = render(<Caixa mounted={false} />);
    rerender(<Caixa mounted />);
    act(() => {
      vi.advanceTimersToNextFrame();
    });
    expect(caixa()?.style.transitionDuration).toBe("0ms");
  });
});
