import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { UnstyledButton } from "../src";

describe("UnstyledButton (React Native)", () => {
  it("é um botão para o leitor de tela, com alvo de toque de 44", async () => {
    const aoTocar = jest.fn();
    await render(<UnstyledButton onPress={aoTocar}><Text>Salvar</Text></UnstyledButton>);
    const botao = screen.getByRole("button", { name: "Salvar" });
    expect(botao).toHaveStyle({ minWidth: 44, minHeight: 44 });
    await fireEvent.press(botao);
    expect(aoTocar).toHaveBeenCalledTimes(1);
  });

  it("disabled não responde e é anunciado como desativado", async () => {
    const aoTocar = jest.fn();
    await render(<UnstyledButton disabled onPress={aoTocar}><Text>Salvar</Text></UnstyledButton>);
    const botao = screen.getByRole("button");
    expect(botao).toBeDisabled();
    await fireEvent.press(botao);
    expect(aoTocar).not.toHaveBeenCalled();
  });

  it("style pode ser função do estado", async () => {
    await render(<UnstyledButton style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}><Text>Ok</Text></UnstyledButton>);
    expect(screen.getByRole("button")).toHaveStyle({ opacity: 1, minHeight: 44 });
  });
});
