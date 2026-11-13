import { render, screen } from "@testing-library/react-native";
import { createRef, type ComponentRef } from "react";
import { ScrollView, View } from "react-native";
import { Box } from "../src";

describe("Box (React Native)", () => {
  it("é uma View e repassa props e ref", async () => {
    const ref = createRef<ComponentRef<typeof View>>();
    await render(<Box ref={ref} testID="caixa" accessibilityLabel="Resumo" />);
    expect(screen.getByTestId("caixa")).toBeOnTheScreen();
    expect(screen.getByLabelText("Resumo")).toBeOnTheScreen();
    expect(ref.current).not.toBeNull();
  });

  it("troca o elemento por component, com as props dele", async () => {
    await render(<Box component={ScrollView} testID="rolagem" horizontal />);
    expect(screen.getByTestId("rolagem").props).toMatchObject({ horizontal: true });
  });
});
