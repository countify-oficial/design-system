import { ActionIcon, Button, Drawer, Icon, MaskInput, UnstyledButton, type MaskInputProps } from "@countify-oficial/native";
import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { borderWidth, controlHeight, fontSize, focusRing, lineHeightPx, nativeFontFamily, radius, space, state, touchTarget } from "@countify-oficial/tokens";
import { useState, type ReactNode } from "react";
import { ScrollView, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { Calendar } from "./Calendar.native";
import { toRange, type CalendarBaseProps, type CalendarValueProps } from "./useCalendar";
import { formatDate, formatRange, formatTime, outOfBounds, parseDate, parseTime, sameDay, sameRange, startOfMonth, type DatesRange, type DateValue } from "./utils";

export interface DateFieldProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  accessibilityLabel?: string | undefined;
  style?: StyleProp<ViewStyle>;
}

export interface DatePreset {
  label: string;
  value: DateValue | DatesRange;
}

const tem = (v: ReactNode) => v !== undefined && v !== null && v !== false && v !== "";

/** O campo de 56 que abre a folha (M-Espaco): rótulo, valor em 17/700 e o ícone do calendário. */
function Gatilho({ campo, texto, aberto, onPress }: { campo: DateFieldProps; texto: string; aberto: boolean; onPress: () => void }) {
  const { colors: c } = useCountifyTheme();
  const { label, description, error, placeholder, disabled, accessibilityLabel, style } = campo;
  const letra = { fontSize: fontSize.sm, lineHeight: lineHeightPx(fontSize.sm), fontFamily: nativeFontFamily[400] };
  const borda = error ? focusRing.width : 0;
  return (
    <View style={[{ gap: space[2] }, style]}>
      {tem(label) && <Text style={[letra, { color: c.text2 }]}>{label}</Text>}
      <UnstyledButton
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? (typeof label === "string" ? label : undefined)}
        accessibilityValue={texto ? { text: texto } : undefined}
        accessibilityState={{ expanded: aberto, disabled: !!disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          {
            flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3], minHeight: controlHeight.input.xl, paddingHorizontal: space[4] - borda,
            borderRadius: radius.sm, backgroundColor: c.field, borderWidth: borda, borderColor: c.down,
          },
          pressed && { opacity: state.pressedOpacity },
          disabled && { opacity: state.disabledOpacity },
        ]}
      >
        <Text style={{ flex: 1, color: texto ? c.text : c.text3, fontSize: fontSize.md, fontFamily: nativeFontFamily[texto ? 700 : 400], fontVariant: ["tabular-nums"] }}>{texto || placeholder || ""}</Text>
        <Icon name="calendar" color="text2" />
      </UnstyledButton>
      {tem(description) && <Text style={[letra, { color: c.text2 }]}>{description}</Text>}
      {tem(error) && <Text accessibilityRole="alert" style={[letra, { color: c.down }]}>{error}</Text>}
    </View>
  );
}

/** Folha com o conteúdo e o "Aplicar" de largura toda (52) no pé, como a folha de período. */
function Folha({ titulo, aberto, fechar, aplicar, podeAplicar, children }: { titulo: ReactNode; aberto: boolean; fechar: () => void; aplicar?: (() => void) | undefined; podeAplicar?: boolean | undefined; children: ReactNode }) {
  const messages = useMessages();
  return (
    <Drawer opened={aberto} onClose={fechar} title={titulo}>
      {children}
      {aplicar && (
        <Button size="md" fullWidth disabled={podeAplicar === false} onPress={aplicar}>
          {messages.apply}
        </Button>
      )}
    </Drawer>
  );
}

