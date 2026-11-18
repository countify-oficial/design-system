import { ActionIcon, Icon } from "@countify-oficial/core";
import { useComponentProps } from "@countify-oficial/provider";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useCalendar, type CalendarBaseProps, type CalendarValueProps } from "./useCalendar";
import classes from "./Calendar.module.css";

export type CalendarProps = CalendarBaseProps &
  CalendarValueProps & {
    className?: string | undefined;
    style?: React.CSSProperties | undefined;
  };

/**
 * Calendário do mês (role grid): setas andam pelos dias, PageUp/PageDown trocam o mês (com Shift, o ano), Home e End
 * vão ao começo e ao fim da semana, Enter ou espaço escolhe. Com type="range", o 1º dia começa e o 2º fecha o período.
 */
export function Calendar(props: CalendarProps) {
  const p = useComponentProps("Calendar", {}, props);
  const c = useCalendar(p);
  // o foco segue o dia só quando o teclado andou (não ao abrir)
  const focar = useRef(false);
  const [grade, setGrade] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!focar.current || !c.focoKey) return;
    focar.current = false;
    grade?.querySelector<HTMLElement>(`[data-key="${c.focoKey}"]`)?.focus();
  }, [c.focoKey, grade]);
  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!c.teclar(e.key, e.shiftKey)) return;
    e.preventDefault();
    focar.current = true;
  };
  return (
    <div className={[classes["root"], p.className].filter(Boolean).join(" ")} style={p.style}>
      <MonthHeader c={c} />
      <div ref={setGrade} role="grid" aria-label={c.titulo} aria-multiselectable={p.type === "range" || undefined} className={classes["weeks"]}>
        {c.semanas.map((semana, i) => (
          <div key={i} role="row" className={classes["week"]}>
            {semana.map((d, j) =>
              d ? (
                <div
                  key={d.key}
                  role="gridcell"
                  data-key={d.key}
                  aria-label={d.label}
                  aria-selected={d.selected || d.range === "in"}
                  data-selected={d.selected || undefined}
                  aria-disabled={d.disabled || undefined}
                  data-today={d.today || undefined}
                  data-range={p.type === "range" ? (d.range ?? undefined) : undefined}
                  tabIndex={d.key === c.focoKey ? 0 : -1}
                  onClick={() => c.escolher(d.date)}
                  onKeyDown={aoTeclar}
                  className={classes["cell"]}
                >
                  <span className={classes["day"]}>{d.date.getDate()}</span>
                </div>
              ) : (
                <div key={`v${String(j)}`} role="gridcell" className={classes["empty"]} />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** O título do mês com as setas e as iniciais dos dias (o mesmo no Calendar e no EventCalendar). */
export function MonthHeader({ c }: { c: ReturnType<typeof useCalendar> }) {
  return (
    <>
      <div className={classes["header"]}>
        <ActionIcon aria-label={c.messages.previousMonth} radius="xl" disabled={!c.podeAntes} onClick={() => c.irMes(-1)}>
          <Icon name="back" size="sm" />
        </ActionIcon>
        <span className={classes["title"]} aria-live="polite">
          {c.titulo}
        </span>
        <ActionIcon aria-label={c.messages.nextMonth} radius="xl" disabled={!c.podeDepois} onClick={() => c.irMes(1)}>
          <Icon name="chevron-right" size="sm" />
        </ActionIcon>
      </div>
      <div className={classes["weekdays"]} aria-hidden>
        {c.diasDaSemana.map((d) => (
          <abbr key={d.long} title={d.long} className={classes["weekday"]}>
            {d.short}
          </abbr>
        ))}
      </div>
    </>
  );
}
