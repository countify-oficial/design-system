import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Componentes do Countify para React Native: as props vêm do contrato (types.ts), as medidas dos css/.
// Letra pela família (Roboto_700Bold), nunca fontWeight: o Android perde a família.
import { createContext, useContext, useState, useEffect, useRef, Children, cloneElement, isValidElement, } from "react";
import { View, Text as RNText, Pressable, TextInput, Modal, ScrollView, Image, ActivityIndicator, Animated, AccessibilityInfo, Platform, useColorScheme, } from "react-native";
import { Svg, Rect, Circle, Path, SvgXml } from "react-native-svg";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, font } from "../tokens.js";
import { icons } from "../icons.js";
import { logo } from "../logo.js";
import { lineChart, barChart, scatterChart, heatmap } from "../charts.js";
import { selectAllState, toggleAll, toggleId, monthGrid, rangeRole, nextRange, addMonths, startOfMonth, dayKey, sameDay, monthLabel, dayLabel, WEEKDAYS, formatTime, clamp01, pageLabel, TREND, selectSummary, } from "../lib.js";
// ---------- estilos comuns
const ts = (fontSize, w = 400, color) => ({ fontSize, fontFamily: font.native[w], color });
const tab = { fontVariant: ["tabular-nums"] };
const caps = { textTransform: "uppercase", letterSpacing: 1 };
const row = { flexDirection: "row", alignItems: "center" };
const fill = { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 };
const cardBox = (c) => ({ backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.divider });
const listBox = (c) => [cardBox(c), { overflow: "hidden" }];
const inset = (c) => ({ marginLeft: 16, paddingLeft: 0, borderTopWidth: 1, borderTopColor: c.divider });
const pressFx = (...s) => ({ pressed }) => [s, pressed && { opacity: 0.8 }];
// texto solto precisa de <Text> no React Native; elementos passam como estão
const isText = (n) => typeof n === "string" || typeof n === "number" || (Array.isArray(n) && n.every(isText));
const body = (c) => ts(17, 400, c.text);
const tx = (node, style, extra) => (isText(node) ? _jsx(RNText, { style: style, ...extra, children: node }) : node ?? null);
// ---------- base
const ThemeCtx = createContext(null);
export function ThemeProvider({ scheme, children }) {
    return _jsx(ThemeCtx.Provider, { value: scheme || null, children: children });
}
/** nativo: cores do modo atual, para estilos próprios do app. */
export function useColors() {
    const forced = useContext(ThemeCtx), system = useColorScheme();
    // "unspecified" (RN novo) cai no claro
    return (forced || system) === "dark" ? colors.dark : colors.light;
}
export function Icon({ name, size = 22, color, label, style, testID }) {
    const c = useColors();
    if (icons[name] == null)
        throw new Error("Ícone desconhecido: " + name);
    const xml = `<svg viewBox="0 0 22 22" fill="none" stroke="${color || c.text}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
    return _jsx(SvgXml, { xml: xml, width: size, height: size, style: style, testID: testID, accessible: !!label, accessibilityRole: label ? "image" : undefined, accessibilityLabel: label });
}
export function Logo({ variant = "full", height = 32, label = "Countify", style, testID }) {
    const c = useColors(), [x, y, w, h] = logo.box[variant];
    const quadrado = variant === "full" || variant === "icon", nome = variant !== "icon", avatar = variant === "avatar";
    const ring = { fill: "none", strokeWidth: 5.86 };
    // avatar: o círculo tem a cor do quadrado, então o nome e o "o" ficam na cor do anel
    const letra = avatar ? c.logoRing : c.logoWord, o = avatar ? c.logoRing : c.logoTile;
    return (_jsxs(Svg, { width: (height * w) / h, height: height, viewBox: `${x} ${y} ${w} ${h}`, style: style, testID: testID, accessible: true, accessibilityRole: "image", accessibilityLabel: label, children: [avatar && _jsx(Circle, { cx: logo.avatar.cx, cy: logo.avatar.cy, r: logo.avatar.r, fill: c.logoTile }), quadrado && _jsx(Rect, { width: 40, height: 40, rx: 8.92, fill: c.logoTile }), quadrado && _jsx(Circle, { cx: 20, cy: 20, r: 10.55, stroke: c.logoRing, ...ring }), quadrado && _jsx(Path, { d: "M20 9.45A10.55 10.55 0 0 1 30.55 20", stroke: c.logoArc, ...ring }), nome && _jsx(Path, { d: logo.word, fill: letra }), nome && _jsx(Circle, { cx: logo.o.cx, cy: logo.o.cy, r: logo.o.r, fill: "none", stroke: o, strokeWidth: logo.o.stroke }), nome && _jsx(Path, { d: logo.o.arc, fill: "none", stroke: c.logoArc, strokeWidth: logo.o.stroke })] }));
}
const VARIANTS = { page: [22, 700], section: [20, 700], number: [28, 700], body: [17, 400], label: [15, 400], small: [13, 400], overline: [13, 700] };
export function Text({ variant = "body", tone = "default", weight, numberOfLines, children, style, testID }) {
    const c = useColors(), [size, w] = VARIANTS[variant];
    const color = { muted: c.text2, accent: c.accent, up: c.up, down: c.down }[tone] || c.text;
    const header = variant === "page" || variant === "section";
    return (_jsx(RNText, { style: [ts(size, weight || w, color), variant === "number" && tab, variant === "overline" && caps, style], numberOfLines: numberOfLines, testID: testID, accessibilityRole: header ? "header" : undefined, children: children }));
}
// ---------- estrutura
export function Screen({ scroll = true, children, style, testID }) {
    const c = useColors(), pad = { padding: 20, paddingTop: 16, paddingBottom: 24, gap: 24 };
    return (_jsx(SafeAreaView, { edges: ["top", "left", "right"], style: [{ flex: 1, backgroundColor: c.bg }, style], testID: testID, children: scroll
            ? _jsx(ScrollView, { contentContainerStyle: pad, keyboardShouldPersistTaps: "handled", children: tx(children, body(c)) })
            : _jsx(View, { style: [pad, { flex: 1 }], children: tx(children, body(c)) }) }));
}
export function Grid({ columns = 2, gap = 12, children, style, testID }) {
    const c = useColors(), items = Children.toArray(children), rows = [];
    for (let i = 0; i < items.length; i += columns)
        rows.push(items.slice(i, i + columns));
    return (_jsx(View, { style: [{ gap }, style], testID: testID, children: rows.map((r, i) => (_jsx(View, { style: { flexDirection: "row", gap }, children: [...r, ...Array(columns - r.length).fill(null)].map((x, j) => _jsx(View, { style: { flex: 1, minWidth: 0 }, children: tx(x, body(c)) }, j)) }, i))) }));
}
export function Card({ padding = 16, gap = 16, children, style, testID }) {
    const c = useColors();
    return _jsx(View, { style: [cardBox(c), { padding, gap }, style], testID: testID, children: tx(children, body(c)) });
}
export function Divider({ style, testID }) {
    const c = useColors();
    return _jsx(View, { style: [{ height: 1, alignSelf: "stretch", backgroundColor: c.divider }, style], testID: testID });
}
export function SectionTitle({ children, help, action, style, testID }) {
    const c = useColors();
    return (_jsxs(View, { style: [row, { minHeight: 44, justifyContent: "space-between", gap: 12 }, style], testID: testID, children: [_jsxs(View, { style: [row, { gap: 4, flexShrink: 1 }], children: [_jsx(RNText, { style: ts(20, 700, c.text), accessibilityRole: "header", children: children }), help] }), tx(action, ts(17, 500, c.accent))] }));
}
export function SectionLabel({ children, style, testID }) {
    const c = useColors();
    return _jsx(RNText, { style: [ts(13, 700, c.text2), caps, style], testID: testID, accessibilityRole: "header", children: children });
}
export function PageHeader({ title, subtitle, eyebrow, back, onTitlePress, titleLabel, actions, style, testID }) {
    const c = useColors();
    const titleText = _jsx(RNText, { style: [ts(22, 700, c.text), { flexShrink: 1 }], accessibilityRole: "header", children: title });
    return (_jsxs(View, { style: [{ gap: 4 }, style], testID: testID, children: [back && (_jsxs(Pressable, { onPress: back.onPress, disabled: back.disabled, accessibilityRole: "button", style: pressFx(row, { gap: 4, minHeight: 44, alignSelf: "flex-start" }), children: [_jsx(Icon, { name: "back", size: 16, color: c.accent }), _jsx(RNText, { style: ts(15, 500, c.accent), children: back.label })] })), eyebrow ? _jsx(RNText, { style: [ts(13, 700, c.accent), caps], children: eyebrow }) : null, onTitlePress
                ? (_jsxs(Pressable, { onPress: onTitlePress, accessibilityRole: "button", accessibilityLabel: titleLabel, style: pressFx(row, { gap: 8, minHeight: 44, alignSelf: "flex-start" }), children: [titleText, _jsx(Icon, { name: "chevron-down", color: c.text })] }))
                : titleText, tx(subtitle, ts(15, 400, c.text2)), actions ? _jsx(View, { style: [row, { flexWrap: "wrap", gap: 8, marginTop: 12 }], children: actions }) : null] }));
}
// barra de abas para o tabBar do Expo Router <Tabs>; não é absoluta, ocupa o pé da tela
export function NavBar({ items, label, style, testID }) {
    const c = useColors(), insets = useSafeAreaInsets();
    return (_jsx(View, { style: [cardBox(c), { flexDirection: "row", gap: 4, margin: 12, marginBottom: insets.bottom + 8, padding: 4 }, style], testID: testID, accessibilityRole: "tablist", accessibilityLabel: label, children: items.map((it, i) => {
            const color = it.current ? c.accent : c.label;
            return (_jsxs(Pressable, { onPress: it.onPress, disabled: it.disabled, accessibilityRole: "tab", accessibilityLabel: it.badge ? `${it.label}, ${it.badge}` : it.label, accessibilityState: { selected: !!it.current, disabled: !!it.disabled }, style: pressFx({ flex: 1, minHeight: 56, alignItems: "center", justifyContent: "center", gap: 2, paddingHorizontal: 4, borderRadius: 12 }, it.current && { backgroundColor: c.accentTint }), children: [_jsxs(View, { children: [_jsx(Icon, { name: it.icon, color: color }), (it.badge ?? 0) > 0 && _jsx(Badge, { tone: "danger", style: { position: "absolute", top: -4, left: 17 }, children: it.badge })] }), _jsx(RNText, { style: ts(13, 500, color), numberOfLines: 1, children: it.label })] }, i));
        }) }));
}
// ---------- ações
export function Button({ variant = "primary", size = "md", block, icon, loading, disabled, onPress, children, style, testID }) {
    const c = useColors(), sm = size === "sm", off = disabled || loading;
    const fg = { primary: c.onButton, danger: c.bg, "danger-text": c.down }[variant] || c.text;
    const look = {
        primary: { backgroundColor: c.button },
        secondary: { borderWidth: 1, borderColor: c.borderStrong },
        danger: { backgroundColor: c.down },
        "danger-text": { minHeight: 44, paddingHorizontal: 12 },
        dashed: { borderWidth: 1.5, borderStyle: "dashed", borderColor: c.text3 },
    };
    return (_jsxs(Pressable, { onPress: onPress, disabled: off, testID: testID, accessibilityRole: "button", accessibilityState: { disabled: !!off, busy: !!loading }, style: pressFx(row, { justifyContent: "center", gap: 8, minHeight: sm ? 44 : 52, paddingHorizontal: sm ? 16 : 20, borderRadius: 12 }, look[variant], block && { alignSelf: "stretch" }, disabled && !loading && { opacity: 0.4 }, style), children: [loading ? _jsx(ActivityIndicator, { color: fg }) : icon ? _jsx(Icon, { name: icon, size: 18, color: fg }) : null, _jsx(RNText, { style: ts(sm ? 15 : 17, variant === "primary" || variant === "danger" ? 700 : 500, fg), numberOfLines: 1, children: children })] }));
}
// color e size: só para uso interno (HelpButton, olho da senha); fora do contrato
export function IconButton({ icon, label, variant = "plain", onPress, disabled, color, size, style, testID }) {
    const c = useColors();
    return (_jsx(Pressable, { onPress: onPress, disabled: disabled, testID: testID, accessibilityRole: "button", accessibilityLabel: label, accessibilityState: { disabled: !!disabled }, style: pressFx({ width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" }, variant === "filled" && { backgroundColor: c.chip }, disabled && { opacity: 0.4 }, style), children: _jsx(Icon, { name: icon, size: size, color: color || c.text }) }));
}
export function HelpButton({ topic, onPress, disabled, style, testID }) {
    const c = useColors();
    // margem negativa: o "?" não aumenta a altura da linha
    return _jsx(IconButton, { icon: "help", label: "Ajuda: " + topic, onPress: onPress, disabled: disabled, size: 20, color: c.text2, style: [{ marginVertical: -10, borderRadius: 22 }, style], testID: testID });
}
export function ActionLink({ children, chevron = true, onPress, disabled, style, testID }) {
    const c = useColors();
    return (_jsxs(Pressable, { onPress: onPress, disabled: disabled, testID: testID, accessibilityRole: "link", accessibilityState: { disabled: !!disabled }, style: pressFx(row, { gap: 4, minHeight: 44 }, disabled && { opacity: 0.4 }, style), children: [_jsx(RNText, { style: ts(17, 500, c.accent), children: children }), chevron && _jsx(Icon, { name: "chevron-right", size: 16, color: c.accent })] }));
}
// ---------- entrada
// caixa do campo: contorno de 1, 2 com foco ou erro; o recuo compensa a borda para o texto não pular
function FieldBox({ error, before, after, input }) {
    const c = useColors(), [focus, setFocus] = useState(false), bw = focus || error ? 2 : 1;
    return (_jsxs(View, { style: [row, { gap: 12, minHeight: 48, paddingHorizontal: 17 - bw, borderRadius: 12, borderWidth: bw, backgroundColor: c.field, borderColor: error ? c.down : focus ? c.accent : c.border }], children: [before, _jsx(TextInput, { placeholderTextColor: c.text3, ...input, onFocus: () => setFocus(true), onBlur: () => setFocus(false), style: [{ flex: 1, alignSelf: "stretch", minHeight: 44, padding: 0, color: c.text }, ts(17, 400, c.text), input.style] }), after] }));
}
const MONO = Platform.OS === "ios" ? "Menlo" : "monospace";
const KEYBOARD = {
    email: { keyboardType: "email-address", autoCapitalize: "none" },
    password: { autoCapitalize: "none", autoCorrect: false },
    tel: { keyboardType: "phone-pad" },
    decimal: { keyboardType: "decimal-pad" },
    time: { keyboardType: "number-pad", maxLength: 5 },
    code: { autoCapitalize: "characters", autoCorrect: false, textContentType: "oneTimeCode", style: { fontFamily: MONO, fontSize: 22, letterSpacing: 4 } },
};
export function TextField({ label, value, onChange, type = "text", placeholder, suffix, icon, hint, error, disabled, multiline, maxLength, autoComplete, style, testID }) {
    const c = useColors(), [show, setShow] = useState(false), time = type === "time";
    const pass = type === "password";
    return (_jsxs(View, { style: [{ gap: 8 }, disabled && { opacity: 0.4 }, style], testID: testID, children: [_jsx(RNText, { style: ts(15, 400, c.text2), children: label }), _jsx(FieldBox, { error: !!error, input: {
                    maxLength, ...KEYBOARD[type], value: time && value != null ? formatTime(value) : value,
                    onChangeText: (t) => onChange?.(time ? formatTime(t) : t), placeholder, editable: !disabled, multiline,
                    autoComplete: autoComplete,
                    secureTextEntry: pass && !show, accessibilityLabel: label, accessibilityHint: error || hint,
                    style: [KEYBOARD[type]?.style, multiline && { minHeight: 96, paddingVertical: 12, textAlignVertical: "top" }],
                }, after: [
                    suffix ? _jsx(RNText, { style: ts(17, 400, c.text2), children: suffix }, "s") : null,
                    pass ? _jsx(IconButton, { icon: show ? "eye-off" : "eye", label: show ? "Esconder senha" : "Mostrar senha", color: c.text2, style: { marginRight: -12 }, onPress: () => setShow(!show) }, "p")
                        : icon ? _jsx(Icon, { name: icon, color: c.text2 }, "i") : null,
                ] }), error || hint ? _jsx(RNText, { style: ts(15, 400, error ? c.down : c.text2), children: error || hint }) : null] }));
}
export function SearchField({ value, onChange, placeholder, label = "Buscar", style, testID }) {
    const c = useColors();
    return (_jsx(View, { style: style, testID: testID, children: _jsx(FieldBox, { before: _jsx(Icon, { name: "search", color: c.text2 }), input: { value, onChangeText: (t) => onChange?.(t), placeholder, accessibilityLabel: label, returnKeyType: "search", autoCorrect: false } }) }));
}
export function Select({ label, options, value, onChange, multiple, placeholder, disabled, style, testID }) {
    const c = useColors(), [open, setOpen] = useState(false), summary = selectSummary(options, value, multiple);
    const close = () => setOpen(false);
    return (_jsxs(View, { style: [{ gap: 8 }, disabled && { opacity: 0.4 }, style], testID: testID, children: [_jsx(RNText, { style: ts(15, 400, c.text2), children: label }), _jsxs(Pressable, { onPress: () => setOpen(true), disabled: disabled, accessibilityRole: "button", accessibilityLabel: label, accessibilityValue: { text: summary || placeholder || "" }, accessibilityState: { disabled: !!disabled, expanded: open }, style: pressFx(row, { gap: 12, minHeight: 48, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: c.border, backgroundColor: c.field }), children: [_jsx(RNText, { style: [ts(17, 400, summary ? c.text : c.text3), { flex: 1 }], numberOfLines: 1, children: summary || placeholder }), _jsx(Icon, { name: "chevron-down", color: c.text2 })] }), _jsx(Sheet, { open: open, onClose: close, title: label, footer: multiple ? _jsx(Button, { variant: "primary", block: true, onPress: close, children: "Pronto" }) : null, children: multiple
                    ? _jsx(CheckList, { items: options.map((o) => ({ id: o.value, label: o.label, description: o.description, disabled: o.disabled })), selected: value || [], onChange: (ids) => onChange?.(ids) })
                    : _jsx(RadioList, { options: options, value: value, onChange: (v) => { onChange?.(v); close(); } }) })] }));
}
// marcas desenhadas: caixa de 22 (canto 6) e rádio de 22
// o ✓ usa a cor do cartão (branco no claro): branco sobre o azul claro do escuro não tem contraste
const checkMark = (c, state) => (_jsx(View, { style: [{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: c.text3, alignItems: "center", justifyContent: "center" }, !!state && { backgroundColor: c.accent, borderColor: c.accent }], children: state ? _jsx(Icon, { name: state === "mixed" ? "minus" : "check", size: 18, color: c.card }) : null }));
const radioMark = (c, on) => (_jsx(View, { style: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: on ? c.accent : c.text3, alignItems: "center", justifyContent: "center" }, children: on ? _jsx(View, { style: { width: 12, height: 12, borderRadius: 6, backgroundColor: c.accent } }) : null }));
function Choice({ mark, role, checked, label, description, disabled, bold, plain, after, onPress, style, testID }) {
    const c = useColors();
    return (_jsxs(Pressable, { onPress: onPress, disabled: disabled, testID: testID, accessibilityRole: role, accessibilityState: { checked, disabled: !!disabled }, style: pressFx(row, { gap: 12, minHeight: 56, paddingVertical: 8, paddingHorizontal: plain ? 0 : 16 }, after && inset(c), style), children: [mark, _jsxs(View, { style: { flex: 1 }, children: [_jsx(RNText, { style: ts(17, bold ? 500 : 400, disabled ? c.text2 : c.text), children: label }), description ? _jsx(RNText, { style: ts(15, 400, c.text2), children: description }) : null] })] }));
}
export function Checkbox({ label, description, checked, onChange, disabled, style, testID }) {
    const c = useColors();
    return _jsx(Choice, { mark: checkMark(c, !!checked), role: "checkbox", checked: !!checked, label: label, description: description, disabled: disabled, plain: true, onPress: () => onChange?.(!checked), style: style, testID: testID });
}
export function CheckList({ items, selected, onChange, allLabel = "Selecionar todos", label, style, testID }) {
    const c = useColors(), all = selectAllState(items, selected);
    const allState = all === "all" ? true : all === "some" ? "mixed" : false;
    return (_jsxs(View, { style: [listBox(c), style], testID: testID, accessibilityLabel: label, children: [_jsx(Choice, { mark: checkMark(c, allState), role: "checkbox", checked: allState, label: allLabel, bold: true, onPress: () => onChange(toggleAll(items, selected)) }), items.map((it) => {
                const on = selected.includes(it.id);
                return _jsx(Choice, { after: true, mark: checkMark(c, on), role: "checkbox", checked: on, label: it.label, description: it.description, disabled: it.disabled, onPress: () => onChange(toggleId(selected, it.id)) }, it.id);
            })] }));
}
export function RadioList({ options, value, onChange, label, style, testID }) {
    const c = useColors();
    return (_jsx(View, { style: [listBox(c), style], testID: testID, accessibilityRole: "radiogroup", accessibilityLabel: label, children: options.map((o, i) => (_jsx(Choice, { after: i > 0, mark: radioMark(c, o.value === value), role: "radio", checked: o.value === value, label: o.label, description: o.description, disabled: o.disabled, onPress: () => onChange?.(o.value) }, o.value))) }));
}
export function Switch({ label, description, checked, onChange, disabled, style, testID }) {
    const c = useColors();
    return (_jsxs(Pressable, { onPress: () => onChange?.(!checked), disabled: disabled, testID: testID, accessibilityRole: "switch", accessibilityState: { checked: !!checked, disabled: !!disabled }, style: pressFx(cardBox(c), row, { gap: 16, minHeight: 56, paddingVertical: 8, paddingHorizontal: 16 }, disabled && { opacity: 0.4 }, style), children: [_jsxs(View, { style: { flex: 1 }, children: [_jsx(RNText, { style: ts(17, 500, c.text), children: label }), description ? _jsx(RNText, { style: ts(15, 400, c.text2), children: description }) : null] }), _jsx(View, { style: { width: 52, height: 32, padding: 4, borderRadius: 16, backgroundColor: checked ? c.accent : c.border, alignItems: checked ? "flex-end" : "flex-start" }, children: _jsx(View, { style: { width: 24, height: 24, borderRadius: 12, backgroundColor: c.card } }) })] }));
}
export function Segmented({ options, value, onChange, label, style, testID }) {
    const c = useColors();
    return (_jsx(View, { style: [cardBox(c), { flexDirection: "row", gap: 4, padding: 4, borderRadius: 12 }, style], testID: testID, accessibilityLabel: label, children: options.map((o) => {
            const on = o === value;
            return (_jsx(Pressable, { onPress: () => onChange?.(o), accessibilityRole: "button", accessibilityState: { selected: on }, 
                // borda transparente quando apagado: a troca não mexe no tamanho
                style: pressFx({ flex: 1, minHeight: 44, paddingHorizontal: 8, alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: 1.5, borderColor: "transparent" }, on && { backgroundColor: c.accentTint, borderColor: c.accent }), children: _jsx(RNText, { style: ts(15, 500, on ? c.accent : c.text), numberOfLines: 1, children: o }) }, o));
        }) }));
}
const ChipLayout = createContext("wrap");
// filter: só para o FilterChip; fora do contrato
export function Chip({ selected, dashed, icon, onRemove, removeLabel, filter, children, onPress, disabled, style, testID }) {
    const c = useColors(), tiles = useContext(ChipLayout) === "tiles";
    const color = selected ? c.accent : dashed || filter || onRemove ? c.text : c.text2;
    const box = [row, { gap: 8, minHeight: 44, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: c.divider, backgroundColor: c.card },
        selected && { borderWidth: 1.5, borderColor: c.accent, backgroundColor: c.accentTint },
        dashed && { borderWidth: 1.5, borderStyle: "dashed", borderColor: c.text3, backgroundColor: "transparent" },
        tiles && { flexDirection: "column", justifyContent: "center", gap: 4, minHeight: 68, paddingVertical: 8, paddingHorizontal: 4 },
        !!onRemove && { paddingRight: 0 }, disabled && { opacity: 0.4 }];
    const inner = (_jsxs(_Fragment, { children: [icon ? _jsx(Icon, { name: icon, color: color }) : null, _jsx(RNText, { style: [ts(tiles ? 13 : 15, 500, color), tiles && { textAlign: "center" }], numberOfLines: tiles ? 2 : 1, children: children }), filter ? _jsx(Icon, { name: "chevron-down", size: 16, color: color }) : null] }));
    if (onRemove) {
        return (_jsxs(View, { style: [box, style], testID: testID, children: [inner, _jsx(Pressable, { onPress: onRemove, accessibilityRole: "button", accessibilityLabel: removeLabel || "Remover " + children, style: pressFx({ width: 36, height: 44, alignItems: "center", justifyContent: "center" }), children: _jsx(Icon, { name: "close", size: 16, color: c.text2 }) })] }));
    }
    return _jsx(Pressable, { onPress: onPress, disabled: disabled, testID: testID, accessibilityRole: "button", accessibilityState: { selected: !!selected, disabled: !!disabled }, style: pressFx(box, style), children: inner });
}
export function FilterChip(p) {
    return _jsx(Chip, { ...p, filter: true });
}
export function ChipGroup({ label, layout = "wrap", children, style, testID }) {
    const c = useColors();
    const items = layout === "tiles" ? _jsx(Grid, { columns: 4, gap: 8, children: children })
        : layout === "scroll" ? _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, style: { marginRight: -20 }, contentContainerStyle: { gap: 8, paddingRight: 20 }, children: children })
            : _jsx(View, { style: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, children: children });
    return (_jsx(ChipLayout.Provider, { value: layout, children: _jsxs(View, { style: [{ gap: 8 }, style], testID: testID, children: [label ? _jsx(RNText, { style: ts(15, 400, c.text2), children: label }) : null, items] }) }));
}
// faixa do período: inteira por dentro, metade do lado de dentro no início e no fim
const BAND = { in: { left: 0, right: 0 }, start: { left: "50%", right: 0 }, end: { left: 0, right: "50%" } };
export function Calendar({ start, end, onChange, min, max, style, testID }) {
    const c = useColors(), [month, setMonth] = useState(() => startOfMonth(start || new Date())), today = new Date();
    const k = dayKey(month), out = (d) => (min && dayKey(d) < dayKey(min)) || (max && dayKey(d) > dayKey(max));
    return (_jsxs(View, { style: [{ gap: 8 }, style], testID: testID, children: [_jsxs(View, { style: [row, { justifyContent: "space-between" }], children: [_jsx(IconButton, { icon: "back", label: "M\u00EAs anterior", disabled: !!min && k <= dayKey(startOfMonth(min)), onPress: () => setMonth(addMonths(month, -1)) }), _jsx(RNText, { style: ts(17, 700, c.text), accessibilityRole: "header", children: monthLabel(month) }), _jsx(IconButton, { icon: "chevron-right", label: "Pr\u00F3ximo m\u00EAs", disabled: !!max && k >= dayKey(startOfMonth(max)), onPress: () => setMonth(addMonths(month, 1)) })] }), _jsxs(View, { style: { gap: 6 }, children: [_jsx(View, { style: { flexDirection: "row" }, children: WEEKDAYS.map(([short, full], i) => _jsx(RNText, { accessibilityLabel: full, style: [ts(13, 500, c.text2), { flex: 1, paddingVertical: 4, textAlign: "center" }], children: short }, i)) }), monthGrid(month.getFullYear(), month.getMonth()).map((week, i) => (_jsx(View, { style: { flexDirection: "row" }, children: week.map((d, j) => {
                            if (!d)
                                return _jsx(View, { style: { flex: 1, height: 44 } }, j);
                            const role = rangeRole(d, start, end), off = !!out(d), edge = role === "start" || role === "end" || role === "single";
                            const band = role ? BAND[role] : undefined;
                            return (_jsxs(Pressable, { disabled: off, onPress: () => onChange?.(nextRange({ start, end }, d)), accessibilityRole: "button", accessibilityLabel: dayLabel(d), accessibilityState: { selected: !!role, disabled: off }, style: { flex: 1, height: 44, alignItems: "center", justifyContent: "center" }, children: [band ? _jsx(View, { style: [fill, band, { backgroundColor: c.accentTint }] }) : null, _jsx(View, { style: [{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }, sameDay(d, today) && { borderWidth: 1, borderColor: c.text }, edge && { backgroundColor: c.button }, off && { opacity: 0.5 }], children: _jsx(RNText, { style: [ts(17, edge ? 700 : 400, edge ? c.onButton : off ? c.text3 : c.text), tab], children: d.getDate() }) })] }, j));
                        }) }, i)))] })] }));
}
// ---------- dados
// variação: a seta tem cor e o leitor de tela ouve "alta de" no lugar dela
function Change({ change, trend = "flat", base }) {
    const c = useColors(), [arrow, spoken] = TREND[trend] || TREND.flat;
    return (_jsxs(RNText, { style: [ts(15, 500, trend === "flat" ? c.text2 : c[trend]), tab], accessibilityLabel: [spoken, change, base].filter(Boolean).join(" "), children: [arrow ? arrow + " " : "", change, base ? _jsx(RNText, { style: ts(15, 400, c.text2), children: " " + base }) : null] }));
}
export function Stat({ label, value, unit, detail, change, trend, base, help, badge, style, testID }) {
    const c = useColors(), money = unit === "R$";
    const u = unit ? _jsx(RNText, { style: ts(17, 400, c.text2), children: unit }) : null;
    return (_jsxs(View, { style: [cardBox(c), { padding: 16, gap: 4 }, style], testID: testID, children: [_jsxs(View, { style: [row, { gap: 4, minHeight: 22 }], children: [_jsx(RNText, { style: ts(15, 400, c.text2), children: label }), help, isText(badge) ? _jsx(Badge, { children: badge }) : badge] }), _jsxs(View, { style: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", gap: 4 }, children: [money ? u : null, _jsx(RNText, { style: [ts(28, 700, c.text), tab], children: value }), money ? null : u] }), tx(detail, [ts(15, 400, c.text2), tab]), change ? _jsx(Change, { change: change, trend: trend, base: base }) : null] }));
}
export function List({ label, children, style, testID }) {
    const c = useColors();
    return (_jsx(View, { style: [listBox(c), style], testID: testID, accessibilityLabel: label, children: Children.toArray(children).map((ch, i) => (i > 0 && isValidElement(ch) ? cloneElement(ch, { inset: true }) : ch)) }));
}
// inset: posto pela List nas linhas depois da primeira; fora do contrato
export function ListItem({ title, subtitle, leading, trailing, chevron, tone, onPress, disabled, inset: after, style, testID }) {
    const c = useColors(), base = [row, { gap: 12, minHeight: 64, paddingVertical: 12, paddingHorizontal: 16 }, after && inset(c), disabled && { opacity: 0.4 }, style];
    const kids = (_jsxs(_Fragment, { children: [leading ?? null, _jsxs(View, { style: { flex: 1, minWidth: 0 }, children: [tx(title, ts(17, 500, tone ? c[tone] : c.text)), tx(subtitle, ts(15, 400, c.text2))] }), tx(trailing, [ts(15, 400, c.text2), tab], { numberOfLines: 1 }), (chevron ?? !!onPress) ? _jsx(Icon, { name: "chevron-right", size: 16, color: c.text3 }) : null] }));
    return onPress
        ? _jsx(Pressable, { onPress: onPress, disabled: disabled, testID: testID, accessibilityRole: "button", accessibilityState: { disabled: !!disabled }, style: pressFx(base), children: kids })
        : _jsx(View, { style: base, testID: testID, children: kids });
}
export function IconTile({ icon, tone = "accent", round, style, testID }) {
    const c = useColors();
    const [bg, fg] = { neutral: [c.chip, c.text2], up: [c.upTint, c.up], down: [c.chip, c.down] }[tone] || [c.accentTint, c.accent];
    return (_jsx(View, { style: [{ width: 40, height: 40, borderRadius: round ? 20 : 12, backgroundColor: bg, alignItems: "center", justifyContent: "center" }, style], testID: testID, children: _jsx(Icon, { name: icon, color: fg }) }));
}
export function Avatar({ initials, src, size = 40, label, style, testID }) {
    const c = useColors();
    return (_jsx(View, { style: [{ width: size, height: size, borderRadius: size / 2, overflow: "hidden", backgroundColor: c.accentTint, alignItems: "center", justifyContent: "center" }, style], testID: testID, accessible: !!label, accessibilityRole: label ? "image" : undefined, accessibilityLabel: label, children: src ? _jsx(Image, { source: { uri: src }, style: { width: size, height: size } }) : _jsx(RNText, { style: ts(15, 700, c.accent), children: initials }) }));
}
export function Badge({ tone = "neutral", children, style, testID }) {
    const c = useColors();
    const [bg, fg, w, r] = { accent: [c.accentTint, c.accent, 500, 8], danger: [c.down, c.bg, 700, 12] }[tone] || [c.chip, c.label, 500, 8];
    return (_jsx(View, { style: [{ minWidth: 24, height: 24, paddingHorizontal: 8, borderRadius: r, backgroundColor: bg, alignItems: "center", justifyContent: "center" }, style], testID: testID, children: _jsx(RNText, { style: [ts(13, w, fg), tab], numberOfLines: 1, children: children }) }));
}
export function Status({ tone = "neutral", children, style, testID }) {
    const c = useColors(), color = { ok: c.up, danger: c.down }[tone] || c.text2;
    return (_jsxs(View, { style: [row, { gap: 8 }, style], testID: testID, children: [_jsx(View, { style: { width: 8, height: 8, borderRadius: 4, backgroundColor: color } }), _jsx(RNText, { style: ts(15, 400, color), children: children })] }));
}
export function DetailList({ items, style, testID }) {
    const c = useColors();
    return (_jsx(View, { style: style, testID: testID, children: items.map((it, i) => (_jsxs(View, { style: [row, { justifyContent: "space-between", gap: 12, minHeight: 48 }, i > 0 && { borderTopWidth: 1, borderTopColor: c.divider }], children: [tx(it.term, [ts(15, 400, c.text2), { flexShrink: 1 }]), tx(it.value, [ts(17, 500, it.tone ? c[it.tone] : c.text), tab, { flexShrink: 1, textAlign: "right" }])] }, i))) }));
}
export function Table({ caption, columns, rows, sort, onSort, style, testID }) {
    const c = useColors(), [widths, setWidths] = useState({});
    // sem layout de tabela no RN: o conteúdo de cada célula mede a largura e a coluna fica com a maior
    // (mede o miolo, não a célula: a primeira coluna estica e realimentaria a medida)
    // shortcut: a largura só cresce (não encolhe quando os dados mudam); medir de novo se isso aparecer
    const measure = (key) => (e) => {
        const w = e.nativeEvent.layout.width;
        setWidths((o) => (o[key] >= w ? o : { ...o, [key]: w }));
    };
    const align = (col) => (col.align === "end" ? "flex-end" : "flex-start");
    const box = (col, j) => [{ paddingVertical: 12, paddingHorizontal: 16, justifyContent: "center", alignItems: align(col) }, j === 0 && { flexGrow: 1 }];
    const sized = (col, content) => _jsx(View, { onLayout: measure(col.key), style: { minWidth: widths[col.key], alignItems: align(col) }, children: content });
    return (_jsx(View, { style: [listBox(c), style], testID: testID, accessibilityLabel: caption, children: _jsx(ScrollView, { horizontal: true, contentContainerStyle: { flexGrow: 1 }, children: _jsxs(View, { style: { flexGrow: 1 }, children: [_jsx(View, { style: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: c.divider }, children: columns.map((col, j) => {
                            const on = sort?.key === col.key, asc = sort?.dir === "asc";
                            const text = sized(col, _jsx(RNText, { style: ts(13, 700, on ? c.accent : c.text2), numberOfLines: 1, children: col.label + (on ? (asc ? " ▲" : " ▼") : "") }));
                            const cell = [box(col, j), { minHeight: 44 }];
                            return col.sortable
                                ? _jsx(Pressable, { style: cell, onPress: () => onSort?.(col.key), accessibilityRole: "button", accessibilityLabel: col.label + (on ? (asc ? ", ordem crescente" : ", ordem decrescente") : ""), children: text }, col.key)
                                : _jsx(View, { style: cell, children: text }, col.key);
                        }) }), rows.map((r, i) => (_jsx(View, { style: [{ flexDirection: "row" }, i > 0 && { borderTopWidth: 1, borderTopColor: c.divider }], children: columns.map((col, j) => _jsx(View, { style: box(col, j), children: sized(col, tx(r[col.key], [ts(15, j === 0 ? 500 : 400, c.text), tab], { numberOfLines: 1 })) }, col.key)) }, i)))] }) }) }));
}
const pct = (v) => `${v * 100}%`;
export function ProgressBar({ value, marker, label, style, testID }) {
    const c = useColors(), v = clamp01(value);
    return (_jsxs(View, { style: [{ height: 8, borderRadius: 4, backgroundColor: c.borderStrong }, style], testID: testID, accessible: true, accessibilityRole: "progressbar", accessibilityLabel: label, accessibilityValue: { min: 0, max: 100, now: Math.round(v * 100) }, children: [_jsx(View, { style: { position: "absolute", top: 0, bottom: 0, left: 0, width: pct(v), borderRadius: 4, backgroundColor: c.accent } }), marker != null ? _jsx(View, { style: { position: "absolute", top: -4, left: pct(clamp01(marker)), width: 2, height: 16, marginLeft: -1, borderRadius: 1, backgroundColor: c.text } }) : null] }));
}
export function BarList({ items, numbered, label, style, testID }) {
    const c = useColors(), split = [row, { alignItems: "baseline", justifyContent: "space-between", gap: 12 }];
    return (_jsx(View, { style: [listBox(c), style], testID: testID, accessibilityLabel: label, children: items.map((it, i) => (_jsxs(View, { style: [{ padding: 16, gap: 8 }, i > 0 && { borderTopWidth: 1, borderTopColor: c.divider }], children: [_jsxs(View, { style: split, children: [_jsx(RNText, { style: [ts(17, 500, c.text), { flexShrink: 1 }], children: (numbered ? i + 1 + ". " : "") + it.label }), _jsx(RNText, { style: [ts(22, 700, c.text), tab], children: it.value })] }), _jsx(ProgressBar, { value: it.ratio, marker: it.marker, label: it.label }), it.detail != null || it.change
                    ? _jsxs(View, { style: split, children: [tx(it.detail ?? "", [ts(15, 400, c.text2), { flexShrink: 1 }]), it.change ? _jsx(Change, { change: it.change, trend: it.trend }) : null] })
                    : null] }, i))) }));
}
export function Accordion({ title, defaultOpen, children, style, testID }) {
    const c = useColors(), [open, setOpen] = useState(!!defaultOpen);
    return (_jsxs(View, { style: [cardBox(c), style], testID: testID, children: [_jsxs(Pressable, { onPress: () => setOpen(!open), accessibilityRole: "button", accessibilityState: { expanded: open }, style: pressFx(row, { justifyContent: "space-between", gap: 12, minHeight: 56, paddingVertical: 8, paddingHorizontal: 16 }), children: [_jsx(RNText, { style: [ts(17, 500, c.text), { flex: 1 }], children: title }), _jsx(View, { style: open && { transform: [{ rotate: "180deg" }] }, children: _jsx(Icon, { name: "chevron-down", color: c.text2 }) })] }), open ? _jsx(View, { style: { gap: 12, paddingHorizontal: 16, paddingBottom: 16 }, children: tx(children, body(c)) }) : null] }));
}
export function Steps({ steps, current, style, testID }) {
    const c = useColors();
    return (_jsxs(View, { style: [{ gap: 8 }, style], testID: testID, children: [_jsx(View, { style: { flexDirection: "row", gap: 4 }, children: steps.map((_, i) => _jsx(View, { style: { flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= current ? c.accent : c.borderStrong } }, i)) }), _jsxs(RNText, { style: ts(15, 400, c.text2), children: [`${current + 1} de ${steps.length} · `, _jsx(RNText, { style: ts(15, 500, c.text), children: steps[current] })] })] }));
}
export function Pagination({ page, pageSize, total, onChange, style, testID }) {
    const c = useColors(), last = Math.max(1, Math.ceil(total / pageSize));
    return (_jsxs(View, { style: [row, { justifyContent: "flex-end", gap: 4 }, style], testID: testID, children: [_jsx(IconButton, { icon: "back", label: "P\u00E1gina anterior", disabled: page <= 1, onPress: () => onChange(page - 1) }), _jsx(RNText, { style: [ts(15, 400, c.text2), tab], children: pageLabel(page, pageSize, total) }), _jsx(IconButton, { icon: "chevron-right", label: "Pr\u00F3xima p\u00E1gina", disabled: page >= last, onPress: () => onChange(page + 1) })] }));
}
// ---------- gráficos: charts.ts desenha; aqui só a largura medida
function Chart({ draw, p }) {
    const c = useColors(), [width, setWidth] = useState(0);
    const out = width ? draw(p, { width, palette: c, native: true }) : null;
    return (_jsx(View, { style: p.style, testID: p.testID, accessible: true, accessibilityRole: "image", accessibilityLabel: p.label, onLayout: (e) => setWidth(e.nativeEvent.layout.width), children: out ? _jsx(SvgXml, { xml: out.svg, width: width, height: out.height }) : null }));
}
export function LineChart(p) {
    return _jsx(Chart, { draw: lineChart, p: p });
}
export function BarChart(p) {
    return _jsx(Chart, { draw: barChart, p: p });
}
export function ScatterChart(p) {
    return _jsx(Chart, { draw: scatterChart, p: p });
}
export function Heatmap(p) {
    return _jsx(Chart, { draw: heatmap, p: p });
}
export function Legend({ items, style, testID }) {
    const c = useColors(), sq = { width: 12, height: 12 };
    const swatch = {
        line: () => _jsx(View, { style: { width: 20, height: 3, borderRadius: 2, backgroundColor: c.accent } }),
        dashed: () => _jsx(View, { style: { flexDirection: "row", width: 20, gap: 4 }, children: [0, 1, 2].map((i) => _jsx(View, { style: { width: 4, height: 2, backgroundColor: c.text2 } }, i)) }),
        bar: () => _jsx(View, { style: [sq, { backgroundColor: c.text }] }),
        highlight: () => _jsx(View, { style: [sq, { backgroundColor: c.accent }] }),
        band: () => _jsx(View, { style: [sq, { backgroundColor: c.divider, borderWidth: 1, borderColor: c.border }] }),
        gap: () => _jsx(Svg, { width: 12, height: 12, children: _jsx(Path, { d: "M3 0L0 3M10 0L0 10M17 0L0 17M24 0L0 24", stroke: c.hatch, strokeWidth: 3 }) }),
    };
    return (_jsx(View, { style: [row, { flexWrap: "wrap", gap: 16 }, style], testID: testID, children: items.map((it, i) => _jsxs(View, { style: [row, { gap: 8 }], children: [swatch[it.kind](), _jsx(RNText, { style: ts(13, 400, c.text2), children: it.label })] }, i)) }));
}
// ---------- camadas
const scrim = (c) => [fill, { backgroundColor: c.scrim, opacity: 0.72 }];
export function Sheet({ open, onClose, title, subtitle, footer, children, style, testID }) {
    const c = useColors(), insets = useSafeAreaInsets();
    return (_jsx(Modal, { visible: !!open, transparent: true, animationType: "slide", onRequestClose: onClose, children: _jsxs(View, { style: { flex: 1, justifyContent: "flex-end" }, children: [_jsx(Pressable, { style: scrim(c), onPress: onClose, accessibilityRole: "button", accessibilityLabel: "Fechar" }), _jsxs(View, { style: [{ maxHeight: "92%", gap: 20, paddingHorizontal: 20, paddingTop: 8, paddingBottom: insets.bottom + 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: c.sheet }, style], testID: testID, accessibilityViewIsModal: true, children: [_jsx(View, { style: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, backgroundColor: c.borderStrong } }), _jsxs(View, { style: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }, children: [_jsxs(View, { style: { flex: 1, gap: 2 }, children: [_jsx(RNText, { style: ts(22, 700, c.text), accessibilityRole: "header", children: title }), subtitle ? _jsx(RNText, { style: ts(15, 400, c.text2), children: subtitle }) : null] }), _jsx(IconButton, { icon: "close", label: "Fechar", variant: "filled", onPress: onClose })] }), _jsx(ScrollView, { style: { flexGrow: 0 }, keyboardShouldPersistTaps: "handled", children: tx(children, ts(15, 400, c.text2)) }), footer ? _jsx(View, { style: { gap: 8 }, children: tx(footer, ts(15, 400, c.text2)) }) : null] })] }) }));
}
function Centered({ open, onClose, dismissable, children, style, testID }) {
    const c = useColors();
    return (_jsx(Modal, { visible: !!open, transparent: true, animationType: "fade", onRequestClose: onClose, children: _jsxs(View, { style: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }, children: [dismissable ? _jsx(Pressable, { style: scrim(c), onPress: onClose, accessibilityRole: "button", accessibilityLabel: "Fechar" }) : _jsx(View, { style: scrim(c) }), _jsx(View, { style: [{ width: "100%", maxWidth: 440, gap: 12, padding: 24, borderRadius: 20, borderWidth: 1, borderColor: c.divider, backgroundColor: c.sheet }, style], testID: testID, accessibilityViewIsModal: true, children: children })] }) }));
}
const actionsRow = (nodes, c) => (_jsx(View, { style: { flexDirection: "row", gap: 8, marginTop: 8 }, children: Children.toArray(nodes).map((n, i) => _jsx(View, { style: { flex: 1 }, children: tx(n, ts(15, 400, c.text2)) }, (isValidElement(n) && n.key) || i)) }));
export function Dialog({ open, onClose, title, footer, children, style, testID }) {
    const c = useColors();
    return (_jsxs(Centered, { open: open, onClose: onClose, dismissable: true, style: style, testID: testID, children: [_jsxs(View, { style: [row, { justifyContent: "space-between", gap: 12 }], children: [_jsx(RNText, { style: [ts(20, 700, c.text), { flex: 1 }], accessibilityRole: "header", children: title }), _jsx(IconButton, { icon: "close", label: "Fechar", onPress: onClose })] }), tx(children, ts(15, 400, c.text2)), footer ? actionsRow(footer, c) : null] }));
}
// tocar fora não fecha: só Cancelar (ou o voltar do Android) desiste
export function ConfirmDialog({ open, title, message, confirmLabel = "Excluir", cancelLabel = "Cancelar", danger = true, onConfirm, onCancel, style, testID }) {
    const c = useColors();
    return (_jsxs(Centered, { open: open, onClose: onCancel, style: style, testID: testID, children: [_jsx(RNText, { style: ts(20, 700, c.text), accessibilityRole: "header", children: title }), message ? _jsx(RNText, { style: ts(15, 400, c.text2), children: message }) : null, actionsRow([
                _jsx(Button, { variant: "secondary", block: true, onPress: onCancel, children: cancelLabel }, "n"),
                _jsx(Button, { variant: danger ? "danger" : "primary", block: true, onPress: onConfirm, children: confirmLabel }, "y"),
            ], c)] }));
}
export function Popover({ open, onClose, title, children, style, testID }) {
    return _jsx(Sheet, { open: open, onClose: onClose, title: title, style: style, testID: testID, children: children });
}
export function Toast({ open, onClose, message, tone = "neutral", duration = 4000, action, style, testID }) {
    const c = useColors(), insets = useSafeAreaInsets(), close = useRef(onClose);
    close.current = onClose;
    useEffect(() => {
        if (!open)
            return;
        // o iOS não lê região viva: anuncia; o Android lê pelo accessibilityLiveRegion
        if (Platform.OS === "ios")
            AccessibilityInfo.announceForAccessibility(message);
        const t = setTimeout(() => close.current?.(), duration);
        return () => clearTimeout(t);
    }, [open, message, duration]);
    if (!open)
        return null;
    return (_jsx(View, { style: { pointerEvents: "box-none", position: "absolute", left: 20, right: 20, bottom: insets.bottom + 96, alignItems: "center" }, children: _jsxs(View, { style: [row, { gap: 12, minHeight: 48, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, backgroundColor: tone === "danger" ? c.down : c.text }, style], testID: testID, accessibilityLiveRegion: "polite", accessibilityRole: "alert", children: [_jsx(RNText, { style: [ts(15, 500, c.bg), { flexShrink: 1 }], children: message }), action
                    ? (_jsx(Pressable, { onPress: action.onPress, disabled: action.disabled, accessibilityRole: "button", style: pressFx({ minHeight: 44, marginVertical: -8, marginRight: -8, paddingHorizontal: 12, justifyContent: "center", borderRadius: 8 }), children: _jsx(RNText, { style: ts(15, 700, c.bg), children: action.label }) }))
                    : null] }) }));
}
// ---------- estados
export function Notice({ tone = "info", title, children, action, style, testID }) {
    const c = useColors(), [icon, color] = { danger: ["alert", c.down], offline: ["wifi", c.text2] }[tone] || ["info", c.accent];
    return (_jsxs(View, { style: [cardBox(c), { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start", gap: 12, padding: 16 }, style], testID: testID, children: [_jsx(Icon, { name: icon, color: color }), _jsxs(View, { style: { flexGrow: 1, flexShrink: 1, flexBasis: 200, gap: 2 }, children: [_jsx(RNText, { style: ts(17, 500, c.text), children: title }), tx(children, ts(15, 400, c.text2))] }), action ? _jsx(Button, { variant: "secondary", size: "sm", onPress: action.onPress, disabled: action.disabled, style: { alignSelf: "center" }, children: action.label }) : null] }));
}
export function EmptyState({ icon = "info", title, description, action, style, testID }) {
    const c = useColors();
    return (_jsxs(View, { style: [{ alignItems: "center", gap: 8, paddingVertical: 32, paddingHorizontal: 16 }, style], testID: testID, children: [_jsx(IconTile, { icon: icon, tone: "neutral" }), _jsx(RNText, { style: [ts(17, 500, c.text), { marginTop: 4, textAlign: "center" }], children: title }), description ? _jsx(RNText, { style: [ts(15, 400, c.text2), { textAlign: "center" }], children: description }) : null, action ? _jsx(Button, { variant: "secondary", onPress: action.onPress, disabled: action.disabled, style: { marginTop: 8 }, children: action.label }) : null] }));
}
export function Skeleton({ width, height = 16, radius = 8, style, testID }) {
    const c = useColors(), opacity = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        let loop, alive = true;
        AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
            if (!alive || reduce)
                return;
            const to = (toValue) => Animated.timing(opacity, { toValue, duration: 700, useNativeDriver: true });
            loop = Animated.loop(Animated.sequence([to(0.5), to(1)]));
            loop.start();
        });
        return () => { alive = false; loop?.stop(); };
    }, []);
    return _jsx(Animated.View, { style: [{ width: width, height, borderRadius: radius, backgroundColor: c.chip, opacity }, style], testID: testID });
}
export function Spinner({ size, label = "Carregando", style, testID }) {
    const c = useColors();
    // o iOS só conhece "small" e "large"
    const tam = size == null ? "small" : Platform.OS === "ios" ? (size > 24 ? "large" : "small") : size;
    return _jsx(ActivityIndicator, { size: tam, color: c.accent, style: style, testID: testID, accessibilityLabel: label });
}
