import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ActionIcon, AppShell, Badge, Button, Icon, Marquee, ScrollArea, Scroller, Splitter, Toolbar } from "../src";
import { semViolacoes } from "./setup";

describe("ScrollArea, Scroller e Marquee", () => {
  it("ScrollArea entra no Tab e avisa a rolagem", async () => {
    const aoRolar = vi.fn();
    const { container } = render(<ScrollArea aria-label="Lojas" role="region" style={{ height: "var(--cf-list-row-height)" }} onScrollPositionChange={aoRolar}><p>Conteúdo</p></ScrollArea>);
    const area = screen.getByRole("region", { name: "Lojas" });
    expect(area.tabIndex).toBe(0);
    fireEvent.scroll(area, { target: { scrollTop: 30 } });
    expect(aoRolar).toHaveBeenLastCalledWith({ x: 0, y: 30 });
    await semViolacoes(container);
  });

  it("Scroller: setas com nome, fora do Tab, escondidas sem conteúdo a mais", () => {
    render(<Scroller><Button>Panorama</Button></Scroller>);
    const antes = screen.getByRole("button", { name: "Rolar para trás", hidden: true });
    expect(antes.tabIndex).toBe(-1);
    expect(antes.hasAttribute("data-hidden")).toBe(true);
  });

  it("Marquee: a segunda cópia fica escondida do leitor de tela", async () => {
    const { container } = render(<Marquee aria-label="Novidades">Fortaleza +12% · Sobral +4%</Marquee>);
    const faixa = screen.getByRole("marquee", { name: "Novidades" });
    expect(faixa.tabIndex).toBe(0);
    expect(faixa.querySelectorAll("[aria-hidden]")).toHaveLength(1);
    await semViolacoes(container);
  });
});

describe("Toolbar", () => {
  it("uma parada no Tab; setas, Home e End andam", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <Toolbar aria-label="Ações da tabela">
          <Button>Exportar</Button>
          <ActionIcon aria-label="Filtrar"><Icon name="sliders" /></ActionIcon>
          <ActionIcon aria-label="Apagar"><Icon name="trash" /></ActionIcon>
        </Toolbar>
        <Button>Depois</Button>
      </>,
    );
    await user.tab();
    expect(document.activeElement?.textContent).toBe("Exportar");
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Filtrar" }));
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Apagar" }));
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement?.textContent).toBe("Exportar");
    await user.tab();
    expect(document.activeElement?.textContent).toBe("Depois");
    await semViolacoes(container);
  });
});

describe("AppShell", () => {
  const itens = (avisos?: boolean) => (
    <>
      <AppShell.NavItem href="#painel" icon="dashboard" label="Painel" active />
      <AppShell.NavItem href="#analises" icon="analytics" label="Análises" />
      <AppShell.NavItem href="#avisos" icon="bell" label="Avisos" badge={avisos ? <Badge color="down" variant="filled">3</Badge> : undefined} />
    </>
  );
  it("menu no cabeçalho e abas embaixo, com a seção atual", () => {
    const { container } = render(
      <AppShell>
        <AppShell.Header logo={<span>countify</span>} end={<Button>Conta</Button>}>{itens(true)}</AppShell.Header>
        <AppShell.Main><h1>Painel</h1></AppShell.Main>
        <AppShell.TabBar>{itens(true)}</AppShell.TabBar>
      </AppShell>,
    );
    const menus = screen.getAllByRole("navigation", { name: "Seções" });
    expect(menus).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Painel" }).every((l) => l.getAttribute("aria-current") === "page")).toBe(true);
    // a contagem só no cabeçalho
    expect(menus[0]?.textContent).toContain("3");
    expect(menus[1]?.textContent).not.toContain("3");
    expect(screen.getByRole("main")).toBeTruthy();
    expect(container).toBeTruthy();
  });

  // em cada largura só um dos dois menus aparece (CSS), o que o jsdom não aplica: confere cada forma sozinha
  it.each([["cabeçalho", true], ["abas", false]])("acessível com o menu do %s", async (_nome, cabecalho) => {
    const { container } = render(
      <AppShell>
        {cabecalho && <AppShell.Header logo={<span>countify</span>}>{itens(true)}</AppShell.Header>}
        <AppShell.Main><h1>Painel</h1></AppShell.Main>
        {!cabecalho && <AppShell.TabBar>{itens()}</AppShell.TabBar>}
      </AppShell>,
    );
    await semViolacoes(container);
  });
});

describe("Splitter", () => {
  it("setas mudam o tamanho, sem passar do mínimo", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(
      <Splitter defaultSizes={[40, 60]} minSize={20} onSizesChange={aoMudar}>
        <Splitter.Panel>Lista</Splitter.Panel>
        <Splitter.Panel>Detalhe</Splitter.Panel>
      </Splitter>,
    );
    const alca = screen.getByRole("separator", { name: "Redimensionar painéis" });
    expect(alca.getAttribute("aria-valuenow")).toBe("40");
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(aoMudar).toHaveBeenLastCalledWith([45, 55]);
    await user.keyboard("{End}");
    expect(aoMudar).toHaveBeenLastCalledWith([80, 20]);
    await user.keyboard("{Home}");
    expect(aoMudar).toHaveBeenLastCalledWith([20, 80]);
    expect(alca.getAttribute("aria-valuenow")).toBe("20");
    await semViolacoes(container);
  });
});
