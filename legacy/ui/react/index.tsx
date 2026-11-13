// Componentes do Countify para React na web e no Electron. O visual está em dist/countify.css;
// aqui só a estrutura, a acessibilidade e o comportamento. As props vêm do contrato (types.ts), o mesmo do celular.
import {
  useEffect, useId, useLayoutEffect, useRef, useState,
  type CSSProperties, type ElementType, type HTMLAttributes, type InputHTMLAttributes, type Key, type MouseEvent, type ReactNode,
  type SyntheticEvent, type TextareaHTMLAttributes,
} from "react";
import { icons } from "../icons.js";
import { logo } from "../logo.js";
import { lineChart, barChart, scatterChart, heatmap, PALETTE_KEYS, type Draw, type Drawn, type Palette } from "../charts.js";
import {
  selectAllState, toggleAll, toggleId, monthGrid, rangeRole, nextRange, startOfMonth, addMonths, dayKey, sameDay,
  monthLabel, dayLabel, WEEKDAYS, formatTime, clamp01, pageLabel, TREND,
  selectSummary,
} from "../lib.js";
import type * as T from "../types.js";

export type * from "../types.js";

/** web: style é CSS; o resto das props vem do contrato */
type P<X> = X & { style?: CSSProperties };
// variáveis --cf-* não existem no tipo CSSProperties
const vars = (o: Record<string, unknown>) => o as CSSProperties;

// no servidor (SSR) não há layout para medir
const useLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;
const cx = (...c: unknown[]) => c.filter(Boolean).join(" ");
const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

// com href vira link, sem href vira botão
type PressProps = T.Pressable & Omit<HTMLAttributes<HTMLElement>, "onClick">;
function Press({ href, onPress, disabled, ...props }: PressProps) {
  if (href && !disabled) return <a href={href} onClick={onPress} {...props} />;
  return <button type="button" onClick={onPress} disabled={disabled} {...props} />;
}

// ---------- base
export function ThemeProvider({ scheme, children }: T.ThemeProviderProps) {
  useEffect(() => {
    const el = document.documentElement;
    if (scheme) el.dataset.theme = scheme;
    else delete el.dataset.theme;
  }, [scheme]);
  return <>{children}</>;
}

export function Icon({ name, size = 22, color, label, className, style }: P<T.IconProps>) {
  if (!icons[name]) throw new Error(`Ícone desconhecido: ${name}`);
  return (
    <svg
      className={cx("cf-svg", className)} width={size} height={size} viewBox="0 0 22 22" fill="none" stroke={color || "currentColor"}
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}
      role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: icons[name] }}
    />
  );
}

export function Logo({ variant = "full", height = 32, label = "Countify", className, style }: P<T.LogoProps>) {
  const [x, y, w, h] = logo.box[variant];
  const quadrado = variant === "full" || variant === "icon", nome = variant !== "icon";
  return (
    <svg className={cx("cf-logo", variant === "avatar" && "cf-logo--avatar", className)} style={style} viewBox={`${x} ${y} ${w} ${h}`} height={height} width={(height * w) / h} role="img" aria-label={label}>
      {variant === "avatar" && <circle className="cf-logo__tile" cx={logo.avatar.cx} cy={logo.avatar.cy} r={logo.avatar.r} />}
      {quadrado && <rect className="cf-logo__tile" width={40} height={40} rx={8.92} />}
      {quadrado && <circle className="cf-logo__ring" cx={20} cy={20} r={10.55} strokeWidth={5.86} />}
      {quadrado && <path className="cf-logo__arc" d="M20 9.45A10.55 10.55 0 0 1 30.55 20" strokeWidth={5.86} />}
      {nome && <path className="cf-logo__word" d={logo.word} />}
      {nome && <circle className="cf-logo__o" cx={logo.o.cx} cy={logo.o.cy} r={logo.o.r} strokeWidth={logo.o.stroke} />}
      {nome && <path className="cf-logo__arc" d={logo.o.arc} strokeWidth={logo.o.stroke} />}
    </svg>
  );
}

const TAG: Record<string, string> = { page: "h1", section: "h2" };
export function Text({ variant = "body", tone = "default", weight, as, numberOfLines, className, style, children, ...rest }: P<T.TextProps>) {
  const corte: CSSProperties | null = numberOfLines ? { overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: numberOfLines } : null;
  const Tag = (as || TAG[variant] || "span") as ElementType;
  return (
    <Tag className={cx("cf-text", `cf-text--${variant}`, tone !== "default" && `cf-text--${tone}`, weight && `cf-w-${weight}`, className)} style={corte ? { ...corte, ...style } : style} {...rest}>
      {children}
    </Tag>
  );
}

