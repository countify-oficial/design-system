import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";
import { CANAIS, type AppInfo, type CountifyDesktopApi, type SystemScheme } from "./api";

// Só funções pequenas e tipadas passam para o renderer; o ipcRenderer em si nunca é exposto.
const api: CountifyDesktopApi = {
  getInfo: () => ipcRenderer.invoke(CANAIS.info) as Promise<AppInfo>,
  getSystemScheme: () => ipcRenderer.invoke(CANAIS.scheme) as Promise<SystemScheme>,
  onSystemSchemeChange: (ouvinte) => {
    const ouvir = (_e: IpcRendererEvent, s: SystemScheme) => ouvinte(s);
    ipcRenderer.on(CANAIS.schemeChanged, ouvir);
    return () => ipcRenderer.removeListener(CANAIS.schemeChanged, ouvir);
  },
};

contextBridge.exposeInMainWorld("countify", api);
