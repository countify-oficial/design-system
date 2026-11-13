import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { matchesMediaQuery, useClipboard, useControllableState, useDebounce, useDisclosure, useId, useMediaQuery } from "../src/index";

afterEach(() => vi.useRealTimers());

describe("useControllableState", () => {
  it("não controlado: guarda o valor e avisa a mudança", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 1, onChange }));
    act(() => result.current[1]((v) => v + 1));
    expect(result.current[0]).toBe(2);
    expect(result.current[2]).toBe(false);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("controlado: mostra o value e só avisa; duas mudanças no mesmo evento somam", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ value: 5, defaultValue: 0, onChange }));
    act(() => {
      result.current[1]((v) => v + 1);
      result.current[1]((v) => v + 1);
    });
    expect(result.current[0]).toBe(5);
    expect(onChange.mock.calls).toEqual([[6], [7]]);
  });

  it("valor igual não chama onChange", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: "a", onChange }));
    act(() => result.current[1]("a"));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("useDisclosure", () => {
  it("abre, fecha e alterna; avisa só quando muda", () => {
    const onOpen = vi.fn(), onClose = vi.fn();
    const { result } = renderHook(() => useDisclosure(false, { onOpen, onClose }));
    act(() => result.current[1].open());
    act(() => result.current[1].open());
    expect(result.current[0]).toBe(true);
    expect(onOpen).toHaveBeenCalledTimes(1);
    act(() => result.current[1].toggle());
    expect(result.current[0]).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("useDebounce", () => {
  it("só muda depois do tempo sem mudança", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), { initialProps: { v: "a" } });
    rerender({ v: "ab" });
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("a");
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("ab");
  });
});

describe("useId", () => {
  it("usa o id passado; sem ele, gera um estável", () => {
    expect(renderHook(() => useId("campo")).result.current).toBe("campo");
    const { result, rerender } = renderHook(() => useId());
    const primeiro = result.current;
    rerender();
    expect(result.current).toBe(primeiro);
    expect(primeiro).not.toBe("");
  });
});

describe("useMediaQuery (web)", () => {
  it("segue o matchMedia e muda junto", () => {
    let matches = false;
    const ouvintes = new Set<() => void>();
    vi.stubGlobal("matchMedia", (q: string) => ({
      media: q,
      get matches() { return matches; },
      addEventListener: (_: string, f: () => void) => ouvintes.add(f),
      removeEventListener: (_: string, f: () => void) => ouvintes.delete(f),
    }));
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(false);
    matches = true;
    act(() => ouvintes.forEach((f) => f()));
    expect(result.current).toBe(true);
    vi.unstubAllGlobals();
  });
});

describe("matchesMediaQuery (React Native)", () => {
  const cel = { width: 390, colorScheme: "dark" as const };
  it("largura e modo", () => {
    expect(matchesMediaQuery("(max-width: 767px)", cel)).toBe(true);
    expect(matchesMediaQuery("(min-width: 768px)", cel)).toBe(false);
    expect(matchesMediaQuery("(min-width: 320px) and (prefers-color-scheme: dark)", cel)).toBe(true);
  });
  it("o que não existe no celular dá erro claro", () => {
    expect(() => matchesMediaQuery("(hover: hover)", cel)).toThrow(/não suportada/);
    expect(() => matchesMediaQuery("(min-width: 40em)", cel)).toThrow(/px/);
  });
});

describe("useClipboard (web)", () => {
  it("copia, marca copiado e volta depois do tempo", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const { result } = renderHook(() => useClipboard({ timeout: 1000 }));
    await act(() => result.current.copy("K7Q-29XM"));
    expect(writeText).toHaveBeenCalledWith("K7Q-29XM");
    expect(result.current.copied).toBe(true);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.copied).toBe(false);
    vi.unstubAllGlobals();
  });

  it("sem área de transferência, guarda o erro", async () => {
    vi.stubGlobal("navigator", {});
    const { result } = renderHook(() => useClipboard());
    await act(() => result.current.copy("x"));
    expect(result.current.copied).toBe(false);
    expect(result.current.error?.message).toMatch(/indisponível/);
    vi.unstubAllGlobals();
  });
});
