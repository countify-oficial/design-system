import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { space, tones, type Size, type Tone } from "@countify-oficial/tokens";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import { Icon } from "../Icon/Icon";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";

export interface RatingProps {
  value?: number | undefined;
  defaultValue?: number | undefined;
  onChange?: ((value: number) => void) | undefined;
  count?: number | undefined;
  readOnly?: boolean | undefined;
  size?: Size | undefined;
  /** Tom das estrelas cheias. Padrão: warn. */
  color?: Tone | undefined;
  label?: string | undefined;
  style?: StyleProp<ViewStyle>;
}

/** Nota em estrelas. No toque, cada estrela é um radio; só leitura, o leitor de tela lê "4 de 5". */
export function Rating(props: RatingProps) {
  const { value, defaultValue, onChange, count = 5, readOnly, size = "md", color = "warn", label, style } = useComponentProps("Rating", {}, props);
  const { colors: c } = useCountifyTheme();
  const [nota, setNota] = useControllableState({ value, defaultValue: defaultValue ?? 0, onChange });
  const estrelas = Array.from({ length: count }, (_, i) => i + 1);
  const estrela = (n: number) => (
    <ContentColor value={n <= nota ? c[tones[color].fill] : c.borderStrong}>
      <Icon name="star" size={size} filled={n <= nota} />
    </ContentColor>
  );
  if (readOnly) {
    return (
      <View accessible accessibilityRole="image" accessibilityLabel={`${label ? `${label}: ` : ""}${nota} de ${count}`} style={[{ flexDirection: "row", gap: space[1] }, style]}>
        {estrelas.map((n) => <View key={n}>{estrela(n)}</View>)}
      </View>
    );
  }
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={[{ flexDirection: "row" }, style]}>
      {estrelas.map((n) => (
        <UnstyledButton key={n} accessibilityRole="radio" accessibilityLabel={`${n} de ${count}`} accessibilityState={{ checked: nota === n }} onPress={() => setNota(n)} style={{ alignItems: "center", justifyContent: "center" }}>
          {estrela(n)}
        </UnstyledButton>
      ))}
    </View>
  );
}
