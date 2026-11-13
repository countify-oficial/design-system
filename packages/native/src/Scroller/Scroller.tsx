import { useComponentProps } from "@countify-oficial/provider";
import { space } from "@countify-oficial/tokens";
import { ScrollView, type ScrollViewProps } from "react-native";

export type ScrollerProps = Omit<ScrollViewProps, "horizontal">;

/** Fileira que rola para o lado com o dedo (no celular, sem as setas da web). */
export function Scroller(props: ScrollerProps) {
  const { contentContainerStyle, ...rest } = useComponentProps("Scroller", {}, props);
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[{ gap: space[2] }, contentContainerStyle]} {...rest} />;
}
