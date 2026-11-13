import { useComponentProps } from "@countify-oficial/provider";
import { radius as cantos, type Size } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

export interface BackgroundImageProps {
  /** Endereço da imagem. */
  src: string;
  /** Canto. Sem ele, reto. */
  radius?: Size | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
}

/** Caixa com imagem de fundo (cobre); os filhos ficam por cima. A imagem é decorativa. */
export function BackgroundImage(props: BackgroundImageProps) {
  const { src, radius, children, style, testID } = useComponentProps("BackgroundImage", {}, props);
  // o ImageBackground do React Native está obsoleto: é uma View com a Image cobrindo o fundo
  return (
    <View testID={testID} style={[{ overflow: "hidden" }, radius && { borderRadius: cantos[radius] }, style]}>
      <Image source={{ uri: src }} resizeMode="cover" accessible={false} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}
