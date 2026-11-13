/**
 * Ajustes de um componente no tema (como no Mantine: theme.components.Button).
 * classNames vale só na web; styles é CSSProperties na web e StyleProp no React Native, por parte interna.
 */
export interface ComponentTheme<P extends object = Record<string, unknown>> {
  defaultProps?: Partial<P>;
  classNames?: Partial<Record<string, string>>;
  styles?: Partial<Record<string, unknown>>;
}

export interface CountifyTheme {
  /** ajustes por componente, pelo nome do componente */
  components: Record<string, ComponentTheme>;
}

/** O que o app passa ao CountifyProvider: só o que muda. Cores e medidas vêm do @countify-oficial/tokens e não mudam. */
export interface ThemeOverride {
  components?: Record<string, ComponentTheme>;
}

export const defaultTheme: CountifyTheme = { components: {} };

/** Ajuda a tipar o tema do app. */
export const createTheme = (theme: ThemeOverride): ThemeOverride => theme;

/** Junta o ajuste ao tema, componente por componente e parte por parte. */
export function mergeTheme(base: CountifyTheme, override?: ThemeOverride): CountifyTheme {
  if (!override?.components) return base;
  const components = { ...base.components };
  for (const [nome, ajuste] of Object.entries(override.components)) {
    const antes = components[nome] ?? {};
    components[nome] = {
      defaultProps: { ...antes.defaultProps, ...ajuste.defaultProps },
      classNames: { ...antes.classNames, ...ajuste.classNames },
      styles: { ...antes.styles, ...ajuste.styles },
    };
  }
  return { ...base, components };
}
