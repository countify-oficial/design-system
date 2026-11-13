import { useComponentProps } from "@countify-oficial/provider";
import { resolveSpacing, zIndex as camadas, type Spacing, type zIndex } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

export interface AffixProps {
  position?: { top?: Spacing; right?: Spacing; bottom?: Spacing; left?: Spacing } | undefined;
  zIndex?: keyof typeof zIndex | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Fixa o conteúdo num lugar da tela (ponha no topo da tela: o React Native não tem portal). */
export function Affix(props: AffixProps) {
  const { position = { bottom: "lg", right: "lg" }, zIndex = "app", children, style } = useComponentProps("Affix", {}, props);
  const px = (s: Spacing | undefined) => (s === undefined ? undefined : resolveSpacing(s));
  return (
    <View pointerEvents="box-none" style={[{ position: "absolute", zIndex: camadas[zIndex], top: px(position.top), right: px(position.right), bottom: px(position.bottom), left: px(position.left) }, style]}>
      {children}
    </View>
  );
}
