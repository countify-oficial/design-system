import { app, BrowserWindow, ipcMain, nativeTheme, shell, type IpcMainInvokeEvent } from "electron";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { CANAIS, type AppInfo, type SystemScheme } from "../preload/api";
import { isExternalUrl, windowOptions } from "./window";

const modo = (): SystemScheme => (nativeTheme.shouldUseDarkColors ? "dark" : "light");

/** Só as janelas do app falam com o processo principal (nada de quadro de fora). */
function deJanelaNossa(e: IpcMainInvokeEvent): void {
  const janela = BrowserWindow.fromWebContents(e.sender);
  if (!janela || e.senderFrame !== janela.webContents.mainFrame) throw new Error("Origem não permitida");
}

function abrirJanela(): BrowserWindow {
  const janela = new BrowserWindow(windowOptions(join(import.meta.dirname, "../preload/index.cjs"), nativeTheme.shouldUseDarkColors));
  janela.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternalUrl(url)) void shell.openExternal(url);
    return { action: "deny" };
  });
  // a página não navega para fora do app
  janela.webContents.on("will-navigate", (e, url) => {
    if (url !== janela.webContents.getURL()) e.preventDefault();
  });
  janela.once("ready-to-show", () => janela.show());
  const dev = process.env["ELECTRON_RENDERER_URL"];
  if (dev) void janela.loadURL(dev);
  else void janela.loadFile(join(import.meta.dirname, "../renderer/index.html"));
  // prova automática: COUNTIFY_SMOKE=foto.png fotografa a janela depois de carregar e fecha o app
  const foto = process.env["COUNTIFY_SMOKE"];
  if (foto) {
    janela.webContents.once("did-finish-load", () => {
      setTimeout(() => {
        void janela.webContents.capturePage().then((img) => {
          writeFileSync(foto, img.toPNG());
          app.quit();
        });
      }, 1500);
    });
  }
  return janela;
}

ipcMain.handle(CANAIS.info, (e): AppInfo => {
  deJanelaNossa(e);
  return { version: app.getVersion(), platform: process.platform, electron: process.versions.electron };
});
ipcMain.handle(CANAIS.scheme, (e): SystemScheme => {
  deJanelaNossa(e);
  return modo();
});
nativeTheme.on("updated", () => {
  for (const j of BrowserWindow.getAllWindows()) j.webContents.send(CANAIS.schemeChanged, modo());
});

void app.whenReady().then(() => {
  abrirJanela();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) abrirJanela();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
