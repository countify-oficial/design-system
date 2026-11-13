import { useMediaQuery } from "@countify-oficial/hooks";
import { useEffect } from "react";
import { CountifyContext, useProviderValue, type CountifyProviderProps } from "./context";

/**
 * Web e Electron. Com light ou dark, grava data-cf-color-scheme no <html> (as variáveis --cf-* do
 * @countify-oficial/tokens/tokens.css seguem); com auto, tira o atributo e o CSS segue o sistema.
 */
export function CountifyProvider(props: CountifyProviderProps) {
  const escuro = useMediaQuery("(prefers-color-scheme: dark)");
  const value = useProviderValue(props, escuro ? "dark" : "light");
  const setting = value.colorSchemeSetting;
  useEffect(() => {
    const html = document.documentElement;
    if (setting === "auto") html.removeAttribute("data-cf-color-scheme");
    else html.setAttribute("data-cf-color-scheme", setting);
    return () => html.removeAttribute("data-cf-color-scheme");
  }, [setting]);
  return <CountifyContext value={value}>{props.children}</CountifyContext>;
}
