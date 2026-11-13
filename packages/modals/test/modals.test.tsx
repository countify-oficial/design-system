import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@countify-oficial/core";
import { semViolacoes } from "@countify-oficial/test-utils";
import { describe, expect, it, vi } from "vitest";
import { createModalsStore, ModalsProvider, useModals, type ContextModalProps } from "../src";

describe("modals (web)", () => {
  it("confirmação: alertdialog, Cancelar e a ação; fecha depois", async () => {
    const user = userEvent.setup();
    const store = createModalsStore();
    const excluir = vi.fn();
    const { baseElement } = render(<ModalsProvider store={store} />);
    act(() => {
      store.openConfirmModal({ title: "Excluir análise?", children: "Ela sai para quem foi compartilhada.", labels: { confirm: "Excluir" }, confirmColor: "down", onConfirm: excluir });
    });
    const janela = screen.getByRole("alertdialog", { name: "Excluir análise?" });
    expect(janela.textContent).toContain("Cancelar");
    await semViolacoes(baseElement);
    await user.click(screen.getByRole("button", { name: "Excluir" }));
    expect(excluir).toHaveBeenCalledOnce();
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("Esc cancela; open mostra o conteúdo; closeAll fecha todas", async () => {
    const user = userEvent.setup();
    const store = createModalsStore();
    const cancelou = vi.fn();
    render(<ModalsProvider store={store} />);
    act(() => {
      store.openConfirmModal({ title: "Sair?", onCancel: cancelou });
    });
    await user.keyboard("{Escape}");
    expect(cancelou).toHaveBeenCalled();
    act(() => {
      store.open({ title: "Detalhes", children: <p>Lume Jardins</p> });
      store.open({ title: "Mais", children: <p>Outra</p> });
    });
    expect(screen.getByText("Lume Jardins")).toBeTruthy();
    act(() => {
      store.closeAll();
    });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("janela registrada (context modal) fecha a si mesma", async () => {
    const user = userEvent.setup();
    const store = createModalsStore();
    function Renomear({ context, id, innerProps }: ContextModalProps<{ nome: string }>) {
      return <Button onClick={() => context.close(id)}>Renomear {innerProps.nome}</Button>;
    }
    function Abre() {
      const m = useModals();
      return <Button onClick={() => m.openContextModal({ modal: "renomear", title: "Renomear", innerProps: { nome: "Lume" } })}>Abrir</Button>;
    }
    render(<ModalsProvider store={store} modals={{ renomear: Renomear }}><Abre /></ModalsProvider>);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    await user.click(screen.getByRole("button", { name: "Renomear Lume" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
