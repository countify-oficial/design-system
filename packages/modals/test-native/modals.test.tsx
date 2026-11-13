import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { createModalsStore, ModalsProvider } from "../src/index.native";

describe("modals (React Native)", () => {
  it("confirmação com dois botões; confirmar chama e fecha", async () => {
    const store = createModalsStore();
    const excluir = jest.fn();
    await render(<ModalsProvider store={store} />);
    await act(() => {
      store.openConfirmModal({ title: "Excluir análise?", children: "Ela sai para quem foi compartilhada.", labels: { confirm: "Excluir" }, confirmColor: "down", onConfirm: excluir });
    });
    expect(screen.getByText("Excluir análise?")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Excluir" }));
    expect(excluir).toHaveBeenCalled();
    expect(screen.queryByText("Excluir análise?")).toBeNull();
  });
});
