// O que o React Native precisa em formato próprio: família por peso (o Android perde a família com fontWeight),
// altura de linha em px e a sombra em props de sombra. O resto (cores, tamanhos) é o mesmo objeto da web.
import { colors, palette, primaryColor, primaryShade, type ColorScheme } from "./colors.js";
import {
  avatarSize, breakpoints, controlFontSize, controlHeight, controlPaddingX, duration, fontSize, gutter, headings, iconSize,
  appShell, calendar, compactRowHeight, dialogWidth, marqueeSpeed, lineHeight, listRowHeight, overlineTracking, loaderStroke, radius, raisedShadow, ringProgress, sheetHandle, sidePanelWidth, skeletonStat, switchSize, space, spacing, state, borderWidth, touchTarget, transition, zIndex,
  type FontWeight,
} from "./scales.js";

/** Nomes do @expo-google-fonts/roboto e do @expo-google-fonts/roboto-mono (o app carrega com useFonts). */
export const nativeFontFamily = { 400: "Roboto_400Regular", 500: "Roboto_500Medium", 700: "Roboto_700Bold" } as const satisfies Record<FontWeight, string>;
export const nativeMonoFontFamily = { 400: "RobotoMono_400Regular", 500: "RobotoMono_500Medium" } as const;

/** Altura de linha em px, como o React Native pede. */
export const lineHeightPx = (size: number, ratio: number = lineHeight): number => Math.round(size * ratio);

export interface NativeShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}
/** A sombra elevada (lg e xl) em props do React Native. Raio = metade do desfoque do CSS; elevation do Android = deslocamento. */
export function nativeRaisedShadow(scheme: ColorScheme): NativeShadow {
  const m = /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/.exec(raisedShadow.color[scheme]);
  if (!m) throw new Error(`Cor de sombra inválida: ${raisedShadow.color[scheme]}`);
  const hex = "#" + [m[1], m[2], m[3]].map((v) => Number(v).toString(16).padStart(2, "0")).join("").toUpperCase();
  return {
    shadowColor: hex,
    shadowOffset: { width: 0, height: raisedShadow.offsetY },
    shadowOpacity: Number(m[4]),
    shadowRadius: raisedShadow.blur / 2,
    elevation: raisedShadow.offsetY,
  };
}

/** Tudo num objeto, para o StyleSheet do @countify-oficial/native. */
export const nativeTokens = {
  colors,
  palette,
  primaryColor,
  primaryShade,
  fontFamily: nativeFontFamily,
  monoFontFamily: nativeMonoFontFamily,
  fontSize,
  lineHeight,
  headings,
  space,
  spacing,
  gutter,
  radius,
  touchTarget,
  controlHeight,
  controlFontSize,
  controlPaddingX,
  iconSize,
  avatarSize,
  listRowHeight,
  compactRowHeight,
  overlineTracking,
  shadow: { light: nativeRaisedShadow("light"), dark: nativeRaisedShadow("dark") },
  zIndex,
  duration,
  transition,
  state,
  borderWidth,
  loaderStroke,
  ringProgress,
  skeletonStat,
  switchSize,
  dialogWidth,
  sheetHandle,
  sidePanelWidth,
  appShell,
  calendar,
  marqueeSpeed,
  breakpoints,
} as const;
