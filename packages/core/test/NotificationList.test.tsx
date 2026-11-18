import { CountifyProvider } from "@countify-oficial/provider";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Avatar, Icon, NotificationList, ThemeIcon, type NotificationListItem } from "../src";
import { semViolacoes } from "./setup";

const avisos: NotificationListItem[] = [
  { id: "cam", title: "Câmera 2 sem imagem", description: "Lume Orla Fortaleza", date: new Date(2026, 10, 18, 10, 40), unread: true, icon: <ThemeIcon color="down"><Icon name="camera" /></ThemeIcon> },
  { id: "ana", title: "Ana Souza", description: "Lume Orla Fortaleza", date: "2026-11-18T08:57:00", icon: <Avatar name="Ana Souza" /> },
  { id: "agente", title: "Agente sem contato", description: "Lume Jardins Bosque", date: new Date(2026, 10, 17, 21, 15).getTime() },
  { id: "velho", title: "Sem vendas", date: new Date(2026, 10, 12, 17, 0) },
];

describe("NotificationList", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 18, 12, 0));
  });
  afterEach(() => vi.useRealTimers());

  it("agrupa por dia (hoje, ontem, data por extenso), com a hora em <time> e o não lido para o leitor de tela", async () => {
    const { container } = render(<NotificationList items={avisos} />);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(["hoje", "ontem", "12 de novembro"]);
    expect(screen.getByRole("list", { name: "hoje" }).querySelectorAll("li")).toHaveLength(2);
    const cam = screen.getByRole("button", { name: /Câmera 2 sem imagem/ });
    expect(cam.textContent).toContain("não lido");
    expect(cam.dataset["unread"]).toBeDefined();
    const hora = cam.querySelector("time");
    expect(hora?.textContent).toBe("10:40");
    expect(hora?.getAttribute("dateTime")).toBe(new Date(2026, 10, 18, 10, 40).toISOString());
    // o ícone e as iniciais são decorativos: o nome é o do aviso, sem "Ana Souza" duas vezes
    expect(screen.getByRole("button", { name: /^Ana Souza\s*Lume Orla Fortaleza\s*08:57$/ })).toBeTruthy();
    await semViolacoes(container);
  });

  it("clique escolhe: fundo de destaque e aria-current; controlado, segue o app", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    const aoEscolher = vi.fn();
    const { rerender } = render(<NotificationList items={avisos} onSelect={aoEscolher} />);
    await user.click(screen.getByRole("button", { name: /Ana Souza/ }));
    expect(aoEscolher).toHaveBeenLastCalledWith("ana", avisos[1]);
    const ana = screen.getByRole("button", { name: /Ana Souza/ });
    expect(ana.getAttribute("aria-current")).toBe("true");
    expect(ana.dataset["active"]).toBeDefined();
    rerender(<NotificationList items={avisos} selected="cam" onSelect={aoEscolher} />);
    expect(screen.getByRole("button", { name: /Câmera/ }).getAttribute("aria-current")).toBe("true");
    expect(screen.getByRole("button", { name: /Ana Souza/ }).getAttribute("aria-current")).toBeNull();
  });

  it("teclado: uma parada no Tab, setas andam entre os grupos, Home e End, Enter escolhe", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    const aoEscolher = vi.fn();
    render(
      <>
        <NotificationList items={avisos} defaultSelected="ana" onSelect={aoEscolher} />
        <button type="button">depois</button>
      </>,
    );
    await user.tab();
    expect(document.activeElement?.textContent).toContain("Ana Souza");
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement?.textContent).toContain("Agente sem contato");
    await user.keyboard("{End}");
    expect(document.activeElement?.textContent).toContain("Sem vendas");
    await user.keyboard("{ArrowDown}{Home}{ArrowUp}");
    expect(document.activeElement?.textContent).toContain("Câmera");
    await user.keyboard("{Enter}");
    expect(aoEscolher).toHaveBeenLastCalledWith("cam", avisos[0]);
    await user.tab();
    expect(document.activeElement?.textContent).toBe("depois");
  });

  it("vazio: EmptyState com o texto do provider, ou o do app", async () => {
    const { container, rerender } = render(<NotificationList items={[]} />);
    expect(screen.getByText("Nenhum aviso")).toBeTruthy();
    await semViolacoes(container);
    rerender(
      <CountifyProvider messages={{ noNotifications: "No notifications" }}>
        <NotificationList items={[]} />
      </CountifyProvider>,
    );
    expect(screen.getByText("No notifications")).toBeTruthy();
    rerender(<NotificationList items={[]} emptyState={<p>Nenhum aviso de pessoas</p>} />);
    expect(screen.getByText("Nenhum aviso de pessoas")).toBeTruthy();
  });

  it("carregando: linhas cinza com o status, sem a lista", async () => {
    const { container } = render(<NotificationList items={avisos} loading />);
    expect(screen.getByRole("status", { name: "Carregando" }).getAttribute("aria-busy")).toBe("true");
    expect(screen.queryByRole("button")).toBeNull();
    await semViolacoes(container);
  });
});
