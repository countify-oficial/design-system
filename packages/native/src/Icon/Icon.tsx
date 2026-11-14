import { filled as tablerFilled, outline as tablerOutline, type TablerIconName } from "@countify-oficial/icons-tabler";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { iconGrid, iconSize, icons, iconSvg, type ColorRole, type IconName, type Size } from "@countify-oficial/tokens";
import type { StyleProp, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { useContentColor } from "../contentColor";

export interface IconProps {
  /** Qual ícone: um da Countify (close, plus, search, chevron-down…) ou, com qualquer outro nome, um do Tabler (home, user, chart-pie…). */
  name: IconName | TablerIconName;
  /** Desenho do Tabler: outline (traço, padrão) ou filled (cheio; sem versão cheia, fica o traço). Os da Countify têm um desenho só. */
  variant?: "outline" | "filled" | undefined;
  /** Tamanho: xs 16, sm 18, md 22, lg 28, xl 32, ou um número vindo dos tokens (appShell.tabIconSize). Padrão: md. */
  size?: Size | number | undefined;
  /** Papel de cor. Padrão: a cor do botão em volta, ou text. */
  color?: ColorRole | undefined;
  /** Nome para o leitor de tela. Sem ele, o ícone é decorativo. */
  label?: string | undefined;
  /** Preenche o desenho da Countify com a cor (a estrela cheia do Rating). */
  filled?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

const isCountify = (name: string): name is IconName => Object.hasOwn(icons, name);

// O desenho do Tabler (caixa de 24) no traço dos tokens; o Metro já empacotou o ícone, aqui ele só é lido.
function tablerSvg(name: string, variant: "outline" | "filled", color: string) {
  const cheio = variant === "filled" && Object.hasOwn(tablerFilled, name);
  const set: Partial<Record<string, () => string>> = cheio ? tablerFilled : tablerOutline;
  const html = (Object.hasOwn(set, name) ? set[name]?.() : undefined) ?? "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${cheio ? color : "none"}" stroke="${cheio ? "none" : color}" stroke-width="${iconGrid.stroke}" stroke-linecap="round" stroke-linejoin="round">${html}</svg>`;
}

/** Ícone da Countify ou do Tabler (react-native-svg), o mesmo desenho da web. */
export function Icon(props: IconProps) {
  const { name, variant = "outline", size = "md", color, label, filled, style, testID } = useComponentProps("Icon", {}, props);
  const { colors } = useCountifyTheme();
  const doBotao = useContentColor();
  const px = typeof size === "number" ? size : iconSize[size];
  const cor = color ? colors[color] : (doBotao ?? colors.text);
  return (
    <SvgXml
      xml={isCountify(name) ? iconSvg(name, cor, filled ? cor : "none") : tablerSvg(name, variant, cor)}
      width={px}
      height={px}
      {...(style === undefined ? {} : { style })}
      {...(testID === undefined ? {} : { testID })}
      {...(label
        ? { accessible: true, accessibilityRole: "image" as const, accessibilityLabel: label }
        : { accessible: false, importantForAccessibility: "no-hide-descendants" as const })}
    />
  );
}