function Atalhos({ presets, rascunho, escolher }: { presets: DatePreset[]; rascunho: DatesRange; escolher: (r: DatesRange) => void }) {
  const { colors: c } = useCountifyTheme();
  const messages = useMessages();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityLabel={messages.shortcuts} contentContainerStyle={{ gap: space[2] }}>
      {presets.map((pr) => {
        const ativo = sameRange(toRange(pr.value), rascunho);
        return (
          <UnstyledButton
            key={pr.label}
            accessibilityRole="button"
            accessibilityState={{ selected: ativo }}
            onPress={() => escolher(toRange(pr.value))}
            style={({ pressed }) => [
              { minHeight: touchTarget, paddingHorizontal: space[4], justifyContent: "center", borderRadius: radius.sm, backgroundColor: c.chip },
              ativo && { backgroundColor: c.accentTint, borderWidth: borderWidth.thick, borderColor: c.accent },
              pressed && { opacity: state.pressedOpacity },
            ]}
          >
            <Text style={{ color: ativo ? c.accent : c.text, fontSize: fontSize.sm, fontFamily: nativeFontFamily[400] }}>{pr.label}</Text>
          </UnstyledButton>
        );
      })}
    </ScrollView>
  );
}

export type DatePickerProps = DateFieldProps &
  CalendarBaseProps &
  CalendarValueProps & {
    presets?: DatePreset[] | undefined;
    valueFormat?: ((value: DatesRange) => string) | undefined;
  };

/** Campo que abre a folha do calendário. Um dia: escolher fecha. Período ou atalhos: "Aplicar" fecha e aplica. */
export function DatePicker(props: DatePickerProps) {
  const p = useComponentProps("DatePicker", {}, props);
  const { locale } = useCountifyTheme();
  const { minDate, maxDate, excludeDate, firstDayOfWeek, presets, valueFormat } = p;
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
  const [mes, setMes] = useState(() => startOfMonth(valor[0] ?? maxDate ?? new Date()));
  const comRodape = periodo || !!presets?.length;
  const limites = { minDate, maxDate, excludeDate, firstDayOfWeek, month: mes, onMonthChange: setMes };
  const aplicar = (r: DatesRange) => {
    setValor(r);
    setAberto(false);
  };
  return (
    <>
      <Gatilho
        campo={p}
        texto={valueFormat ? valueFormat(valor) : formatRange(valor, locale)}
        aberto={aberto}
        onPress={() => {
          setRascunho(valor);
          setMes(startOfMonth(valor[0] ?? maxDate ?? new Date()));
          setAberto(true);
        }}
      />
      <Folha titulo={p.label} aberto={aberto} fechar={() => setAberto(false)} aplicar={comRodape ? () => aplicar(rascunho) : undefined} podeAplicar={!periodo || (!!rascunho[0] && !!rascunho[1])}>
        {presets && presets.length > 0 && (
          <Atalhos
            presets={presets}
            rascunho={rascunho}
            escolher={(r) => {
              setRascunho(r);
              if (r[0]) setMes(startOfMonth(r[0]));
            }}
          />
        )}
        {periodo ? (
          <Calendar {...limites} type="range" value={rascunho} onChange={setRascunho} />
        ) : (
          <Calendar {...limites} value={rascunho[0]} onChange={(d) => (comRodape ? setRascunho([d, null]) : aplicar([d, null]))} />
        )}
      </Folha>
    </>
  );
}

export type DateTimePickerProps = DateFieldProps &
  CalendarBaseProps & {
    value?: DateValue | undefined;
    defaultValue?: DateValue | undefined;
    onChange?: ((value: DateValue) => void) | undefined;
  };

/** Dia e hora (24 h) na mesma folha, aplicados juntos. */
export function DateTimePicker(props: DateTimePickerProps) {
  const messages = useMessages();
  const p = useComponentProps("DateTimePicker", {}, props);
  const { value, defaultValue, onChange, minDate, maxDate, excludeDate, firstDayOfWeek } = p;
  const [valor, setValor] = useControllableState<DateValue>({ value, defaultValue: defaultValue ?? null, onChange });
  const [aberto, setAberto] = useState(false);
  const [dia, setDia] = useState<DateValue>(valor);
  const [hora, setHora] = useState("");
  const [mes, setMes] = useState(() => startOfMonth(valor ?? new Date()));
  const t = parseTime(hora);
  return (
    <>
      <Gatilho
        campo={p}
        texto={valor ? `${formatDate(valor)} ${formatTime(valor.getHours(), valor.getMinutes())}` : ""}
        aberto={aberto}
        onPress={() => {
          setDia(valor);
          setHora(valor ? formatTime(valor.getHours(), valor.getMinutes()) : "");
          setMes(startOfMonth(valor ?? new Date()));
          setAberto(true);
        }}
      />
      <Folha
        titulo={p.label}
        aberto={aberto}
        fechar={() => setAberto(false)}
        podeAplicar={!!dia && !!t}
        aplicar={() => {
          if (!dia || !t) return;
          setValor(new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), t.h, t.m));
          setAberto(false);
        }}
      >
        <Calendar {...{ minDate, maxDate, excludeDate, firstDayOfWeek }} month={mes} onMonthChange={setMes} value={dia} onChange={setDia} />
        <TimeInput label={messages.time} value={hora} onChange={setHora} />
      </Folha>
    </>
  );
}

