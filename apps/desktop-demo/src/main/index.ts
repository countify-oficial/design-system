import { app, BrowserWindow, ipcMain, nativeTheme, type IpcMainInvokeEvent } from "electron";
import { writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { CANAIS, type AppInfo, type SystemScheme } from "../preload/api";
import { windowOptions } from "./window";

const modo = (): SystemScheme => (nativeTheme.shouldUseDarkColors ? "dark" : "light");

/** Só as janelas do app falam com o processo principal (nada de quadro de fora). */
function deJanelaNossa(e: IpcMainInvokeEvent): void {
  const janela = BrowserWindow.fromWebContents(e.sender);
  if (!janela || e.senderFrame !== janela.webContents.mainFrame) throw new Error("Origem não permitida");
}

function abrirJanela(): BrowserWindow {
  const janela = new BrowserWindow(windowOptions(join(import.meta.dirname, "../preload/index.cjs"), nativeTheme.shouldUseDarkColors));
  janela.once("ready-to-show", () => janela.show());
  const dev = process.env["ELECTRON_RENDERER_URL"];
  if (dev) void janela.loadURL(dev);
  else void janela.loadFile(join(import.meta.dirname, "../renderer/index.html"));
  // prova automática, só fora do app empacotado: COUNTIFY_SMOKE=foto.png fotografa a janela na pasta temporária
  // (só o nome do arquivo vale; nunca sobrescreve) e fecha o app
  const foto = process.env["COUNTIFY_SMOKE"];
  if (foto && !app.isPackaged) {
    const alvo = join(app.getPath("temp"), basename(foto));
    janela.webContents.once("did-finish-load", () => {
      setTimeout(() => {
        void janela.webContents.capturePage().then((img) => {
          try {
            writeFileSync(alvo, img.toPNG(), { flag: "wx" });
            console.log(alvo);
          } catch (erro) {
            console.error(erro);
          }
          app.quit();
        });
      }, 1500);
    });
  }
  return janela;
}

// Em qualquer conteúdo web que o app criar: nenhuma janela nova e nenhuma navegação para fora da página do app
app.on("web-contents-created", (_e, conteudo) => {
  conteudo.setWindowOpenHandler(() => ({ action: "deny" }));
  conteudo.on("will-frame-navigate", (e) => {
    if (e.url !== conteudo.getURL()) e.preventDefault();
  });
});

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
