import { Badge } from "@countify-oficial/native";
import { useComponentProps, useCountifyTheme } from "@countify-oficial/provider";
import { fontSize, nativeFontFamily, space, state, tones, touchTarget } from "@countify-oficial/tokens";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { CalendarView } from "./Calendar.native";
import { useEventCalendar, type CalendarEvent, type EventCalendarBaseProps } from "./useEventCalendar";

export type EventCalendarProps<T extends CalendarEvent = CalendarEvent> = EventCalendarBaseProps<T> & {
  /** Estilo da raiz. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Calendário de eventos (celular): o mês do Calendar com até 3 pontos nos dias que têm evento e, embaixo, a lista do
 * dia escolhido (hoje no começo), como as agendas do sistema. Tocar no dia o escolhe e chama onDayClick.
 */
export function EventCalendar<T extends CalendarEvent>(props: EventCalendarProps<T>) {
  const p = useComponentProps("EventCalendar", {}, props);
  const { onDayClick, onEventClick } = p;
  const { c, doDia, curto, rotuloDoDia, rotuloDoEvento } = useEventCalendar(p, true);
  const { colors: cor } = useCountifyTheme();
  const escolhido = c.valor[0];
  const doEscolhido = escolhido ? doDia(escolhido) : [];
  return (
    <View style={[{ gap: space[4] }, p.style]}>
      <CalendarView
        c={c}
        range={false}
        label={rotuloDoDia}
        onPress={(d) => {
          c.escolher(d);
          onDayClick?.(d);
        }}
        marks={(d) => (
          <View style={{ flexDirection: "row", gap: space[1], height: space[2] }}>
            {doDia(d.date).slice(0, 3).map((e) => (
              <View key={e.id} style={{ width: space[2], height: space[2], borderRadius: space[1], backgroundColor: cor[tones[e.color ?? "accent"].c] }} />
            ))}
          </View>
        )}
      />
      {escolhido && (
        <View>
          <Text accessibilityRole="header" style={{ color: cor.text, fontSize: fontSize.md, fontFamily: nativeFontFamily[700] }}>
            {curto(escolhido)}
          </Text>
          {doEscolhido.length === 0 ? (
            <Text style={{ color: cor.text2, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400], paddingVertical: space[3] }}>{c.messages.noEvents}</Text>
          ) : (
            doEscolhido.map((e) => (
              <Pressable
                key={e.id}
                accessibilityRole="button"
                accessibilityLabel={rotuloDoEvento(e)}
                onPress={() => onEventClick?.(e)}
                style={({ pressed }) => [{ minHeight: touchTarget, justifyContent: "center" }, pressed && { opacity: state.pressedOpacity }]}
              >
                <Badge variant="dot" color={e.color ?? "accent"}>{e.title}</Badge>
              </Pressable>
            ))
          )}
        </View>
      )}
    </View>
  );
}