export type DateInputProps = Omit<MaskInputProps, "mask" | "value" | "defaultValue" | "onChange"> &
  CalendarBaseProps & {
    value?: DateValue | undefined;
    defaultValue?: DateValue | undefined;
    onChange?: ((value: DateValue) => void) | undefined;
  };

/** Data digitada ("15/09/2026", 48), com o calendário numa folha pelo ícone. Texto inválido volta ao último dia válido. */
export function DateInput(props: DateInputProps) {
  const messages = useMessages();
  const { value, defaultValue, onChange, month, defaultMonth, onMonthChange, minDate, maxDate, excludeDate, firstDayOfWeek, disabled, onBlur, ...rest } = useComponentProps("DateInput", {}, props);
  const [valor, setValor] = useControllableState<DateValue>({ value, defaultValue: defaultValue ?? null, onChange });
  const [texto, setTexto] = useState(valor ? formatDate(valor) : "");
  const [visto, setVisto] = useState<DateValue>(valor);
  const [aberto, setAberto] = useState(false);
  if (!(visto === valor || sameDay(visto, valor))) {
    setVisto(valor);
    setTexto(valor ? formatDate(valor) : "");
  }
  const valido = (d: Date | null) => !!d && !outOfBounds(d, minDate, maxDate) && !excludeDate?.(d);
  return (
    <>
      <MaskInput
        {...rest}
        disabled={disabled}
        mask="99/99/9999"
        keyboardType="number-pad"
        value={texto}
        onChange={(m, raw) => {
          setTexto(m);
          const d = parseDate(m);
          if (raw.length === 8 && valido(d)) {
            setVisto(d);
            setValor(d);
          } else if (raw.length === 0) {
            setVisto(null);
            setValor(null);
          }
        }}
        onBlur={(e) => {
          setTexto(valor ? formatDate(valor) : "");
          onBlur?.(e);
        }}
        rightSection={
          <ActionIcon accessibilityLabel={messages.chooseDate} color="text2" disabled={disabled} onPress={() => setAberto(true)}>
            <Icon name="calendar" />
          </ActionIcon>
        }
      />
      <Folha titulo={rest.label} aberto={aberto} fechar={() => setAberto(false)}>
        <Calendar
          {...{ month, defaultMonth, onMonthChange, minDate, maxDate, excludeDate, firstDayOfWeek }}
          value={valor}
          onChange={(d) => {
            setValor(d);
            setAberto(false);
          }}
        />
      </Folha>
    </>
  );
}

export type TimeInputProps = Omit<MaskInputProps, "mask" | "value" | "defaultValue" | "onChange"> & {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
};

/** Hora digitada em 24 h ("10:00"), sem ícone. */
export function TimeInput(props: TimeInputProps) {
  const { value, defaultValue, onChange, onBlur, ...rest } = useComponentProps("TimeInput", {}, props);
  const [valor, setValor] = useControllableState({ value, defaultValue: defaultValue ?? "", onChange });
  const [texto, setTexto] = useState(valor);
  const [visto, setVisto] = useState(valor);
  if (visto !== valor) {
    setVisto(valor);
    setTexto(valor);
  }
  return (
    <MaskInput
      {...rest}
      mask="99:99"
      keyboardType="number-pad"
      value={texto}
      onChange={(m, raw) => {
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
      }}
      onBlur={(e) => {
        setTexto(valor);
        onBlur?.(e);
      }}
    />
  );
}
