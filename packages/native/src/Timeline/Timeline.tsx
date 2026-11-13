import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, fontSize, lineHeightPx, nativeFontFamily, space, tones, type Tone } from "@countify-oficial/tokens";
import { Children, createContext, useContext, type ReactNode } from "react";
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { ContentColor } from "../contentColor";
import { useThemeStyle } from "../styles";

export interface TimelineProps {
  /** Índice do último item feito. Padrão: -1. */
  active?: number | undefined;
  /** Tom dos feitos. Padrão: accent. */
  color?: Tone | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface TimelineItemProps {
  bullet?: ReactNode;
  title?: ReactNode;
  lineVariant?: "solid" | "dashed" | undefined;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Estado = createContext<{ feito: boolean; linhaFeita: boolean; ultimo: boolean; tom: Tone }>({ feito: false, linhaFeita: false, ultimo: false, tom: "accent" });

/** Um passo da Timeline. */
export function TimelineItem(props: TimelineItemProps) {
  const { feito, linhaFeita, ultimo, tom } = useContext(Estado);
  const { bullet, title, lineVariant = "solid", children, style } = useComponentProps("TimelineItem", {}, props);
  const { colors: c } = useCountifyTheme();
  const t = tones[tom];
  const lado = space[6];
  const texto = (v: ReactNode, s: object) => (typeof v === "string" ? <RNText style={s}>{v}</RNText> : v);
  return (
    <View style={[{ flexDirection: "row", gap: space[3] }, style]}>
      <View style={{ alignItems: "center", width: lado }}>
        <ContentColor value={feito ? c.bg : c.text2}>
          <View
            style={{
              width: lado, height: lado, borderRadius: lado / 2, borderWidth: borderWidth.thick, alignItems: "center", justifyContent: "center",
              borderColor: feito ? c[t.fill] : c.borderStrong, backgroundColor: feito ? c[t.fill] : c.card,
            }}
          >
            {bullet}
          </View>
        </ContentColor>
        {!ultimo && <View style={{ flex: 1, borderLeftWidth: borderWidth.thin, borderStyle: lineVariant, borderColor: linhaFeita ? c[t.c] : c.divider }} />}
      </View>
      <View style={{ flex: 1, paddingBottom: ultimo ? 0 : space[6] }}>
        {title !== undefined && texto(title, { color: c.text, fontSize: fontSize.md, lineHeight: lineHeightPx(fontSize.md), fontFamily: nativeFontFamily[500] })}
        {children !== undefined && texto(children, { color: c.text2, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400] })}
      </View>
    </View>
  );
}

function TimelineRoot(props: TimelineProps) {
  const { active = -1, color = "accent", children, style } = useComponentProps("Timeline", {}, props);
  const tema = useThemeStyle("Timeline");
  const filhos = Children.toArray(children);
  return (
    <View accessibilityRole="list" style={[tema, style]}>
      {filhos.map((filho, i) => (
        <Estado key={i} value={{ feito: i <= active, linhaFeita: i < active, ultimo: i === filhos.length - 1, tom: color }}>{filho}</Estado>
      ))}
    </View>
  );
}

/** Linha do tempo: passos em sequência, os feitos com o marcador cheio. */
export const Timeline = Object.assign(TimelineRoot, { Item: TimelineItem });
