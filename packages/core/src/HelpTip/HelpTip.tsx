import { useComponentProps } from "@countify-oficial/provider";
import type { Placement } from "@floating-ui/react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import { Popover } from "../Popover/Popover";
import { useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./HelpTip.module.css";

export interface HelpTipProps extends StylesApiProps<"root" | "content">, Omit<ComponentPropsWithRef<"button">, "className" | "style" | "children"> {
  /** Nome do botão e da explicação para o leitor de tela ("Ajuda: como é calculado o previsto"). */
  label: string;
  /** A explicação que o "?" mostra ao ser clicado. */
  children: ReactNode;
  /** Lado em que a explicação abre. Padrão: bottom-start. */
  position?: Placement | undefined;
}

/**
 * O "?" de ajuda: a explicação fica nele, fora da tela ("Pouco texto" do guia). Alvo redondo de 44 que não aumenta a
 * linha; o clique abre a explicação e Esc ou um clique fora fecham.
 */
export function HelpTip(props: HelpTipProps) {
  const { label, children, position = "bottom-start", className, style, classNames, styles, ...rest } = useComponentProps("HelpTip", {}, props);
  const getStyles = useStyles("HelpTip", classes, { className, style, classNames, styles });
  return (
    <Popover position={position}>
      <Popover.Target>
        <UnstyledButton aria-label={label} {...rest} {...getStyles("root")}>
          <Icon name="help" />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown aria-label={label}>
        <div {...getStyles("content")}>{children}</div>
      </Popover.Dropdown>
    </Popover>
  );
}
