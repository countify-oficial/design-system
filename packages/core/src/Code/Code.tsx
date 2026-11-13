import { useComponentProps } from "@countify-oficial/provider";
import type { ComponentPropsWithRef } from "react";
import { useStyles, type StylesApiProps } from "../styles";
import classes from "./Code.module.css";

export interface CodeProps extends StylesApiProps, Omit<ComponentPropsWithRef<"code">, "className" | "style"> {
  /** Bloco (<pre>) em vez de trecho na linha. */
  block?: boolean | undefined;
}

/** Código em letra de largura fixa: um trecho na linha ou um bloco. */
export function Code(props: CodeProps) {
  const { block, className, style, classNames, styles, ...rest } = useComponentProps("Code", {}, props);
  const getStyles = useStyles("Code", classes, { className, style, classNames, styles });
  if (block) return <pre data-block {...getStyles("root")}><code {...rest} /></pre>;
  return <code {...rest} {...getStyles("root")} />;
}
