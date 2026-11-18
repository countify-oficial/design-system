import { CountifyProvider } from "@countify-oficial/provider";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Anchor, Announcement, Button } from "../src";
import { semViolacoes } from "./setup";

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("Announcement", () => {
  it("região com o nome do título, ícone no quadrado do tom, texto, ação e o × com o nome Dispensar", async () => {
    const { container } = render(
      <Announcement title="Agora dá para exportar em CSV" action={<Anchor href="#novidades">Ver o que mudou</Anchor>}>
        Na tabela de lojas, use o botão Exportar.
      </Announcement>,
    );
    const regiao = screen.getByRole("region", { name: "Agora dá para exportar em CSV" });
    expect(regiao.textContent).toContain("Na tabela de lojas");
    expect(regiao.querySelector("[data-variant='light']")?.getAttribute("style")).toContain("--tone-tint: var(--cf-color-accent-tint)");
    expect(screen.getByRole("link", { name: "Ver o que mudou" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Dispensar" })).toBeTruthy();
    await semViolacoes(container);
  });

  it("não controlado: o × esconde e chama onDismiss; icon={null} tira o quadrado", () => {
    const aoDispensar = vi.fn();
    render(<Announcement title="Nova versão do agente" icon={null} onDismiss={aoDispensar} />);
    expect(screen.getByRole("region").querySelectorAll("svg")).toHaveLength(1); // só o do ×
    fireEvent.click(screen.getByRole("button", { name: "Dispensar" }));
    expect(aoDispensar).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("controlado: quem esconde é o app; defaultOpened={false} começa fechado", () => {
    function Tela() {
      const [aberto, setAberto] = useState(true);
      return <Announcement title="Novidade" opened={aberto} onDismiss={() => setAberto(false)} />;
    }
    const { rerender } = render(<Tela />);
    fireEvent.click(screen.getByRole("button", { name: "Dispensar" }));
    expect(screen.queryByRole("region")).toBeNull();
    rerender(<Announcement title="Novidade" opened onDismiss={() => undefined} />);
    fireEvent.click(screen.getByRole("button", { name: "Dispensar" }));
    expect(screen.getByRole("region")).toBeTruthy(); // o app não fechou
    rerender(<Announcement key="outro" title="Novidade" defaultOpened={false} />);
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("storageKey: lembra a dispensa e não volta; sem localStorage, segue funcionando", () => {
    const { unmount } = render(<Announcement title="CSV" storageKey="novidade-csv" />);
    fireEvent.click(screen.getByRole("button", { name: "Dispensar" }));
    expect(window.localStorage.getItem("novidade-csv")).toBe("1");
    unmount();
    render(<Announcement title="CSV" storageKey="novidade-csv" />);
    expect(screen.queryByRole("region")).toBeNull();
    window.localStorage.clear();
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    render(<Announcement title="Bloqueado" storageKey="novidade-bloqueada" />);
    fireEvent.click(screen.getByRole("button", { name: "Dispensar" }));
    expect(screen.queryByRole("region", { name: "Bloqueado" })).toBeNull();
  });

  it("foco: vai para o próximo focável depois do anúncio, ou o anterior se ele era o último", () => {
    const { unmount } = render(
      <>
        <Button>Antes</Button>
        <Announcement title="Novidade" />
        <Button>Depois</Button>
      </>,
    );
    screen.getByRole("button", { name: "Dispensar" }).focus();
    fireEvent.click(screen.getByRole("button", { name: "Dispensar" }));
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Depois" }));
    unmount();
    render(
      <>
        <Button>Antes</Button>
        <Announcement title="Novidade" />
      </>,
    );
    screen.getByRole("button", { name: "Dispensar" }).focus();
    fireEvent.click(screen.getByRole("button", { name: "Dispensar" }));
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Antes" }));
  });

  it("o nome do × vem do provider ou de dismissLabel", () => {
    render(
      <CountifyProvider messages={{ dismiss: "Dismiss" }}>
        <Announcement title="A" />
        <Announcement title="B" dismissLabel="Dispensar novidade B" />
      </CountifyProvider>,
    );
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Dispensar novidade B" })).toBeTruthy();
  });
});
