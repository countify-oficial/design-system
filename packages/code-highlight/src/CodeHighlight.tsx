import { CopyButton, ScrollArea, UnstyledButton } from "@countify-oficial/core";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import type { CSSProperties, ReactNode } from "react";
import { tokenizeLines, type CodeLanguage, type TokenKind } from "./tokenize";
import classes from "./CodeHighlight.module.css";

const CLASSE: Record<TokenKind, string | undefined> = {
  keyword: classes["keyword"],
  string: classes["string"],
  number: classes["number-token"],
  comment: classes["comment"],
  property: classes["property"],
  punctuation: classes["punctuation"],
  plain: undefined,
};

export interface CodeHighlightProps {
  code: string;
  /** ts, tsx, js, jsx, json, bash, sh, css ou text (sem cor). Padrão: tsx. */
  language?: CodeLanguage | undefined;
  /** O link "Copiar". Padrão: true. */
  withCopyButton?: boolean | undefined;
  withLineNumbers?: boolean | undefined;
  /** Acima do código, à esquerda (o nome do arquivo, por exemplo). */
  title?: ReactNode;
  /** O nome da área que rola, para o leitor de tela. Padrão: o título, se for texto. */
  "aria-label"?: string | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}

/** Bloco de código com realce (papéis de cor que já existem) e o link "Copiar". Rola para o lado sem quebrar linha. */
export function CodeHighlight(props: CodeHighlightProps) {
  const messages = useMessages();
  const { code, language = "tsx", withCopyButton = true, withLineNumbers = false, title, "aria-label": nome, className, style } = useComponentProps("CodeHighlight", {}, props);
  const linhas = tokenizeLines(code.replace(/\n$/, ""), language);
  return (
    <div className={[classes["root"], className].filter(Boolean).join(" ")} style={style}>
      {(title !== undefined || withCopyButton) && (
        <div className={classes["toolbar"]}>
          {title}
          {withCopyButton && (
            <CopyButton value={code}>
              {({ copied, copy }) => (
                <UnstyledButton className={classes["copy"]} onClick={copy} aria-live="polite">
                  {copied ? messages.copied : messages.copy}
                </UnstyledButton>
              )}
            </CopyButton>
          )}
        </div>
      )}
      <ScrollArea role="region" aria-label={nome ?? (typeof title === "string" ? title : language)} scrollbars="x" className={classes["scroll"]}>
        <pre className={classes["pre"]}>
          <code>
            {linhas.map((linha, i) => (
              <span key={i} className={classes["line"]}>
                {withLineNumbers && <span className={classes["number"]} aria-hidden>{i + 1}</span>}
                <span className={classes["content"]}>
                  {linha.map((t, j) => (CLASSE[t.kind] ? <span key={j} className={CLASSE[t.kind]}>{t.text}</span> : t.text))}
                  {"\n"}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </ScrollArea>
    </div>
  );
}
