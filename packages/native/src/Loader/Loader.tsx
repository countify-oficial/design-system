import { useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import type { ColorRole, Size } from "@countify-oficial/tokens";
import { ActivityIndicator, type StyleProp, type ViewStyle } from "react-native";
import { useContentColor } from "../contentColor";

export interface LoaderProps {
  /** xs, sm e md: o girador pequeno do sistema; lg e xl: o grande. Padrão: md. */
  size?: Size | undefined;
  /** Papel de cor. Padrão: a cor do botão em volta, ou accent. */
  color?: ColorRole | undefined;
  /** O que o leitor de tela anuncia. Padrão: o texto "Carregando" do provider. false: decorativo. */
  label?: string | false | undefined;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/** Girador do sistema (ActivityIndicator). Para o carregamento de uma tela, a Countify usa Skeleton. */
export function Loader(props: LoaderProps) {
  const messages = useMessages();
  const { size = "md", color, label = messages.loading, style, testID } = useComponentProps("Loader", {}, props);
  const { colors } = useCountifyTheme();
  const doBotao = useContentColor();
  return (
    <ActivityIndicator
      size={size === "lg" || size === "xl" ? "large" : "small"}
      color={color ? colors[color] : (doBotao ?? colors.accent)}
      style={style}
      testID={testID}
      accessibilityLabel={label === false ? undefined : label}
      importantForAccessibility={label === false ? "no-hide-descendants" : "yes"}
    />
  );
}
