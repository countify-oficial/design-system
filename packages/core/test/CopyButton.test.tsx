import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button, CopyButton } from "../src";

afterEach(() => vi.unstubAllGlobals());

describe("CopyButton", () => {
  it("copia o valor e diz que copiou", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<CopyButton value="K7Q-29XM">{({ copied, copy }) => <Button onClick={copy}>{copied ? "Copiado" : "Copiar código"}</Button>}</CopyButton>);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copiar código" }));
      await Promise.resolve();
    });
    expect(writeText).toHaveBeenCalledWith("K7Q-29XM");
    expect(screen.getByRole("button", { name: "Copiado" })).toBeTruthy();
  });
});
