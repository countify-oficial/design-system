import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, OverflowList } from "../src";

const lojas = ["Jardins", "Orla", "Aldeota", "Centro", "Meireles"];

describe("OverflowList", () => {
  it("mostra os primeiros e resume o resto em +N", () => {
    render(<OverflowList items={lojas} maxVisible={2} renderItem={(l) => <Badge key={l}>{l}</Badge>} />);
    expect(screen.getByText("Jardins")).toBeTruthy();
    expect(screen.queryByText("Aldeota")).toBeNull();
    expect(screen.getByText("+3")).toBeTruthy();
  });

  it("resumo próprio recebe os escondidos; sem sobra, sem resumo", () => {
    const { rerender } = render(<OverflowList items={lojas} maxVisible={4} renderItem={(l) => <span key={l}>{l}</span>} renderOverflow={(h) => <span>e {h.join(", ")}</span>} />);
    expect(screen.getByText("e Meireles")).toBeTruthy();
    rerender(<OverflowList items={lojas} maxVisible={9} renderItem={(l) => <span key={l}>{l}</span>} />);
    expect(screen.queryByText(/^\+/)).toBeNull();
  });
});
