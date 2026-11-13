import { act, render, screen } from "@testing-library/react-native";
import { createNotificationsStore, Notifications } from "../src/index.native";

describe("Notifications (React Native)", () => {
  it("mostra, some sozinho e chama onClose", async () => {
    jest.useFakeTimers();
    const store = createNotificationsStore();
    const saiu = jest.fn();
    await render(<Notifications store={store} bottomInset={36} />);
    await act(() => {
      store.show({ message: "Análise salva", onClose: saiu });
    });
    expect(screen.getByText("Análise salva")).toBeOnTheScreen();
    await act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(screen.queryByText("Análise salva")).toBeNull();
    expect(saiu).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
