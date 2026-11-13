import { useComponentProps } from "@countify-oficial/provider";
import { radius as cantos, type Size } from "@countify-oficial/tokens";
import { useState } from "react";
import { Image as RNImage, type ImageProps as RNImageProps, type ImageStyle, type StyleProp } from "react-native";

export interface ImageProps extends Omit<RNImageProps, "source" | "alt"> {
  /** Endereço da imagem. */
  src: string;
  /** Texto para o leitor de tela; "" se for só decoração. */
  alt: string;
  /** Canto. Sem ele, reto. */
  radius?: Size | undefined;
  /** Como cobre a caixa. Padrão: cover. */
  fit?: RNImageProps["resizeMode"];
  /** Imagem mostrada se a principal não carregar. */
  fallbackSrc?: string | undefined;
  style?: StyleProp<ImageStyle>;
}

/** Imagem com canto da identidade e reserva se não carregar. */
export function Image(props: ImageProps) {
  const { src, alt, radius, fit = "cover", fallbackSrc, style, onError, ...rest } = useComponentProps("Image", {}, props);
  const [falhou, setFalhou] = useState<string | undefined>(undefined);
  const usar = fallbackSrc && falhou === src ? fallbackSrc : src;
  return (
    <RNImage
      accessible={alt !== ""}
      accessibilityLabel={alt || undefined}
      accessibilityRole={alt ? "image" : undefined}
      resizeMode={fit}
      {...rest}
      source={{ uri: usar }}
      onError={(e) => {
        setFalhou(src);
        onError?.(e);
      }}
      style={[radius && { borderRadius: cantos[radius] }, style]}
    />
  );
}
