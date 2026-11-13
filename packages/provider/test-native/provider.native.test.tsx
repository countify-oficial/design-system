import { render, screen } from "@testing-library/react-native";
import { Text, useColorScheme } from "react-native";
import { CountifyProvider, useCountifyTheme } from "../src/index.native";

// o preset de testes do React Native troca o useColorScheme por um jest.fn (padrão "light")
const modoDoAparelho = jest.mocked(useColorScheme);

function Modo() {
  const { colorScheme, colors } = useCountifyTheme();
  return <Text>{`${colorScheme} ${colors.bg}`}</Text>;
}

describe("CountifyProvider (React Native)", () => {
  it("auto segue o modo do aparelho", async () => {
    modoDoAparelho.mockReturnValue("dark");
    await render(<CountifyProvider><Modo /></CountifyProvider>);
    expect(screen.getByText("dark #0B1120")).toBeOnTheScreen();
  });

  it("modo forçado vale mais que o do aparelho", async () => {
    modoDoAparelho.mockReturnValue("dark");
    await render(<CountifyProvider defaultColorScheme="light"><Modo /></CountifyProvider>);
    expect(screen.getByText("light #F4F6FA")).toBeOnTheScreen();
  });

  it("aparelho sem preferência (null) fica no claro", async () => {
    modoDoAparelho.mockReturnValue(null);
    await render(<CountifyProvider><Modo /></CountifyProvider>);
    expect(screen.getByText("light #F4F6FA")).toBeOnTheScreen();
  });
});
