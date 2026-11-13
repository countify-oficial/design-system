import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, controlHeight, gutter, nativeRaisedShadow, radius, space, zIndex } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { Transition } from "../Transition/Transition";

export interface ActionBarProps {
  opened: boolean;
  /** Nome da barra para o leitor de tela. */
  accessibilityLabel: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Barra de ações que sobe do pé da tela quando há itens escolhidos. */
export function ActionBar(props: ActionBarProps) {
  const { opened, accessibilityLabel, children, style } = useComponentProps("ActionBar", {}, props);
  const { colors: c, colorScheme } = useCountifyTheme();
  return (
    <Transition mounted={opened} transition="slide-up" style={{ position: "absolute", zIndex: zIndex.app, left: gutter.mobile, right: gutter.mobile, bottom: space[6] }}>
      <View
        accessibilityRole="toolbar"
        accessibilityLabel={accessibilityLabel}
        style={[
          { flexDirection: "row", alignItems: "center", gap: space[2], minHeight: controlHeight.button.md, paddingVertical: space[1], paddingLeft: space[4], paddingRight: space[2], borderRadius: radius.md, backgroundColor: c.card, borderWidth: borderWidth.thin, borderColor: c.divider },
          nativeRaisedShadow(colorScheme),
          style,
        ]}
      >
        {children}
      </View>
    </Transition>
  );
}
