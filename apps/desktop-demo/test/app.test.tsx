import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/renderer/src/App";
import { windowOptions } from "../src/main/window";

beforeEach(() => {
  window.countify = {
    getInfo: vi.fn(() => Promise.resolve({ version: "0.0.0", platform: "darwin", electron: "45.1.0" })),
    getSystemScheme: vi.fn(() => Promise.resolve("light" as const)),
    onSystemSchemeChange: vi.fn(() => () => undefined),
  };
});

describe("janela segura", () => {
  it("renderer isolado, sem Node e em sandbox", () => {
    const o = windowOptions("/preload.cjs", false);
    expect(o.webPreferences).toMatchObject({ contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true, preload: "/preload.cjs" });
  });
});

describe("app de demonstração", () => {
  it("o menu troca a seção; Ajustes mostra o que veio do preload", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "Painel" })).toBeTruthy();
    const [ajustes] = screen.getAllByRole("button", { name: "Ajustes" });
    if (!ajustes) throw new Error("sem menu");
    await user.click(ajustes);
    expect(screen.getByRole("heading", { level: 1, name: "Ajustes" })).toBeTruthy();
    await waitFor(() => expect(screen.getByText("45.1.0")).toBeTruthy());
  });
});
