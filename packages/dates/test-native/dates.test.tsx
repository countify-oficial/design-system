import { fireEvent, render, screen } from "@testing-library/react-native";
import { Calendar, DateInput, DatePicker, TimeInput } from "../src/index.native";

beforeEach(() => {
  jest.useFakeTimers({ doNotFake: ["setTimeout", "setInterval", "setImmediate", "nextTick", "queueMicrotask", "requestAnimationFrame", "cancelAnimationFrame", "clearTimeout", "clearInterval", "clearImmediate"] });
  jest.setSystemTime(new Date(2026, 10, 11, 9, 0));
});
afterEach(() => jest.useRealTimers());

const dia = (n: number) => screen.getByRole("button", { name: new RegExp(`, ${String(n)} de novembro de 2026`) });

describe("datas (React Native)", () => {
  it("Calendar: hoje, futuros bloqueados, período", async () => {
    const aoMudar = jest.fn();
    await render(<Calendar type="range" maxDate={new Date()} onChange={aoMudar} />);
    expect(screen.getByText("Novembro de 2026")).toBeOnTheScreen();
    expect(dia(12)).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próximo mês" })).toBeDisabled();
    await fireEvent.press(dia(3));
    await fireEvent.press(dia(9));
    expect(aoMudar).toHaveBeenLastCalledWith([new Date(2026, 10, 3), new Date(2026, 10, 9)]);
    expect(dia(5)).toBeSelected();
  });

  it("DatePicker: o campo abre a folha; escolher fecha e mostra a data", async () => {
    const aoMudar = jest.fn();
    await render(<DatePicker label="Vale a partir de" onChange={aoMudar} />);
    await fireEvent.press(screen.getByRole("button", { name: "Vale a partir de" }));
    await fireEvent.press(dia(1));
    expect(aoMudar).toHaveBeenLastCalledWith(new Date(2026, 10, 1));
    expect(screen.getByText("01/11/2026")).toBeOnTheScreen();
  });

  it("DatePicker: um maxDate no futuro não puxa o mês", async () => {
    await render(<DatePicker label="Até" maxDate={new Date(2027, 11, 31)} />);
    await fireEvent.press(screen.getByRole("button", { name: "Até" }));
    expect(screen.getByText("Novembro de 2026")).toBeOnTheScreen();
  });

  it("DatePicker de período: Aplicar", async () => {
    const aoMudar = jest.fn();
    await render(<DatePicker type="range" label="Período" onChange={aoMudar} />);
    await fireEvent.press(screen.getByRole("button", { name: "Período" }));
    await fireEvent.press(dia(2));
    await fireEvent.press(dia(8));
    await fireEvent.press(screen.getByRole("button", { name: "Aplicar" }));
    expect(aoMudar).toHaveBeenLastCalledWith([new Date(2026, 10, 2), new Date(2026, 10, 8)]);
  });

  it("DateInput e TimeInput com máscara", async () => {
    const dataMudou = jest.fn();
    const horaMudou = jest.fn();
    await render(
      <>
        <DateInput label="Dia" onChange={dataMudou} />
        <TimeInput label="Abre" onChange={horaMudou} />
      </>,
    );
    await fireEvent.changeText(screen.getByLabelText("Dia"), "15092026");
    expect(dataMudou).toHaveBeenLastCalledWith(new Date(2026, 8, 15));
    await fireEvent.changeText(screen.getByLabelText("Abre"), "1000");
    expect(horaMudou).toHaveBeenLastCalledWith("10:00");
  });
});
