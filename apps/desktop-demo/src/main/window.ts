import { breakpoints, colors } from "@countify-oficial/tokens";
import type { BrowserWindowConstructorOptions } from "electron";

/** As opções da janela: renderer isolado (contextIsolation), sem Node (nodeIntegration) e em sandbox. */
export function windowOptions(preload: string, escuro: boolean): BrowserWindowConstructorOptions {
  return {
    width: breakpoints.lg,
    height: Math.round((breakpoints.lg * 10) / 16),
    minWidth: breakpoints.sm,
    show: false,
    // o fundo da página desde o primeiro quadro (sem piscar branco no modo escuro)
    backgroundColor: escuro ? colors.dark.bg : colors.light.bg,
    webPreferences: { preload, contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true, spellcheck: false },
  };
}
