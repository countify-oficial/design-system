// O que o preload expõe ao renderer (window.countify). O renderer não tem Node: só estas funções passam pela ponte.

export interface AppInfo {
  version: string;
  platform: string;
  electron: string;
}

export type SystemScheme = "light" | "dark";

export interface CountifyDesktopApi {
  /** Versão do app, sistema e versão do Electron. */
  getInfo: () => Promise<AppInfo>;
  /** O modo claro/escuro do sistema agora. */
  getSystemScheme: () => Promise<SystemScheme>;
  /** Avisa quando o sistema troca de modo; devolve a função que para de ouvir. */
  onSystemSchemeChange: (ouvinte: (scheme: SystemScheme) => void) => () => void;
}

/** Os canais entre o processo principal e o preload. */
export const CANAIS = { info: "countify:info", scheme: "countify:scheme", schemeChanged: "countify:scheme-changed" } as const;

declare global {
  interface Window {
    countify: CountifyDesktopApi;
  }
}
