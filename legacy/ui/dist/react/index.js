import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Componentes do Countify para React na web e no Electron. O visual está em dist/countify.css;
// aqui só a estrutura, a acessibilidade e o comportamento. As props vêm do contrato (types.ts), o mesmo do celular.
import { useEffect, useId, useLayoutEffect, useRef, useState, } from "react";
import { icons } from "../icons.js";
import { logo } from "../logo.js";
import { lineChart, barChart, scatterChart, heatmap, PALETTE_KEYS } from "../charts.js";
import { selectAllState, toggleAll, toggleId, monthGrid, rangeRole, nextRange, startOfMonth, addMonths, dayKey, sameDay, monthLabel, dayLabel, WEEKDAYS, formatTime, clamp01, pageLabel, TREND, selectSummary, } from "../lib.js";
// variáveis --cf-* não existem no tipo CSSProperties
const vars = (o) => o;
// no servidor (SSR) não há layout para medir
const useLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;
const cx = (...c) => c.filter(Boolean).join(" ");
const kebab = (s) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
function Press({ href, onPress, disabled, ...props }) {
    if (href && !disabled)
        return _jsx("a", { href: href, onClick: onPress, ...props });
    return _jsx("button", { type: "button", onClick: onPress, disabled: disabled, ...props });
}
// ---------- base
export function ThemeProvider({ scheme, children }) {
    useEffect(() => {
        const el = document.documentElement;
        if (scheme)
            el.dataset.theme = scheme;
        else
            delete el.dataset.theme;
    }, [scheme]);
    return _jsx(_Fragment, { children: children });
}
export function Icon({ name, size = 22, color, label, className, style }) {
    if (!icons[name])
        throw new Error(`Ícone desconhecido: ${name}`);
    return (_jsx("svg", { className: cx("cf-svg", className), width: size, height: size, viewBox: "0 0 22 22", fill: "none", stroke: color || "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", style: style, role: label ? "img" : undefined, "aria-label": label, "aria-hidden": label ? undefined : true, dangerouslySetInnerHTML: { __html: icons[name] } }));
}
export function Logo({ variant = "full", height = 32, label = "Countify", className, style }) {
    const [x, y, w, h] = logo.box[variant];
    const quadrado = variant === "full" || variant === "icon", nome = variant !== "icon";
    return (_jsxs("svg", { className: cx("cf-logo", variant === "avatar" && "cf-logo--avatar", className), style: style, viewBox: `${x} ${y} ${w} ${h}`, height: height, width: (height * w) / h, role: "img", "aria-label": label, children: [variant === "avatar" && _jsx("circle", { className: "cf-logo__tile", cx: logo.avatar.cx, cy: logo.avatar.cy, r: logo.avatar.r }), quadrado && _jsx("rect", { className: "cf-logo__tile", width: 40, height: 40, rx: 8.92 }), quadrado && _jsx("circle", { className: "cf-logo__ring", cx: 20, cy: 20, r: 10.55, strokeWidth: 5.86 }), quadrado && _jsx("path", { className: "cf-logo__arc", d: "M20 9.45A10.55 10.55 0 0 1 30.55 20", strokeWidth: 5.86 }), nome && _jsx("path", { className: "cf-logo__word", d: logo.word }), nome && _jsx("circle", { className: "cf-logo__o", cx: logo.o.cx, cy: logo.o.cy, r: logo.o.r, strokeWidth: logo.o.stroke }), nome && _jsx("path", { className: "cf-logo__arc", d: logo.o.arc, strokeWidth: logo.o.stroke })] }));
}
const TAG = { page: "h1", section: "h2" };
export function Text({ variant = "body", tone = "default", weight, as, numberOfLines, className, style, children, ...rest }) {
    const corte = numberOfLines ? { overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: numberOfLines } : null;
    const Tag = (as || TAG[variant] || "span");
    return (_jsx(Tag, { className: cx("cf-text", `cf-text--${variant}`, tone !== "default" && `cf-text--${tone}`, weight && `cf-w-${weight}`, className), style: corte ? { ...corte, ...style } : style, ...rest, children: children }));
}
// ---------- estrutura
export function Screen({ scroll, className, children, ...rest }) {
    return _jsx("main", { className: cx("cf-screen", className), ...rest, children: children });
}
export function Grid({ columns = 2, columnsDesktop, gap, className, style, children, ...rest }) {
    return (_jsx("div", { className: cx("cf-grid", className), style: vars({ "--cf-cols": columns, "--cf-cols-desktop": columnsDesktop ?? columns, ...(gap != null && { "--cf-gap": gap + "px" }), ...style }), ...rest, children: children }));
}
export function Card({ padding, gap, className, style, children, ...rest }) {
    return _jsx("div", { className: cx("cf-card", className), style: { ...(padding != null && { padding }), ...(gap != null && { gap }), ...style }, ...rest, children: children });
}
export function Divider({ className, ...rest }) {
    return _jsx("hr", { className: cx("cf-divider", className), ...rest });
}
export function SectionTitle({ help, action, className, children, ...rest }) {
    return (_jsxs("div", { className: cx("cf-section-title", className), ...rest, children: [_jsxs("div", { className: "cf-section-title__main", children: [_jsx("h2", { children: children }), help] }), action] }));
}
export function SectionLabel({ className, children, ...rest }) {
    return _jsx("h2", { className: cx("cf-section-label", className), ...rest, children: children });
}
export function PageHeader({ title, subtitle, eyebrow, back, onTitlePress, titleLabel, actions, className, ...rest }) {
    return (_jsxs("header", { className: cx("cf-page-header", className), ...rest, children: [_jsxs("div", { className: "cf-page-header__main", children: [back && _jsxs(Press, { href: back.href, onPress: back.onPress, className: "cf-page-header__back", children: [_jsx(Icon, { name: "back", size: 16 }), back.label] }), eyebrow && _jsx("span", { className: "cf-page-header__eyebrow", children: eyebrow }), _jsx("h1", { className: "cf-page-header__title", children: onTitlePress
                            ? _jsxs("button", { type: "button", className: "cf-page-header__selector", onClick: onTitlePress, "aria-label": titleLabel, children: [title, _jsx(Icon, { name: "chevron-down" })] })
                            : title }), subtitle && _jsx("p", { className: "cf-page-header__subtitle", children: subtitle })] }), actions && _jsx("div", { className: "cf-page-header__actions", children: actions })] }));
}
export function NavBar({ items, start, end, label = "Seções", className, ...rest }) {
    return (_jsxs("nav", { className: cx("cf-nav", className), "aria-label": label, ...rest, children: [start && _jsx("div", { className: "cf-nav__start", children: start }), _jsx("ul", { className: "cf-nav__items", children: items.map((it) => (_jsx("li", { children: _jsxs(Press, { href: it.href, onPress: it.onPress, className: "cf-nav__item", "aria-current": it.current ? "page" : undefined, children: [_jsx(Icon, { name: it.icon }), _jsx("span", { children: it.label }), it.badge ? _jsx(Badge, { tone: "danger", children: it.badge }) : null] }) }, it.label))) }), end && _jsx("div", { className: "cf-nav__end", children: end })] }));
}
// ---------- ações
export function Spinner({ size, label, className, style }) {
    return _jsx("span", { className: cx("cf-spinner", className), style: size ? { width: size, height: size, ...style } : style, role: label ? "status" : undefined, "aria-label": label, "aria-hidden": label ? undefined : true });
}
export function Button({ variant = "primary", size, block, icon, loading, disabled, href, onPress, type = "button", className, children, ...rest }) {
    const props = {
        className: cx("cf-button", `cf-button--${variant}`, size === "sm" && "cf-button--sm", block && "cf-button--block", className),
        "aria-busy": loading || undefined, ...rest,
    };
    const kids = _jsxs(_Fragment, { children: [loading ? _jsx(Spinner, {}) : icon && _jsx(Icon, { name: icon, size: 18 }), children] });
    if (href && !disabled && !loading)
        return _jsx("a", { href: href, onClick: onPress, ...props, children: kids });
    return _jsx("button", { type: type, onClick: onPress, disabled: disabled || loading, ...props, children: kids });
}
// size: só para uso interno (HelpButton); fora do contrato
export function IconButton({ icon, label, variant = "plain", size, className, ...rest }) {
    return (_jsx(Press, { className: cx("cf-icon-button", variant === "filled" && "cf-icon-button--filled", className), "aria-label": label, title: label, ...rest, children: _jsx(Icon, { name: icon, size: size }) }));
}
export function HelpButton({ topic, className, ...rest }) {
    return _jsx(IconButton, { icon: "help", size: 20, label: `Ajuda: ${topic}`, className: cx("cf-help", className), ...rest });
}
export function ActionLink({ chevron = true, className, children, ...rest }) {
    return _jsxs(Press, { className: cx("cf-action-link", className), ...rest, children: [children, chevron && _jsx(Icon, { name: "chevron-right", size: 16 })] });
}
const TIPO = {
    email: { type: "email", autoCapitalize: "none", spellCheck: false },
    password: { type: "password" },
    tel: { type: "tel" },
    decimal: { type: "text", inputMode: "decimal" },
    time: { type: "text", inputMode: "numeric", maxLength: 5, placeholder: "00:00" },
    code: { type: "text", autoComplete: "one-time-code", autoCapitalize: "characters", spellCheck: false },
};
export function TextField({ label, value, onChange, type = "text", placeholder, suffix, icon, hint, error, disabled, multiline, maxLength, autoComplete, id, className, style, ...rest }) {
    const auto = useId(), fid = id || auto, msg = error || hint, mid = msg ? fid + "-msg" : undefined;
    const [ver, setVer] = useState(false);
    const extra = TIPO[type] || { type: "text" };
    const props = {
        id: fid, value, disabled, ...extra, ...(type === "password" && ver && { type: "text" }),
        placeholder: placeholder ?? extra.placeholder, maxLength: maxLength ?? extra.maxLength, autoComplete: autoComplete ?? extra.autoComplete,
        "aria-invalid": error ? true : undefined, "aria-describedby": mid,
        onChange: (e) => onChange?.(type === "time" ? formatTime(e.target.value) : e.target.value), ...rest,
    };
    if (multiline)
        delete props.type;
    return (_jsxs("div", { className: cx("cf-field", error && "cf-field--error", disabled && "cf-field--disabled", type === "code" && "cf-field--code", className), style: style, children: [_jsx("label", { htmlFor: fid, className: "cf-label", children: label }), _jsxs("div", { className: "cf-field__box", children: [multiline ? _jsx("textarea", { ...props }) : _jsx("input", { ...props }), suffix && _jsx("span", { className: "cf-field__suffix", children: suffix }), icon && _jsx(Icon, { name: icon, size: 20 }), type === "password" && _jsx(IconButton, { icon: ver ? "eye-off" : "eye", label: ver ? "Esconder senha" : "Mostrar senha", onPress: () => setVer(!ver), disabled: disabled })] }), msg && _jsx("span", { id: mid, className: "cf-field__msg", role: error ? "alert" : undefined, children: msg })] }));
}
export function SearchField({ value, onChange, placeholder, label = "Buscar", className, style }) {
    return (_jsxs("label", { className: cx("cf-field__box", className), style: style, children: [_jsx(Icon, { name: "search", size: 20 }), _jsx("span", { className: "cf-sr", children: label }), _jsx("input", { type: "search", value: value, placeholder: placeholder, onChange: (e) => onChange?.(e.target.value) })] }));
}
export function Select({ label, options, value, onChange, multiple, placeholder = "Escolher", disabled, className, style }) {
    const [aberto, setAberto] = useState(false);
    const id = useId();
    const fechar = () => setAberto(false);
    return (_jsxs("div", { className: cx("cf-field", disabled && "cf-field--disabled", className), style: style, children: [_jsx("span", { id: id, className: "cf-label", children: label }), _jsxs("button", { type: "button", className: "cf-field__box cf-select", disabled: disabled, "aria-haspopup": "dialog", "aria-labelledby": id + " " + id + "v", onClick: () => setAberto(true), children: [_jsx("span", { id: id + "v", className: "cf-select__value", "data-placeholder": placeholder, children: selectSummary(options, value, multiple) }), _jsx(Icon, { name: "chevron-down", size: 20 })] }), _jsx(Sheet, { open: aberto, onClose: fechar, title: label, footer: multiple && _jsx(Button, { block: true, onPress: fechar, children: "Pronto" }), children: multiple
                    ? _jsx(CheckList, { items: options.map((o) => ({ id: o.value, label: o.label, description: o.description, disabled: o.disabled })), selected: value || [], onChange: (ids) => onChange?.(ids), label: label })
                    : _jsx(RadioList, { options: options, value: value, label: label, onChange: (v) => { onChange?.(v); fechar(); } }) })] }));
}
function CheckRow({ label, description, input, strong, plain }) {
    return (_jsxs("label", { className: cx("cf-check", strong && "cf-check--all", plain && "cf-check--plain"), children: [input, _jsxs("span", { className: "cf-row-text", children: [_jsx("span", { className: "cf-row-title", children: label }), description && _jsx("span", { className: "cf-row-sub", children: description })] })] }));
}
export function Checkbox({ label, description, checked, onChange, disabled, className, style }) {
    return (_jsx("div", { className: className, style: style, children: _jsx(CheckRow, { label: label, description: description, plain: true, input: _jsx("input", { type: "checkbox", checked: !!checked, disabled: disabled, onChange: (e) => onChange?.(e.target.checked) }) }) }));
}
export function CheckList({ items, selected, onChange, allLabel = "Selecionar todos", label, className, style }) {
    const todos = useRef(null), estado = selectAllState(items, selected);
    useEffect(() => { if (todos.current)
        todos.current.indeterminate = estado === "some"; }, [estado]);
    return (_jsxs("ul", { className: cx("cf-list", className), style: style, "aria-label": label, children: [_jsx("li", { children: _jsx(CheckRow, { label: allLabel, strong: true, input: _jsx("input", { type: "checkbox", ref: todos, checked: estado === "all", onChange: () => onChange(toggleAll(items, selected)) }) }) }, "__todos"), items.map((it) => (_jsx("li", { children: _jsx(CheckRow, { label: it.label, description: it.description, input: _jsx("input", { type: "checkbox", checked: selected.includes(it.id), disabled: it.disabled, onChange: () => onChange(toggleId(selected, it.id)) }) }) }, it.id)))] }));
}
export function RadioList({ options, value, onChange, label, className, style }) {
    const nome = useId();
    return (_jsx("ul", { className: cx("cf-list", className), style: style, role: "radiogroup", "aria-label": label, children: options.map((o) => (_jsx("li", { children: _jsx(CheckRow, { label: o.label, description: o.description, input: _jsx("input", { type: "radio", name: nome, checked: o.value === value, disabled: o.disabled, onChange: () => onChange?.(o.value) }) }) }, o.value))) }));
}
export function Switch({ label, description, checked, onChange, disabled, className, style }) {
    return (_jsxs("button", { type: "button", role: "switch", "aria-checked": !!checked, disabled: disabled, className: cx("cf-switch", className), style: style, onClick: () => onChange?.(!checked), children: [_jsxs("span", { className: "cf-switch__text", children: [_jsx("span", { className: "cf-switch__label", children: label }), description && _jsx("span", { className: "cf-switch__desc", children: description })] }), _jsx("span", { className: "cf-switch__track", "aria-hidden": true })] }));
}
export function Segmented({ options, value, onChange, label, className, style }) {
    return (_jsxs("div", { className: cx("cf-field", className), style: style, children: [label && _jsx("span", { className: "cf-label", "aria-hidden": true, children: label }), _jsx("div", { role: "group", "aria-label": label || "Opções", className: "cf-segmented", style: vars({ "--cf-n": options.length }), children: options.map((o) => _jsx("button", { type: "button", "aria-pressed": o === value, onClick: () => onChange?.(o), children: o }, o)) })] }));
}
export function Chip({ selected, dashed, icon, onRemove, removeLabel, href, onPress, disabled, className, children, ...rest }) {
    const ic = icon && _jsx(Icon, { name: icon, size: 18 });
    if (onRemove) {
        return (_jsxs("span", { className: cx("cf-chip cf-chip--removable", className), ...rest, children: [ic, children, _jsx("button", { type: "button", className: "cf-chip__remove", "aria-label": removeLabel || `Remover ${typeof children === "string" ? children : ""}`.trim(), onClick: onRemove, disabled: disabled, children: _jsx(Icon, { name: "close", size: 16 }) })] }));
    }
    const c = cx("cf-chip", dashed && "cf-chip--dashed", className);
    if (href)
        return _jsxs("a", { href: href, className: c, "aria-current": selected ? "true" : undefined, onClick: onPress, ...rest, children: [ic, children] });
    return _jsxs("button", { type: "button", className: c, "aria-pressed": dashed ? undefined : !!selected, onClick: onPress, disabled: disabled, ...rest, children: [ic, children] });
}
export function FilterChip({ className, children, ...rest }) {
    return _jsxs(Press, { className: cx("cf-chip cf-chip--filter", className), ...rest, children: [children, _jsx(Icon, { name: "chevron-down", size: 16 })] });
}
export function ChipGroup({ label, layout = "wrap", className, style, children }) {
    return (_jsxs("div", { className: cx("cf-chip-group", className), style: style, children: [label && _jsx("span", { className: "cf-label", "aria-hidden": true, children: label }), _jsx("div", { role: "group", "aria-label": label || "Opções", className: cx("cf-chip-group__items", layout !== "wrap" && `cf-chip-group__items--${layout}`), children: children })] }));
}
export function Calendar({ start, end, onChange, min, max, className, style }) {
    const [mes, setMes] = useState(() => startOfMonth(start || max || new Date()));
    const hoje = new Date();
    const fora = (d) => (min && dayKey(d) < dayKey(min)) || (max && dayKey(d) > dayKey(max));
    const antes = !min || mes > startOfMonth(min), depois = !max || addMonths(mes, 1) <= max;
    return (_jsxs("div", { className: cx("cf-calendar", className), style: style, children: [_jsxs("div", { className: "cf-calendar__head", children: [_jsx(IconButton, { icon: "back", label: "M\u00EAs anterior", disabled: !antes, onPress: () => setMes(addMonths(mes, -1)) }), _jsx("span", { className: "cf-calendar__month", "aria-live": "polite", children: monthLabel(mes) }), _jsx(IconButton, { icon: "chevron-right", label: "Pr\u00F3ximo m\u00EAs", disabled: !depois, onPress: () => setMes(addMonths(mes, 1)) })] }), _jsxs("div", { className: "cf-calendar__grid", children: [WEEKDAYS.map(([l, nome], i) => _jsx("abbr", { title: nome, className: "cf-calendar__wd", children: l }, "w" + i)), monthGrid(mes.getFullYear(), mes.getMonth()).flat().map((d, i) => d
                        ? (_jsx("button", { type: "button", className: "cf-calendar__day", disabled: !!fora(d), "data-range": rangeRole(d, start, end) || undefined, "aria-current": sameDay(d, hoje) ? "date" : undefined, "aria-pressed": rangeRole(d, start, end) ? true : undefined, "aria-label": dayLabel(d), onClick: () => onChange?.(nextRange({ start, end }, d)), children: _jsx("span", { children: d.getDate() }) }, i))
                        : _jsx("span", { "aria-hidden": true }, i))] })] }));
}
// ---------- dados
function Change({ change, trend = "flat", base }) {
    const [seta, fala] = TREND[trend] || TREND.flat;
    return (_jsxs("span", { className: `cf-change cf-change--${trend}`, children: [seta && _jsx("span", { "aria-hidden": true, children: seta + " " }), fala && _jsx("span", { className: "cf-sr", children: fala + " " }), change, base && _jsx("span", { className: "cf-change__base", children: " " + base })] }));
}
export function Stat({ label, value, unit, detail, change, trend, base, help, badge, className, style }) {
    const antes = unit === "R$";
    return (_jsxs("div", { className: cx("cf-card cf-stat", className), style: style, children: [_jsxs("div", { className: "cf-stat__label", children: [_jsx("span", { children: label }), help, badge] }), _jsxs("div", { className: "cf-stat__value", children: [antes && _jsx("span", { className: "cf-stat__unit", children: unit }), _jsx("span", { className: "cf-stat__number", children: value }), unit && !antes && _jsx("span", { className: "cf-stat__unit", children: unit })] }), detail && _jsx("span", { className: "cf-stat__detail", children: detail }), change && _jsx(Change, { change: change, trend: trend, base: base })] }));
}
export function List({ label, className, children, ...rest }) {
    return _jsx("ul", { className: cx("cf-list", className), "aria-label": label, ...rest, children: children });
}
export function ListItem({ title, subtitle, leading, trailing, chevron, tone, href, onPress, disabled, className, style }) {
    const toca = !!(href || onPress);
    const dentro = (_jsxs(_Fragment, { children: [leading, _jsxs("span", { className: "cf-row-text", children: [_jsx("span", { className: cx("cf-row-title", tone && `cf-row-title--${tone}`), children: title }), subtitle && _jsx("span", { className: "cf-row-sub", children: subtitle })] }), trailing && _jsx("span", { className: "cf-row-trailing", children: trailing }), (chevron ?? toca) && _jsx(Icon, { name: "chevron-right", size: 16, className: "cf-row-chevron" })] }));
    return _jsx("li", { className: className, style: style, children: toca ? _jsx(Press, { href: href, onPress: onPress, disabled: disabled, className: "cf-row", children: dentro }) : _jsx("div", { className: "cf-row", children: dentro }) });
}
export function IconTile({ icon, tone = "accent", round, className, style }) {
    return _jsx("span", { className: cx("cf-tile", tone !== "accent" && `cf-tile--${tone}`, round && "cf-tile--round", className), style: style, "aria-hidden": true, children: _jsx(Icon, { name: icon, size: 20 }) });
}
export function Avatar({ initials, src, size = 40, label, className, style }) {
    return (_jsx("span", { className: cx("cf-avatar", className), style: vars({ "--cf-avatar": size + "px", ...style }), role: label ? "img" : undefined, "aria-label": label, "aria-hidden": label ? undefined : true, children: src ? _jsx("img", { src: src, alt: "" }) : initials }));
}
export function Badge({ tone = "neutral", className, children, ...rest }) {
    return _jsx("span", { className: cx("cf-badge", tone !== "neutral" && `cf-badge--${tone}`, className), ...rest, children: children });
}
export function Status({ tone = "neutral", className, children, ...rest }) {
    return _jsx("span", { className: cx("cf-status", `cf-status--${tone}`, className), ...rest, children: children });
}
export function DetailList({ items, className, style }) {
    return (_jsx("dl", { className: cx("cf-details", className), style: style, children: items.map((it, i) => _jsxs("div", { children: [_jsx("dt", { children: it.term }), _jsx("dd", { className: it.tone && `cf-tone-${it.tone}`, children: it.value })] }, i)) }));
}
export function Table({ caption, columns, rows, sort, onSort, className, style }) {
    const num = (c) => (c.align === "end" ? "cf-num" : undefined);
    return (_jsx("div", { className: cx("cf-table-wrap", className), style: style, children: _jsxs("table", { className: "cf-table", children: [_jsx("caption", { className: "cf-sr", children: caption }), _jsx("thead", { children: _jsx("tr", { children: columns.map((c) => {
                            const s = sort?.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined;
                            const txt = _jsxs(_Fragment, { children: [c.label, s && _jsx("span", { "aria-hidden": true, children: s === "ascending" ? " ▲" : " ▼" })] });
                            return (_jsx("th", { scope: "col", "aria-sort": s, className: num(c), children: onSort && c.sortable !== false ? _jsx("button", { type: "button", onClick: () => onSort(c.key), children: txt }) : txt }, c.key));
                        }) }) }), _jsx("tbody", { children: rows.map((r, i) => (_jsx("tr", { children: columns.map((c, j) => (j
                            ? _jsx("td", { className: num(c), children: r[c.key] }, c.key)
                            : _jsx("th", { scope: "row", className: num(c), children: r[c.key] }, c.key))) }, (r.id ?? i)))) })] }) }));
}
export function ProgressBar({ value, marker, label, className, style }) {
    const pct = (v) => clamp01(v) * 100 + "%";
    return (_jsxs("div", { className: cx("cf-progress", className), style: style, role: "progressbar", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(clamp01(value) * 100), children: [_jsx("span", { className: "cf-progress__fill", style: { width: pct(value) } }), marker != null && _jsx("span", { className: "cf-progress__marker", style: { left: pct(marker) } })] }));
}
export function BarList({ items, numbered, label, className, style }) {
    return (_jsx("ol", { className: cx("cf-barlist", className), style: style, "aria-label": label, children: items.map((it, i) => (_jsxs("li", { children: [_jsxs("div", { className: "cf-barlist__head", children: [_jsx("span", { className: "cf-barlist__name", children: numbered ? `${i + 1}. ${it.label}` : it.label }), _jsx("span", { className: "cf-barlist__value", children: it.value })] }), _jsx(ProgressBar, { value: it.ratio, marker: it.marker, label: `${it.label}: ${it.value}` }), (it.detail || it.change) && _jsxs("div", { className: "cf-barlist__foot", children: [_jsx("span", { className: "cf-barlist__detail", children: it.detail }), it.change && _jsx(Change, { change: it.change, trend: it.trend })] })] }, it.label))) }));
}
export function Accordion({ title, defaultOpen, className, style, children }) {
    return (_jsxs("details", { className: cx("cf-accordion", className), style: style, open: defaultOpen, children: [_jsxs("summary", { children: [title, _jsx(Icon, { name: "chevron-down", size: 20 })] }), _jsx("div", { className: "cf-accordion__body", children: children })] }));
}
export function Steps({ steps, current, className, style }) {
    return (_jsxs("div", { className: cx("cf-steps", className), style: style, children: [_jsx("div", { className: "cf-steps__bars", style: vars({ "--cf-n": steps.length }), "aria-hidden": true, children: steps.map((_, i) => _jsx("span", { className: "cf-steps__bar", "data-done": i <= current || undefined }, i)) }), _jsxs("span", { className: "cf-steps__label", children: [`${current + 1} de ${steps.length} · `, _jsx("b", { children: steps[current] })] })] }));
}
export function Pagination({ page, pageSize, total, onChange, className, style }) {
    const ultima = Math.max(1, Math.ceil(total / pageSize));
    return (_jsxs("nav", { className: cx("cf-pagination", className), style: style, "aria-label": "P\u00E1ginas", children: [_jsx(IconButton, { icon: "back", label: "P\u00E1gina anterior", disabled: page <= 1, onPress: () => onChange(page - 1) }), _jsx("span", { children: pageLabel(page, pageSize, total) }), _jsx(IconButton, { icon: "chevron-right", label: "Pr\u00F3xima p\u00E1gina", disabled: page >= ultima, onPress: () => onChange(page + 1) })] }));
}
// ---------- gráficos: a largura vem do elemento; o desenho, do charts.ts
const PALETA = Object.fromEntries(PALETTE_KEYS.map((k) => [k, `var(--cf-${kebab(k)})`]));
function useWidth() {
    const ref = useRef(null), [w, setW] = useState(0);
    useLayout(() => {
        const el = ref.current;
        if (!el)
            return;
        setW(el.clientWidth);
        const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    return [ref, w];
}
function chart(draw) {
    return function Chart(p) {
        const [ref, width] = useWidth();
        const r = width ? draw(p, { width, palette: PALETA }) : null;
        return _jsx("div", { ref: ref, className: cx("cf-chart", p.className), style: { minHeight: r?.height ?? p.height, ...p.style }, role: "img", "aria-label": p.label, dangerouslySetInnerHTML: r ? { __html: r.svg } : undefined });
    };
}
export const LineChart = chart(lineChart);
export const BarChart = chart(barChart);
export const ScatterChart = chart(scatterChart);
export const Heatmap = chart(heatmap);
export function Legend({ items, className, style }) {
    return (_jsx("div", { className: cx("cf-legend", className), style: style, "aria-hidden": true, children: items.map((it) => _jsxs("span", { className: "cf-legend__item", children: [_jsx("span", { className: `cf-legend__swatch cf-legend__swatch--${it.kind}` }), it.label] }, it.label)) }));
}
// ---------- camadas: <dialog> nativo dá foco preso, Esc e fundo inerte
function useDialog(open, onClose, fechaNoFundo) {
    const ref = useRef(null);
    useEffect(() => {
        const d = ref.current;
        if (!d)
            return;
        if (open && !d.open)
            d.showModal();
        else if (!open && d.open)
            d.close();
    }, [open]);
    return {
        ref,
        onCancel: (e) => { e.preventDefault(); onClose?.(); },
        onClick: fechaNoFundo ? (e) => { if (e.target === e.currentTarget)
            onClose?.(); } : undefined,
    };
}
export function Sheet({ open, onClose, title, subtitle, footer, className, style, children }) {
    const id = useId();
    return (_jsx("dialog", { ...useDialog(open, onClose, true), className: cx("cf-sheet", className), style: style, "aria-labelledby": id, children: open && (_jsxs("div", { className: "cf-sheet__panel", children: [_jsxs("div", { className: "cf-sheet__head", children: [_jsxs("div", { children: [_jsx("h2", { id: id, className: "cf-sheet__title", children: title }), subtitle && _jsx("p", { className: "cf-sheet__subtitle", children: subtitle })] }), _jsx(IconButton, { icon: "close", label: "Fechar", variant: "filled", onPress: onClose })] }), children, footer && _jsx("div", { className: "cf-sheet__foot", children: footer })] })) }));
}
export function Dialog({ open, onClose, title, footer, className, style, children }) {
    const id = useId();
    return (_jsx("dialog", { ...useDialog(open, onClose, true), className: cx("cf-dialog", className), style: style, "aria-labelledby": id, children: open && (_jsxs("div", { className: "cf-dialog__panel", children: [_jsxs("div", { className: "cf-dialog__head", children: [_jsx("h2", { id: id, className: "cf-dialog__title", children: title }), _jsx(IconButton, { icon: "close", label: "Fechar", variant: "filled", onPress: onClose })] }), children, footer && _jsx("div", { className: "cf-dialog__actions", children: footer })] })) }));
}
export function ConfirmDialog({ open, title, message, confirmLabel = "Excluir", cancelLabel = "Cancelar", danger = true, onConfirm, onCancel, className, style }) {
    const id = useId();
    return (_jsx("dialog", { ...useDialog(open, onCancel, false), role: "alertdialog", className: cx("cf-dialog", className), style: style, "aria-labelledby": id + "t", "aria-describedby": message ? id + "m" : undefined, children: open && (_jsxs("div", { className: "cf-dialog__panel", children: [_jsx("h2", { id: id + "t", className: "cf-dialog__title", children: title }), message && _jsx("p", { id: id + "m", className: "cf-dialog__message", children: message }), _jsxs("div", { className: "cf-dialog__actions", children: [_jsx(Button, { variant: "secondary", onPress: onCancel, autoFocus: true, children: cancelLabel }), _jsx(Button, { variant: danger ? "danger" : "primary", onPress: onConfirm, children: confirmLabel })] })] })) }));
}
export function Popover({ open, onClose, title, width = 440, anchor, className, style, children }) {
    const ref = useRef(null), id = useId();
    useLayout(() => {
        const el = ref.current;
        if (!el)
            return;
        if (open && !el.matches(":popover-open")) {
            const r = anchor?.current?.getBoundingClientRect?.();
            const w = Math.min(width, innerWidth - 32);
            el.style.top = (r ? r.bottom + 8 : 72) + "px";
            el.style.left = Math.max(16, Math.min(r ? r.left : innerWidth - w - 16, innerWidth - w - 16)) + "px";
            el.showPopover();
        }
        else if (!open && el.matches(":popover-open"))
            el.hidePopover();
    }, [open]);
    useEffect(() => {
        const el = ref.current;
        const t = (e) => { if (e.newState === "closed")
            onClose?.(); };
        el?.addEventListener("toggle", t);
        return () => el?.removeEventListener("toggle", t);
    }, [onClose]);
    // popover ainda não está no tipo do React 18: vai por espalhamento
    return (_jsxs("div", { ref: ref, popover: "auto", role: "dialog", "aria-labelledby": id, className: cx("cf-popover", className), style: vars({ "--cf-w": width + "px", ...style }), children: [_jsx("h2", { id: id, className: "cf-popover__title", children: title }), children] }));
}
export function Toast({ open, onClose, message, tone = "neutral", duration = 4000, action, className, style }) {
    useEffect(() => {
        if (!open || !duration)
            return;
        const t = setTimeout(() => onClose?.(), duration);
        return () => clearTimeout(t);
    }, [open, duration, message]);
    return (_jsxs("div", { role: "status", "aria-live": "polite", className: open ? cx("cf-toast", tone === "danger" && "cf-toast--danger", className) : "cf-sr", style: open ? style : undefined, children: [open && message, open && action && _jsx(Press, { href: action.href, onPress: action.onPress, className: "cf-toast__action", children: action.label })] }));
}
// ---------- estados
const AVISO = { info: "info", danger: "alert", offline: "wifi" };
export function Notice({ tone = "info", title, action, className, style, children }) {
    return (_jsxs("div", { className: cx("cf-notice", `cf-notice--${tone}`, className), style: style, role: tone === "danger" ? "alert" : "status", children: [_jsx(Icon, { name: AVISO[tone] }), _jsxs("div", { className: "cf-notice__text", children: [_jsx("strong", { children: title }), children && _jsx("span", { children: children })] }), action && _jsx(Button, { variant: "secondary", size: "sm", href: action.href, onPress: action.onPress, children: action.label })] }));
}
export function EmptyState({ icon = "info", title, description, action, className, style }) {
    return (_jsxs("div", { className: cx("cf-empty", className), style: style, children: [_jsx(IconTile, { icon: icon, tone: "neutral" }), _jsx("p", { className: "cf-empty__title", children: title }), description && _jsx("p", { className: "cf-empty__text", children: description }), action && _jsx(Button, { variant: "secondary", href: action.href, onPress: action.onPress, children: action.label })] }));
}
export function Skeleton({ width = "100%", height = 16, radius, className, style }) {
    return _jsx("span", { className: cx("cf-skeleton", className), style: { width, height, ...(radius != null && { borderRadius: radius }), ...style }, "aria-hidden": true });
}
