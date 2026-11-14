import { useComponentProps, useMessages } from "@countify-oficial/provider";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import classes from "./SkeletonMask.module.css";

export interface SkeletonMaskProps extends StylesApiProps, Omit<ComponentPropsWithRef<"div">, "className" | "style" | "children"> {
  /** Mostra o conteúdo como blocos do Skeleton (true) ou como ele é (false). */
  visible: boolean;
  /** Pulsa. Padrão: true (para com "reduzir movimento"). */
  animate?: boolean | undefined;
  /** O que o leitor de tela anuncia. Padrão: "Carregando" do provider. */
  label?: string | undefined;
  /** O conteúdo de verdade (com dados de exemplo enquanto carrega), no mesmo layout. */
  children?: ReactNode;
}

/**
 * O "Carregando" no formato exato da tela: os filhos de verdade, no mesmo lugar e tamanho, viram os blocos do Skeleton
 * (texto da largura dele, botões, abas, etiquetas, caixas de marcar, ícones, imagens e células, cada um com o próprio
 * canto); o campo fica com a própria superfície e um bloco onde o valor estaria; cartões e fundos ficam. Enquanto mostra
 * os blocos, nada ali recebe clique, foco ou leitor de tela. Sem `visible`, não muda nada (o invólucro não tem caixa).
 */
export function SkeletonMask(props: SkeletonMaskProps) {
  const messages = useMessages();
  const { visible, animate = true, label = messages.loading, children, className, style, classNames, styles, ...rest } =
    useComponentProps("SkeletonMask", {}, props);
  const getStyles = useStyles("SkeletonMask", classes, { className, style, classNames, styles });
  return (
    <>
      <div
        {...rest}
        inert={visible || undefined}
        aria-busy={visible || undefined}
        data-visible={visible || undefined}
        data-animate={(visible && animate) || undefined}
        {...getStyles("root")}
      >
        {children}
      </div>
      {visible && <VisuallyHidden role="status">{label}</VisuallyHidden>}
    </>
  );
}
