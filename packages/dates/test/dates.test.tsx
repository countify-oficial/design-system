import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { semViolacoes } from "@countify-oficial/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Calendar, DateInput, DatePicker, DateTimePicker, TimeInput, type DatesRange } from "../src";

// o "hoje" do mockup
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 10, 11, 9, 0));
});
afterEach(() => vi.useRealTimers());

const dia = (n: number) => screen.getByRole("gridcell", { name: new RegExp(`, ${String(n)} de novembro de 2026`) });

describe("Calendar", () => {
  it("mês, hoje, futuros bloqueados e o teclado", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(<Calendar maxDate={new Date()} onChange={aoMudar} />);
    expect(screen.getByRole("grid", { name: "Novembro de 2026" })).toBeTruthy();
    expect(dia(11).getAttribute("aria-label")).toContain("hoje");
    expect(dia(12).getAttribute("aria-disabled")).toBe("true");
    expect(screen.getByRole("button", { name: "Próximo mês" })).toHaveProperty("disabled", true);
    await user.click(dia(12));
    expect(aoMudar).not.toHaveBeenCalled();
    await user.click(dia(3));
    expect(aoMudar).toHaveBeenLastCalledWith(new Date(2026, 10, 3));
    expect(dia(3).getAttribute("aria-selected")).toBe("true");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(aoMudar).toHaveBeenLastCalledWith(new Date(2026, 10, 10));
    await user.keyboard("{PageUp}");
    expect(screen.getByRole("grid", { name: "Outubro de 2026" })).toBeTruthy();
    expect(document.activeElement?.getAttribute("aria-label")).toContain("10 de outubro");
    await semViolacoes(container);
  });

  it("período: o 1º começa, o 2º fecha; o meio fica marcado", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<Calendar type="range" onChange={aoMudar} />);
    await user.click(dia(3));
    await user.click(dia(9));
    expect(aoMudar).toHaveBeenLastCalledWith([new Date(2026, 10, 3), new Date(2026, 10, 9)]);
    expect(dia(5).getAttribute("data-range")).toBe("in");
    expect(dia(3).getAttribute("data-range")).toBe("start");
  });
});

describe("DatePicker", () => {
  it("um dia: escolher fecha e mostra 01/11/2026", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { baseElement } = render(<DatePicker label="Vale a partir de" onChange={aoMudar} />);
    const campo = screen.getByRole<HTMLInputElement>("textbox", { name: "Vale a partir de" });
    await user.click(campo);
    await semViolacoes(baseElement);
    await user.click(dia(1));
    expect(aoMudar).toHaveBeenLastCalledWith(new Date(2026, 10, 1));
    expect(campo.value).toBe("01/11/2026");
  });

  it("período com atalhos: Aplicar só com o período completo", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const ontem: DatesRange = [new Date(2026, 10, 10), new Date(2026, 10, 10)];
    render(<DatePicker type="range" label="Período" maxDate={new Date()} presets={[{ label: "Ontem", value: ontem }]} onChange={aoMudar} />);
    const campo = screen.getByRole<HTMLInputElement>("textbox", { name: "Período" });
    await user.click(campo);
    await user.click(dia(2));
    expect(screen.getByRole("button", { name: "Aplicar" })).toHaveProperty("disabled", true);
    await user.click(dia(8));
    await user.click(screen.getByRole("button", { name: "Aplicar" }));
    expect(aoMudar).toHaveBeenLastCalledWith([new Date(2026, 10, 2), new Date(2026, 10, 8)]);
    expect(campo.value).toBe("02/11 a 08/11/2026");
    await user.click(campo);
    await user.click(screen.getByRole("button", { name: "Ontem" }));
    expect(screen.getByRole("button", { name: "Ontem" }).getAttribute("aria-pressed")).toBe("true");
    await user.click(screen.getByRole("button", { name: "Aplicar" }));
    expect(campo.value).toBe("10/11/2026");
  });

  it("DateTimePicker: dia e hora juntos", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<DateTimePicker label="Começa" onChange={aoMudar} />);
    const campo = screen.getByRole<HTMLInputElement>("textbox", { name: "Começa" });
    await user.click(campo);
    await user.click(dia(4));
    await user.type(screen.getByRole("textbox", { name: "Horário" }), "1430");
    await user.click(screen.getByRole("button", { name: "Aplicar" }));
    expect(aoMudar).toHaveBeenLastCalledWith(new Date(2026, 10, 4, 14, 30));
    expect(campo.value).toBe("04/11/2026 14:30");
  });
});

describe("DateInput e TimeInput", () => {
  it("DateInput: digitar com a máscara; inválido volta ao sair", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(<DateInput label="Dia" onChange={aoMudar} />);
    const campo = screen.getByRole<HTMLInputElement>("textbox", { name: "Dia" });
    await user.type(campo, "15092026");
    expect(campo.value).toBe("15/09/2026");
    expect(aoMudar).toHaveBeenLastCalledWith(new Date(2026, 8, 15));
    await user.clear(campo);
    await user.type(campo, "3102");
    await user.tab();
    expect(aoMudar).toHaveBeenLastCalledWith(null);
    await semViolacoes(container);
  });

  it("DateInput: o ícone abre o calendário", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<DateInput label="Dia" onChange={aoMudar} />);
    const campo = screen.getByRole<HTMLInputElement>("textbox", { name: "Dia" });
    await user.click(screen.getByRole("button", { name: "Escolher data" }));
    await user.click(dia(5));
    expect(aoMudar).toHaveBeenLastCalledWith(new Date(2026, 10, 5));
    expect(campo.value).toBe("05/11/2026");
  });

  it("TimeInput: 24 h, só avisa a hora válida", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    render(<TimeInput label="Abre" onChange={aoMudar} />);
    const campo = screen.getByRole<HTMLInputElement>("textbox", { name: "Abre" });
    await user.type(campo, "2599");
    expect(aoMudar).not.toHaveBeenCalled();
    await user.clear(campo);
    await user.type(campo, "1000");
    expect(aoMudar).toHaveBeenLastCalledWith("10:00");
  });
});
