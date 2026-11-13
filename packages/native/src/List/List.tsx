import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, lineHeightPx, nativeFontFamily, resolveSpacing, space, type Size, type Spacing } from "@countify-oficial/tokens";
import { Children, createContext, useContext, type ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { useThemeStyle } from "../styles";

export interface ListProps {
  /** Com marcadores ou numerada. Padrão: unordered. */
  type?: "unordered" | "ordered" | undefined;
  /** Espaço entre os itens. Padrão: xs (4). */
  spacing?: Spacing | undefined;
  /** Tamanho da letra. Padrão: md (17). */
  size?: Size | undefined;
  /** Ícone no lugar do marcador, para todos os itens. */
  icon?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface ListItemProps {
  /** Ícone só deste item. */
  icon?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const DaLista = createContext<{ marcador: (i: number) => ReactNode; tamanho: Size }>({ marcador: () => "•", tamanho: "md" });
const Indice = createContext(0);

/** Um item da List. */
export function ListItem(props: ListItemProps) {
  const { marcador, tamanho } = useContext(DaLista);
  const i = useContext(Indice);
  const { icon, children, style } = useComponentProps("ListItem", {}, props);
  const { colors: c } = useCountifyTheme();
  const letra = { color: c.text, fontSize: fontSize[tamanho], lineHeight: lineHeightPx(fontSize[tamanho]), fontFamily: nativeFontFamily[400] };
  const m = icon ?? marcador(i);
  return (
    <View style={[{ flexDirection: "row", alignItems: "flex-start", gap: space[2] }, style]}>
      {typeof m === "string" ? <RNText style={[letra, { color: c.text2 }]}>{m}</RNText> : m}
      <View style={{ flex: 1 }}>{typeof children === "string" ? <RNText style={letra}>{children}</RNText> : children}</View>
    </View>
  );
}

function ListRoot(props: ListProps) {
  const { type = "unordered", spacing = "xs", size = "md", icon, children, style } = useComponentProps("List", {}, props);
  const tema = useThemeStyle("List");
  const marcador = (i: number) => icon ?? (type === "ordered" ? `${i + 1}.` : "•");
  return (
    <DaLista value={{ marcador, tamanho: size }}>
      <View accessibilityRole="list" style={[{ gap: resolveSpacing(spacing) }, tema, style]}>
        {Children.toArray(children).map((filho, i) => <Indice key={i} value={i}>{filho}</Indice>)}
      </View>
    </DaLista>
  );
}

/** Lista de texto, com marcadores, números ou ícones. */
export const List = Object.assign(ListRoot, { Item: ListItem });
