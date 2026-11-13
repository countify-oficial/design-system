import { useComponentProps } from "@countify-oficial/provider";
import { marqueeSpeed, type Spacing } from "@countify-oficial/tokens";
import { useEffect, useState, type ComponentPropsWithRef } from "react";
import { spacingVar, useStyles, type StylesApiProps } from "../styles";
import classes from "./Marquee.module.css";

export interface MarqueeProps extends StylesApiProps<"root" | "track" | "content">, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** Pixels por segundo. Padrão: 50 (aprovado em 13/11/2026). */
  speed?: number | undefined;
  /** Corre da esquerda para a direita. */
  reverse?: boolean | undefined;
  /** Para com o mouse em cima. Padrão: true (com o foco dentro, para sempre). */
  pauseOnHover?: boolean | undefined;
  /** Espaço entre as voltas. Padrão: xl. */
  gap?: Spacing | undefined;
}

/** Faixa que corre sozinha e dá a volta. Para com o mouse ou o foco; fica parada para quem pediu menos movimento. */
export function Marquee(props: MarqueeProps) {
  const { speed = marqueeSpeed, reverse, pauseOnHover = true, gap = "xl", children, className, style, classNames, styles, ...rest } = useComponentProps("Marquee", {}, props);
  const getStyles = useStyles("Marquee", classes, { className, style, classNames, styles });
  const [conteudo, setConteudo] = useState<HTMLDivElement | null>(null);
  const [largura, setLargura] = useState(0);
  useEffect(() => {
    if (!conteudo) return;
    const ro = new ResizeObserver(() => setLargura(conteudo.offsetWidth));
    ro.observe(conteudo);
    return () => ro.disconnect();
  }, [conteudo]);
  // uma volta = a largura do conteúdo (mais o espaço) na velocidade pedida
  const segundos = largura > 0 ? largura / Math.max(1, speed) : 0;
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- com o foco a faixa para: é a pausa pelo teclado (WCAG 2.2.2)
    <div role="marquee" tabIndex={0} data-reverse={reverse || undefined} data-pause-on-hover={pauseOnHover || undefined} {...rest} {...getStyles("root")}>
      <div {...getStyles("track", { "--marquee-duration": `${String(segundos)}s`, "--marquee-gap": spacingVar(gap) })}>
        <div ref={setConteudo} {...getStyles("content")}>
          {children}
        </div>
        <div aria-hidden inert {...getStyles("content")}>
          {children}
        </div>
      </div>
    </div>
  );
}
