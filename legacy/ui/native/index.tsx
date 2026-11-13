// Componentes do Countify para React Native: as props vêm do contrato (types.ts), as medidas dos css/.
// Letra pela família (Roboto_700Bold), nunca fontWeight: o Android perde a família.
import {
  createContext, useContext, useState, useEffect, useRef, Children, cloneElement, isValidElement,
  type ReactElement, type ReactNode,
} from "react";
import {
  View, Text as RNText, Pressable, TextInput, Modal, ScrollView, Image, ActivityIndicator, Animated, AccessibilityInfo, Platform, useColorScheme,
  type DimensionValue, type LayoutChangeEvent, type PressableStateCallbackType, type StyleProp, type TextInputProps, type TextProps as RNTextProps,
  type TextStyle, type ViewStyle,
} from "react-native";
import { Svg, Rect, Circle, Path, SvgXml } from "react-native-svg";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, font, type Colors } from "../tokens.js";
import { icons } from "../icons.js";
import { logo } from "../logo.js";
import { lineChart, barChart, scatterChart, heatmap, type Draw, type Drawn } from "../charts.js";
import {
  selectAllState, toggleAll, toggleId, monthGrid, rangeRole, nextRange, addMonths, startOfMonth, dayKey, sameDay,
  monthLabel, dayLabel, WEEKDAYS, formatTime, clamp01, pageLabel, TREND, selectSummary, type RangeRole,
} from "../lib.js";
import type * as T from "../types.js";

export type * from "../types.js";

/** nativo: style vai para a View (ou o Text) raiz; o resto das props vem do contrato */
type P<X, S = ViewStyle> = X & { style?: StyleProp<S> };
type Peso = 400 | 500 | 700;

// ---------- estilos comuns
const ts = (fontSize: number, w: Peso = 400, color?: string): TextStyle => ({ fontSize, fontFamily: font.native[w], color });
const tab: TextStyle = { fontVariant: ["tabular-nums"] };
const caps: TextStyle = { textTransform: "uppercase", letterSpacing: 1 };
const row: ViewStyle = { flexDirection: "row", alignItems: "center" };
const fill: ViewStyle = { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 };
const cardBox = (c: Colors): ViewStyle => ({ backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.divider });
const listBox = (c: Colors): StyleProp<ViewStyle> => [cardBox(c), { overflow: "hidden" }];
const inset = (c: Colors): ViewStyle => ({ marginLeft: 16, paddingLeft: 0, borderTopWidth: 1, borderTopColor: c.divider });
const pressFx = (...s: StyleProp<ViewStyle>[]) => ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [s, pressed && { opacity: 0.8 }];
// texto solto precisa de <Text> no React Native; elementos passam como estão
const isText = (n: ReactNode): boolean => typeof n === "string" || typeof n === "number" || (Array.isArray(n) && n.every(isText));
const body = (c: Colors) => ts(17, 400, c.text);
const tx = (node: ReactNode, style?: StyleProp<TextStyle>, extra?: RNTextProps) => (isText(node) ? <RNText style={style} {...extra}>{node}</RNText> : node ?? null);

// ---------- base
const ThemeCtx = createContext<"light" | "dark" | null>(null);
export function ThemeProvider({ scheme, children }: T.ThemeProviderProps) {
  return <ThemeCtx.Provider value={scheme || null}>{children}</ThemeCtx.Provider>;
}
/** nativo: cores do modo atual, para estilos próprios do app. */
export function useColors(): Colors {
  const forced = useContext(ThemeCtx), system = useColorScheme();
  // "unspecified" (RN novo) cai no claro
  return (forced || system) === "dark" ? colors.dark : colors.light;
}

