import { render, screen } from "@testing-library/react-native";
import { CodeHighlight } from "../src/index.native";

describe("CodeHighlight (React Native)", () => {
  it("mostra o código e o Copiar", async () => {
    await render(<CodeHighlight code={"pnpm add @countify-oficial/core"} language="bash" />);
    expect(screen.getByText("Copiar")).toBeOnTheScreen();
    expect(screen.getByText("pnpm add @countify-oficial/core")).toBeOnTheScreen();
  });
});
