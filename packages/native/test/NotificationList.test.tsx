import { CountifyProvider } from "@countify-oficial/provider";
import { colors } from "@countify-oficial/tokens";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { Avatar, Icon, NotificationList, ThemeIcon, type NotificationListItem } from "../src";

const l = colors.light;
const avisos: NotificationListItem[] = [
  { id: "cam", title: "Câmera 2 sem imagem", description: "Lume Orla Fortaleza", date: new Date(2026, 10, 18, 10, 40), unread: true, icon: <ThemeIcon color="down"><Icon name="camera" /></ThemeIcon> },
  { id: "ana", title: "Ana Souza", description: "Lume Orla Fortaleza", date: "2026-11-18T08:57:00", icon: <Avatar name="Ana Souza" /> },
  { id: "agente", title: "Agente sem contato", date: new Date(2026, 10, 17, 21, 15).getTime() },
];

describe("NotificationList (React Native)", () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate", "setTimeout", "setInterval", "queueMicrotask"] });
    jest.setSystemTime(new Date(2026, 10, 18, 12, 0));
  });
  afterEach(() => jest.useRealTimers());

  it("grupos por dia, nome completo para o leitor de tela e não lido em negrito com o ponto", async () => {
    await render(<NotificationList items={avisos} />);
    expect(screen.getByRole("header", { name: "hoje" })).toHaveStyle({ textTransform: "uppercase" });
    expect(screen.getByRole("header", { name: "ontem" })).toBeOnTheScreen();
    expect(screen.getByRole("link", { name: "Câmera 2 sem imagem, Lume Orla Fortaleza, 10:40, não lido" })).toBeOnTheScreen();
    expect(screen.getByRole("link", { name: "Agente sem contato, 21:15" })).toBeOnTheScreen();
    expect(screen.getByText("Câmera 2 sem imagem")).toHaveStyle({ fontFamily: "Roboto_700Bold" });
    expect(screen.getByText("Ana Souza")).toHaveStyle({ fontFamily: "Roboto_500Medium" });
    expect(screen.getByText("08:57")).toHaveStyle({ color: l.text2 });
    expect(screen.getAllByTestId("unread-dot")).toHaveLength(1);
  });

  it("tocar escolhe e avisa o app; controlado, segue o app", async () => {
    const aoEscolher = jest.fn();
    const { rerender } = await render(<NotificationList items={avisos} onSelect={aoEscolher} />);
    await fireEvent.press(screen.getByRole("link", { name: /^Ana Souza/ }));
    expect(aoEscolher).toHaveBeenLastCalledWith("ana", avisos[1]);
    expect(screen.getByRole("link", { name: /^Ana Souza/ })).toBeSelected();
    await rerender(<NotificationList items={avisos} selected="cam" />);
    expect(screen.getByRole("link", { name: /^Câmera/ })).toBeSelected();
    expect(screen.getByRole("link", { name: /^Ana Souza/ })).not.toBeSelected();
  });

  it("vazio e carregando", async () => {
    const { rerender } = await render(<NotificationList items={[]} />);
    expect(screen.getByText("Nenhum aviso")).toBeOnTheScreen();
    await rerender(
      <CountifyProvider messages={{ noNotifications: "No notifications" }}>
        <NotificationList items={[]} />
      </CountifyProvider>,
    );
    expect(screen.getByText("No notifications")).toBeOnTheScreen();
    await rerender(<NotificationList items={[]} emptyState={<Text>Nenhum aviso de pessoas</Text>} />);
    expect(screen.getByText("Nenhum aviso de pessoas")).toBeOnTheScreen();
    await rerender(<NotificationList items={avisos} loading />);
    expect(screen.getByLabelText("Carregando")).toBeBusy();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
