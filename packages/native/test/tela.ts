import { act } from "@testing-library/react-native";
import { Dimensions } from "react-native";

/** Troca a largura da tela simulada (o preset do Jest começa em 750). */
export async function larguraDaTela(width: number) {
  await act(() => Dimensions.set({ window: { width, height: 900, scale: 2, fontScale: 1 }, screen: { width, height: 900, scale: 2, fontScale: 1 } }));
}
