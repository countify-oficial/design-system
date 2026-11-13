import { colors, type ColorScheme, type SchemeColors } from "@countify-oficial/tokens";
import { useControllableState } from "@countify-oficial/hooks";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { defaultMessages, type CountifyMessages } from "./messages";
import { defaultTheme, mergeTheme, type ComponentTheme, type CountifyTheme, type ThemeOverride } from "./theme";

/** "auto" segue o aparelho. */
export type ColorSchemeSetting = ColorScheme | "auto";

export interface CountifyContextValue {
  theme: CountifyTheme;
  /** o modo em uso agora (com "auto", o do aparelho) */
  colorScheme: ColorScheme;
  /** o que foi escolhido: light, dark ou auto */
  colorSchemeSetting: ColorSchemeSetting;
  setColorScheme: (setting: ColorSchemeSetting) => void;
  /** as cores por papel do modo em uso */
  colors: SchemeColors;
  messages: CountifyMessages;
  /** Idioma e região para números e datas (BCP 47). Padrão: pt-BR. */
  locale: string;
}

export interface CountifyProviderProps {
  theme?: ThemeOverride | undefined;
  /** modo controlado; sem ele, o provider guarda o modo (começa em defaultColorScheme) */
  colorScheme?: ColorSchemeSetting | undefined;
  defaultColorScheme?: ColorSchemeSetting | undefined;
  onColorSchemeChange?: ((setting: ColorSchemeSetting) => void) | undefined;
  /** troca os textos padrão (i18n) */
  messages?: Partial<CountifyMessages> | undefined;
  /** Idioma e região para números e datas (BCP 47). Padrão: pt-BR. */
  locale?: string | undefined;
  children?: ReactNode;
}

// sem provider, os componentes ainda funcionam: modo claro, tema e textos padrão
export const CountifyContext = createContext<CountifyContextValue>({
  theme: defaultTheme,
  colorScheme: "light",
  colorSchemeSetting: "auto",
  setColorScheme: () => undefined,
  colors: colors.light,
  messages: defaultMessages,
  locale: "pt-BR",
});

/** O valor do contexto; cada plataforma diz qual é o modo do aparelho. */
export function useProviderValue(props: CountifyProviderProps, systemScheme: ColorScheme): CountifyContextValue {
  const { theme: override, messages: textos, locale = "pt-BR" } = props;
  const [setting, setColorScheme] = useControllableState<ColorSchemeSetting>({
    value: props.colorScheme,
    defaultValue: props.defaultColorScheme ?? "auto",
    onChange: props.onColorSchemeChange,
  });
  const colorScheme = setting === "auto" ? systemScheme : setting;
  const theme = useMemo(() => mergeTheme(defaultTheme, override), [override]);
  const messages = useMemo(() => ({ ...defaultMessages, ...textos }), [textos]);
  return useMemo(
    () => ({ theme, colorScheme, colorSchemeSetting: setting, setColorScheme, colors: colors[colorScheme], messages, locale }),
    [theme, colorScheme, setting, setColorScheme, messages, locale],
  );
}

/** Tema, modo em uso, cores do modo e textos. */
export const useCountifyTheme = (): CountifyContextValue => useContext(CountifyContext);

/** Os textos (i18n) do provider. */
export const useMessages = (): CountifyMessages => useContext(CountifyContext).messages;

/** Os ajustes do tema para um componente (classNames e styles por parte). */
export function useComponentTheme(name: string): ComponentTheme {
  return useContext(CountifyContext).theme.components[name] ?? {};
}

/** Props finais do componente: padrão do componente < defaultProps do tema < props passadas (undefined não conta). */
export function useComponentProps<P extends object>(name: string, defaults: Partial<P>, props: P): P {
  const doTema = useComponentTheme(name).defaultProps as Partial<P> | undefined;
  const passadas = Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined));
  return { ...defaults, ...doTema, ...passadas } as P;
}
