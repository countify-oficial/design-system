import { ActionIcon, Icon } from "@countify-oficial/native";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { borderWidth, calendar, fontSize, nativeFontFamily, space, state } from "@countify-oficial/tokens";
import type { ReactNode } from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useCalendar, type CalendarBaseProps, type CalendarDay, type CalendarValueProps } from "./useCalendar";

export type CalendarProps = CalendarBaseProps & CalendarValueProps & { style?: StyleProp<ViewStyle> };

/** Calendário do mês (M-Periodo): setas redondas, dia em círculo de 40; com type="range", a faixa liga as pontas. */
export function Calendar(props: CalendarProps) {
  const p = useComponentProps("Calendar", {}, props);
  const c = useCalendar(p);
  return <CalendarView c={c} range={p.type === "range"} style={p.style} />;
}

/**
 * O mês desenhado (o mesmo no Calendar e no EventCalendar). `marks` põe algo embaixo do número (os pontos dos eventos);
 * `onPress` troca o toque no dia (padrão: escolher) e `label` o nome do dia.
 */
export function CalendarView({
  c, range, style, marks, onPress = c.escolher, label = (d) => d.label,
}: {
  c: ReturnType<typeof useCalendar>;
  range: boolean;
  style?: StyleProp<ViewStyle>;
  marks?: ((d: CalendarDay) => ReactNode) | undefined;
  onPress?: ((date: Date) => void) | undefined;
  label?: ((d: CalendarDay) => string) | undefined;
}) {
  const { colors: cor } = useCountifyTheme();
  const meio = calendar.daySize / 2;
  // com marcas, o dia ganha a linha delas (8) e o vão (4) embaixo do círculo
  const altura = marks ? calendar.daySize + space[1] + space[2] : calendar.daySize;
  return (
    <View style={[{ gap: space[2] }, style]}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <ActionIcon accessibilityLabel={c.messages.previousMonth} radius="xl" disabled={!c.podeAntes} onPress={() => c.irMes(-1)}>
          <Icon name="back" size="sm" />
        </ActionIcon>
        <Text accessibilityLiveRegion="polite" style={{ color: cor.text, fontSize: fontSize.md, fontFamily: nativeFontFamily[700] }}>{c.titulo}</Text>
        <ActionIcon accessibilityLabel={c.messages.nextMonth} radius="xl" disabled={!c.podeDepois} onPress={() => c.irMes(1)}>
          <Icon name="chevron-right" size="sm" />
        </ActionIcon>
      </View>
      <View style={{ flexDirection: "row" }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {c.diasDaSemana.map((d) => (
          <Text key={d.long} style={{ flex: 1, textAlign: "center", color: cor.text2, fontSize: fontSize.xs, fontFamily: nativeFontFamily[400] }}>{d.short}</Text>
        ))}
      </View>
      <View style={{ gap: space[1] }}>
        {c.semanas.map((semana, i) => (
          <View key={i} style={{ flexDirection: "row" }}>
            {semana.map((d, j) => {
              if (!d) return <View key={`v${String(j)}`} style={{ flex: 1, height: altura }} />;
              const papel = range ? d.range : null;
              return (
                <Pressable
                  key={d.key}
                  accessibilityRole="button"
                  accessibilityLabel={label(d)}
                  accessibilityState={{ selected: d.selected || papel === "in", disabled: d.disabled }}
                  disabled={d.disabled}
                  onPress={() => onPress(d.date)}
                  style={({ pressed }) => [{ flex: 1, height: altura, alignItems: "center", justifyContent: marks ? "flex-start" : "center", gap: space[1] }, papel === "in" && { backgroundColor: cor.rangeTint }, pressed && { opacity: state.pressedOpacity }]}
                >
                  {(papel === "start" || papel === "end") && (
                    <View style={{ position: "absolute", top: 0, bottom: 0, left: papel === "start" ? "50%" : 0, right: papel === "end" ? "50%" : 0, backgroundColor: cor.rangeTint }} />
                  )}
                  <View
                    style={[
                      { width: calendar.daySize, height: calendar.daySize, borderRadius: meio, alignItems: "center", justifyContent: "center" },
                      d.today && { borderWidth: borderWidth.thick, borderColor: cor.text },
                      d.selected && { backgroundColor: cor.button, borderWidth: 0 },
                    ]}
                  >
                    <Text
                      style={{
                        color: d.selected ? cor.onButton : d.disabled ? cor.borderStrong : cor.text,
                        fontSize: fontSize.md,
                        fontFamily: nativeFontFamily[d.selected ? 700 : 400],
                        fontVariant: ["tabular-nums"],
                      }}
                    >
                      {d.date.getDate()}
                    </Text>
                  </View>
                  {marks?.(d)}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
