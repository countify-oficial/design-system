import { useComponentProps } from "@countify-oficial/provider";
import { Linking, type GestureResponderEvent } from "react-native";
import { Text, type TextProps } from "../Text/Text";

export type AnchorProps = TextProps & {
  /** Endereço aberto pelo sistema (Linking) se não houver onPress. */
  href?: string | undefined;
  onPress?: ((e: GestureResponderEvent) => void) | undefined;
  /** Sublinhado: sempre ou nunca (não há hover no toque). Padrão: never. */
  underline?: "always" | "never" | "hover" | undefined;
};

/** Link no texto, na cor de destaque. Dentro de outro Text, herda a letra dele. */
export function Anchor(props: AnchorProps) {
  const { href, onPress, underline = "never", style, ...rest } = useComponentProps("Anchor", {}, props);
  const abrir = (e: GestureResponderEvent) => {
    if (onPress) onPress(e);
    else if (href) void Linking.openURL(href);
  };
  return (
    <Text
      color="accent"
      accessibilityRole="link"
      {...(rest)}
      onPress={abrir}
      style={[underline === "always" && { textDecorationLine: "underline" }, style]}
    />
  );
}
