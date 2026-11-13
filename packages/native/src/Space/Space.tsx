import { useComponentProps } from "@countify-oficial/provider";
import { resolveSpacing, type Spacing } from "@countify-oficial/tokens";
import { View, type ViewProps } from "react-native";
import { useThemeStyle } from "../styles";

export interface SpaceProps extends Omit<ViewProps, "children"> {
  /** Altura: xs–xl ou degrau da grade de 4 (3 = 12). */
  h?: Spacing | undefined;
  /** Largura: xs–xl ou degrau da grade de 4 (3 = 12). */
  w?: Spacing | undefined;
}

/** Espaço vazio entre dois elementos (altura h, largura w). */
export function Space(props: SpaceProps) {
  const { h, w, style, ...rest } = useComponentProps("Space", {}, props);
  const doTema = useThemeStyle("Space");
  return (
    <View
      importantForAccessibility="no"
      {...rest}
      style={[{ flexShrink: 0, height: h === undefined ? undefined : resolveSpacing(h), width: w === undefined ? undefined : resolveSpacing(w) }, doTema, style]}
    />
  );
}
