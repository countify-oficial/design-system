import { createUseClipboard } from "./clipboard";

/** web: copia com a API de área de transferência do navegador (pede página segura, https ou localhost). */
export const useClipboard = createUseClipboard((text) => {
  // fora de https (ou localhost) o navegador não expõe a área de transferência, embora o tipo diga que sempre existe
  const clipboard = typeof navigator === "undefined" ? undefined : (navigator as Partial<Navigator>).clipboard;
  if (!clipboard) return Promise.reject(new Error("Área de transferência indisponível"));
  return clipboard.writeText(text);
});
