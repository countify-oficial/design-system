import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Timeline } from "../src";
import { semViolacoes } from "./setup";

describe("Timeline", () => {
  it("os itens até active ficam feitos; a linha até o ativo também", async () => {
    const { container } = render(
      <Timeline active={1}>
        <Timeline.Item title="Câmera instalada" />
        <Timeline.Item title="Agente conectado" />
        <Timeline.Item title="Primeira contagem" lineVariant="dashed">Aguardando</Timeline.Item>
      </Timeline>,
    );
    const itens = Array.from(container.querySelectorAll("li"));
    expect(itens.map((i) => i.hasAttribute("data-active"))).toEqual([true, true, false]);
    expect(itens.map((i) => i.hasAttribute("data-line-active"))).toEqual([true, false, false]);
    expect(itens[2]?.style.getPropertyValue("--tl-line")).toBe("dashed");
    await semViolacoes(container);
  });
});
