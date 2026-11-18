import type { Tone } from "@countify-oficial/tokens";
import { useMemo } from "react";
import { useCalendar, type CalendarBaseProps, type CalendarDay } from "./useCalendar";
import { dayKey, dayLabel } from "./utils";

/** Um evento do calendário: cai num dia, com título e tom. */
export interface CalendarEvent {
  /** Identificador único do evento (a chave na lista). */
  id: string | number;
  /** O dia do evento (data local); a hora, se houver, não muda o dia em que aparece. */
  date: Date;
  /** O texto do chip e o começo do nome para o leitor de tela ("Inventário Lume Orla"). */
  title: string;
  /** Tom do chip (e do ponto no celular): gray, accent, up, down ou warn. Padrão: accent. */
  color?: Tone | undefined;
}

/** O que serve às duas plataformas: os eventos, os cliques e o mês (o mesmo do Calendar). */
export interface EventCalendarBaseProps<T extends CalendarEvent = CalendarEvent> extends CalendarBaseProps {
  /** Os eventos; os do mesmo dia aparecem na ordem em que chegam. */
  events?: readonly T[] | undefined;
  /** Clique (ou Enter) num evento: o app abre o detalhe. Recebe o evento como veio em `events`. */
  onEventClick?: ((event: T) => void) | undefined;
  /** Clique (ou Enter) num dia: o app cria um evento ou mostra o dia. No celular, tocar no dia também o escolhe. */
  onDayClick?: ((date: Date) => void) | undefined;
  /**
   * Só na web: quantas linhas de chip cada dia mostra, contando o "+N mais" (com mais eventos que isso, aparecem os
   * primeiros e o "+N mais"). Padrão: 3. No celular, o dia mostra até 3 pontos e a lista embaixo traz todos.
   */
  maxEventsPerDay?: number | undefined;
}

/** O calendário (useCalendar) com os eventos por dia e os nomes para o leitor de tela. */
export function useEventCalendar<T extends CalendarEvent>(props: EventCalendarBaseProps<T>, selecionavel: boolean) {
  // na web nenhum dia fica escolhido (value null); no celular o dia escolhido é o da lista, hoje no começo
  const c = useCalendar(selecionavel ? { ...props, defaultValue: new Date() } : { ...props, value: null });
  const { events } = props;
  const porDia = useMemo(() => {
    const m = new Map<number, T[]>();
    for (const e of events ?? []) {
      const k = dayKey(e.date);
      m.set(k, [...(m.get(k) ?? []), e]);
    }
    return m;
  }, [events]);
  const doDia = (d: Date): T[] => porDia.get(dayKey(d)) ?? [];
  return {
    c,
    doDia,
    /** "12 de novembro": título da lista do dia e fim do nome do "+N mais". */
    curto: (d: Date) => new Intl.DateTimeFormat(c.locale, { day: "numeric", month: "long" }).format(d),
    /** "quinta-feira, 12 de novembro de 2026, 2 eventos". */
    rotuloDoDia: (d: CalendarDay) => {
      const n = doDia(d.date).length;
      return n ? `${d.label}, ${c.messages.eventCount(n)}` : d.label;
    },
    /** "Inventário Lume Orla, quinta-feira, 12 de novembro de 2026". */
    rotuloDoEvento: (e: T) => `${e.title}, ${dayLabel(e.date, c.locale)}`,
  };
}
