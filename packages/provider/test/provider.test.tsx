import { act, render, renderHook, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CountifyProvider, createTheme, useComponentProps, useCountifyTheme, useMessages, type CountifyProviderProps } from "../src/index";

function sistemaEscuro(escuro: boolean) {
  vi.stubGlobal("matchMedia", (q: string) => ({ media: q, matches: escuro, addEventListener: () => undefined, removeEventListener: () => undefined }));
}
const comProvider = (props: Omit<CountifyProviderProps, "children"> = {}) => ({ children }: { children: ReactNode }) => (
  <CountifyProvider {...props}>{children}</CountifyProvider>
);
const html = () => document.documentElement.getAttribute("data-cf-color-scheme");

afterEach(() => vi.unstubAllGlobals());

describe("CountifyProvider (web)", () => {
  it("auto segue o sistema e não grava atributo", () => {
    sistemaEscuro(true);
    const { result } = renderHook(() => useCountifyTheme(), { wrapper: comProvider() });
    expect(result.current.colorScheme).toBe("dark");
    expect(result.current.colors.bg).toBe("#0B1120");
    expect(html()).toBeNull();
  });

  it("modo forçado grava no <html> e sai ao desmontar", () => {
    sistemaEscuro(true);
    const { result, unmount } = renderHook(() => useCountifyTheme(), { wrapper: comProvider({ defaultColorScheme: "light" }) });
    expect(result.current.colorScheme).toBe("light");
    expect(html()).toBe("light");
    unmount();
    expect(html()).toBeNull();
  });

  it("não controlado: setColorScheme troca o modo e avisa", () => {
    sistemaEscuro(false);
    const onColorSchemeChange = vi.fn();
    const { result } = renderHook(() => useCountifyTheme(), { wrapper: comProvider({ onColorSchemeChange }) });
    act(() => result.current.setColorScheme("dark"));
    expect(result.current.colorScheme).toBe("dark");
    expect(html()).toBe("dark");
    expect(onColorSchemeChange).toHaveBeenCalledWith("dark");
  });

  it("controlado: o modo é o da prop", () => {
    sistemaEscuro(false);
    const { result } = renderHook(() => useCountifyTheme(), { wrapper: comProvider({ colorScheme: "dark", onColorSchemeChange: () => undefined }) });
    act(() => result.current.setColorScheme("light"));
    expect(result.current.colorScheme).toBe("dark");
  });

  it("props: padrão do componente < tema < passadas; undefined não apaga", () => {
    sistemaEscuro(false);
    const theme = createTheme({ components: { Button: { defaultProps: { variant: "secondary", size: "sm" } } } });
    type P = { variant?: string | undefined; size?: string | undefined; radius?: string | undefined };
    const { result } = renderHook(() => useComponentProps<P>("Button", { variant: "primary", radius: "sm" }, { size: "lg", radius: undefined }), {
      wrapper: comProvider({ theme }),
    });
    expect(result.current).toEqual({ variant: "secondary", size: "lg", radius: "sm" });
  });

  it("textos: pt-BR por padrão; o app troca só o que passar", () => {
    sistemaEscuro(false);
    function Rotulo() {
      const m = useMessages();
      return <span>{`${m.close} · ${m.loading}`}</span>;
    }
    render(<CountifyProvider messages={{ close: "Close" }}><Rotulo /></CountifyProvider>);
    expect(screen.getByText("Close · Carregando")).toBeTruthy();
  });

  it("sem provider: claro, tema e textos padrão", () => {
    const { result } = renderHook(() => useCountifyTheme());
    expect(result.current.colorScheme).toBe("light");
    expect(result.current.messages.close).toBe("Fechar");
  });
});

describe("formatNumber", () => {
  it("formata no idioma, com casas e opções do Intl", async () => {
    const { formatNumber } = await import("../src/index");
    expect(formatNumber(1284.5)).toBe("1.284,5");
    expect(formatNumber(21.4, { decimalScale: 2, fixedDecimalScale: true })).toBe("21,40");
    expect(formatNumber(1284.5, { locale: "en-US" })).toBe("1,284.5");
  });
});

describe("parseNumber e applyMask", () => {
  it("lê números no idioma", async () => {
    const { parseNumber } = await import("../src/index");
    expect([parseNumber("1.284,5"), parseNumber("-21,40"), parseNumber(""), parseNumber("abc"), parseNumber("1,284.5", "en-US")]).toEqual([1284.5, -21.4, undefined, undefined, 1284.5]);
  });

  it("aplica máscara de telefone, CPF e CEP; ignora o que não cabe", async () => {
    const { applyMask } = await import("../src/index");
    expect(applyMask("85999990000", "(99) 99999-9999")).toEqual({ masked: "(85) 99999-0000", raw: "85999990000" });
    expect(applyMask("123.456.789-0", "999.999.999-99")).toEqual({ masked: "123.456.789-0", raw: "1234567890" });
    expect(applyMask("60a1", "99999-999")).toEqual({ masked: "601", raw: "601" });
    expect(applyMask("abc12", "aaa-99")).toEqual({ masked: "abc-12", raw: "abc12" });
  });
});
