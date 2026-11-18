import { Badge, Popover, UnstyledButton } from "@countify-oficial/core";
import { useComponentProps } from "@countify-oficial/provider";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { MonthHeader } from "./Calendar";
import { useEventCalendar, type CalendarEvent, type EventCalendarBaseProps } from "./useEventCalendar";
import cal from "./Calendar.module.css";
import classes from "./EventCalendar.module.css";

export type EventCalendarProps<T extends CalendarEvent = CalendarEvent> = EventCalendarBaseProps<T> & {
  /** Classe da raiz. */
  className?: string | undefined;
  /** Estilo da raiz. */
  style?: CSSProperties | undefined;
};

/**
 * Calendário de eventos do mês (role grid, como o Calendar): cada dia mostra os eventos em chips e, quando não cabem,
 * "+N mais" abre a lista do dia. Setas andam pelos dias, PageUp/PageDown trocam o mês, Enter no dia chama onDayClick;
 * Tab entra nos eventos do dia em foco.
 */
export function EventCalendar<T extends CalendarEvent>(props: EventCalendarProps<T>) {
  const p = useComponentProps("EventCalendar", {}, props);
  const { maxEventsPerDay = 3, onDayClick, onEventClick } = p;
  const { c, doDia, curto, rotuloDoDia, rotuloDoEvento } = useEventCalendar(p, false);
  const [abertoEm, setAbertoEm] = useState<string | null>(null);
  // o foco segue o dia só quando o teclado andou (como no Calendar)
  const focar = useRef(false);
  const [grade, setGrade] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!focar.current || !c.focoKey) return;
    focar.current = false;
    grade?.querySelector<HTMLElement>(`[data-key="${c.focoKey}"]`)?.focus();
  }, [c.focoKey, grade]);
  const linhas = Math.max(1, maxEventsPerDay);
  const chip = (e: T, tab: number) => (
    <Badge
      key={e.id}
      component="button"
      type="button"
      color={e.color ?? "accent"}
      className={classes["event"]}
      aria-label={rotuloDoEvento(e)}
      tabIndex={tab}
      onClick={() => {
        setAbertoEm(null);
        onEventClick?.(e);
      }}
    >
      <span className={classes["title"]}>{e.title}</span>
    </Badge>
  );
  return (
    <div className={[cal["root"], p.className].filter(Boolean).join(" ")} style={p.style}>
      <MonthHeader c={c} />
      <div ref={setGrade} role="grid" aria-label={c.titulo} className={classes["weeks"]} style={{ "--event-rows": linhas } as CSSProperties}>
        {c.semanas.map((semana, i) => (
          <div key={i} role="row" className={classes["week"]}>
            {semana.map((d, j) => {
              if (!d) return <div key={`v${String(j)}`} role="gridcell" className={classes["cell"]} />;
              const eventos = doDia(d.date);
              const cabe = eventos.length <= linhas;
              const vistos = cabe ? eventos : eventos.slice(0, linhas - 1);
              const resto = eventos.length - vistos.length;
              // Tab entra só nos eventos do dia em foco; nos outros, as setas levam ao dia antes
              const tab = d.key === c.focoKey ? 0 : -1;
              const aoClicar = (e: MouseEvent<HTMLDivElement>) => {
                // o clique num evento, no "+N mais" ou dentro da lista aberta (portal) não é clique no dia
                const alvo = e.target as Element;
                if (d.disabled || !e.currentTarget.contains(alvo) || alvo.closest("button")) return;
                onDayClick?.(d.date);
              };
              const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
                if (e.target !== e.currentTarget) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (!d.disabled) onDayClick?.(d.date);
                  return;
                }
                if (!c.teclar(e.key, e.shiftKey)) return;
                e.preventDefault();
                focar.current = true;
              };
              return (
                <div
                  key={d.key}
                  role="gridcell"
                  data-key={d.key}
                  aria-label={rotuloDoDia(d)}
                  aria-disabled={d.disabled || undefined}
                  data-today={d.today || undefined}
                  tabIndex={tab}
                  onClick={aoClicar}
                  onKeyDown={aoTeclar}
                  className={classes["cell"]}
                >
                  <span className={classes["day"]}>{d.date.getDate()}</span>
                  <div className={classes["events"]}>
                    {vistos.map((e) => chip(e, tab))}
                    {resto > 0 && (
                      <Popover opened={abertoEm === d.key} onChange={(v) => setAbertoEm(v ? d.key : null)} position="bottom-start" trapFocus>
                        <Popover.Target>
                          <UnstyledButton className={classes["more"]} aria-label={c.messages.moreEvents(resto, curto(d.date))} tabIndex={tab}>
                            +{resto} {c.messages.more}
                          </UnstyledButton>
                        </Popover.Target>
                        <Popover.Dropdown aria-label={curto(d.date)} classNames={{ dropdown: classes["list"] ?? "" }}>
                          <span className={classes["listTitle"]}>{curto(d.date)}</span>
                          {eventos.map((e) => chip(e, 0))}
                        </Popover.Dropdown>
                      </Popover>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
