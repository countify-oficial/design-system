import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, lineHeightPx, nativeFontFamily, space } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import { useThemeStyle } from "../styles";

export interface EmptyStateProps {
  /** Ícone acima do título; recebe a cor de texto 2. */
  icon?: ReactNode;
  /** O que falta ("Nenhuma análise salva"). */
  title: ReactNode;
  description?: ReactNode;
  /** A ação ("+ Nova análise"). */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/** Estado vazio: ocupa o lugar do conteúdo, diz o que falta e oferece a ação. */
export function EmptyState(props: EmptyStateProps) {
  const { icon, title, description, children, style, testID } = useComponentProps("EmptyState", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("EmptyState");
  const texto = (conteudo: ReactNode, cor: string, tamanho: number, peso: 400 | 500) =>
    typeof conteudo === "string" ? (
      <RNText style={{ color: cor, fontSize: tamanho, lineHeight: lineHeightPx(tamanho), fontFamily: nativeFontFamily[peso], textAlign: "center" }}>{conteudo}</RNText>
    ) : (
      conteudo
    );
  return (
    <View testID={testID} style={[{ alignItems: "center", gap: space[2], paddingVertical: space[8], paddingHorizontal: space[4] }, tema, style]}>
      {icon !== undefined && <ContentColor value={c.text2}>{icon}</ContentColor>}
      {texto(title, c.text, fontSize.md, 500)}
      {description !== undefined && texto(description, c.text2, fontSize.sm, 400)}
      {children !== undefined && <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: space[3], marginTop: space[2] }}>{children}</View>}
    </View>
  );
}
