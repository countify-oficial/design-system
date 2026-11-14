import { ActionIcon, Button, Icon, InputBase, MaskInput, Popover, UnstyledButton, type InputBaseOwnProps, type MaskInputProps } from "@countify-oficial/core";
import { useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { useState, type ChangeEvent, type ReactNode } from "react";
import { Calendar } from "./Calendar";
import { toRange, type CalendarBaseProps, type CalendarValueProps } from "./useCalendar";
import { useDateInputState, useDatePickerState, useDateTimePickerState, useTimeInputState } from "./usePickers";
import { formatRange, sameRange, type DatesRange, type DateValue } from "./utils";
import classes from "./Pickers.module.css";

/** As props do campo (rótulo, descrição, erro, tamanho…). */
export type DateFieldProps = Omit<InputBaseOwnProps, "rightSection" | "rightSectionPointerEvents"> & {
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  name?: string | undefined;
  "aria-label"?: string | undefined;
};

export interface DatePreset {
  label: string;
  value: DateValue | DatesRange;
}

const cx = (...c: (string | undefined)[]) => c.filter(Boolean).join(" ");

/** As props sem as chaves do valor e do calendário: o resto vai para o campo. */
function semChaves<T extends object, K extends keyof T>(o: T, chaves: readonly K[]): Omit<T, K> {
  const fora: readonly PropertyKey[] = chaves;
  return Object.fromEntries(Object.entries(o).filter(([k]) => !fora.includes(k))) as Omit<T, K>;
}
const DO_CALENDARIO = ["value", "defaultValue", "onChange", "month", "defaultMonth", "onMonthChange", "minDate", "maxDate", "excludeDate", "firstDayOfWeek"] as const;
const nomeDe = (label: ReactNode, aria: string | undefined) => aria ?? (typeof label === "string" ? label : undefined);

/** O campo de 56 que abre o seletor; dentro, o conteúdo e o rodapé (Cancelar e Aplicar). */
function CampoDoSeletor({
  campo, texto, aberto, setAberto, conteudo, aplicar, podeAplicar,
}: { campo: DateFieldProps; texto: string; aberto: boolean; setAberto: (v: boolean) => void; conteudo: ReactNode; aplicar?: (() => void) | undefined; podeAplicar?: boolean | undefined }) {
  const messages = useMessages();
  const { classNames, disabled, ...resto } = campo;
  return (
    <Popover opened={aberto && !disabled} onChange={setAberto} position="bottom-start" trapFocus>
      <Popover.Target>
        <InputBase
          size="xl"
          {...resto}
          component="input"
          // abre um seletor: o padrão "date picker combobox" do WAI-ARIA (textbox não aceita aria-expanded)
          role="combobox"
          readOnly
          disabled={disabled}
          value={texto}
          onChange={(_e: ChangeEvent<HTMLInputElement>) => undefined}
          rightSection={<span className={classes["icon"]}><Icon name="calendar" /></span>}
          rightSectionPointerEvents="none"
          classNames={{ ...classNames, input: cx(classes["trigger"], classNames?.input) }}
        />
      </Popover.Target>
      <Popover.Dropdown aria-label={nomeDe(campo.label, campo["aria-label"])}>
        {conteudo}
        {aplicar && (
          <div className={classes["footer"]}>
            <Button variant="outline" onClick={() => setAberto(false)}>{messages.cancel}</Button>
            <Button disabled={podeAplicar === false} onClick={aplicar}>{messages.apply}</Button>
          </div>
        )}
      </Popover.Dropdown>
    </Popover>
  );
}

export type DatePickerProps = DateFieldProps &
  CalendarBaseProps &
  CalendarValueProps & {
    /** Atalhos ("Hoje", "Últimos 7 dias"…): chips no celular, lista ao lado do calendário a partir de 768. */
    presets?: DatePreset[] | undefined;
    /** Como o valor aparece no campo. Padrão: "01/11/2026" ou "22/10 a 31/10/2026". */
    valueFormat?: ((value: DatesRange) => string) | undefined;
  };

/**
 * Campo que abre o calendário. Um dia: escolher fecha. Período ou atalhos: escolhe no rascunho e "Aplicar" fecha e
 * aplica (a regra da folha de período do mockup).
 */
export function DatePicker(props: DatePickerProps) {
  const p = useComponentProps("DatePicker", {}, props);
  const { locale } = useCountifyTheme();
  const { minDate, maxDate, excludeDate, firstDayOfWeek, presets, valueFormat } = p;
  const campo = semChaves(p, [...DO_CALENDARIO, "type", "presets", "valueFormat"]);
  const { periodo, valor, aberto, abrir, rascunho, setRascunho, mes, setMes, comRodape, podeAplicar, aplicar, escolherAtalho } = useDatePickerState(p);
  const limites = { minDate, maxDate, excludeDate, firstDayOfWeek, month: mes, onMonthChange: setMes };
  return (
    <CampoDoSeletor
      campo={campo}
      texto={valueFormat ? valueFormat(valor) : formatRange(valor, locale)}
      aberto={aberto}
      setAberto={abrir}
      aplicar={comRodape ? () => aplicar(rascunho) : undefined}
      podeAplicar={podeAplicar}
      conteudo={
        <div className={classes["body"]}>
          {presets && presets.length > 0 && (
            <div className={classes["presets"]}>
              {presets.map((pr) => (
                <UnstyledButton
                  key={pr.label}
                  className={classes["preset"]}
                  aria-pressed={sameRange(toRange(pr.value), rascunho)}
                  onClick={() => escolherAtalho(toRange(pr.value))}
                >
                  {pr.label}
                </UnstyledButton>
              ))}
            </div>
          )}
          {periodo ? (
            <Calendar className={classes["calendar"]} {...limites} type="range" value={rascunho} onChange={setRascunho} />
          ) : (
            <Calendar className={classes["calendar"]} {...limites} value={rascunho[0]} onChange={(d) => (comRodape ? setRascunho([d, null]) : aplicar([d, null]))} />
          )}
        </div>
      }
    />
  );
}

export type DateTimePickerProps = DateFieldProps &
  CalendarBaseProps & {
    /** O dia e a hora. */
    value?: DateValue | undefined;
    defaultValue?: DateValue | undefined;
    onChange?: ((value: DateValue) => void) | undefined;
  };

/** Campo de dia e hora: o calendário e o horário (24 h), aplicados juntos. */
export function DateTimePicker(props: DateTimePickerProps) {
  const messages = useMessages();
  const p = useComponentProps("DateTimePicker", {}, props);
  const { minDate, maxDate, excludeDate, firstDayOfWeek } = p;
  const campo = semChaves(p, DO_CALENDARIO);
  const { texto, aberto, abrir, dia, setDia, hora, setHora, mes, setMes, podeAplicar, aplicar } = useDateTimePickerState(p);
  return (
    <CampoDoSeletor
      campo={campo}
      texto={texto}
      aberto={aberto}
      setAberto={abrir}
      podeAplicar={podeAplicar}
      aplicar={aplicar}
      conteudo={
        <div>
          <Calendar className={classes["calendar"]} {...{ minDate, maxDate, excludeDate, firstDayOfWeek }} month={mes} onMonthChange={setMes} value={dia} onChange={setDia} />
          {/* o texto como está no campo (não o TimeInput, que guarda a última hora válida): "14:3" deixa o Aplicar apagado */}
          <MaskInput className={classes["time"]} label={messages.time} mask="99:99" inputMode="numeric" value={hora} onChange={setHora} />
        </div>
      }
    />
  );
}

export type DateInputProps = DateFieldProps &
  CalendarBaseProps & {
    value?: DateValue | undefined;
    defaultValue?: DateValue | undefined;
    onChange?: ((value: DateValue) => void) | undefined;
  };

/** Data digitada ("15/09/2026", altura 48), com o calendário no ícone. Texto inválido volta ao último dia válido ao sair. */
export function DateInput(props: DateInputProps) {
  const messages = useMessages();
  const p = useComponentProps("DateInput", {}, props);
  const { month, defaultMonth, onMonthChange, minDate, maxDate, excludeDate, firstDayOfWeek, disabled } = p;
  const campo = semChaves(p, [...DO_CALENDARIO, "disabled"]);
  const { valor, setValor, texto, digitar, sair } = useDateInputState(p);
  const [aberto, setAberto] = useState(false);
  return (
    <MaskInput
      {...(campo as Omit<MaskInputProps, "mask">)}
      disabled={disabled}
      mask="99/99/9999"
      inputMode="numeric"
      value={texto}
      onChange={digitar}
      onBlur={sair}
      rightSectionPointerEvents="auto"
      rightSection={
        <Popover opened={aberto && !disabled} onChange={setAberto} position="bottom-end" trapFocus>
          <Popover.Target>
            <ActionIcon aria-label={messages.chooseDate} color="text2" disabled={disabled}>
              <Icon name="calendar" />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown aria-label={messages.chooseDate}>
            <Calendar
              className={classes["calendar"]}
              {...{ month, defaultMonth, onMonthChange, minDate, maxDate, excludeDate, firstDayOfWeek }}
              value={valor}
              onChange={(d) => {
                setValor(d);
                setAberto(false);
              }}
            />
          </Popover.Dropdown>
        </Popover>
      }
    />
  );
}

export type TimeInputProps = Omit<MaskInputProps, "mask" | "value" | "defaultValue" | "onChange"> & {
  /** "14:30" (24 h). */
  value?: string | undefined;
  defaultValue?: string | undefined;
  /** Chamado com a hora completa e válida ("08:05"), ou "" ao apagar. */
  onChange?: ((value: string) => void) | undefined;
};

/** Hora digitada em 24 h ("10:00"), como os campos Abre e Fecha do mockup: sem ícone. */
export function TimeInput(props: TimeInputProps) {
  const { value, defaultValue, onChange, onBlur, ...rest } = useComponentProps("TimeInput", {}, props);
  const { texto, digitar, sair } = useTimeInputState({ value, defaultValue, onChange });
  return (
    <MaskInput
      {...rest}
      mask="99:99"
      inputMode="numeric"
      value={texto}
      onChange={digitar}
      onBlur={(e) => {
        sair();
        onBlur?.(e);
      }}
    />
  );
}
