import { fireEvent, render, screen } from "@testing-library/react-native";
import { EventCalendar, type CalendarEvent } from "../src/index.native";

beforeEach(() => {
  jest.useFakeTimers({ doNotFake: ["setTimeout", "setInterval", "setImmediate", "nextTick", "queueMicrotask", "requestAnimationFrame", "cancelAnimationFrame", "clearTimeout", "clearInterval", "clearImmediate"] });
  jest.setSystemTime(new Date(2026, 10, 11, 9, 0));
});
afterEach(() => jest.useRealTimers());

const eventos: CalendarEvent[] = [
  { id: 1, date: new Date(2026, 10, 12), title: "Inventário Lume Orla" },
  { id: 2, date: new Date(2026, 10, 12), title: "Entrega 14h", color: "up" },
];
const dia = (n: number) => screen.getByRole("button", { name: new RegExp(`^[a-zç-]+, ${String(n)} de novembro de 2026`) });

describe("EventCalendar (React Native)", () => {
  it("hoje sem eventos; tocar no dia mostra a lista dele; os cliques", async () => {
    const aoEvento = jest.fn();
    const aoDia = jest.fn();
    await render(<EventCalendar events={eventos} onEventClick={aoEvento} onDayClick={aoDia} />);
    expect(screen.getByText("11 de novembro")).toBeOnTheScreen();
    expect(screen.getByText("Nenhum evento")).toBeOnTheScreen();
    expect(dia(12)).toHaveAccessibleName("quinta-feira, 12 de novembro de 2026, 2 eventos");
    await fireEvent.press(dia(12));
    expect(aoDia).toHaveBeenLastCalledWith(new Date(2026, 10, 12));
    expect(dia(12)).toBeSelected();
    expect(screen.getByText("12 de novembro")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Entrega 14h, quinta-feira, 12 de novembro de 2026" }));
    expect(aoEvento).toHaveBeenLastCalledWith(eventos[1]);
    // tocar de novo no mesmo dia também avisa (o app pode criar um evento)
    await fireEvent.press(dia(12));
    expect(aoDia).toHaveBeenCalledTimes(2);
  });
});
