import { ActionIcon, Button, Drawer, Icon, MaskInput, UnstyledButton, type MaskInputProps } from "@countify-oficial/native";
import { hasContent, useComponentProps, useCountifyTheme, useMessages } from "@countify-oficial/provider";
import { borderWidth, controlHeight, fontSize, focusRing, lineHeightPx, nativeFontFamily, radius, space, state, touchTarget } from "@countify-oficial/tokens";
import { useState, type ReactNode } from "react";
import { ScrollView, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { Calendar } from "./Calendar.native";
import { toRange, type CalendarBaseProps, type CalendarValueProps } from "./useCalendar";
import { useDateInputState, useDatePickerState, useDateTimePickerState, useTimeInputState } from "./usePickers";
import { formatRange, sameRange, type DatesRange, type DateValue } from "./utils";

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

/** O campo de 56 que abre a folha (M-Espaco): rótulo, valor em 17/700 e o ícone do calendário. */
function Gatilho({ campo, texto, aberto, onPress }: { campo: DateFieldProps; texto: string; aberto: boolean; onPress: () => void }) {
  const { colors: c } = useCountifyTheme();
  const { label, description, error, placeholder, disabled, accessibilityLabel, style } = campo;
  const letra = { fontSize: fontSize.sm, lineHeight: lineHeightPx(fontSize.sm), fontFamily: nativeFontFamily[400] };
  const borda = error ? focusRing.width : 0;
  return (
    <View style={[{ gap: space[2] }, style]}>
      {hasContent(label) && <Text style={[letra, { color: c.text2 }]}>{label}</Text>}
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
      {hasContent(description) && <Text style={[letra, { color: c.text2 }]}>{description}</Text>}
      {hasContent(error) && <Text accessibilityRole="alert" style={[letra, { color: c.down }]}>{error}</Text>}
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
  const { periodo, valor, aberto, abrir, rascunho, setRascunho, mes, setMes, comRodape, podeAplicar, aplicar, escolherAtalho } = useDatePickerState(p);
  const limites = { minDate, maxDate, excludeDate, firstDayOfWeek, month: mes, onMonthChange: setMes };
  return (
    <>
      <Gatilho campo={p} texto={valueFormat ? valueFormat(valor) : formatRange(valor, locale)} aberto={aberto} onPress={() => abrir(true)} />
      <Folha titulo={p.label} aberto={aberto} fechar={() => abrir(false)} aplicar={comRodape ? () => aplicar(rascunho) : undefined} podeAplicar={podeAplicar}>
        {presets && presets.length > 0 && <Atalhos presets={presets} rascunho={rascunho} escolher={escolherAtalho} />}
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
  const { minDate, maxDate, excludeDate, firstDayOfWeek } = p;
  const { texto, aberto, abrir, dia, setDia, hora, setHora, mes, setMes, podeAplicar, aplicar } = useDateTimePickerState(p);
  return (
    <>
      <Gatilho campo={p} texto={texto} aberto={aberto} onPress={() => abrir(true)} />
      <Folha titulo={p.label} aberto={aberto} fechar={() => abrir(false)} podeAplicar={podeAplicar} aplicar={aplicar}>
        <Calendar {...{ minDate, maxDate, excludeDate, firstDayOfWeek }} month={mes} onMonthChange={setMes} value={dia} onChange={setDia} />
        {/* o texto como está no campo (não o TimeInput, que guarda a última hora válida): "14:3" deixa o Aplicar apagado */}
        <MaskInput label={messages.time} mask="99:99" keyboardType="number-pad" value={hora} onChange={setHora} />
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
  const { valor, setValor, texto, digitar, sair } = useDateInputState({ value, defaultValue, onChange, minDate, maxDate, excludeDate });
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <MaskInput
        {...rest}
        disabled={disabled}
        mask="99/99/9999"
        keyboardType="number-pad"
        value={texto}
        onChange={digitar}
        onBlur={(e) => {
          sair();
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
  const { texto, digitar, sair } = useTimeInputState({ value, defaultValue, onChange });
  return (
    <MaskInput
      {...rest}
      mask="99:99"
      keyboardType="number-pad"
      value={texto}
      onChange={digitar}
      onBlur={(e) => {
        sair();
        onBlur?.(e);
      }}
    />
  );
}
