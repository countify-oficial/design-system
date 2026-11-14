import { ActionIcon, Icon } from "@countify-oficial/core";
import { useReducedMotion } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import type { Spacing } from "@countify-oficial/tokens";
import { Children, useEffect, useRef, useState, type ComponentPropsWithRef, type CSSProperties, type ReactNode } from "react";
import classes from "./Carousel.module.css";

export interface CarouselProps extends Omit<ComponentPropsWithRef<"section">, "className" | "style"> {
  /** Os Carousel.Slide. */
  children?: ReactNode;
  /** O nome do carrossel para o leitor de tela ("Datas comemorativas"). */
  "aria-label": string;
  /** Largura de cada cartão (CSS). Padrão: 100% (um por vez). */
  slideSize?: string | undefined;
  /** Espaço entre os cartões. Padrão: sm (8, como as fileiras de chips). */
  slideGap?: Spacing | undefined;
  /** Setas nas pontas (a partir de 768; no celular, rola com o dedo). Padrão: true. */
  withControls?: boolean | undefined;
  /** O contador "2 de 5". Padrão: true. */
  withCounter?: boolean | undefined;
  onSlideChange?: ((index: number) => void) | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}

export type CarouselSlideProps = ComponentPropsWithRef<"div">;

/** Um cartão do carrossel. */
export function CarouselSlide(props: CarouselSlideProps) {
  return <div {...props} />;
}

const valorDoEspaco = (g: Spacing) => (g === 0 ? "0" : typeof g === "number" ? `var(--cf-space-${String(g)})` : `var(--cf-spacing-${g})`);

/** Carrossel: cartões que rolam para o lado com encaixe; setas na web, o contador "2 de 5" e as setas do teclado. */
function CarouselRoot(props: CarouselProps) {
  const messages = useMessages();
  const reduzir = useReducedMotion();
  const { children, slideSize = "100%", slideGap = "sm", withControls = true, withCounter = true, onSlideChange, className, style, ...rest } = useComponentProps("Carousel", {}, props);
  const itens = Children.toArray(children);
  const [vista, setVista] = useState<HTMLDivElement | null>(null);
  const [atual, setAtual] = useState(0);
  const [lados, setLados] = useState({ antes: false, depois: itens.length > 1 });
  useEffect(() => {
    if (!vista) return;
    const medir = () => {
      const slides = Array.from(vista.children) as HTMLElement[];
      const passo = (slides[1]?.offsetLeft ?? 0) - (slides[0]?.offsetLeft ?? 0) || vista.clientWidth || 1;
      const i = Math.round(vista.scrollLeft / passo);
      setAtual(i);
      setLados({ antes: vista.scrollLeft > 0, depois: vista.scrollLeft + vista.clientWidth < vista.scrollWidth - 1 });
    };
    medir();
    vista.addEventListener("scroll", medir, { passive: true });
    // a largura muda (janela) e os cartões chegam depois (dados): as setas e o contador medem de novo
    const ro = new ResizeObserver(medir);
    ro.observe(vista);
    return () => {
      vista.removeEventListener("scroll", medir);
      ro.disconnect();
    };
  }, [vista, itens.length]);
  // avisa só quando o cartão muda: nem ao montar, nem a cada render com um callback novo
  const avisado = useRef(atual);
  useEffect(() => {
    if (avisado.current === atual) return;
    avisado.current = atual;
    onSlideChange?.(atual);
  }, [atual, onSlideChange]);
  const ir = (i: number) => {
    const slides = Array.from(vista?.children ?? []) as HTMLElement[];
    const alvo = slides[Math.max(0, Math.min(slides.length - 1, i))];
    const primeiro = slides[0];
    if (vista && alvo && primeiro) vista.scrollTo({ left: alvo.offsetLeft - primeiro.offsetLeft, behavior: reduzir ? "auto" : "smooth" });
  };
  return (
    <section aria-roledescription={messages.carousel} {...rest} className={[classes["root"], className].filter(Boolean).join(" ")} style={style}>
      <div className={classes["row"]}>
        {withControls && (
          <ActionIcon aria-label={messages.scrollBackward} variant="default" className={classes["control"]} data-hidden={!lados.antes || undefined} onClick={() => ir(atual - 1)}>
            <Icon name="back" size="sm" />
          </ActionIcon>
        )}
        <div
          ref={setVista}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a fileira que rola entra no Tab: as setas do teclado rolam (WCAG 2.1.1)
          tabIndex={0}
          className={classes["viewport"]}
          style={{ "--carousel-gap": valorDoEspaco(slideGap), "--carousel-slide-size": slideSize } as CSSProperties}
        >
          {itens.map((item, i) => (
            <div key={i} role="group" aria-roledescription={messages.slide} aria-label={messages.stepOf(i + 1, itens.length)} className={classes["slide"]}>
              {item}
            </div>
          ))}
        </div>
        {withControls && (
          <ActionIcon aria-label={messages.scrollForward} variant="default" className={classes["control"]} data-hidden={!lados.depois || undefined} onClick={() => ir(atual + 1)}>
            <Icon name="chevron-right" size="sm" />
          </ActionIcon>
        )}
      </div>
      {withCounter && itens.length > 1 && (
        <span className={classes["counter"]} aria-hidden>
          {messages.stepOf(Math.min(atual + 1, itens.length), itens.length)}
        </span>
      )}
    </section>
  );
}

/** Carousel com um Carousel.Slide por cartão. */
export const Carousel = Object.assign(CarouselRoot, { Slide: CarouselSlide });