export function Icon({ name, size = 22, color, label, style, testID }: P<T.IconProps>) {
  const c = useColors();
  if (icons[name] == null) throw new Error("Ícone desconhecido: " + name);
  const xml = `<svg viewBox="0 0 22 22" fill="none" stroke="${color || c.text}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
  return <SvgXml xml={xml} width={size} height={size} style={style} testID={testID} accessible={!!label} accessibilityRole={label ? "image" : undefined} accessibilityLabel={label} />;
}

export function Logo({ variant = "full", height = 32, label = "Countify", style, testID }: P<T.LogoProps>) {
  const c = useColors(), [x, y, w, h] = logo.box[variant];
  const quadrado = variant === "full" || variant === "icon", nome = variant !== "icon", avatar = variant === "avatar";
  const ring = { fill: "none", strokeWidth: 5.86 };
  // avatar: o círculo tem a cor do quadrado, então o nome e o "o" ficam na cor do anel
  const letra = avatar ? c.logoRing : c.logoWord, o = avatar ? c.logoRing : c.logoTile;
  return (
    <Svg width={(height * w) / h} height={height} viewBox={`${x} ${y} ${w} ${h}`} style={style} testID={testID} accessible accessibilityRole="image" accessibilityLabel={label}>
      {avatar && <Circle cx={logo.avatar.cx} cy={logo.avatar.cy} r={logo.avatar.r} fill={c.logoTile} />}
      {quadrado && <Rect width={40} height={40} rx={8.92} fill={c.logoTile} />}
      {quadrado && <Circle cx={20} cy={20} r={10.55} stroke={c.logoRing} {...ring} />}
      {quadrado && <Path d="M20 9.45A10.55 10.55 0 0 1 30.55 20" stroke={c.logoArc} {...ring} />}
      {nome && <Path d={logo.word} fill={letra} />}
      {nome && <Circle cx={logo.o.cx} cy={logo.o.cy} r={logo.o.r} fill="none" stroke={o} strokeWidth={logo.o.stroke} />}
      {nome && <Path d={logo.o.arc} fill="none" stroke={c.logoArc} strokeWidth={logo.o.stroke} />}
    </Svg>
  );
}

const VARIANTS: Record<NonNullable<T.TextProps["variant"]>, [number, Peso]> = { page: [22, 700], section: [20, 700], number: [28, 700], body: [17, 400], label: [15, 400], small: [13, 400], overline: [13, 700] };
export function Text({ variant = "body", tone = "default", weight, numberOfLines, children, style, testID }: P<T.TextProps, TextStyle>) {
  const c = useColors(), [size, w] = VARIANTS[variant];
  const color = ({ muted: c.text2, accent: c.accent, up: c.up, down: c.down } as Record<string, string>)[tone] || c.text;
  const header = variant === "page" || variant === "section";
  return (
    <RNText style={[ts(size, weight || w, color), variant === "number" && tab, variant === "overline" && caps, style]} numberOfLines={numberOfLines} testID={testID} accessibilityRole={header ? "header" : undefined}>
      {children}
    </RNText>
  );
}

// ---------- estrutura
export function Screen({ scroll = true, children, style, testID }: P<T.ScreenProps>) {
  const c = useColors(), pad: ViewStyle = { padding: 20, paddingTop: 16, paddingBottom: 24, gap: 24 };
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[{ flex: 1, backgroundColor: c.bg }, style]} testID={testID}>
      {scroll
        ? <ScrollView contentContainerStyle={pad} keyboardShouldPersistTaps="handled">{tx(children, body(c))}</ScrollView>
        : <View style={[pad, { flex: 1 }]}>{tx(children, body(c))}</View>}
    </SafeAreaView>
  );
}

export function Grid({ columns = 2, gap = 12, children, style, testID }: P<T.GridProps>) {
  const c = useColors(), items = Children.toArray(children), rows: ReactNode[][] = [];
  for (let i = 0; i < items.length; i += columns) rows.push(items.slice(i, i + columns));
  return (
    <View style={[{ gap }, style]} testID={testID}>
      {rows.map((r, i) => (
        <View key={i} style={{ flexDirection: "row", gap }}>
          {/* a última linha completa com vazios para as colunas não esticarem */}
          {[...r, ...Array(columns - r.length).fill(null)].map((x, j) => <View key={j} style={{ flex: 1, minWidth: 0 }}>{tx(x, body(c))}</View>)}
        </View>
      ))}
    </View>
  );
}

export function Card({ padding = 16, gap = 16, children, style, testID }: P<T.CardProps>) {
  const c = useColors();
  return <View style={[cardBox(c), { padding, gap }, style]} testID={testID}>{tx(children, body(c))}</View>;
}

export function Divider({ style, testID }: P<T.DividerProps>) {
  const c = useColors();
  return <View style={[{ height: 1, alignSelf: "stretch", backgroundColor: c.divider }, style]} testID={testID} />;
}

export function SectionTitle({ children, help, action, style, testID }: P<T.SectionTitleProps>) {
  const c = useColors();
  return (
    <View style={[row, { minHeight: 44, justifyContent: "space-between", gap: 12 }, style]} testID={testID}>
      <View style={[row, { gap: 4, flexShrink: 1 }]}><RNText style={ts(20, 700, c.text)} accessibilityRole="header">{children}</RNText>{help}</View>
      {tx(action, ts(17, 500, c.accent))}
    </View>
  );
}

export function SectionLabel({ children, style, testID }: P<T.SectionLabelProps, TextStyle>) {
  const c = useColors();
  return <RNText style={[ts(13, 700, c.text2), caps, style]} testID={testID} accessibilityRole="header">{children}</RNText>;
}

export function PageHeader({ title, subtitle, eyebrow, back, onTitlePress, titleLabel, actions, style, testID }: P<T.PageHeaderProps>) {
  const c = useColors();
  const titleText = <RNText style={[ts(22, 700, c.text), { flexShrink: 1 }]} accessibilityRole="header">{title}</RNText>;
  return (
    <View style={[{ gap: 4 }, style]} testID={testID}>
      {back && (
        <Pressable onPress={back.onPress} disabled={back.disabled} accessibilityRole="button" style={pressFx(row, { gap: 4, minHeight: 44, alignSelf: "flex-start" })}>
          <Icon name="back" size={16} color={c.accent} /><RNText style={ts(15, 500, c.accent)}>{back.label}</RNText>
        </Pressable>
      )}
      {eyebrow ? <RNText style={[ts(13, 700, c.accent), caps]}>{eyebrow}</RNText> : null}
      {onTitlePress
        ? (
          <Pressable onPress={onTitlePress} accessibilityRole="button" accessibilityLabel={titleLabel} style={pressFx(row, { gap: 8, minHeight: 44, alignSelf: "flex-start" })}>
            {titleText}<Icon name="chevron-down" color={c.text} />
          </Pressable>
        )
        : titleText}
      {tx(subtitle, ts(15, 400, c.text2))}
      {actions ? <View style={[row, { flexWrap: "wrap", gap: 8, marginTop: 12 }]}>{actions}</View> : null}
    </View>
  );
}

// barra de abas para o tabBar do Expo Router <Tabs>; não é absoluta, ocupa o pé da tela
export function NavBar({ items, label, style, testID }: P<T.NavBarProps>) {
  const c = useColors(), insets = useSafeAreaInsets();
  return (
    <View style={[cardBox(c), { flexDirection: "row", gap: 4, margin: 12, marginBottom: insets.bottom + 8, padding: 4 }, style]} testID={testID} accessibilityRole="tablist" accessibilityLabel={label}>
      {items.map((it, i) => {
        const color = it.current ? c.accent : c.label;
        return (
          <Pressable
            key={i} onPress={it.onPress} disabled={it.disabled} accessibilityRole="tab"
            accessibilityLabel={it.badge ? `${it.label}, ${it.badge}` : it.label} accessibilityState={{ selected: !!it.current, disabled: !!it.disabled }}
            style={pressFx({ flex: 1, minHeight: 56, alignItems: "center", justifyContent: "center", gap: 2, paddingHorizontal: 4, borderRadius: 12 }, it.current && { backgroundColor: c.accentTint })}
          >
            <View><Icon name={it.icon} color={color} />{(it.badge ?? 0) > 0 && <Badge tone="danger" style={{ position: "absolute", top: -4, left: 17 }}>{it.badge}</Badge>}</View>
            <RNText style={ts(13, 500, color)} numberOfLines={1}>{it.label}</RNText>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------- ações
export function Button({ variant = "primary", size = "md", block, icon, loading, disabled, onPress, children, style, testID }: P<T.ButtonProps>) {
  const c = useColors(), sm = size === "sm", off = disabled || loading;
  const fg = ({ primary: c.onButton, danger: c.bg, "danger-text": c.down } as Record<string, string>)[variant] || c.text;
  const look: Record<string, ViewStyle> = {
    primary: { backgroundColor: c.button },
    secondary: { borderWidth: 1, borderColor: c.borderStrong },
    danger: { backgroundColor: c.down },
    "danger-text": { minHeight: 44, paddingHorizontal: 12 },
    dashed: { borderWidth: 1.5, borderStyle: "dashed", borderColor: c.text3 },
  };
  return (
    <Pressable
      onPress={onPress} disabled={off} testID={testID} accessibilityRole="button" accessibilityState={{ disabled: !!off, busy: !!loading }}
      style={pressFx(row, { justifyContent: "center", gap: 8, minHeight: sm ? 44 : 52, paddingHorizontal: sm ? 16 : 20, borderRadius: 12 }, look[variant],
        block && { alignSelf: "stretch" }, disabled && !loading && { opacity: 0.4 }, style)}
    >
      {loading ? <ActivityIndicator color={fg} /> : icon ? <Icon name={icon} size={18} color={fg} /> : null}
      <RNText style={ts(sm ? 15 : 17, variant === "primary" || variant === "danger" ? 700 : 500, fg)} numberOfLines={1}>{children}</RNText>
    </Pressable>
  );
}

// color e size: só para uso interno (HelpButton, olho da senha); fora do contrato
export function IconButton({ icon, label, variant = "plain", onPress, disabled, color, size, style, testID }: P<T.IconButtonProps> & { color?: string; size?: number }) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress} disabled={disabled} testID={testID} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !!disabled }}
      style={pressFx({ width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
        variant === "filled" && { backgroundColor: c.chip }, disabled && { opacity: 0.4 }, style)}
    >
      <Icon name={icon} size={size} color={color || c.text} />
    </Pressable>
  );
}

export function HelpButton({ topic, onPress, disabled, style, testID }: P<T.HelpButtonProps>) {
  const c = useColors();
  // margem negativa: o "?" não aumenta a altura da linha
  return <IconButton icon="help" label={"Ajuda: " + topic} onPress={onPress} disabled={disabled} size={20} color={c.text2} style={[{ marginVertical: -10, borderRadius: 22 }, style]} testID={testID} />;
}

export function ActionLink({ children, chevron = true, onPress, disabled, style, testID }: P<T.ActionLinkProps>) {
  const c = useColors();
  return (
    <Pressable onPress={onPress} disabled={disabled} testID={testID} accessibilityRole="link" accessibilityState={{ disabled: !!disabled }} style={pressFx(row, { gap: 4, minHeight: 44 }, disabled && { opacity: 0.4 }, style)}>
      <RNText style={ts(17, 500, c.accent)}>{children}</RNText>
      {chevron && <Icon name="chevron-right" size={16} color={c.accent} />}
    </Pressable>
  );
}

// ---------- entrada
// caixa do campo: contorno de 1, 2 com foco ou erro; o recuo compensa a borda para o texto não pular
function FieldBox({ error, before, after, input }: { error?: boolean; before?: ReactNode; after?: ReactNode; input: TextInputProps }) {
  const c = useColors(), [focus, setFocus] = useState(false), bw = focus || error ? 2 : 1;
  return (
    <View style={[row, { gap: 12, minHeight: 48, paddingHorizontal: 17 - bw, borderRadius: 12, borderWidth: bw, backgroundColor: c.field, borderColor: error ? c.down : focus ? c.accent : c.border }]}>
      {before}
      <TextInput
        placeholderTextColor={c.text3} {...input}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={[{ flex: 1, alignSelf: "stretch", minHeight: 44, padding: 0, color: c.text }, ts(17, 400, c.text), input.style]}
      />
      {after}
    </View>
  );
}

const MONO = Platform.OS === "ios" ? "Menlo" : "monospace";
const KEYBOARD: Partial<Record<NonNullable<T.TextFieldProps["type"]>, TextInputProps>> = {
  email: { keyboardType: "email-address", autoCapitalize: "none" },
  password: { autoCapitalize: "none", autoCorrect: false },
  tel: { keyboardType: "phone-pad" },
  decimal: { keyboardType: "decimal-pad" },
  time: { keyboardType: "number-pad", maxLength: 5 },
  code: { autoCapitalize: "characters", autoCorrect: false, textContentType: "oneTimeCode", style: { fontFamily: MONO, fontSize: 22, letterSpacing: 4 } },
};
export function TextField({ label, value, onChange, type = "text", placeholder, suffix, icon, hint, error, disabled, multiline, maxLength, autoComplete, style, testID }: P<T.TextFieldProps>) {
  const c = useColors(), [show, setShow] = useState(false), time = type === "time";
  const pass = type === "password";
  return (
    <View style={[{ gap: 8 }, disabled && { opacity: 0.4 }, style]} testID={testID}>
      <RNText style={ts(15, 400, c.text2)}>{label}</RNText>
      <FieldBox
        error={!!error}
        input={{
          maxLength, ...KEYBOARD[type], value: time && value != null ? formatTime(value) : value,
          onChangeText: (t) => onChange?.(time ? formatTime(t) : t), placeholder, editable: !disabled, multiline,
          autoComplete: autoComplete as TextInputProps["autoComplete"],
          secureTextEntry: pass && !show, accessibilityLabel: label, accessibilityHint: error || hint,
          style: [KEYBOARD[type]?.style, multiline && { minHeight: 96, paddingVertical: 12, textAlignVertical: "top" }],
        }}
        after={[
          suffix ? <RNText key="s" style={ts(17, 400, c.text2)}>{suffix}</RNText> : null,
          pass ? <IconButton key="p" icon={show ? "eye-off" : "eye"} label={show ? "Esconder senha" : "Mostrar senha"} color={c.text2} style={{ marginRight: -12 }} onPress={() => setShow(!show)} />
            : icon ? <Icon key="i" name={icon} color={c.text2} /> : null,
        ]}
      />
      {error || hint ? <RNText style={ts(15, 400, error ? c.down : c.text2)}>{error || hint}</RNText> : null}
    </View>
  );
}

export function SearchField({ value, onChange, placeholder, label = "Buscar", style, testID }: P<T.SearchFieldProps>) {
  const c = useColors();
  return (
    <View style={style} testID={testID}>
      <FieldBox
        before={<Icon name="search" color={c.text2} />}
        input={{ value, onChangeText: (t) => onChange?.(t), placeholder, accessibilityLabel: label, returnKeyType: "search", autoCorrect: false }}
      />
    </View>
  );
}

export function Select({ label, options, value, onChange, multiple, placeholder, disabled, style, testID }: P<T.SelectProps>) {
  const c = useColors(), [open, setOpen] = useState(false), summary = selectSummary(options, value, multiple);
  const close = () => setOpen(false);
  return (
    <View style={[{ gap: 8 }, disabled && { opacity: 0.4 }, style]} testID={testID}>
      <RNText style={ts(15, 400, c.text2)}>{label}</RNText>
      <Pressable
        onPress={() => setOpen(true)} disabled={disabled} accessibilityRole="button" accessibilityLabel={label}
        accessibilityValue={{ text: summary || placeholder || "" }} accessibilityState={{ disabled: !!disabled, expanded: open }}
        style={pressFx(row, { gap: 12, minHeight: 48, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: c.border, backgroundColor: c.field })}
      >
        <RNText style={[ts(17, 400, summary ? c.text : c.text3), { flex: 1 }]} numberOfLines={1}>{summary || placeholder}</RNText>
        <Icon name="chevron-down" color={c.text2} />
      </Pressable>
      <Sheet open={open} onClose={close} title={label} footer={multiple ? <Button variant="primary" block onPress={close}>Pronto</Button> : null}>
        {multiple
          ? <CheckList items={options.map((o) => ({ id: o.value, label: o.label, description: o.description, disabled: o.disabled }))} selected={(value as string[] | undefined) || []} onChange={(ids) => onChange?.(ids)} />
          : <RadioList options={options} value={value as string | undefined} onChange={(v) => { onChange?.(v); close(); }} />}
      </Sheet>
    </View>
  );
}

// marcas desenhadas: caixa de 22 (canto 6) e rádio de 22
// o ✓ usa a cor do cartão (branco no claro): branco sobre o azul claro do escuro não tem contraste
const checkMark = (c: Colors, state: boolean | "mixed") => (
  <View style={[{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: c.text3, alignItems: "center", justifyContent: "center" }, !!state && { backgroundColor: c.accent, borderColor: c.accent }]}>
    {state ? <Icon name={state === "mixed" ? "minus" : "check"} size={18} color={c.card} /> : null}
  </View>
);
const radioMark = (c: Colors, on: boolean) => (
  <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: on ? c.accent : c.text3, alignItems: "center", justifyContent: "center" }}>
    {on ? <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: c.accent }} /> : null}
  </View>
);

type ChoiceProps = {
  mark: ReactNode; role: "checkbox" | "radio"; checked: boolean | "mixed"; label: ReactNode; description?: ReactNode;
  disabled?: boolean; bold?: boolean; plain?: boolean; after?: boolean; onPress: () => void; style?: StyleProp<ViewStyle>; testID?: string;
};
function Choice({ mark, role, checked, label, description, disabled, bold, plain, after, onPress, style, testID }: ChoiceProps) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress} disabled={disabled} testID={testID} accessibilityRole={role} accessibilityState={{ checked, disabled: !!disabled }}
      style={pressFx(row, { gap: 12, minHeight: 56, paddingVertical: 8, paddingHorizontal: plain ? 0 : 16 }, after && inset(c), style)}
    >
      {mark}
      <View style={{ flex: 1 }}>
        <RNText style={ts(17, bold ? 500 : 400, disabled ? c.text2 : c.text)}>{label}</RNText>
        {description ? <RNText style={ts(15, 400, c.text2)}>{description}</RNText> : null}
      </View>
    </Pressable>
  );
}

export function Checkbox({ label, description, checked, onChange, disabled, style, testID }: P<T.CheckboxProps>) {
  const c = useColors();
  return <Choice mark={checkMark(c, !!checked)} role="checkbox" checked={!!checked} label={label} description={description} disabled={disabled} plain onPress={() => onChange?.(!checked)} style={style} testID={testID} />;
}

export function CheckList({ items, selected, onChange, allLabel = "Selecionar todos", label, style, testID }: P<T.CheckListProps>) {
  const c = useColors(), all = selectAllState(items, selected);
  const allState = all === "all" ? true : all === "some" ? "mixed" : false;
  return (
    <View style={[listBox(c), style]} testID={testID} accessibilityLabel={label}>
      <Choice mark={checkMark(c, allState)} role="checkbox" checked={allState} label={allLabel} bold onPress={() => onChange(toggleAll(items, selected))} />
      {items.map((it) => {
        const on = selected.includes(it.id);
        return <Choice key={it.id} after mark={checkMark(c, on)} role="checkbox" checked={on} label={it.label} description={it.description} disabled={it.disabled} onPress={() => onChange(toggleId(selected, it.id))} />;
      })}
    </View>
  );
}

export function RadioList({ options, value, onChange, label, style, testID }: P<T.RadioListProps>) {
  const c = useColors();
  return (
    <View style={[listBox(c), style]} testID={testID} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((o, i) => (
        <Choice
          key={o.value} after={i > 0} mark={radioMark(c, o.value === value)} role="radio" checked={o.value === value}
          label={o.label} description={o.description} disabled={o.disabled} onPress={() => onChange?.(o.value)}
        />
      ))}
    </View>
  );
}

export function Switch({ label, description, checked, onChange, disabled, style, testID }: P<T.SwitchProps>) {
  const c = useColors();
  return (
    <Pressable
      onPress={() => onChange?.(!checked)} disabled={disabled} testID={testID} accessibilityRole="switch" accessibilityState={{ checked: !!checked, disabled: !!disabled }}
      style={pressFx(cardBox(c), row, { gap: 16, minHeight: 56, paddingVertical: 8, paddingHorizontal: 16 }, disabled && { opacity: 0.4 }, style)}
    >
      <View style={{ flex: 1 }}>
        <RNText style={ts(17, 500, c.text)}>{label}</RNText>
        {description ? <RNText style={ts(15, 400, c.text2)}>{description}</RNText> : null}
      </View>
      <View style={{ width: 52, height: 32, padding: 4, borderRadius: 16, backgroundColor: checked ? c.accent : c.border, alignItems: checked ? "flex-end" : "flex-start" }}>
        <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: c.card }} />
      </View>
    </Pressable>
  );
}

export function Segmented({ options, value, onChange, label, style, testID }: P<T.SegmentedProps>) {
  const c = useColors();
  return (
    <View style={[cardBox(c), { flexDirection: "row", gap: 4, padding: 4, borderRadius: 12 }, style]} testID={testID} accessibilityLabel={label}>
      {options.map((o) => {
        const on = o === value;
        return (
          <Pressable
            key={o} onPress={() => onChange?.(o)} accessibilityRole="button" accessibilityState={{ selected: on }}
            // borda transparente quando apagado: a troca não mexe no tamanho
            style={pressFx({ flex: 1, minHeight: 44, paddingHorizontal: 8, alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: 1.5, borderColor: "transparent" },
              on && { backgroundColor: c.accentTint, borderColor: c.accent })}
          >
            <RNText style={ts(15, 500, on ? c.accent : c.text)} numberOfLines={1}>{o}</RNText>
          </Pressable>
        );
      })}
    </View>
  );
}

const ChipLayout = createContext<NonNullable<T.ChipGroupProps["layout"]>>("wrap");
// filter: só para o FilterChip; fora do contrato
export function Chip({ selected, dashed, icon, onRemove, removeLabel, filter, children, onPress, disabled, style, testID }: P<T.ChipProps> & { filter?: boolean }) {
  const c = useColors(), tiles = useContext(ChipLayout) === "tiles";
  const color = selected ? c.accent : dashed || filter || onRemove ? c.text : c.text2;
  const box: StyleProp<ViewStyle> = [row, { gap: 8, minHeight: 44, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: c.divider, backgroundColor: c.card },
    selected && { borderWidth: 1.5, borderColor: c.accent, backgroundColor: c.accentTint },
    dashed && { borderWidth: 1.5, borderStyle: "dashed", borderColor: c.text3, backgroundColor: "transparent" },
    tiles && { flexDirection: "column", justifyContent: "center", gap: 4, minHeight: 68, paddingVertical: 8, paddingHorizontal: 4 },
    !!onRemove && { paddingRight: 0 }, disabled && { opacity: 0.4 }];
  const inner = (
    <>
      {icon ? <Icon name={icon} color={color} /> : null}
      <RNText style={[ts(tiles ? 13 : 15, 500, color), tiles && { textAlign: "center" }]} numberOfLines={tiles ? 2 : 1}>{children}</RNText>
      {filter ? <Icon name="chevron-down" size={16} color={color} /> : null}
    </>
  );
  if (onRemove) {
    return (
      <View style={[box, style]} testID={testID}>
        {inner}
        <Pressable onPress={onRemove} accessibilityRole="button" accessibilityLabel={removeLabel || "Remover " + children} style={pressFx({ width: 36, height: 44, alignItems: "center", justifyContent: "center" })}>
          <Icon name="close" size={16} color={c.text2} />
        </Pressable>
      </View>
    );
  }
  return <Pressable onPress={onPress} disabled={disabled} testID={testID} accessibilityRole="button" accessibilityState={{ selected: !!selected, disabled: !!disabled }} style={pressFx(box, style)}>{inner}</Pressable>;
}

export function FilterChip(p: P<T.FilterChipProps>) {
  return <Chip {...p} filter />;
}

export function ChipGroup({ label, layout = "wrap", children, style, testID }: P<T.ChipGroupProps>) {
  const c = useColors();
  const items =
    layout === "tiles" ? <Grid columns={4} gap={8}>{children}</Grid>
    : layout === "scroll" ? <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginRight: -20 }} contentContainerStyle={{ gap: 8, paddingRight: 20 }}>{children}</ScrollView>
    : <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{children}</View>;
  return (
    <ChipLayout.Provider value={layout}>
      <View style={[{ gap: 8 }, style]} testID={testID}>{label ? <RNText style={ts(15, 400, c.text2)}>{label}</RNText> : null}{items}</View>
    </ChipLayout.Provider>
  );
}

// faixa do período: inteira por dentro, metade do lado de dentro no início e no fim
const BAND: Partial<Record<RangeRole, ViewStyle>> = { in: { left: 0, right: 0 }, start: { left: "50%", right: 0 }, end: { left: 0, right: "50%" } };
export function Calendar({ start, end, onChange, min, max, style, testID }: P<T.CalendarProps>) {
  const c = useColors(), [month, setMonth] = useState(() => startOfMonth(start || new Date())), today = new Date();
  const k = dayKey(month), out = (d: Date) => (min && dayKey(d) < dayKey(min)) || (max && dayKey(d) > dayKey(max));
  return (
    <View style={[{ gap: 8 }, style]} testID={testID}>
      <View style={[row, { justifyContent: "space-between" }]}>
        <IconButton icon="back" label="Mês anterior" disabled={!!min && k <= dayKey(startOfMonth(min))} onPress={() => setMonth(addMonths(month, -1))} />
        <RNText style={ts(17, 700, c.text)} accessibilityRole="header">{monthLabel(month)}</RNText>
        <IconButton icon="chevron-right" label="Próximo mês" disabled={!!max && k >= dayKey(startOfMonth(max))} onPress={() => setMonth(addMonths(month, 1))} />
      </View>
      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: "row" }}>
          {WEEKDAYS.map(([short, full], i) => <RNText key={i} accessibilityLabel={full} style={[ts(13, 500, c.text2), { flex: 1, paddingVertical: 4, textAlign: "center" }]}>{short}</RNText>)}
        </View>
        {monthGrid(month.getFullYear(), month.getMonth()).map((week, i) => (
          <View key={i} style={{ flexDirection: "row" }}>
            {week.map((d, j) => {
              if (!d) return <View key={j} style={{ flex: 1, height: 44 }} />;
              const role = rangeRole(d, start, end), off = !!out(d), edge = role === "start" || role === "end" || role === "single";
              const band = role ? BAND[role] : undefined;
              return (
                <Pressable
                  key={j} disabled={off} onPress={() => onChange?.(nextRange({ start, end }, d))}
                  accessibilityRole="button" accessibilityLabel={dayLabel(d)} accessibilityState={{ selected: !!role, disabled: off }}
                  style={{ flex: 1, height: 44, alignItems: "center", justifyContent: "center" }}
                >
                  {band ? <View style={[fill, band, { backgroundColor: c.accentTint }]} /> : null}
                  <View style={[{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }, sameDay(d, today) && { borderWidth: 1, borderColor: c.text }, edge && { backgroundColor: c.button }, off && { opacity: 0.5 }]}>
                    <RNText style={[ts(17, edge ? 700 : 400, edge ? c.onButton : off ? c.text3 : c.text), tab]}>{d.getDate()}</RNText>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------- dados
// variação: a seta tem cor e o leitor de tela ouve "alta de" no lugar dela
function Change({ change, trend = "flat", base }: { change: string; trend?: T.Trend; base?: string }) {
  const c = useColors(), [arrow, spoken] = TREND[trend] || TREND.flat;
  return (
    <RNText style={[ts(15, 500, trend === "flat" ? c.text2 : c[trend]), tab]} accessibilityLabel={[spoken, change, base].filter(Boolean).join(" ")}>
      {arrow ? arrow + " " : ""}{change}
      {base ? <RNText style={ts(15, 400, c.text2)}>{" " + base}</RNText> : null}
    </RNText>
  );
}

export function Stat({ label, value, unit, detail, change, trend, base, help, badge, style, testID }: P<T.StatProps>) {
  const c = useColors(), money = unit === "R$";
  const u = unit ? <RNText style={ts(17, 400, c.text2)}>{unit}</RNText> : null;
  return (
    <View style={[cardBox(c), { padding: 16, gap: 4 }, style]} testID={testID}>
      <View style={[row, { gap: 4, minHeight: 22 }]}><RNText style={ts(15, 400, c.text2)}>{label}</RNText>{help}{isText(badge) ? <Badge>{badge}</Badge> : badge}</View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", gap: 4 }}>
        {money ? u : null}<RNText style={[ts(28, 700, c.text), tab]}>{value}</RNText>{money ? null : u}
      </View>
      {tx(detail, [ts(15, 400, c.text2), tab])}
      {change ? <Change change={change} trend={trend} base={base} /> : null}
    </View>
  );
}

export function List({ label, children, style, testID }: P<T.ListProps>) {
  const c = useColors();
  return (
    <View style={[listBox(c), style]} testID={testID} accessibilityLabel={label}>
      {Children.toArray(children).map((ch, i) => (i > 0 && isValidElement(ch) ? cloneElement(ch as ReactElement<{ inset?: boolean }>, { inset: true }) : ch))}
    </View>
  );
}

// inset: posto pela List nas linhas depois da primeira; fora do contrato
export function ListItem({ title, subtitle, leading, trailing, chevron, tone, onPress, disabled, inset: after, style, testID }: P<T.ListItemProps> & { inset?: boolean }) {
  const c = useColors(), base = [row, { gap: 12, minHeight: 64, paddingVertical: 12, paddingHorizontal: 16 }, after && inset(c), disabled && { opacity: 0.4 }, style];
  const kids = (
    <>
      {leading ?? null}
      <View style={{ flex: 1, minWidth: 0 }}>
        {tx(title, ts(17, 500, tone ? c[tone] : c.text))}
        {tx(subtitle, ts(15, 400, c.text2))}
      </View>
      {tx(trailing, [ts(15, 400, c.text2), tab], { numberOfLines: 1 })}
      {(chevron ?? !!onPress) ? <Icon name="chevron-right" size={16} color={c.text3} /> : null}
    </>
  );
  return onPress
    ? <Pressable onPress={onPress} disabled={disabled} testID={testID} accessibilityRole="button" accessibilityState={{ disabled: !!disabled }} style={pressFx(base)}>{kids}</Pressable>
    : <View style={base} testID={testID}>{kids}</View>;
}

export function IconTile({ icon, tone = "accent", round, style, testID }: P<T.IconTileProps>) {
  const c = useColors();
  const [bg, fg] = ({ neutral: [c.chip, c.text2], up: [c.upTint, c.up], down: [c.chip, c.down] } as Record<string, [string, string]>)[tone] || [c.accentTint, c.accent];
  return (
    <View style={[{ width: 40, height: 40, borderRadius: round ? 20 : 12, backgroundColor: bg, alignItems: "center", justifyContent: "center" }, style]} testID={testID}>
      <Icon name={icon} color={fg} />
    </View>
  );
}

export function Avatar({ initials, src, size = 40, label, style, testID }: P<T.AvatarProps>) {
  const c = useColors();
  return (
    <View
      style={[{ width: size, height: size, borderRadius: size / 2, overflow: "hidden", backgroundColor: c.accentTint, alignItems: "center", justifyContent: "center" }, style]}
      testID={testID} accessible={!!label} accessibilityRole={label ? "image" : undefined} accessibilityLabel={label}
    >
      {src ? <Image source={{ uri: src }} style={{ width: size, height: size }} /> : <RNText style={ts(15, 700, c.accent)}>{initials}</RNText>}
    </View>
  );
}

export function Badge({ tone = "neutral", children, style, testID }: P<T.BadgeProps>) {
  const c = useColors();
  const [bg, fg, w, r] = ({ accent: [c.accentTint, c.accent, 500, 8], danger: [c.down, c.bg, 700, 12] } as Record<string, [string, string, Peso, number]>)[tone] || [c.chip, c.label, 500, 8];
  return (
    <View style={[{ minWidth: 24, height: 24, paddingHorizontal: 8, borderRadius: r, backgroundColor: bg, alignItems: "center", justifyContent: "center" }, style]} testID={testID}>
      <RNText style={[ts(13, w, fg), tab]} numberOfLines={1}>{children}</RNText>
    </View>
  );
}

export function Status({ tone = "neutral", children, style, testID }: P<T.StatusProps>) {
  const c = useColors(), color = ({ ok: c.up, danger: c.down } as Record<string, string>)[tone] || c.text2;
  return (
    <View style={[row, { gap: 8 }, style]} testID={testID}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <RNText style={ts(15, 400, color)}>{children}</RNText>
    </View>
  );
}

export function DetailList({ items, style, testID }: P<T.DetailListProps>) {
  const c = useColors();
  return (
    <View style={style} testID={testID}>
      {items.map((it, i) => (
        <View key={i} style={[row, { justifyContent: "space-between", gap: 12, minHeight: 48 }, i > 0 && { borderTopWidth: 1, borderTopColor: c.divider }]}>
          {tx(it.term, [ts(15, 400, c.text2), { flexShrink: 1 }])}
          {tx(it.value, [ts(17, 500, it.tone ? c[it.tone] : c.text), tab, { flexShrink: 1, textAlign: "right" }])}
        </View>
      ))}
    </View>
  );
}

export function Table({ caption, columns, rows, sort, onSort, style, testID }: P<T.TableProps>) {
  const c = useColors(), [widths, setWidths] = useState<Record<string, number>>({});
  // sem layout de tabela no RN: o conteúdo de cada célula mede a largura e a coluna fica com a maior
  // (mede o miolo, não a célula: a primeira coluna estica e realimentaria a medida)
  // shortcut: a largura só cresce (não encolhe quando os dados mudam); medir de novo se isso aparecer
  const measure = (key: string) => (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setWidths((o) => (o[key] >= w ? o : { ...o, [key]: w }));
  };
  const align = (col: T.Column) => (col.align === "end" ? "flex-end" : "flex-start");
  const box = (col: T.Column, j: number): StyleProp<ViewStyle> => [{ paddingVertical: 12, paddingHorizontal: 16, justifyContent: "center", alignItems: align(col) }, j === 0 && { flexGrow: 1 }];
  const sized = (col: T.Column, content: ReactNode) => <View onLayout={measure(col.key)} style={{ minWidth: widths[col.key], alignItems: align(col) }}>{content}</View>;
  return (
    <View style={[listBox(c), style]} testID={testID} accessibilityLabel={caption}>
      <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flexGrow: 1 }}>
          <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: c.divider }}>
            {columns.map((col, j) => {
              const on = sort?.key === col.key, asc = sort?.dir === "asc";
              const text = sized(col, <RNText style={ts(13, 700, on ? c.accent : c.text2)} numberOfLines={1}>{col.label + (on ? (asc ? " ▲" : " ▼") : "")}</RNText>);
              const cell = [box(col, j), { minHeight: 44 }];
              return col.sortable
                ? <Pressable key={col.key} style={cell} onPress={() => onSort?.(col.key)} accessibilityRole="button" accessibilityLabel={col.label + (on ? (asc ? ", ordem crescente" : ", ordem decrescente") : "")}>{text}</Pressable>
                : <View key={col.key} style={cell}>{text}</View>;
            })}
          </View>
          {rows.map((r, i) => (
            <View key={i} style={[{ flexDirection: "row" }, i > 0 && { borderTopWidth: 1, borderTopColor: c.divider }]}>
              {columns.map((col, j) => <View key={col.key} style={box(col, j)}>{sized(col, tx(r[col.key], [ts(15, j === 0 ? 500 : 400, c.text), tab], { numberOfLines: 1 }))}</View>)}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const pct = (v: number) => `${v * 100}%` as DimensionValue;
export function ProgressBar({ value, marker, label, style, testID }: P<T.ProgressBarProps>) {
  const c = useColors(), v = clamp01(value);
  return (
    <View
      style={[{ height: 8, borderRadius: 4, backgroundColor: c.borderStrong }, style]} testID={testID}
      accessible accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: 100, now: Math.round(v * 100) }}
    >
      <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: pct(v), borderRadius: 4, backgroundColor: c.accent }} />
      {marker != null ? <View style={{ position: "absolute", top: -4, left: pct(clamp01(marker)), width: 2, height: 16, marginLeft: -1, borderRadius: 1, backgroundColor: c.text }} /> : null}
    </View>
  );
}

export function BarList({ items, numbered, label, style, testID }: P<T.BarListProps>) {
  const c = useColors(), split: StyleProp<ViewStyle> = [row, { alignItems: "baseline", justifyContent: "space-between", gap: 12 }];
  return (
    <View style={[listBox(c), style]} testID={testID} accessibilityLabel={label}>
      {items.map((it, i) => (
        <View key={i} style={[{ padding: 16, gap: 8 }, i > 0 && { borderTopWidth: 1, borderTopColor: c.divider }]}>
          <View style={split}>
            <RNText style={[ts(17, 500, c.text), { flexShrink: 1 }]}>{(numbered ? i + 1 + ". " : "") + it.label}</RNText>
            <RNText style={[ts(22, 700, c.text), tab]}>{it.value}</RNText>
          </View>
          <ProgressBar value={it.ratio} marker={it.marker} label={it.label} />
          {it.detail != null || it.change
            ? <View style={split}>{tx(it.detail ?? "", [ts(15, 400, c.text2), { flexShrink: 1 }])}{it.change ? <Change change={it.change} trend={it.trend} /> : null}</View>
            : null}
        </View>
      ))}
    </View>
  );
}

export function Accordion({ title, defaultOpen, children, style, testID }: P<T.AccordionProps>) {
  const c = useColors(), [open, setOpen] = useState(!!defaultOpen);
  return (
    <View style={[cardBox(c), style]} testID={testID}>
      <Pressable onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityState={{ expanded: open }} style={pressFx(row, { justifyContent: "space-between", gap: 12, minHeight: 56, paddingVertical: 8, paddingHorizontal: 16 })}>
        <RNText style={[ts(17, 500, c.text), { flex: 1 }]}>{title}</RNText>
        <View style={open && { transform: [{ rotate: "180deg" }] }}><Icon name="chevron-down" color={c.text2} /></View>
      </Pressable>
      {open ? <View style={{ gap: 12, paddingHorizontal: 16, paddingBottom: 16 }}>{tx(children, body(c))}</View> : null}
    </View>
  );
}

export function Steps({ steps, current, style, testID }: P<T.StepsProps>) {
  const c = useColors();
  return (
    <View style={[{ gap: 8 }, style]} testID={testID}>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {steps.map((_, i) => <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= current ? c.accent : c.borderStrong }} />)}
      </View>
      <RNText style={ts(15, 400, c.text2)}>{`${current + 1} de ${steps.length} · `}<RNText style={ts(15, 500, c.text)}>{steps[current]}</RNText></RNText>
    </View>
  );
}

export function Pagination({ page, pageSize, total, onChange, style, testID }: P<T.PaginationProps>) {
  const c = useColors(), last = Math.max(1, Math.ceil(total / pageSize));
  return (
    <View style={[row, { justifyContent: "flex-end", gap: 4 }, style]} testID={testID}>
      <IconButton icon="back" label="Página anterior" disabled={page <= 1} onPress={() => onChange(page - 1)} />
      <RNText style={[ts(15, 400, c.text2), tab]}>{pageLabel(page, pageSize, total)}</RNText>
      <IconButton icon="chevron-right" label="Próxima página" disabled={page >= last} onPress={() => onChange(page + 1)} />
    </View>
  );
}

// ---------- gráficos: charts.ts desenha; aqui só a largura medida
function Chart<X extends T.ChartBase>({ draw, p }: { draw: (o: X, d: Draw) => Drawn; p: P<X> }) {
  const c = useColors(), [width, setWidth] = useState(0);
  const out = width ? draw(p, { width, palette: c, native: true }) : null;
  return (
    <View style={p.style} testID={p.testID} accessible accessibilityRole="image" accessibilityLabel={p.label} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {out ? <SvgXml xml={out.svg} width={width} height={out.height} /> : null}
    </View>
  );
}
export function LineChart(p: P<T.LineChartProps>) {
  return <Chart draw={lineChart} p={p} />;
}
export function BarChart(p: P<T.BarChartProps>) {
  return <Chart draw={barChart} p={p} />;
}
export function ScatterChart(p: P<T.ScatterChartProps>) {
  return <Chart draw={scatterChart} p={p} />;
}
export function Heatmap(p: P<T.HeatmapProps>) {
  return <Chart draw={heatmap} p={p} />;
}

export function Legend({ items, style, testID }: P<T.LegendProps>) {
  const c = useColors(), sq: ViewStyle = { width: 12, height: 12 };
  const swatch: Record<T.LegendProps["items"][number]["kind"], () => ReactNode> = {
    line: () => <View style={{ width: 20, height: 3, borderRadius: 2, backgroundColor: c.accent }} />,
    dashed: () => <View style={{ flexDirection: "row", width: 20, gap: 4 }}>{[0, 1, 2].map((i) => <View key={i} style={{ width: 4, height: 2, backgroundColor: c.text2 }} />)}</View>,
    bar: () => <View style={[sq, { backgroundColor: c.text }]} />,
    highlight: () => <View style={[sq, { backgroundColor: c.accent }]} />,
    band: () => <View style={[sq, { backgroundColor: c.divider, borderWidth: 1, borderColor: c.border }]} />,
    gap: () => <Svg width={12} height={12}><Path d="M3 0L0 3M10 0L0 10M17 0L0 17M24 0L0 24" stroke={c.hatch} strokeWidth={3} /></Svg>,
  };
  return (
    <View style={[row, { flexWrap: "wrap", gap: 16 }, style]} testID={testID}>
      {items.map((it, i) => <View key={i} style={[row, { gap: 8 }]}>{swatch[it.kind]()}<RNText style={ts(13, 400, c.text2)}>{it.label}</RNText></View>)}
    </View>
  );
}

// ---------- camadas
const scrim = (c: Colors): StyleProp<ViewStyle> => [fill, { backgroundColor: c.scrim, opacity: 0.72 }];

export function Sheet({ open, onClose, title, subtitle, footer, children, style, testID }: P<T.SheetProps>) {
  const c = useColors(), insets = useSafeAreaInsets();
  return (
    <Modal visible={!!open} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Pressable style={scrim(c)} onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar" />
        <View
          style={[{ maxHeight: "92%", gap: 20, paddingHorizontal: 20, paddingTop: 8, paddingBottom: insets.bottom + 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: c.sheet }, style]}
          testID={testID} accessibilityViewIsModal
        >
          <View style={{ alignSelf: "center", width: 36, height: 4, borderRadius: 2, backgroundColor: c.borderStrong }} />
          <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <View style={{ flex: 1, gap: 2 }}>
              <RNText style={ts(22, 700, c.text)} accessibilityRole="header">{title}</RNText>
              {subtitle ? <RNText style={ts(15, 400, c.text2)}>{subtitle}</RNText> : null}
            </View>
            <IconButton icon="close" label="Fechar" variant="filled" onPress={onClose} />
          </View>
          {/* flexGrow 0: a rolagem fica do tamanho do conteúdo e só encolhe no limite de 92% */}
          <ScrollView style={{ flexGrow: 0 }} keyboardShouldPersistTaps="handled">{tx(children, ts(15, 400, c.text2))}</ScrollView>
          {footer ? <View style={{ gap: 8 }}>{tx(footer, ts(15, 400, c.text2))}</View> : null}
        </View>
      </View>
    </Modal>
  );
}

// janela no centro: largura min(440, tela − 40) pela margem de 20
type CenteredProps = { open: boolean; onClose: () => void; dismissable?: boolean; children?: ReactNode; style?: StyleProp<ViewStyle>; testID?: string };
function Centered({ open, onClose, dismissable, children, style, testID }: CenteredProps) {
  const c = useColors();
  return (
    <Modal visible={!!open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
        {dismissable ? <Pressable style={scrim(c)} onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar" /> : <View style={scrim(c)} />}
        <View
          style={[{ width: "100%", maxWidth: 440, gap: 12, padding: 24, borderRadius: 20, borderWidth: 1, borderColor: c.divider, backgroundColor: c.sheet }, style]}
          testID={testID} accessibilityViewIsModal
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}
const actionsRow = (nodes: ReactNode, c: Colors) => (
  <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
    {Children.toArray(nodes).map((n, i) => <View key={(isValidElement(n) && n.key) || i} style={{ flex: 1 }}>{tx(n, ts(15, 400, c.text2))}</View>)}
  </View>
);

export function Dialog({ open, onClose, title, footer, children, style, testID }: P<T.DialogProps>) {
  const c = useColors();
  return (
    <Centered open={open} onClose={onClose} dismissable style={style} testID={testID}>
      <View style={[row, { justifyContent: "space-between", gap: 12 }]}>
        <RNText style={[ts(20, 700, c.text), { flex: 1 }]} accessibilityRole="header">{title}</RNText>
        <IconButton icon="close" label="Fechar" onPress={onClose} />
      </View>
      {tx(children, ts(15, 400, c.text2))}
      {footer ? actionsRow(footer, c) : null}
    </Centered>
  );
}

// tocar fora não fecha: só Cancelar (ou o voltar do Android) desiste
export function ConfirmDialog({ open, title, message, confirmLabel = "Excluir", cancelLabel = "Cancelar", danger = true, onConfirm, onCancel, style, testID }: P<T.ConfirmDialogProps>) {
  const c = useColors();
  return (
    <Centered open={open} onClose={onCancel} style={style} testID={testID}>
      <RNText style={ts(20, 700, c.text)} accessibilityRole="header">{title}</RNText>
      {message ? <RNText style={ts(15, 400, c.text2)}>{message}</RNText> : null}
      {actionsRow([
        <Button key="n" variant="secondary" block onPress={onCancel}>{cancelLabel}</Button>,
        <Button key="y" variant={danger ? "danger" : "primary"} block onPress={onConfirm}>{confirmLabel}</Button>,
      ], c)}
    </Centered>
  );
}

export function Popover({ open, onClose, title, children, style, testID }: P<T.PopoverProps>) {
  return <Sheet open={open} onClose={onClose} title={title} style={style} testID={testID}>{children}</Sheet>;
}

export function Toast({ open, onClose, message, tone = "neutral", duration = 4000, action, style, testID }: P<T.ToastProps>) {
  const c = useColors(), insets = useSafeAreaInsets(), close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    // o iOS não lê região viva: anuncia; o Android lê pelo accessibilityLiveRegion
    if (Platform.OS === "ios") AccessibilityInfo.announceForAccessibility(message);
    const t = setTimeout(() => close.current?.(), duration);
    return () => clearTimeout(t);
  }, [open, message, duration]);
  if (!open) return null;
  return (
    <View style={{ pointerEvents: "box-none", position: "absolute", left: 20, right: 20, bottom: insets.bottom + 96, alignItems: "center" }}>
      <View
        style={[row, { gap: 12, minHeight: 48, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, backgroundColor: tone === "danger" ? c.down : c.text }, style]}
        testID={testID} accessibilityLiveRegion="polite" accessibilityRole="alert"
      >
        <RNText style={[ts(15, 500, c.bg), { flexShrink: 1 }]}>{message}</RNText>
        {action
          ? (
            <Pressable onPress={action.onPress} disabled={action.disabled} accessibilityRole="button" style={pressFx({ minHeight: 44, marginVertical: -8, marginRight: -8, paddingHorizontal: 12, justifyContent: "center", borderRadius: 8 })}>
              <RNText style={ts(15, 700, c.bg)}>{action.label}</RNText>
            </Pressable>
          )
          : null}
      </View>
    </View>
  );
}

// ---------- estados
export function Notice({ tone = "info", title, children, action, style, testID }: P<T.NoticeProps>) {
  const c = useColors(), [icon, color] = ({ danger: ["alert", c.down], offline: ["wifi", c.text2] } as Record<string, [T.IconName, string]>)[tone] || ["info", c.accent];
  return (
    <View style={[cardBox(c), { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start", gap: 12, padding: 16 }, style]} testID={testID}>
      <Icon name={icon} color={color} />
      <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 200, gap: 2 }}>
        <RNText style={ts(17, 500, c.text)}>{title}</RNText>
        {tx(children, ts(15, 400, c.text2))}
      </View>
      {action ? <Button variant="secondary" size="sm" onPress={action.onPress} disabled={action.disabled} style={{ alignSelf: "center" }}>{action.label}</Button> : null}
    </View>
  );
}

export function EmptyState({ icon = "info", title, description, action, style, testID }: P<T.EmptyStateProps>) {
  const c = useColors();
  return (
    <View style={[{ alignItems: "center", gap: 8, paddingVertical: 32, paddingHorizontal: 16 }, style]} testID={testID}>
      <IconTile icon={icon} tone="neutral" />
      <RNText style={[ts(17, 500, c.text), { marginTop: 4, textAlign: "center" }]}>{title}</RNText>
      {description ? <RNText style={[ts(15, 400, c.text2), { textAlign: "center" }]}>{description}</RNText> : null}
      {action ? <Button variant="secondary" onPress={action.onPress} disabled={action.disabled} style={{ marginTop: 8 }}>{action.label}</Button> : null}
    </View>
  );
}

export function Skeleton({ width, height = 16, radius = 8, style, testID }: P<T.SkeletonProps>) {
  const c = useColors(), opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined, alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!alive || reduce) return;
      const to = (toValue: number) => Animated.timing(opacity, { toValue, duration: 700, useNativeDriver: true });
      loop = Animated.loop(Animated.sequence([to(0.5), to(1)]));
      loop.start();
    });
    return () => { alive = false; loop?.stop(); };
  }, []);
  return <Animated.View style={[{ width: width as DimensionValue, height, borderRadius: radius, backgroundColor: c.chip, opacity }, style]} testID={testID} />;
}

export function Spinner({ size, label = "Carregando", style, testID }: P<T.SpinnerProps>) {
  const c = useColors();
  // o iOS só conhece "small" e "large"
  const tam = size == null ? "small" : Platform.OS === "ios" ? (size > 24 ? "large" : "small") : size;
  return <ActivityIndicator size={tam} color={c.accent} style={style} testID={testID} accessibilityLabel={label} />;
}
