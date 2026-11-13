import { fireEvent, render, screen } from "@testing-library/react-native";
import { AlphaSlider, AngleSlider, ColorPicker, HueSlider, RangeSlider, Slider } from "../src";

const acao = (nome: "increment" | "decrement") => ({ nativeEvent: { actionName: nome } });

describe("sliders (React Native)", () => {
  it("Slider: ajustável com valor; aumentar e diminuir pelo leitor de tela", async () => {
    const aoMudar = jest.fn();
    const fim = jest.fn();
    await render(<Slider label="Meta" defaultValue={50} step={5} onChange={aoMudar} onChangeEnd={fim} />);
    const s = screen.getByRole("adjustable", { name: "Meta" });
    expect(s.props.accessibilityValue).toMatchObject({ min: 0, max: 100, now: 50 });
    await fireEvent(s, "accessibilityAction", acao("increment"));
    expect(aoMudar).toHaveBeenLastCalledWith(55);
    expect(fim).toHaveBeenLastCalledWith(55);
  });

  it("Slider: o toque leva ao ponto (pela largura do trilho)", async () => {
    const aoMudar = jest.fn();
    await render(<Slider label="X" onChange={aoMudar} testID="s" />);
    const trilho = screen.getByRole("adjustable").parent;
    if (!trilho) throw new Error("sem trilho");
    await fireEvent(trilho, "layout", { nativeEvent: { layout: { x: 0, y: 0, width: 200, height: 44 } } });
    await fireEvent(trilho, "responderGrant", { nativeEvent: { locationX: 150, locationY: 20 } });
    expect(aoMudar).toHaveBeenLastCalledWith(75);
  });

  it("RangeSlider: as bolinhas não se cruzam", async () => {
    const aoMudar = jest.fn();
    await render(<RangeSlider defaultValue={[20, 25]} step={5} onChange={aoMudar} />);
    await fireEvent(screen.getByRole("adjustable", { name: "Mínimo" }), "accessibilityAction", acao("increment"));
    expect(aoMudar).toHaveBeenLastCalledWith([20, 25]);
  });

  it("HueSlider e AlphaSlider leem matiz e transparência", async () => {
    await render(<><HueSlider defaultValue={200} /><AlphaSlider color="#225ba5" defaultValue={0.5} /></>);
    expect(screen.getByRole("adjustable", { name: "Matiz" }).props.accessibilityValue).toMatchObject({ text: "200°" });
    expect(screen.getByRole("adjustable", { name: "Transparência" }).props.accessibilityValue).toMatchObject({ text: "50%" });
  });

  it("AngleSlider dá a volta", async () => {
    const aoMudar = jest.fn();
    await render(<AngleSlider label="Direção" defaultValue={0} onChange={aoMudar} />);
    await fireEvent(screen.getByRole("adjustable", { name: "Direção" }), "accessibilityAction", acao("decrement"));
    expect(aoMudar).toHaveBeenLastCalledWith(359);
  });

  it("ColorPicker: saturação pelo leitor de tela e cores prontas", async () => {
    const aoMudar = jest.fn();
    await render(<ColorPicker defaultValue="#ff0000" swatches={["#326b53"]} onChange={aoMudar} />);
    await fireEvent(screen.getByRole("adjustable", { name: "Saturação e brilho" }), "accessibilityAction", acao("decrement"));
    expect(aoMudar).toHaveBeenLastCalledWith("#ff0d0d");
    await fireEvent.press(screen.getByLabelText("#326b53"));
    expect(aoMudar).toHaveBeenLastCalledWith("#326b53");
  });
});
