import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Anchor, Breadcrumbs, Burger, NavLink, Pagination, Stepper, TableOfContents, Tabs } from "../src";
import { semViolacoes } from "./setup";

function Abas({ onChange }: { onChange?: (v: string | null) => void }) {
  return (
    <Tabs defaultValue="dia" onChange={onChange}>
      <Tabs.List aria-label="Período">
        <Tabs.Tab value="dia">Dia</Tabs.Tab>
        <Tabs.Tab value="semana">Semana</Tabs.Tab>
        <Tabs.Tab value="mes" disabled>Mês</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="dia">Hoje</Tabs.Panel>
      <Tabs.Panel value="semana">Esta semana</Tabs.Panel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("clique e setas abrem a aba; pula a desativada; painel ligado à aba", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(<Abas onChange={aoMudar} />);
    expect(screen.getByRole("tabpanel", { name: "Dia" }).textContent).toBe("Hoje");
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Dia" }));
    await user.keyboard("{ArrowRight}");
    expect(aoMudar).toHaveBeenLastCalledWith("semana");
    expect(screen.getByRole("tab", { name: "Semana" }).getAttribute("aria-selected")).toBe("true");
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Dia" }));
    await user.click(screen.getByRole("tab", { name: "Semana" }));
    expect(screen.getByRole("tabpanel").textContent).toBe("Esta semana");
    expect(screen.getByRole("tab", { name: "Dia" }).tabIndex).toBe(-1);
    await semViolacoes(container);
  });
});

describe("Burger, Breadcrumbs e NavLink", () => {
  it("Burger anuncia aberto e troca o nome", () => {
    const { rerender } = render(<Burger opened={false} />);
    expect(screen.getByRole("button", { name: "Abrir menu" }).getAttribute("aria-expanded")).toBe("false");
    rerender(<Burger opened />);
    expect(screen.getByRole("button", { name: "Fechar menu" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("Breadcrumbs: o último é a tela atual", async () => {
    const { container } = render(
      <Breadcrumbs>
        <Anchor href="/ajustes">Ajustes</Anchor>
        <Anchor href="/ajustes/seguranca">Segurança</Anchor>
        Dispositivos
      </Breadcrumbs>,
    );
    const nav = screen.getByRole("navigation", { name: "Caminho" });
    expect(nav.querySelectorAll("li[aria-hidden]")).toHaveLength(2);
    expect(nav.querySelector('[aria-current="page"]')?.textContent).toBe("Dispositivos");
    await semViolacoes(container);
  });

  it("NavLink: a atual é anunciada; com filhos abre e fecha", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <nav aria-label="Ajustes">
        <NavLink href="/conta" label="Conta" description="Nome, e-mail e senha" active />
        <NavLink label="Lojas" defaultOpened={false}>
          <NavLink href="/lojas/jardins" label="Lume Jardins" />
        </NavLink>
      </nav>,
    );
    expect(screen.getByRole("link", { name: /Conta/ }).getAttribute("aria-current")).toBe("page");
    const grupo = screen.getByRole("button", { name: "Lojas" });
    expect(grupo.getAttribute("aria-expanded")).toBe("false");
    await user.click(grupo);
    expect(grupo.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("link", { name: "Lume Jardins" })).toBeTruthy();
    await semViolacoes(container);
  });
});

describe("Pagination", () => {
  it("números com saltos; setas param nas pontas", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(<Pagination total={10} defaultValue={5} onChange={aoMudar} />);
    const nav = screen.getByRole("navigation", { name: "Páginas" });
    expect(nav.textContent).toBe("1…456…10");
    expect(screen.getByRole("button", { name: "Página 5" }).getAttribute("aria-current")).toBe("page");
    await user.click(screen.getByRole("button", { name: "Próxima página" }));
    expect(aoMudar).toHaveBeenLastCalledWith(6);
    await user.click(screen.getByRole("button", { name: "Página 10" }));
    expect(screen.getByRole("button", { name: "Próxima página" })).toHaveProperty("disabled", true);
    await semViolacoes(container);
  });

  it("compacta: só as setas e o rótulo", () => {
    render(<Pagination total={17} value={2} withPages={false} label="21–40 de 340" />);
    expect(screen.getByRole("navigation").textContent).toBe("21–40 de 340");
  });
});

describe("Stepper", () => {
  const passos = (active: number, onStepClick?: (i: number) => void) => (
    <Stepper active={active} onStepClick={onStepClick}>
      <Stepper.Step label="Lojas">Escolha as lojas</Stepper.Step>
      <Stepper.Step label="Câmeras">Ligue as câmeras</Stepper.Step>
      <Stepper.Step label="Pronto">Revise</Stepper.Step>
      <Stepper.Completed>Instalação concluída</Stepper.Completed>
    </Stepper>
  );

  it("mostra o passo atual e o conteúdo; no fim, o Completed", () => {
    const { container, rerender } = render(passos(1));
    expect(container.textContent).toContain("2 de 3 · Câmeras");
    expect(container.textContent).toContain("Ligue as câmeras");
    expect(container.querySelectorAll("[data-done]")).toHaveLength(2);
    rerender(passos(3));
    expect(container.textContent).toBe("Instalação concluída");
  });

  it("barras viram botões: volta, não avança", async () => {
    const user = userEvent.setup();
    const ir = vi.fn();
    const { container } = render(passos(1, ir));
    expect(screen.getByRole("button", { name: "Câmeras" }).getAttribute("aria-current")).toBe("step");
    expect(screen.getByRole("button", { name: "Pronto" })).toHaveProperty("disabled", true);
    await user.click(screen.getByRole("button", { name: "Lojas" }));
    expect(ir).toHaveBeenCalledWith(0);
    await semViolacoes(container);
  });
});

describe("TableOfContents", () => {
  it("links numerados para os títulos; a atual marcada", async () => {
    const user = userEvent.setup();
    const aoMudar = vi.fn();
    const { container } = render(
      <TableOfContents
        onChange={aoMudar}
        links={[
          { id: "cores", label: "Cores" },
          { id: "letra", label: "Letra", depth: 1 },
        ]}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Nesta página" });
    expect(nav.textContent).toBe("01Cores02Letra");
    await user.click(screen.getByRole("link", { name: "Letra" }));
    expect(aoMudar).toHaveBeenLastCalledWith("letra");
    expect(screen.getByRole("link", { name: "Letra" }).getAttribute("aria-current")).toBe("location");
    await semViolacoes(container);
  });
});
