import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { Children, isValidElement, type ComponentPropsWithRef, type ReactElement, type ReactNode } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton";
import classes from "./Stepper.module.css";

export interface StepperStepProps {
  /** O nome do passo ("Lojas", "Câmeras"…). */
  label: string;
  description?: ReactNode;
  /** Deixa (ou não) voltar a este passo pela barra. Padrão: o do Stepper. */
  allowStepSelect?: boolean | undefined;
  /** O conteúdo, mostrado quando o passo é o atual. */
  children?: ReactNode;
}

/** Um passo; o Stepper desenha a barra e mostra o conteúdo do atual. */
export function StepperStep(_props: StepperStepProps): null {
  return null;
}

/** O que aparece depois do último passo (active igual ao número de passos). */
export function StepperCompleted(_props: { children?: ReactNode }): null {
  return null;
}

export interface StepperProps extends StylesApiProps<"root" | "steps" | "step" | "stepButton" | "bar" | "label" | "stepLabel" | "description" | "content">, Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** O passo atual, a partir de 0. Igual ao número de passos: mostra o Stepper.Completed. */
  active: number;
  /** Com ele, as barras viram botões para ir a um passo. */
  onStepClick?: ((index: number) => void) | undefined;
  /** Deixa ir a passos à frente pela barra. Padrão: false (só voltar). */
  allowNextStepsSelect?: boolean | undefined;
}

/** Passos de um fluxo: uma barra por passo, cheia até o atual, e "2 de 4 · Nome" embaixo. */
export function StepperRoot(props: StepperProps) {
  const messages = useMessages();
  const { active, onStepClick, allowNextStepsSelect = false, children, className, style, classNames, styles, ...rest } = useComponentProps("Stepper", {}, props);
  const getStyles = useStyles("Stepper", classes, { className, style, classNames, styles });
  const filhos = Children.toArray(children).filter(isValidElement);
  const passos = filhos.filter((f): f is ReactElement<StepperStepProps> => f.type === StepperStep).map((f) => f.props);
  const fim = filhos.find((f): f is ReactElement<{ children?: ReactNode }> => f.type === StepperCompleted);
  const atual = passos[active];
  const clicavel = (i: number, p: StepperStepProps) => !!onStepClick && i !== active && (p.allowStepSelect ?? (i < active || allowNextStepsSelect));
  return (
    <div {...rest} {...getStyles("root")}>
      <ol aria-hidden={onStepClick ? undefined : true} {...getStyles("steps", { "--stepper-count": passos.length })}>
        {passos.map((p, i) => {
          const barra = <span data-done={i <= active || undefined} {...getStyles("bar")} />;
          return (
            <li key={p.label} {...getStyles("step")}>
              {onStepClick ? (
                <UnstyledButton aria-label={p.label} aria-current={i === active ? "step" : undefined} disabled={!clicavel(i, p) && i !== active} onClick={() => onStepClick(i)} {...getStyles("stepButton")}>
                  {barra}
                </UnstyledButton>
              ) : (
                barra
              )}
            </li>
          );
        })}
      </ol>
      {atual && (
        <p {...getStyles("label")}>
          {messages.stepOf(active + 1, passos.length)} · <span {...getStyles("stepLabel")}>{atual.label}</span>
        </p>
      )}
      {atual?.description !== undefined && <p {...getStyles("description")}>{atual.description}</p>}
      {(atual ? atual.children : fim?.props.children) !== undefined && <div {...getStyles("content")}>{atual ? atual.children : fim?.props.children}</div>}
    </div>
  );
}

/** Stepper com Stepper.Step (um por passo) e Stepper.Completed. */
export const Stepper = Object.assign(StepperRoot, { Step: StepperStep, Completed: StepperCompleted });
