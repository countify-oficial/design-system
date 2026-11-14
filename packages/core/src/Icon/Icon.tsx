import type { TablerIconName } from "@countify-oficial/icons-tabler";
import { useComponentProps } from "@countify-oficial/provider";
import { iconGrid, icons, type IconName, type Size } from "@countify-oficial/tokens";
import { useEffect, useReducer, type ComponentPropsWithRef } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Icon.module.css";

export interface IconProps extends StylesApiProps, Omit<ComponentPropsWithRef<"svg">, "className" | "style" | "children" | "dangerouslySetInnerHTML"> {
  /** Qual ícone: um da Countify (close, plus, search, chevron-down…) ou, com qualquer outro nome, um do Tabler (home, user, chart-pie…). */
  name: IconName | TablerIconName;
  /** Desenho do Tabler: outline (traço, padrão) ou filled (cheio; sem versão cheia, fica o traço). Os da Countify têm um desenho só. */
  variant?: "outline" | "filled" | undefined;
  /** Tamanho: xs 16, sm 18, md 22, lg 28, xl 32. Padrão: md. */
  size?: Size | undefined;
  /** Nome para o leitor de tela. Sem ele, o ícone é decorativo (aria-hidden). */
  label?: string | undefined;
}

type Tabler = { html: string; filled: boolean };
// ícones do Tabler já baixados, por "variante/nome"
const tabler = new Map<string, Tabler>();
// os que estão baixando: mil linhas com o mesmo ícone esperam o mesmo pedido, em vez de mil
const baixando = new Map<string, Promise<Tabler>>();

const isCountify = (name: string): name is IconName => Object.hasOwn(icons, name);

async function loadTabler(name: string, variant: "outline" | "filled"): Promise<Tabler> {
  // o mapa do Tabler (um import() por ícone) só é baixado quando o primeiro ícone dele aparece
  const sets = await import("@countify-oficial/icons-tabler");
  const filled = variant === "filled" && Object.hasOwn(sets.filled, name);
  const set: Partial<Record<string, () => Promise<{ default: string }>>> = filled ? sets.filled : sets.outline;
  const load = Object.hasOwn(set, name) ? set[name] : undefined;
  return { html: load ? (await load()).default : "", filled };
}

function useTabler(name: string | undefined, variant: "outline" | "filled") {
  const key = name === undefined ? undefined : `${variant}/${name}`;
  const [, loaded] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    if (name === undefined || key === undefined || tabler.has(key)) return;
    let mounted = true;
    let pedido = baixando.get(key);
    if (!pedido) {
      pedido = loadTabler(name, variant).then((t) => {
        tabler.set(key, t);
        return t;
      });
      baixando.set(key, pedido);
      // pronto ou com erro (um pedaço que não baixou), sai da fila; com erro, a próxima montagem tenta de novo
      void pedido.finally(() => baixando.delete(key)).catch(() => undefined);
    }
    void pedido.then(
      () => {
        if (mounted) loaded();
      },
      () => undefined,
    );
    return () => {
      mounted = false;
    };
  }, [name, variant, key]);
  return key === undefined ? undefined : tabler.get(key);
}

/** Ícone da Countify (traço de 1,8 numa caixa de 22) ou do Tabler (caixa de 24, no mesmo traço), na cor do texto. */
export function Icon(props: IconProps) {
  const { name, variant = "outline", size = "md", label, className, style, classNames, styles, ...rest } = useComponentProps("Icon", {}, props);
  const getStyles = useStyles("Icon", classes, { className, style, classNames, styles });
  const countify = isCountify(name);
  const t = useTabler(countify ? undefined : name, variant);
  const filled = t?.filled === true;
  return (
    <svg
      // 24: a grade dos desenhos do Tabler
      viewBox={countify ? `0 0 ${iconGrid.box} ${iconGrid.box}` : "0 0 24 24"}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={iconGrid.stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
      // desenho fixo dos tokens ou do Tabler (conferido no build), nunca texto do usuário
      dangerouslySetInnerHTML={{ __html: countify ? icons[name] : (t?.html ?? "") }}
      {...getStyles("root", { "--icon-size": `var(--cf-icon-size-${size})` })}
    />
  );
}
