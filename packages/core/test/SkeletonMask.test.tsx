import { CountifyProvider } from "@countify-oficial/provider";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { Badge, Button, Radio, SkeletonMask, Text, TextInput } from "../src";
import classes from "../src/SkeletonMask/SkeletonMask.module.css";
import { semViolacoes } from "./setup";

const Formulario = ({ salvar }: { salvar?: () => void }) => (
  <>
    <Text>Faturamento</Text>
    <TextInput label="Loja" defaultValue="" />
    <Badge>parcial</Badge>
    <Button onClick={salvar}>Salvar</Button>
  </>
);

// o CSS Module de verdade, com a classe que o teste recebe (o Vitest não injeta CSS)
const comOCss = () => {
  const css = readFileSync(join(import.meta.dirname, "../src/SkeletonMask/SkeletonMask.module.css"), "utf8");
  const folha = document.createElement("style");
  folha.textContent = css.replaceAll(".root", `.${classes["root"] ?? ""}`);
  document.head.append(folha);
  return folha;
};

describe("SkeletonMask", () => {
  it("visível: aria-busy, inert e o status 'Carregando'; o conteúdo continua lá, do mesmo tamanho", async () => {
    const { container } = render(<SkeletonMask visible><Formulario /></SkeletonMask>);
    const involucro = container.firstElementChild as HTMLElement;
    expect([involucro.getAttribute("aria-busy"), involucro.hasAttribute("inert"), involucro.hasAttribute("data-animate")]).toEqual(["true", true, true]);
    expect(screen.getByRole("status").textContent).toBe("Carregando");
    expect(involucro.contains(screen.getByRole("status"))).toBe(false);
    expect(involucro.querySelector("button")?.textContent).toBe("Salvar");
    await semViolacoes(container);
  });

  it("label, animate={false} e o texto do provider", () => {
    const { rerender } = render(<CountifyProvider messages={{ loading: "Loading" }}><SkeletonMask visible animate={false}><p>1.284</p></SkeletonMask></CountifyProvider>);
    expect(screen.getByRole("status").textContent).toBe("Loading");
    expect(screen.getByText("1.284").parentElement?.hasAttribute("data-animate")).toBe(false);
    rerender(<SkeletonMask visible label="Carregando vendas"><p>1.284</p></SkeletonMask>);
    expect(screen.getByRole("status").textContent).toBe("Carregando vendas");
  });

  it("sem visible: involucro simples; os filhos recebem clique e texto", async () => {
    const user = userEvent.setup();
    const salvar = vi.fn();
    const { container } = render(<SkeletonMask visible={false}><Formulario salvar={salvar} /></SkeletonMask>);
    const involucro = container.firstElementChild as HTMLElement;
    expect(["aria-busy", "inert", "data-visible", "data-animate"].filter((a) => involucro.hasAttribute(a))).toEqual([]);
    expect(screen.queryByRole("status")).toBeNull();
    await user.type(screen.getByRole("textbox", { name: "Loja" }), "Orla");
    await user.click(screen.getByRole("button", { name: "Salvar" }));
    expect([screen.getByRole<HTMLInputElement>("textbox").value, salvar.mock.calls.length]).toEqual(["Orla", 1]);
    await semViolacoes(container);
  });

  it("no pai flex, o involucro não tem caixa nos dois estados e os filhos não remontam", async () => {
    const folha = comOCss();
    const user = userEvent.setup();
    const tela = (visible: boolean) => <div style={{ display: "flex" }}><SkeletonMask visible={visible}><Formulario /></SkeletonMask></div>;
    const { container, rerender } = render(tela(false));
    const involucro = container.firstElementChild?.firstElementChild as HTMLElement;
    const campo = screen.getByRole<HTMLInputElement>("textbox", { name: "Loja" });
    await user.type(campo, "Orla");
    const estado = () => [getComputedStyle(involucro).display, getComputedStyle(screen.getByText("Faturamento")).color];
    expect(estado()).toEqual(["contents", "rgb(0, 0, 0)"]);
    rerender(tela(true));
    expect(estado()).toEqual(["contents", "rgba(0, 0, 0, 0)"]);
    rerender(tela(false));
    expect(estado()).toEqual(["contents", "rgb(0, 0, 0)"]);
    expect([screen.getByRole("textbox", { name: "Loja" }) === campo, campo.value]).toEqual([true, "Orla"]);
    folha.remove();
  });

  it("a opção vira um bloco redondo sem o desenho do sistema, que pulsa por filter; o texto em bloco fica da largura dele", () => {
    const folha = comOCss();
    const tela = (visible: boolean) => <SkeletonMask visible={visible}><Radio label="Nome" defaultChecked /><Text>Faturamento</Text></SkeletonMask>;
    const { container, rerender } = render(tela(true));
    const estilo = () => {
      const opcao = getComputedStyle(container.querySelector("input") as HTMLInputElement);
      return [opcao.getPropertyValue("appearance"), opcao.borderRadius, opcao.animationName, getComputedStyle(screen.getByText("Faturamento")).width];
    };
    // filter, e não opacity: o input invisível de um controle (opacity 0) continua invisível no pulso
    expect(estilo()).toEqual(["none", "50%", "pulsar-filtro", "fit-content"]);
    rerender(tela(false));
    expect(estilo()).toEqual(["auto", "0px", "none", "auto"]);
    folha.remove();
  });
});
