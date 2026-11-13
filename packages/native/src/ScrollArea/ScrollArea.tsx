import { useComponentProps } from "@countify-oficial/provider";
import { ScrollView, type ScrollViewProps } from "react-native";

export interface ScrollAreaProps extends Omit<ScrollViewProps, "horizontal"> {
  /** auto e always mostram a barra; never esconde. Padrão: auto. */
  type?: "auto" | "always" | "never" | undefined;
  /** Para onde rola. Padrão: y. */
  scrollbars?: "x" | "y" | undefined;
  onScrollPositionChange?: ((position: { x: number; y: number }) => void) | undefined;
}

/** Área que rola (ScrollView). A altura vem do style. */
export function ScrollArea(props: ScrollAreaProps) {
  const { type = "auto", scrollbars = "y", onScrollPositionChange, onScroll, ...rest } = useComponentProps("ScrollArea", {}, props);
  const barra = type !== "never";
  return (
    <ScrollView
      horizontal={scrollbars === "x"}
      showsVerticalScrollIndicator={barra}
      showsHorizontalScrollIndicator={barra}
      persistentScrollbar={type === "always"}
      scrollEventThrottle={16}
      onScroll={(e) => {
        onScroll?.(e);
        onScrollPositionChange?.({ x: e.nativeEvent.contentOffset.x, y: e.nativeEvent.contentOffset.y });
      }}
      {...rest}
    />
  );
}
