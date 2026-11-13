import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, controlHeight, fontSize, nativeFontFamily, space, tones, type Tone } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { useThemeStyle } from "../styles";

export interface DataListProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface DataListItemProps {
  label: ReactNode;
  value?: ReactNode;
  /** Tom do valor. Sem ele, a cor do texto. */
  color?: Tone | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Um par termo–valor. */
export function DataListItem(props: DataListItemProps) {
  const { label, value, color, children, style } = useComponentProps("DataListItem", {}, props);
  const { colors: c } = useCountifyTheme();
  const v = value ?? children;
  return (
    <View
      accessible
      style={[
        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3], minHeight: controlHeight.input.md, borderTopWidth: borderWidth.thin, borderColor: c.divider },
        style,
      ]}
    >
      {typeof label === "string" ? <RNText style={{ color: c.text2, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400] }}>{label}</RNText> : label}
      {typeof v === "string" || typeof v === "number" ? (
        <RNText style={{ color: color ? c[tones[color].c] : c.text, fontSize: fontSize.md, fontFamily: nativeFontFamily[500], fontVariant: ["tabular-nums"], textAlign: "right" }}>{v}</RNText>
      ) : (
        v
      )}
    </View>
  );
}

function DataListRoot(props: DataListProps) {
  const { children, style } = useComponentProps("DataList", {}, props);
  const tema = useThemeStyle("DataList");
  return <View style={[tema, style]}>{children}</View>;
}

/** Pares de dados: termo à esquerda, valor à direita, linha de 48. */
export const DataList = Object.assign(DataListRoot, { Item: DataListItem });