// ---------- estrutura
export function Screen({ scroll, className, children, ...rest }: P<T.ScreenProps>) {
  return <main className={cx("cf-screen", className)} {...rest}>{children}</main>;
}
export function Grid({ columns = 2, columnsDesktop, gap, className, style, children, ...rest }: P<T.GridProps>) {
  return (
    <div className={cx("cf-grid", className)} style={vars({ "--cf-cols": columns, "--cf-cols-desktop": columnsDesktop ?? columns, ...(gap != null && { "--cf-gap": gap + "px" }), ...style })} {...rest}>
      {children}
    </div>
  );
}
export function Card({ padding, gap, className, style, children, ...rest }: P<T.CardProps>) {
  return <div className={cx("cf-card", className)} style={{ ...(padding != null && { padding }), ...(gap != null && { gap }), ...style }} {...rest}>{children}</div>;
}
export function Divider({ className, ...rest }: P<T.DividerProps>) {
  return <hr className={cx("cf-divider", className)} {...rest} />;
}
export function SectionTitle({ help, action, className, children, ...rest }: P<T.SectionTitleProps>) {
  return (
    <div className={cx("cf-section-title", className)} {...rest}>
      <div className="cf-section-title__main"><h2>{children}</h2>{help}</div>
      {action}
    </div>
  );
}
export function SectionLabel({ className, children, ...rest }: P<T.SectionLabelProps>) {
  return <h2 className={cx("cf-section-label", className)} {...rest}>{children}</h2>;
}
export function PageHeader({ title, subtitle, eyebrow, back, onTitlePress, titleLabel, actions, className, ...rest }: P<T.PageHeaderProps>) {
  return (
    <header className={cx("cf-page-header", className)} {...rest}>
      <div className="cf-page-header__main">
        {back && <Press href={back.href} onPress={back.onPress} className="cf-page-header__back"><Icon name="back" size={16} />{back.label}</Press>}
        {eyebrow && <span className="cf-page-header__eyebrow">{eyebrow}</span>}
        <h1 className="cf-page-header__title">
          {onTitlePress
            ? <button type="button" className="cf-page-header__selector" onClick={onTitlePress} aria-label={titleLabel}>{title}<Icon name="chevron-down" /></button>
            : title}
        </h1>
        {subtitle && <p className="cf-page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="cf-page-header__actions">{actions}</div>}
    </header>
  );
}
export function NavBar({ items, start, end, label = "Seções", className, ...rest }: P<T.NavBarProps>) {
  return (
    <nav className={cx("cf-nav", className)} aria-label={label} {...rest}>
      {start && <div className="cf-nav__start">{start}</div>}
      <ul className="cf-nav__items">
        {items.map((it) => (
          <li key={it.label}>
            <Press href={it.href} onPress={it.onPress} className="cf-nav__item" aria-current={it.current ? "page" : undefined}>
              <Icon name={it.icon} /><span>{it.label}</span>{it.badge ? <Badge tone="danger">{it.badge}</Badge> : null}
            </Press>
          </li>
        ))}
      </ul>
      {end && <div className="cf-nav__end">{end}</div>}
    </nav>
  );
}

// ---------- ações
export function Spinner({ size, label, className, style }: P<T.SpinnerProps>) {
  return <span className={cx("cf-spinner", className)} style={size ? { width: size, height: size, ...style } : style} role={label ? "status" : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}
export function Button({ variant = "primary", size, block, icon, loading, disabled, href, onPress, type = "button", className, children, ...rest }: P<T.ButtonProps>) {
  const props = {
    className: cx("cf-button", `cf-button--${variant}`, size === "sm" && "cf-button--sm", block && "cf-button--block", className),
    "aria-busy": loading || undefined, ...rest,
  };
  const kids = <>{loading ? <Spinner /> : icon && <Icon name={icon} size={18} />}{children}</>;
  if (href && !disabled && !loading) return <a href={href} onClick={onPress} {...props}>{kids}</a>;
  return <button type={type} onClick={onPress} disabled={disabled || loading} {...props}>{kids}</button>;
}
// size: só para uso interno (HelpButton); fora do contrato
export function IconButton({ icon, label, variant = "plain", size, className, ...rest }: P<T.IconButtonProps> & { size?: number }) {
  return (
    <Press className={cx("cf-icon-button", variant === "filled" && "cf-icon-button--filled", className)} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={size} />
    </Press>
  );
}
export function HelpButton({ topic, className, ...rest }: P<T.HelpButtonProps>) {
  return <IconButton icon="help" size={20} label={`Ajuda: ${topic}`} className={cx("cf-help", className)} {...rest} />;
}
export function ActionLink({ chevron = true, className, children, ...rest }: P<T.ActionLinkProps>) {
  return <Press className={cx("cf-action-link", className)} {...rest}>{children}{chevron && <Icon name="chevron-right" size={16} />}</Press>;
}

// ---------- entrada
type Campo = InputHTMLAttributes<HTMLInputElement>;
const TIPO: Partial<Record<NonNullable<T.TextFieldProps["type"]>, Campo>> = {
  email: { type: "email", autoCapitalize: "none", spellCheck: false },
  password: { type: "password" },
  tel: { type: "tel" },
  decimal: { type: "text", inputMode: "decimal" },
  time: { type: "text", inputMode: "numeric", maxLength: 5, placeholder: "00:00" },
  code: { type: "text", autoComplete: "one-time-code", autoCapitalize: "characters", spellCheck: false },
};
export function TextField({ label, value, onChange, type = "text", placeholder, suffix, icon, hint, error, disabled, multiline, maxLength, autoComplete, id, className, style, ...rest }: P<T.TextFieldProps>) {
  const auto = useId(), fid = id || auto, msg = error || hint, mid = msg ? fid + "-msg" : undefined;
  const [ver, setVer] = useState(false);
  const extra = TIPO[type] || { type: "text" };
  const props: Campo = {
    id: fid, value, disabled, ...extra, ...(type === "password" && ver && { type: "text" }),
    placeholder: placeholder ?? extra.placeholder, maxLength: maxLength ?? extra.maxLength, autoComplete: autoComplete ?? extra.autoComplete,
    "aria-invalid": error ? true : undefined, "aria-describedby": mid,
    onChange: (e) => onChange?.(type === "time" ? formatTime(e.target.value) : e.target.value), ...rest,
  };
  if (multiline) delete props.type;
  return (
    <div className={cx("cf-field", error && "cf-field--error", disabled && "cf-field--disabled", type === "code" && "cf-field--code", className)} style={style}>
      <label htmlFor={fid} className="cf-label">{label}</label>
      <div className="cf-field__box">
        {multiline ? <textarea {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)} /> : <input {...props} />}
        {suffix && <span className="cf-field__suffix">{suffix}</span>}
        {icon && <Icon name={icon} size={20} />}
        {type === "password" && <IconButton icon={ver ? "eye-off" : "eye"} label={ver ? "Esconder senha" : "Mostrar senha"} onPress={() => setVer(!ver)} disabled={disabled} />}
      </div>
      {msg && <span id={mid} className="cf-field__msg" role={error ? "alert" : undefined}>{msg}</span>}
    </div>
  );
}
export function SearchField({ value, onChange, placeholder, label = "Buscar", className, style }: P<T.SearchFieldProps>) {
  return (
    <label className={cx("cf-field__box", className)} style={style}>
      <Icon name="search" size={20} /><span className="cf-sr">{label}</span>
      <input type="search" value={value} placeholder={placeholder} onChange={(e) => onChange?.(e.target.value)} />
    </label>
  );
}
export function Select({ label, options, value, onChange, multiple, placeholder = "Escolher", disabled, className, style }: P<T.SelectProps>) {
  const [aberto, setAberto] = useState(false);
  const id = useId();
  const fechar = () => setAberto(false);
  return (
    <div className={cx("cf-field", disabled && "cf-field--disabled", className)} style={style}>
      <span id={id} className="cf-label">{label}</span>
      <button type="button" className="cf-field__box cf-select" disabled={disabled} aria-haspopup="dialog" aria-labelledby={id + " " + id + "v"} onClick={() => setAberto(true)}>
        <span id={id + "v"} className="cf-select__value" data-placeholder={placeholder}>{selectSummary(options, value, multiple)}</span>
        <Icon name="chevron-down" size={20} />
      </button>
      <Sheet open={aberto} onClose={fechar} title={label} footer={multiple && <Button block onPress={fechar}>Pronto</Button>}>
        {multiple
          ? <CheckList items={options.map((o) => ({ id: o.value, label: o.label, description: o.description, disabled: o.disabled }))} selected={(value as string[] | undefined) || []} onChange={(ids) => onChange?.(ids)} label={label} />
          : <RadioList options={options} value={value as string | undefined} label={label} onChange={(v) => { onChange?.(v); fechar(); }} />}
      </Sheet>
    </div>
  );
}
function CheckRow({ label, description, input, strong, plain }: { label: ReactNode; description?: ReactNode; input: ReactNode; strong?: boolean; plain?: boolean }) {
  return (
    <label className={cx("cf-check", strong && "cf-check--all", plain && "cf-check--plain")}>
      {input}
      <span className="cf-row-text"><span className="cf-row-title">{label}</span>{description && <span className="cf-row-sub">{description}</span>}</span>
    </label>
  );
}
export function Checkbox({ label, description, checked, onChange, disabled, className, style }: P<T.CheckboxProps>) {
  return (
    <div className={className} style={style}>
      <CheckRow label={label} description={description} plain input={<input type="checkbox" checked={!!checked} disabled={disabled} onChange={(e) => onChange?.(e.target.checked)} />} />
    </div>
  );
}
export function CheckList({ items, selected, onChange, allLabel = "Selecionar todos", label, className, style }: P<T.CheckListProps>) {
  const todos = useRef<HTMLInputElement>(null), estado = selectAllState(items, selected);
  useEffect(() => { if (todos.current) todos.current.indeterminate = estado === "some"; }, [estado]);
  return (
    <ul className={cx("cf-list", className)} style={style} aria-label={label}>
      <li key="__todos">
        <CheckRow label={allLabel} strong input={<input type="checkbox" ref={todos} checked={estado === "all"} onChange={() => onChange(toggleAll(items, selected))} />} />
      </li>
      {items.map((it) => (
        <li key={it.id}>
          <CheckRow label={it.label} description={it.description}
            input={<input type="checkbox" checked={selected.includes(it.id)} disabled={it.disabled} onChange={() => onChange(toggleId(selected, it.id))} />} />
        </li>
      ))}
    </ul>
  );
}
export function RadioList({ options, value, onChange, label, className, style }: P<T.RadioListProps>) {
  const nome = useId();
  return (
    <ul className={cx("cf-list", className)} style={style} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <li key={o.value}>
          <CheckRow label={o.label} description={o.description}
            input={<input type="radio" name={nome} checked={o.value === value} disabled={o.disabled} onChange={() => onChange?.(o.value)} />} />
        </li>
      ))}
    </ul>
  );
}
export function Switch({ label, description, checked, onChange, disabled, className, style }: P<T.SwitchProps>) {
  return (
    <button type="button" role="switch" aria-checked={!!checked} disabled={disabled} className={cx("cf-switch", className)} style={style} onClick={() => onChange?.(!checked)}>
      <span className="cf-switch__text"><span className="cf-switch__label">{label}</span>{description && <span className="cf-switch__desc">{description}</span>}</span>
      <span className="cf-switch__track" aria-hidden />
    </button>
  );
}
export function Segmented({ options, value, onChange, label, className, style }: P<T.SegmentedProps>) {
  return (
    <div className={cx("cf-field", className)} style={style}>
      {label && <span className="cf-label" aria-hidden>{label}</span>}
      <div role="group" aria-label={label || "Opções"} className="cf-segmented" style={vars({ "--cf-n": options.length })}>
        {options.map((o) => <button key={o} type="button" aria-pressed={o === value} onClick={() => onChange?.(o)}>{o}</button>)}
      </div>
    </div>
  );
}
export function Chip({ selected, dashed, icon, onRemove, removeLabel, href, onPress, disabled, className, children, ...rest }: P<T.ChipProps>) {
  const ic = icon && <Icon name={icon} size={18} />;
  if (onRemove) {
    return (
      <span className={cx("cf-chip cf-chip--removable", className)} {...rest}>
        {ic}{children}
        <button type="button" className="cf-chip__remove" aria-label={removeLabel || `Remover ${typeof children === "string" ? children : ""}`.trim()} onClick={onRemove} disabled={disabled}>
          <Icon name="close" size={16} />
        </button>
      </span>
    );
  }
  const c = cx("cf-chip", dashed && "cf-chip--dashed", className);
  if (href) return <a href={href} className={c} aria-current={selected ? "true" : undefined} onClick={onPress} {...rest}>{ic}{children}</a>;
  return <button type="button" className={c} aria-pressed={dashed ? undefined : !!selected} onClick={onPress} disabled={disabled} {...rest}>{ic}{children}</button>;
}
export function FilterChip({ className, children, ...rest }: P<T.FilterChipProps>) {
  return <Press className={cx("cf-chip cf-chip--filter", className)} {...rest}>{children}<Icon name="chevron-down" size={16} /></Press>;
}
export function ChipGroup({ label, layout = "wrap", className, style, children }: P<T.ChipGroupProps>) {
  return (
    <div className={cx("cf-chip-group", className)} style={style}>
      {label && <span className="cf-label" aria-hidden>{label}</span>}
      <div role="group" aria-label={label || "Opções"} className={cx("cf-chip-group__items", layout !== "wrap" && `cf-chip-group__items--${layout}`)}>{children}</div>
    </div>
  );
}
export function Calendar({ start, end, onChange, min, max, className, style }: P<T.CalendarProps>) {
  const [mes, setMes] = useState(() => startOfMonth(start || max || new Date()));
  const hoje = new Date();
  const fora = (d: Date) => (min && dayKey(d) < dayKey(min)) || (max && dayKey(d) > dayKey(max));
  const antes = !min || mes > startOfMonth(min), depois = !max || addMonths(mes, 1) <= max;
  return (
    <div className={cx("cf-calendar", className)} style={style}>
      <div className="cf-calendar__head">
        <IconButton icon="back" label="Mês anterior" disabled={!antes} onPress={() => setMes(addMonths(mes, -1))} />
        <span className="cf-calendar__month" aria-live="polite">{monthLabel(mes)}</span>
        <IconButton icon="chevron-right" label="Próximo mês" disabled={!depois} onPress={() => setMes(addMonths(mes, 1))} />
      </div>
      <div className="cf-calendar__grid">
        {WEEKDAYS.map(([l, nome], i) => <abbr key={"w" + i} title={nome} className="cf-calendar__wd">{l}</abbr>)}
        {monthGrid(mes.getFullYear(), mes.getMonth()).flat().map((d, i) => d
          ? (
            <button key={i} type="button" className="cf-calendar__day" disabled={!!fora(d)} data-range={rangeRole(d, start, end) || undefined}
              aria-current={sameDay(d, hoje) ? "date" : undefined} aria-pressed={rangeRole(d, start, end) ? true : undefined} aria-label={dayLabel(d)}
              onClick={() => onChange?.(nextRange({ start, end }, d))}>
              <span>{d.getDate()}</span>
            </button>
          )
          : <span key={i} aria-hidden />)}
      </div>
    </div>
  );
}

