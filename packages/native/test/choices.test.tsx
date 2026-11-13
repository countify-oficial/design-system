import { colors } from "@countify-oficial/tokens";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Checkbox, Chip, Radio, Rating, SegmentedControl, Switch } from "../src";

const l = colors.light;

describe("escolhas (React Native)", () => {
  it("Checkbox: papel checkbox, marca ao tocar na linha; meio marcado é mixed", async () => {
    const aoMudar = jest.fn();
    await render(<><Checkbox label="Lume Jardins" onChange={aoMudar} /><Checkbox label="Selecionar todos" indeterminate /></>);
    const c = screen.getByRole("checkbox", { name: "Lume Jardins" });
    expect(c).not.toBeChecked();
    await fireEvent.press(c);
    expect(c).toBeChecked();
    expect(aoMudar).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("checkbox", { name: "Selecionar todos" })).toBePartiallyChecked();
  });

  it("Checkbox.Group guarda os marcados", async () => {
    const aoMudar = jest.fn();
    await render(<Checkbox.Group label="Lojas" onChange={aoMudar}><Checkbox value="a" label="Jardins" /><Checkbox value="b" label="Orla" /></Checkbox.Group>);
    await fireEvent.press(screen.getByRole("checkbox", { name: "Orla" }));
    expect(aoMudar).toHaveBeenLastCalledWith(["b"]);
  });

  it("Radio.Group: um só", async () => {
    const aoMudar = jest.fn();
    await render(<Radio.Group label="Período" defaultValue="hoje" onChange={aoMudar}><Radio value="hoje" label="Hoje" /><Radio value="semana" label="Semana" /></Radio.Group>);
    await fireEvent.press(screen.getByRole("radio", { name: "Semana" }));
    expect(aoMudar).toHaveBeenLastCalledWith("semana");
    expect(screen.getByRole("radio", { name: "Hoje" })).not.toBeChecked();
  });

  it("Switch: a linha liga e desliga, nas cores da identidade", async () => {
    await render(<Switch label="Avisar quando entrar" />);
    const s = screen.getByRole("switch", { name: "Avisar quando entrar" });
    await fireEvent.press(s);
    expect(s).toBeChecked();
  });

  it("Chip: escolhido com a tinta e o anel do destaque", async () => {
    await render(<Chip.Group multiple label="Categorias"><Chip value="c">Calçados</Chip></Chip.Group>);
    const c = screen.getByRole("checkbox");
    await fireEvent.press(c);
    expect(c).toBeChecked();
    expect(c).toHaveStyle({ backgroundColor: l.accentTint, borderColor: l.accent, borderWidth: 1.5, minHeight: 44 });
  });

  it("SegmentedControl: radios; o primeiro vem escolhido", async () => {
    const aoMudar = jest.fn();
    await render(<SegmentedControl data={["Todos", "Pessoas", "Sistema"]} onChange={aoMudar} accessibilityLabel="Filtro" />);
    expect(screen.getByRole("radio", { name: "Todos" })).toBeChecked();
    await fireEvent.press(screen.getByRole("radio", { name: "Sistema" }));
    expect(aoMudar).toHaveBeenLastCalledWith("Sistema");
  });

  it("Rating: toca na estrela; só leitura lê a nota", async () => {
    const aoMudar = jest.fn();
    await render(<><Rating onChange={aoMudar} label="Atendimento" /><Rating readOnly value={3} label="Nota" /></>);
    await fireEvent.press(screen.getByRole("radio", { name: "4 de 5" }));
    expect(aoMudar).toHaveBeenLastCalledWith(4);
    expect(screen.getByLabelText("Nota: 3 de 5")).toBeOnTheScreen();
  });
});
