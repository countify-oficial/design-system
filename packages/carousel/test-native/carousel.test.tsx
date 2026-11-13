import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { Carousel } from "../src/index.native";

describe("Carousel (React Native)", () => {
  it("encaixa e conta o cartão atual", async () => {
    const mudou = jest.fn();
    await render(
      <Carousel accessibilityLabel="Datas" onSlideChange={mudou}>
        <Carousel.Slide><Text>Mães</Text></Carousel.Slide>
        <Carousel.Slide><Text>Pais</Text></Carousel.Slide>
      </Carousel>,
    );
    expect(screen.getByText("1 de 2", { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText("Pais")).toBeOnTheScreen();
    await fireEvent(screen.getByLabelText("Datas"), "momentumScrollEnd", { nativeEvent: { contentOffset: { x: 0, y: 0 } } });
    expect(mudou).toHaveBeenCalledWith(0);
  });
});
