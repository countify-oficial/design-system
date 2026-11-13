import { act, renderHook } from "@testing-library/react-native";
import { setStringAsync } from "expo-clipboard";
import { AccessibilityInfo } from "react-native";
import { useClipboard, useMediaQuery, useReducedMotion } from "../src/index.native";

jest.mock("expo-clipboard", () => ({ setStringAsync: jest.fn().mockResolvedValue(true) }));

describe("hooks no React Native", () => {
  it("useMediaQuery confere contra a largura da tela", async () => {
    // o preset do React Native simula uma tela de 750 de largura
    expect((await renderHook(() => useMediaQuery("(min-width: 700px)"))).result.current).toBe(true);
    expect((await renderHook(() => useMediaQuery("(min-width: 768px)"))).result.current).toBe(false);
  });

  it("useClipboard copia pelo expo-clipboard", async () => {
    const { result } = await renderHook(() => useClipboard());
    await act(() => result.current.copy("K7Q-29XM"));
    expect(setStringAsync).toHaveBeenCalledWith("K7Q-29XM");
    expect(result.current.copied).toBe(true);
  });

  it("useReducedMotion segue o aparelho e a mudança dele", async () => {
    jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(true);
    let avisar: (v: boolean) => void = () => undefined;
    jest.spyOn(AccessibilityInfo, "addEventListener").mockImplementation((_evento, fn) => {
      avisar = fn;
      return { remove: jest.fn() };
    });
    const { result } = await renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
    await act(() => avisar(false));
    expect(result.current).toBe(false);
  });
});
