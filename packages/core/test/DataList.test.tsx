import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataList } from "../src";
import { semViolacoes } from "./setup";

describe("DataList", () => {
  it("pares termo–valor em <dl>, valor com tom", async () => {
    const { container } = render(
      <DataList>
        <DataList.Item label="Ticket médio" value="R$ 87,40" />
        <DataList.Item label="Variação" color="up">+8%</DataList.Item>
      </DataList>,
    );
    expect(container.querySelector("dl")?.children).toHaveLength(2);
    expect(screen.getByText("Ticket médio").tagName).toBe("DT");
    const dd = screen.getByText("+8%");
    expect([dd.tagName, dd.dataset["color"], dd.style.getPropertyValue("--tone-c")]).toEqual(["DD", "up", "var(--cf-color-up)"]);
    await semViolacoes(container);
  });
});
