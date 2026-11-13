import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { iconSize, iconSvg, type ColorRole, type IconName, type Size } from "@countify-oficial/tokens";
import type { StyleProp, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { useContentColor } from "../contentColor";

export interface IconProps {
  /** Qual ícone da Countify (close, plus, search, chevron-down…). */
  name: IconName;
  /** Tamanho: xs 16, sm 18, md 22, lg 28, xl 32. Padrão: md. */
  size?: Size | undefined;
  /** Papel de cor. Padrão: a cor do botão em volta, ou text. */
  color?: ColorRole | undefined;
  /** Nome para o leitor de tela. Sem ele, o ícone é decorativo. */
  label?: string | undefined;
  /** Preenche o desenho com a cor (a estrela cheia do Rating). */
  filled?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/** Ícone da Countify (react-native-svg), o mesmo desenho da web. */
export function Icon(props: IconProps) {
  const { name, size = "md", color, label, filled, style, testID } = useComponentProps("Icon", {}, props);
  const { colors } = useCountifyTheme();
  const doBotao = useContentColor();
  const px = iconSize[size];
  const cor = color ? colors[color] : (doBotao ?? colors.text);
  return (
    <SvgXml
      xml={iconSvg(name, cor, filled ? cor : "none")}
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
