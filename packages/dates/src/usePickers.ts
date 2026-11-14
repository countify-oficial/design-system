// O estado dos campos de data, igual na web e no celular: só o desenho fica em Pickers.tsx e Pickers.native.tsx.
import { useControllableState } from "@countify-oficial/hooks";
import { useState } from "react";
import { toRange, type CalendarBaseProps, type CalendarValueProps } from "./useCalendar";
import { formatDate, formatTime, initialDay, outOfBounds, parseDate, parseTime, sameDay, startOfMonth, type DatesRange, type DateValue } from "./utils";

interface ValorDeData {
  value?: DateValue | undefined;
  defaultValue?: DateValue | undefined;
  onChange?: ((value: DateValue) => void) | undefined;
}

/** DatePicker: o valor, o rascunho da folha (período ou atalhos só valem no "Aplicar") e o mês à vista. */
export function useDatePickerState(p: CalendarBaseProps & CalendarValueProps & { presets?: readonly unknown[] | undefined }) {
  const periodo = p.type === "range";
  const [valor, setValor] = useControllableState<DatesRange>({
    value: p.value === undefined ? undefined : toRange(p.value),
    defaultValue: toRange(p.defaultValue),
    onChange: (r) => {
      if (p.type === "range") p.onChange?.(r);
      else p.onChange?.(r[0]);
    },
  });
  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState<DatesRange>(valor);
  const [mes, setMes] = useState(() => startOfMonth(valor[0] ?? initialDay(p.maxDate)));
  return {
    periodo,
    valor,
    aberto,
    rascunho,
    setRascunho,
    mes,
    setMes,
    comRodape: periodo || !!p.presets?.length,
    podeAplicar: !periodo || (!!rascunho[0] && !!rascunho[1]),
    /** Abrir recomeça o rascunho do valor atual. */
    abrir: (v: boolean) => {
      setAberto(v);
      if (!v) return;
      setRascunho(valor);
      setMes(startOfMonth(valor[0] ?? initialDay(p.maxDate)));
    },
    aplicar: (r: DatesRange) => {
      setValor(r);
      setAberto(false);
    },
    escolherAtalho: (r: DatesRange) => {
      setRascunho(r);
      if (r[0]) setMes(startOfMonth(r[0]));
    },
  };
}

const hhmm = (d: DateValue) => (d ? formatTime(d.getHours(), d.getMinutes()) : "");

/** DateTimePicker: dia e horário no rascunho, aplicados juntos. O horário é o texto do campo: incompleto não aplica. */
export function useDateTimePickerState({ value, defaultValue, onChange, maxDate }: ValorDeData & { maxDate?: Date | undefined }) {
  const [valor, setValor] = useControllableState<DateValue>({ value, defaultValue: defaultValue ?? null, onChange });
  const [aberto, setAberto] = useState(false);
  const [dia, setDia] = useState<DateValue>(valor);
  const [hora, setHora] = useState(hhmm(valor));
  const [mes, setMes] = useState(() => startOfMonth(valor ?? initialDay(maxDate)));
  const t = parseTime(hora);
  return {
    texto: valor ? `${formatDate(valor)} ${hhmm(valor)}` : "",
    aberto,
    dia,
    setDia,
    hora,
    setHora,
    mes,
    setMes,
    podeAplicar: !!dia && !!t,
    abrir: (v: boolean) => {
      setAberto(v);
      if (!v) return;
      setDia(valor);
      setHora(hhmm(valor));
      setMes(startOfMonth(valor ?? initialDay(maxDate)));
    },
    aplicar: () => {
      if (!dia || !t) return;
      setValor(new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), t.h, t.m));
      setAberto(false);
    },
  };
}

/** DateInput: o texto com máscara segue o valor; só um dia completo e permitido vira valor. */
export function useDateInputState({ value, defaultValue, onChange, minDate, maxDate, excludeDate }: ValorDeData & CalendarBaseProps) {
  const [valor, setValor] = useControllableState<DateValue>({ value, defaultValue: defaultValue ?? null, onChange });
  const [texto, setTexto] = useState(valor ? formatDate(valor) : "");
  const [visto, setVisto] = useState<DateValue>(valor);
  // o valor mudou por fora (ou pelo calendário): o texto acompanha
  if (!(visto === valor || sameDay(visto, valor))) {
    setVisto(valor);
    setTexto(valor ? formatDate(valor) : "");
  }
  return {
    valor,
    setValor,
    texto,
    digitar: (m: string, raw: string) => {
      setTexto(m);
      const d = parseDate(m);
      if (raw.length === 8 && d && !outOfBounds(d, minDate, maxDate) && !excludeDate?.(d)) {
        setVisto(d);
        setValor(d);
      } else if (raw.length === 0) {
        setVisto(null);
        setValor(null);
      }
    },
    /** Texto inválido volta ao último dia válido. */
    sair: () => setTexto(valor ? formatDate(valor) : ""),
  };
}

/** TimeInput: o texto com máscara segue o valor; só avisa a hora completa e válida ("08:05"), ou "" ao apagar. */
export function useTimeInputState({ value, defaultValue, onChange }: { value?: string | undefined; defaultValue?: string | undefined; onChange?: ((value: string) => void) | undefined }) {
  const [valor, setValor] = useControllableState({ value, defaultValue: defaultValue ?? "", onChange });
  const [texto, setTexto] = useState(valor);
  const [visto, setVisto] = useState(valor);
  if (visto !== valor) {
    setVisto(valor);
    setTexto(valor);
  }
  return {
    texto,
    digitar: (m: string, raw: string) => {
      setTexto(m);
      const t = parseTime(m);
      if (raw.length === 4 && t) {
        const novo = formatTime(t.h, t.m);
        setVisto(novo);
        setValor(novo);
      } else if (raw.length === 0) {
        setVisto("");
        setValor("");
      }
    },
    sair: () => setTexto(valor),
  };
}
