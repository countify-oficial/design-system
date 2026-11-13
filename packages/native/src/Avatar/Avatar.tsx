import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { avatarSize, fontSize, nativeFontFamily, tones, type Size, type Tone } from "@countify-oficial/tokens";
import { useState, type ReactNode } from "react";
import { Image, Text as RNText, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import { Icon } from "../Icon/Icon";
import { useThemeStyle } from "../styles";

export interface AvatarProps extends Omit<ViewProps, "children"> {
  /** Foto (uri). Se não carregar, mostra as iniciais. */
  src?: string | undefined;
  /** Nome da pessoa: vira as iniciais e o nome para o leitor de tela. */
  name?: string | undefined;
  /** Lado: xs 24, sm 32, md 40, lg 48, xl 64. Padrão: md. */
  size?: Size | undefined;
  /** Tom das iniciais. Padrão: accent. */
  color?: Tone | undefined;
  /** Conteúdo próprio no lugar das iniciais. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** "Ana Souza" → "AS"; um nome só → as duas primeiras letras. */
export function initials(name: string): string {
  const partes = name.trim().split(/\s+/).filter(Boolean);
  const [primeira = "", ultima] = [partes[0], partes.length > 1 ? partes.at(-1) : undefined];
  return (ultima ? (primeira[0] ?? "") + (ultima[0] ?? "") : primeira.slice(0, 2)).toUpperCase();
}

const letra: Record<Size, Size> = { xs: "xs", sm: "xs", md: "sm", lg: "sm", xl: "lg" };

/** Foto ou iniciais da pessoa, num círculo. */
export function Avatar(props: AvatarProps) {
  const { src, name, size = "md", color = "accent", children, style, ...rest } = useComponentProps("Avatar", {}, props);
  const { colors: c } = useCountifyTheme();
  const tema = useThemeStyle("Avatar");
  const [falhou, setFalhou] = useState<string | undefined>(undefined);
  const tom = tones[color];
  const lado = avatarSize[size];
  const foto = src !== undefined && falhou !== src;
  return (
    <ContentColor value={c[tom.c]}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={name}
        {...rest}
        style={[{ width: lado, height: lado, borderRadius: lado / 2, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: c[tom.tint] }, tema, style]}
      >
        {foto ? (
          <Image source={{ uri: src }} onError={() => setFalhou(src)} style={{ width: lado, height: lado }} />
        ) : (
          (children ??
          (name ? (
            <RNText style={{ color: c[tom.c], fontSize: fontSize[letra[size]], fontFamily: nativeFontFamily[700] }}>{initials(name)}</RNText>
          ) : (
            <Icon name="person" size={size === "xl" ? "lg" : "sm"} />
          )))
        )}
      </View>
    </ContentColor>
  );
}
