import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, space } from "@countify-oficial/tokens";
import { useState, type ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface SpoilerProps {
  /** Altura mostrada fechado. */
  maxHeight: number;
  showLabel?: string | undefined;
  hideLabel?: string | undefined;
  expanded?: boolean | undefined;
  defaultExpanded?: boolean | undefined;
  onExpandedChange?: ((expanded: boolean) => void) | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Corta um texto longo numa altura e oferece "Mostrar mais", se ele passar da altura. */
export function Spoiler(props: SpoilerProps) {
  const messages = useMessages();
  const { maxHeight, showLabel = messages.showMore, hideLabel = messages.showLess, expanded, defaultExpanded, onExpandedChange, children, style } =
    useComponentProps("Spoiler", {}, props);
  const { colors: c } = useCountifyTheme();
  const [aberto, setAberto] = useControllableState({ value: expanded, defaultValue: defaultExpanded ?? false, onChange: onExpandedChange });
  const [altura, setAltura] = useState(0);
  return (
    <View style={style}>
      <View style={[{ overflow: "hidden" }, !aberto && { maxHeight }]}>
        <View onLayout={(e) => setAltura(e.nativeEvent.layout.height)}>{children}</View>
      </View>
      {altura > maxHeight && (
        <UnstyledButton accessibilityState={{ expanded: aberto }} onPress={() => setAberto(!aberto)} style={{ alignSelf: "flex-start", justifyContent: "center", marginTop: space[1] }}>
          <RNText style={{ color: c.accent, fontSize: fontSize.sm, fontFamily: nativeFontFamily[500] }}>{aberto ? hideLabel : showLabel}</RNText>
        </UnstyledButton>
      )}
    </View>
  );
}
