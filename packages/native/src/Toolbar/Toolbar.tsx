import { useComponentProps } from "@countify-oficial/provider";
import { space } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

export interface ToolbarProps {
  /** O nome da barra para o leitor de tela. */
  accessibilityLabel: string;
  orientation?: "horizontal" | "vertical" | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Barra de botões (role toolbar), separados por 8. */
export function Toolbar(props: ToolbarProps) {
  const { accessibilityLabel, orientation = "horizontal", children, style } = useComponentProps("Toolbar", {}, props);
  return (
    <View
      accessibilityRole="toolbar"
      accessibilityLabel={accessibilityLabel}
      style={[{ flexDirection: orientation === "horizontal" ? "row" : "column", flexWrap: "wrap", alignItems: orientation === "horizontal" ? "center" : "stretch", gap: space[2] }, style]}
    >
      {children}
    </View>
  );
}
