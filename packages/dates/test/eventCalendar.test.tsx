import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { semViolacoes } from "@countify-oficial/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EventCalendar, type CalendarEvent } from "../src";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 10, 11, 9, 0));
});
afterEach(() => vi.useRealTimers());

const eventos: CalendarEvent[] = [
  { id: 1, date: new Date(2026, 10, 12, 8), title: "Inventário Lume Orla" },
  { id: 2, date: new Date(2026, 10, 12), title: "Promoção Dia das Mães", color: "warn" },
  { id: 3, date: new Date(2026, 10, 12), title: "Entrega 14h", color: "up" },
  { id: 4, date: new Date(2026, 10, 12), title: "Reunião de loja", color: "gray" },
  { id: 5, date: new Date(2026, 10, 20), title: "Balanço" },
];
const dia = (n: number, mes = "novembro") => screen.getByRole("gridcell", { name: new RegExp(`, ${String(n)} de ${mes} de 2026`) });

describe("EventCalendar", () => {
  it("chips, +N mais com a lista do dia, hoje e os cliques", async () => {
    const user = userEvent.setup();
    const aoEvento = vi.fn();
    const aoDia = vi.fn();
    const { baseElement } = render(<EventCalendar events={eventos} onEventClick={aoEvento} onDayClick={aoDia} />);
    expect(screen.getByRole("grid", { name: "Novembro de 2026" })).toBeTruthy();
    expect(dia(11).getAttribute("aria-label")).toContain("hoje");
    expect(dia(12).getAttribute("aria-label")).toBe("quinta-feira, 12 de novembro de 2026, 4 eventos");
    // 3 linhas: 2 chips e o "+2 mais"
    expect(screen.getByRole("button", { name: "Inventário Lume Orla, quinta-feira, 12 de novembro de 2026" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /^Entrega 14h/ })).toBeNull();
    const mais = screen.getByRole("button", { name: "mais 2 eventos em 12 de novembro" });
    expect(mais.textContent).toBe("+2 mais");
    await semViolacoes(baseElement);

    await user.click(mais);
    expect(aoDia).not.toHaveBeenCalled();
    const lista = screen.getByRole("dialog", { name: "12 de novembro" });
    expect(lista.querySelectorAll("button")).toHaveLength(4);
    await semViolacoes(baseElement);
    await user.click(screen.getByRole("button", { name: /^Entrega 14h/ }));
    expect(aoEvento).toHaveBeenLastCalledWith(eventos[2]);
    expect(aoDia).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    await user.click(screen.getByRole("button", { name: /^Balanço/ }));
    expect(aoEvento).toHaveBeenLastCalledWith(eventos[4]);
    expect(aoDia).not.toHaveBeenCalled();
    await user.click(dia(5));
    expect(aoDia).toHaveBeenLastCalledWith(new Date(2026, 10, 5));
  });

  it("teclado: setas andam, Enter no dia, Tab entra nos eventos do dia em foco", async () => {
    const user = userEvent.setup();
    const aoEvento = vi.fn();
    const aoDia = vi.fn();
    render(<EventCalendar events={eventos} maxEventsPerDay={5} onEventClick={aoEvento} onDayClick={aoDia} />);
    // os 4 cabem com 5 linhas: sem "+N mais"
    expect(screen.queryByRole("button", { name: /^mais/ })).toBeNull();
    await user.tab();
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(dia(11));
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(dia(12));
    await user.keyboard("{Enter}");
    expect(aoDia).toHaveBeenLastCalledWith(new Date(2026, 10, 12));
    await user.tab();
    expect(document.activeElement?.getAttribute("aria-label")).toMatch(/^Inventário Lume Orla/);
    await user.keyboard("{Enter}");
    expect(aoEvento).toHaveBeenLastCalledWith(eventos[0]);
    expect(aoDia).toHaveBeenCalledTimes(1);
    dia(12).focus();
    await user.keyboard("{PageDown}");
    expect(screen.getByRole("grid", { name: "Dezembro de 2026" })).toBeTruthy();
    expect(document.activeElement).toBe(dia(12, "dezembro"));
  });
});
