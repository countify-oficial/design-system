import { CountifyProvider, createTheme } from "@countify-oficial/provider";
import { colors } from "@countify-oficial/tokens";
import { render, screen } from "@testing-library/react-native";
import { Text } from "../src";

describe("Text (React Native)", () => {
  it("md regular na cor de texto do modo", async () => {
    await render(<Text>Vendas</Text>);
    expect(screen.getByText("Vendas")).toHaveStyle({ fontFamily: "Roboto_400Regular", fontSize: 17, lineHeight: 24, color: colors.light.text });
  });

  it("segue o modo escuro do provider", async () => {
    await render(<CountifyProvider defaultColorScheme="dark"><Text color="accent">Ver</Text></CountifyProvider>);
    expect(screen.getByText("Ver")).toHaveStyle({ color: colors.dark.accent });
  });

  it("size, weight e align", async () => {
    await render(<Text size="xl" weight="bold" align="end">Total</Text>);
    expect(screen.getByText("Total")).toHaveStyle({ fontFamily: "Roboto_700Bold", fontSize: 22, lineHeight: 31, textAlign: "right" });
  });

  it("truncate e lineClamp viram numberOfLines", async () => {
    await render(<><Text truncate>uma</Text><Text lineClamp={3}>três</Text></>);
    expect(screen.getByText("uma").props).toMatchObject({ numberOfLines: 1 });
    expect(screen.getByText("três").props).toMatchObject({ numberOfLines: 3 });
  });

  it("inherit não põe letra nem cor (herda do Text de fora)", async () => {
    await render(<Text weight="bold">Total: <Text inherit>R$ 10</Text></Text>);
    const dentro = screen.getByText("R$ 10");
    expect(dentro).not.toHaveStyle({ fontFamily: "Roboto_400Regular" });
    expect(dentro).not.toHaveStyle({ color: colors.light.text });
  });

  it("defaultProps e styles do tema valem; a prop vale mais", async () => {
    const theme = createTheme({ components: { Text: { defaultProps: { size: "sm" }, styles: { root: { letterSpacing: 1 } } } } });
    await render(<CountifyProvider theme={theme}><Text>tema</Text><Text size="lg">prop</Text></CountifyProvider>);
    expect(screen.getByText("tema")).toHaveStyle({ fontSize: 15, letterSpacing: 1 });
    expect(screen.getByText("prop")).toHaveStyle({ fontSize: 20 });
  });
});
