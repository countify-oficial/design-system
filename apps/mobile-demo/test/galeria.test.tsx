import { fireEvent, render, screen } from "@testing-library/react-native";
import { CountifyProvider } from "@countify-oficial/provider";
import { Galeria } from "../src/Galeria";

describe("galeria (React Native)", () => {
  it("abre em Início e troca de aba pelas abas de baixo", async () => {
    await render(
      <CountifyProvider>
        <Galeria insets={{ top: 48, bottom: 36 }} />
      </CountifyProvider>,
    );
    expect(screen.getByText("Hoje")).toBeOnTheScreen();
    expect(screen.getByRole("tab", { name: "Início" })).toBeSelected();
    await fireEvent.press(screen.getByRole("tab", { name: "Campos" }));
    expect(screen.getByText("Nome da loja")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("tab", { name: "Mais" }));
    await fireEvent.press(screen.getByRole("button", { name: "Mostrar aviso" }));
    expect(screen.getByText("Análise salva")).toBeOnTheScreen();
  });
});
