import { useControllableState } from "@countify-oficial/hooks";
import { useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { useState } from "react";
import { addDays, addMonths, dayKey, dayLabel, initialDay, monthGrid, monthLabel, nextRange, outOfBounds, rangeRole, sameDay, startOfMonth, weekdays, type DatesRange, type DateValue } from "./utils";

/** O que serve aos dois modos: o mês à vista, os limites e o começo da semana. */
export interface CalendarBaseProps {
  /** O mês à vista (controlado): qualquer dia dele. */
  month?: Date | undefined;
  defaultMonth?: Date | undefined;
  onMonthChange?: ((month: Date) => void) | undefined;
  /** Antes disso não se escolhe (e a seta do mês anterior para). */
  minDate?: Date | undefined;
  /** Depois disso não se escolhe; o mockup apaga os dias futuros (maxDate = hoje). */
  maxDate?: Date | undefined;
  /** Outros dias que não se escolhem. */
  excludeDate?: ((date: Date) => boolean) | undefined;
  /** 0 = domingo (padrão, como no mockup), 1 = segunda. */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
}

export type CalendarValueProps =
  | { type?: "default" | undefined; value?: DateValue | undefined; defaultValue?: DateValue | undefined; onChange?: ((value: DateValue) => void) | undefined }
  | { type: "range"; value?: DatesRange | undefined; defaultValue?: DatesRange | undefined; onChange?: ((value: DatesRange) => void) | undefined };

export interface CalendarDay {
  date: Date;
  /** "2026-11-13", para achar o dia na tela. */
  key: string;
  today: boolean;
  disabled: boolean;
  selected: boolean;
  range: "start" | "end" | "single" | "in" | null;
  label: string;
}

const chave = (d: Date) => `${String(d.getFullYear())}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const toRange = (v: DateValue | DatesRange | undefined): DatesRange => (Array.isArray(v) ? v : [v ?? null, null]);

/** O estado do calendário: o mês, os dias com o papel de cada um, escolher e andar pelo teclado. */
export function useCalendar(props: CalendarBaseProps & CalendarValueProps) {
  const { locale } = useCountifyTheme();
  const messages = useMessages();
  const { month, defaultMonth, onMonthChange, minDate, maxDate, excludeDate, firstDayOfWeek = 0 } = props;
  const periodo = props.type === "range";
  const [valor, setValor] = useControllableState<DatesRange>({
    value: props.value === undefined ? undefined : toRange(props.value),
    defaultValue: toRange(props.defaultValue),
    onChange: (r) => {
      if (props.type === "range") props.onChange?.(r);
      else props.onChange?.(r[0]);
    },
  });
  const inicial = valor[0] ?? initialDay(maxDate);
  const [mes, setMes] = useControllableState<Date>({ value: month && startOfMonth(month), defaultValue: startOfMonth(defaultMonth ?? inicial), onChange: onMonthChange });
  const [foco, setFoco] = useState<Date>(valor[0] ?? inicial);
  const hoje = new Date();
  const bloqueado = (d: Date) => outOfBounds(d, minDate, maxDate) || !!excludeDate?.(d);
  const semanas: (CalendarDay | null)[][] = monthGrid(mes.getFullYear(), mes.getMonth(), firstDayOfWeek).map((s) =>
    s.map((d) => {
      if (!d) return null;
      const papel = periodo ? rangeRole(d, valor) : sameDay(d, valor[0]) ? "single" : null;
      const eHoje = sameDay(d, hoje);
      return {
        date: d,
        key: chave(d),
        today: eHoje,
        disabled: bloqueado(d),
        selected: papel !== null && papel !== "in",
        range: papel,
        label: eHoje ? `${dayLabel(d, locale)}, ${messages.today}` : dayLabel(d, locale),
      };
    }),
  );
  const irMes = (n: number) => {
    const novo = addMonths(mes, n);
    setMes(startOfMonth(novo));
    setFoco(new Date(novo.getFullYear(), novo.getMonth(), Math.min(foco.getDate(), new Date(novo.getFullYear(), novo.getMonth() + 1, 0).getDate())));
  };
  const escolher = (d: Date) => {
    if (bloqueado(d)) return;
    setFoco(d);
    setValor(periodo ? nextRange(valor, d) : [d, null]);
  };
  /** Move o foco (setas, Home/End, PageUp/PageDown); troca o mês se sair dele. Devolve se tratou a tecla. */
  const teclar = (tecla: string, shift: boolean): boolean => {
    const dia = (foco.getDay() - firstDayOfWeek + 7) % 7;
    const destinos: Record<string, () => Date> = {
      ArrowLeft: () => addDays(foco, -1),
      ArrowRight: () => addDays(foco, 1),
      ArrowUp: () => addDays(foco, -7),
      ArrowDown: () => addDays(foco, 7),
      Home: () => addDays(foco, -dia),
      End: () => addDays(foco, 6 - dia),
      PageUp: () => addMonths(foco, shift ? -12 : -1),
      PageDown: () => addMonths(foco, shift ? 12 : 1),
    };
    const destino = destinos[tecla];
    if (destino) {
      let d = destino();
      if (minDate && dayKey(d) < dayKey(minDate)) d = minDate;
      if (maxDate && dayKey(d) > dayKey(maxDate)) d = maxDate;
      setFoco(d);
      if (d.getMonth() !== mes.getMonth() || d.getFullYear() !== mes.getFullYear()) setMes(startOfMonth(d));
      return true;
    }
    if (tecla === "Enter" || tecla === " ") {
      escolher(foco);
      return true;
    }
    return false;
  };
  const podeAntes = !minDate || startOfMonth(mes) > startOfMonth(minDate);
  const podeDepois = !maxDate || addMonths(startOfMonth(mes), 1) <= maxDate;
  // o dia que fica no Tab: o foco, se está neste mês; senão o primeiro escolhível
  const doMes = semanas.flat().filter((d): d is CalendarDay => d !== null);
  const focoNoMes = doMes.find((d) => sameDay(d.date, foco) && !d.disabled) ?? doMes.find((d) => d.selected && !d.disabled) ?? doMes.find((d) => !d.disabled);
  return {
    valor,
    setValor,
    mes,
    titulo: monthLabel(mes, locale),
    diasDaSemana: weekdays(locale, firstDayOfWeek),
    semanas,
    focoKey: focoNoMes?.key ?? null,
    escolher,
    teclar,
    irMes,
    podeAntes,
    podeDepois,
    messages,
    locale,
  };
}
