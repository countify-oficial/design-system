import { useReducedMotion } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { useEffect, useState, type ComponentPropsWithRef } from "react";
import { ActionIcon } from "../ActionIcon/ActionIcon";
import { Icon } from "../Icon/Icon";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Scroller.module.css";

export interface ScrollerProps extends StylesApiProps<"root" | "viewport" | "control">, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** Quanto cada seta rola, em pixels. Padrão: a largura visível. */
  scrollAmount?: number | undefined;
}

/** Fileira que rola para o lado, com setas nas pontas quando há mais conteúdo daquele lado (chips, cartões). */
export function Scroller(props: ScrollerProps) {
  const messages = useMessages();
  const reduzir = useReducedMotion();
  const { scrollAmount, children, className, style, classNames, styles, ...rest } = useComponentProps("Scroller", {}, props);
  const getStyles = useStyles("Scroller", classes, { className, style, classNames, styles });
  const [vista, setVista] = useState<HTMLDivElement | null>(null);
  const [lados, setLados] = useState({ antes: false, depois: false });
  useEffect(() => {
    if (!vista) return;
    const medir = () => setLados({ antes: vista.scrollLeft > 0, depois: vista.scrollLeft + vista.clientWidth < vista.scrollWidth - 1 });
    medir();
    vista.addEventListener("scroll", medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(vista);
    return () => {
      vista.removeEventListener("scroll", medir);
      ro.disconnect();
    };
  }, [vista]);
  const rolar = (sentido: 1 | -1) => vista?.scrollBy({ left: sentido * (scrollAmount ?? vista.clientWidth), behavior: reduzir ? "auto" : "smooth" });
  return (
    <div {...rest} {...getStyles("root")}>
      <ActionIcon aria-label={messages.scrollBackward} variant="default" tabIndex={-1} data-hidden={!lados.antes || undefined} onClick={() => rolar(-1)} {...getStyles("control")}>
        <Icon name="back" size="sm" />
      </ActionIcon>
      <div ref={setVista} {...getStyles("viewport")}>
        {children}
      </div>
      <ActionIcon aria-label={messages.scrollForward} variant="default" tabIndex={-1} data-hidden={!lados.depois || undefined} onClick={() => rolar(1)} {...getStyles("control")}>
        <Icon name="chevron-right" size="sm" />
      </ActionIcon>
    </div>
  );
}