// ---------- dados
function Change({ change, trend = "flat", base }: { change: ReactNode; trend?: T.Trend; base?: string }) {
  const [seta, fala] = TREND[trend] || TREND.flat;
  return (
    <span className={`cf-change cf-change--${trend}`}>
      {seta && <span aria-hidden>{seta + " "}</span>}{fala && <span className="cf-sr">{fala + " "}</span>}{change}
      {base && <span className="cf-change__base">{" " + base}</span>}
    </span>
  );
}
export function Stat({ label, value, unit, detail, change, trend, base, help, badge, className, style }: P<T.StatProps>) {
  const antes = unit === "R$";
  return (
    <div className={cx("cf-card cf-stat", className)} style={style}>
      <div className="cf-stat__label"><span>{label}</span>{help}{badge}</div>
      <div className="cf-stat__value">
        {antes && <span className="cf-stat__unit">{unit}</span>}<span className="cf-stat__number">{value}</span>{unit && !antes && <span className="cf-stat__unit">{unit}</span>}
      </div>
      {detail && <span className="cf-stat__detail">{detail}</span>}
      {change && <Change change={change} trend={trend} base={base} />}
    </div>
  );
}
export function List({ label, className, children, ...rest }: P<T.ListProps>) {
  return <ul className={cx("cf-list", className)} aria-label={label} {...rest}>{children}</ul>;
}
export function ListItem({ title, subtitle, leading, trailing, chevron, tone, href, onPress, disabled, className, style }: P<T.ListItemProps>) {
  const toca = !!(href || onPress);
  const dentro = (
    <>
      {leading}
      <span className="cf-row-text"><span className={cx("cf-row-title", tone && `cf-row-title--${tone}`)}>{title}</span>{subtitle && <span className="cf-row-sub">{subtitle}</span>}</span>
      {trailing && <span className="cf-row-trailing">{trailing}</span>}
      {(chevron ?? toca) && <Icon name="chevron-right" size={16} className="cf-row-chevron" />}
    </>
  );
  return <li className={className} style={style}>{toca ? <Press href={href} onPress={onPress} disabled={disabled} className="cf-row">{dentro}</Press> : <div className="cf-row">{dentro}</div>}</li>;
}
export function IconTile({ icon, tone = "accent", round, className, style }: P<T.IconTileProps>) {
  return <span className={cx("cf-tile", tone !== "accent" && `cf-tile--${tone}`, round && "cf-tile--round", className)} style={style} aria-hidden><Icon name={icon} size={20} /></span>;
}
export function Avatar({ initials, src, size = 40, label, className, style }: P<T.AvatarProps>) {
  return (
    <span className={cx("cf-avatar", className)} style={vars({ "--cf-avatar": size + "px", ...style })} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {src ? <img src={src} alt="" /> : initials}
    </span>
  );
}
export function Badge({ tone = "neutral", className, children, ...rest }: P<T.BadgeProps>) {
  return <span className={cx("cf-badge", tone !== "neutral" && `cf-badge--${tone}`, className)} {...rest}>{children}</span>;
}
export function Status({ tone = "neutral", className, children, ...rest }: P<T.StatusProps>) {
  return <span className={cx("cf-status", `cf-status--${tone}`, className)} {...rest}>{children}</span>;
}
export function DetailList({ items, className, style }: P<T.DetailListProps>) {
  return (
    <dl className={cx("cf-details", className)} style={style}>
      {items.map((it, i) => <div key={i}><dt>{it.term}</dt><dd className={it.tone && `cf-tone-${it.tone}`}>{it.value}</dd></div>)}
    </dl>
  );
}
export function Table({ caption, columns, rows, sort, onSort, className, style }: P<T.TableProps>) {
  const num = (c: T.Column) => (c.align === "end" ? "cf-num" : undefined);
  return (
    <div className={cx("cf-table-wrap", className)} style={style}>
      <table className="cf-table">
        <caption className="cf-sr">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => {
              const s = sort?.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined;
              const txt = <>{c.label}{s && <span aria-hidden>{s === "ascending" ? " ▲" : " ▼"}</span>}</>;
              return (
                <th key={c.key} scope="col" aria-sort={s} className={num(c)}>
                  {onSort && c.sortable !== false ? <button type="button" onClick={() => onSort(c.key)}>{txt}</button> : txt}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={(r.id ?? i) as Key}>
              {columns.map((c, j) => (j
                ? <td key={c.key} className={num(c)}>{r[c.key]}</td>
                : <th key={c.key} scope="row" className={num(c)}>{r[c.key]}</th>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function ProgressBar({ value, marker, label, className, style }: P<T.ProgressBarProps>) {
  const pct = (v: number) => clamp01(v) * 100 + "%";
  return (
    <div className={cx("cf-progress", className)} style={style} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(clamp01(value) * 100)}>
      <span className="cf-progress__fill" style={{ width: pct(value) }} />
      {marker != null && <span className="cf-progress__marker" style={{ left: pct(marker) }} />}
    </div>
  );
}
export function BarList({ items, numbered, label, className, style }: P<T.BarListProps>) {
  return (
    <ol className={cx("cf-barlist", className)} style={style} aria-label={label}>
      {items.map((it, i) => (
        <li key={it.label}>
          <div className="cf-barlist__head"><span className="cf-barlist__name">{numbered ? `${i + 1}. ${it.label}` : it.label}</span><span className="cf-barlist__value">{it.value}</span></div>
          <ProgressBar value={it.ratio} marker={it.marker} label={`${it.label}: ${it.value}`} />
          {(it.detail || it.change) && <div className="cf-barlist__foot"><span className="cf-barlist__detail">{it.detail}</span>{it.change && <Change change={it.change} trend={it.trend} />}</div>}
        </li>
      ))}
    </ol>
  );
}
export function Accordion({ title, defaultOpen, className, style, children }: P<T.AccordionProps>) {
  return (
    <details className={cx("cf-accordion", className)} style={style} open={defaultOpen}>
      <summary>{title}<Icon name="chevron-down" size={20} /></summary>
      <div className="cf-accordion__body">{children}</div>
    </details>
  );
}
export function Steps({ steps, current, className, style }: P<T.StepsProps>) {
  return (
    <div className={cx("cf-steps", className)} style={style}>
      <div className="cf-steps__bars" style={vars({ "--cf-n": steps.length })} aria-hidden>
        {steps.map((_, i) => <span key={i} className="cf-steps__bar" data-done={i <= current || undefined} />)}
      </div>
      <span className="cf-steps__label">{`${current + 1} de ${steps.length} · `}<b>{steps[current]}</b></span>
    </div>
  );
}
export function Pagination({ page, pageSize, total, onChange, className, style }: P<T.PaginationProps>) {
  const ultima = Math.max(1, Math.ceil(total / pageSize));
  return (
    <nav className={cx("cf-pagination", className)} style={style} aria-label="Páginas">
      <IconButton icon="back" label="Página anterior" disabled={page <= 1} onPress={() => onChange(page - 1)} />
      <span>{pageLabel(page, pageSize, total)}</span>
      <IconButton icon="chevron-right" label="Próxima página" disabled={page >= ultima} onPress={() => onChange(page + 1)} />
    </nav>
  );
}

// ---------- gráficos: a largura vem do elemento; o desenho, do charts.ts
const PALETA = Object.fromEntries(PALETTE_KEYS.map((k) => [k, `var(--cf-${kebab(k)})`])) as Palette;
function useWidth() {
  const ref = useRef<HTMLDivElement>(null), [w, setW] = useState(0);
  useLayout(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}
function chart<X extends T.ChartBase>(draw: (o: X, d: Draw) => Drawn) {
  return function Chart(p: P<X>) {
    const [ref, width] = useWidth();
    const r = width ? draw(p, { width, palette: PALETA }) : null;
    return <div ref={ref} className={cx("cf-chart", p.className)} style={{ minHeight: r?.height ?? p.height, ...p.style }} role="img" aria-label={p.label} dangerouslySetInnerHTML={r ? { __html: r.svg } : undefined} />;
  };
}
export const LineChart = chart<T.LineChartProps>(lineChart);
export const BarChart = chart<T.BarChartProps>(barChart);
export const ScatterChart = chart<T.ScatterChartProps>(scatterChart);
export const Heatmap = chart<T.HeatmapProps>(heatmap);
export function Legend({ items, className, style }: P<T.LegendProps>) {
  return (
    <div className={cx("cf-legend", className)} style={style} aria-hidden>
      {items.map((it) => <span key={it.label} className="cf-legend__item"><span className={`cf-legend__swatch cf-legend__swatch--${it.kind}`} />{it.label}</span>)}
    </div>
  );
}

// ---------- camadas: <dialog> nativo dá foco preso, Esc e fundo inerte
function useDialog(open: boolean, onClose: (() => void) | undefined, fechaNoFundo: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);
  return {
    ref,
    onCancel: (e: SyntheticEvent) => { e.preventDefault(); onClose?.(); },
    onClick: fechaNoFundo ? (e: MouseEvent) => { if (e.target === e.currentTarget) onClose?.(); } : undefined,
  };
}
export function Sheet({ open, onClose, title, subtitle, footer, className, style, children }: P<T.SheetProps>) {
  const id = useId();
  return (
    <dialog {...useDialog(open, onClose, true)} className={cx("cf-sheet", className)} style={style} aria-labelledby={id}>
      {open && (
        <div className="cf-sheet__panel">
          <div className="cf-sheet__head">
            <div><h2 id={id} className="cf-sheet__title">{title}</h2>{subtitle && <p className="cf-sheet__subtitle">{subtitle}</p>}</div>
            <IconButton icon="close" label="Fechar" variant="filled" onPress={onClose} />
          </div>
          {children}
          {footer && <div className="cf-sheet__foot">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}
export function Dialog({ open, onClose, title, footer, className, style, children }: P<T.DialogProps>) {
  const id = useId();
  return (
    <dialog {...useDialog(open, onClose, true)} className={cx("cf-dialog", className)} style={style} aria-labelledby={id}>
      {open && (
        <div className="cf-dialog__panel">
          <div className="cf-dialog__head"><h2 id={id} className="cf-dialog__title">{title}</h2><IconButton icon="close" label="Fechar" variant="filled" onPress={onClose} /></div>
          {children}
          {footer && <div className="cf-dialog__actions">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}
export function ConfirmDialog({ open, title, message, confirmLabel = "Excluir", cancelLabel = "Cancelar", danger = true, onConfirm, onCancel, className, style }: P<T.ConfirmDialogProps>) {
  const id = useId();
  return (
    <dialog {...useDialog(open, onCancel, false)} role="alertdialog" className={cx("cf-dialog", className)} style={style} aria-labelledby={id + "t"} aria-describedby={message ? id + "m" : undefined}>
      {open && (
        <div className="cf-dialog__panel">
          <h2 id={id + "t"} className="cf-dialog__title">{title}</h2>
          {message && <p id={id + "m"} className="cf-dialog__message">{message}</p>}
          <div className="cf-dialog__actions">
            <Button variant="secondary" onPress={onCancel} autoFocus>{cancelLabel}</Button>
            <Button variant={danger ? "danger" : "primary"} onPress={onConfirm}>{confirmLabel}</Button>
          </div>
        </div>
      )}
    </dialog>
  );
}
export function Popover({ open, onClose, title, width = 440, anchor, className, style, children }: P<T.PopoverProps>) {
  const ref = useRef<HTMLDivElement>(null), id = useId();
  useLayout(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.matches(":popover-open")) {
      const r = (anchor?.current as Element | null | undefined)?.getBoundingClientRect?.();
      const w = Math.min(width, innerWidth - 32);
      el.style.top = (r ? r.bottom + 8 : 72) + "px";
      el.style.left = Math.max(16, Math.min(r ? r.left : innerWidth - w - 16, innerWidth - w - 16)) + "px";
      el.showPopover();
    } else if (!open && el.matches(":popover-open")) el.hidePopover();
  }, [open]);
  useEffect(() => {
    const el = ref.current;
    const t = (e: Event) => { if ((e as ToggleEvent).newState === "closed") onClose?.(); };
    el?.addEventListener("toggle", t);
    return () => el?.removeEventListener("toggle", t);
  }, [onClose]);
  // popover ainda não está no tipo do React 18: vai por espalhamento
  return (
    <div ref={ref} {...{ popover: "auto" }} role="dialog" aria-labelledby={id} className={cx("cf-popover", className)} style={vars({ "--cf-w": width + "px", ...style })}>
      <h2 id={id} className="cf-popover__title">{title}</h2>{children}
    </div>
  );
}
export function Toast({ open, onClose, message, tone = "neutral", duration = 4000, action, className, style }: P<T.ToastProps>) {
  useEffect(() => {
    if (!open || !duration) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [open, duration, message]);
  return (
    <div role="status" aria-live="polite" className={open ? cx("cf-toast", tone === "danger" && "cf-toast--danger", className) : "cf-sr"} style={open ? style : undefined}>
      {open && message}
      {open && action && <Press href={action.href} onPress={action.onPress} className="cf-toast__action">{action.label}</Press>}
    </div>
  );
}

// ---------- estados
const AVISO: Record<NonNullable<T.NoticeProps["tone"]>, T.IconName> = { info: "info", danger: "alert", offline: "wifi" };
export function Notice({ tone = "info", title, action, className, style, children }: P<T.NoticeProps>) {
  return (
    <div className={cx("cf-notice", `cf-notice--${tone}`, className)} style={style} role={tone === "danger" ? "alert" : "status"}>
      <Icon name={AVISO[tone]} />
      <div className="cf-notice__text"><strong>{title}</strong>{children && <span>{children}</span>}</div>
      {action && <Button variant="secondary" size="sm" href={action.href} onPress={action.onPress}>{action.label}</Button>}
    </div>
  );
}
export function EmptyState({ icon = "info", title, description, action, className, style }: P<T.EmptyStateProps>) {
  return (
    <div className={cx("cf-empty", className)} style={style}>
      <IconTile icon={icon} tone="neutral" />
      <p className="cf-empty__title">{title}</p>
      {description && <p className="cf-empty__text">{description}</p>}
      {action && <Button variant="secondary" href={action.href} onPress={action.onPress}>{action.label}</Button>}
    </div>
  );
}
export function Skeleton({ width = "100%", height = 16, radius, className, style }: P<T.SkeletonProps>) {
  return <span className={cx("cf-skeleton", className)} style={{ width, height, ...(radius != null && { borderRadius: radius }), ...style }} aria-hidden />;
}
