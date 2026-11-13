import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { semViolacoes } from "@countify-oficial/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createNotificationsStore, Notifications } from "../src";

afterEach(() => vi.useRealTimers());

describe("Notifications (web)", () => {
  it("mostra um por vez; some em 4 s; o próximo entra", () => {
    vi.useFakeTimers();
    const store = createNotificationsStore();
    const saiu = vi.fn();
    render(<Notifications store={store} />);
    act(() => {
      store.show({ message: "Análise salva", onClose: saiu });
      store.show({ message: "Câmera de volta" });
    });
    expect(screen.getByRole("status").textContent).toContain("Análise salva");
    expect(screen.queryByText("Câmera de volta")).toBeNull();
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(saiu).toHaveBeenCalledOnce();
    expect(screen.getByRole("status").textContent).toContain("Câmera de volta");
  });

  it("erro é anunciado na hora; loading não some; update troca o texto", () => {
    vi.useFakeTimers();
    const store = createNotificationsStore();
    render(<Notifications store={store} limit={2} />);
    let id = "";
    act(() => {
      id = store.show({ message: "Salvando…", loading: true });
      store.show({ message: "Sem conexão", color: "down", autoClose: false });
    });
    expect(screen.getByRole("alert").textContent).toContain("Sem conexão");
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.getByText("Salvando…")).toBeTruthy();
    act(() => {
      store.update(id, { message: "Salvo", loading: false });
    });
    expect(screen.getByText("Salvo")).toBeTruthy();
  });

  it("o botão fecha; sem violações de acessibilidade", async () => {
    const user = userEvent.setup();
    const store = createNotificationsStore();
    const { baseElement } = render(<Notifications store={store} />);
    act(() => {
      store.show({ title: "Meta batida", message: "Lume Jardins passou de 1.200", withCloseButton: true });
    });
    await semViolacoes(baseElement);
    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByRole("status")).toBeNull();
  });
});
