// Realce de sintaxe pequeno e sem biblioteca: separa o código em pedaços (palavra-chave, texto, número, comentário…).
// Cobre TypeScript/JavaScript (com JSX), JSON, shell e CSS; outra língua sai sem cor.

export type TokenKind = "keyword" | "string" | "number" | "comment" | "property" | "punctuation" | "plain";
export interface Token {
  kind: TokenKind;
  text: string;
}
export type CodeLanguage = "ts" | "tsx" | "js" | "jsx" | "json" | "bash" | "sh" | "css" | "text";

const PALAVRAS: Record<string, string[]> = {
  ts: [
    "import", "export", "from", "default", "const", "let", "var", "function", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "new",
    "class", "extends", "implements", "interface", "type", "enum", "as", "async", "await", "try", "catch", "finally", "throw", "typeof", "instanceof", "in", "of", "void",
    "null", "undefined", "true", "false", "this", "super", "readonly", "public", "private", "protected", "static", "keyof", "satisfies",
  ],
  json: ["true", "false", "null"],
  bash: ["if", "then", "else", "fi", "for", "do", "done", "while", "case", "esac", "export", "echo", "cd", "function", "return", "in"],
  css: ["important"],
};

interface Regra {
  kind: TokenKind;
  re: RegExp;
}

const comum = { numero: { kind: "number" as const, re: /^-?\d[\d_]*(\.\d+)?([eE][+-]?\d+)?/ }, espaco: { kind: "plain" as const, re: /^\s+/ } };

const REGRAS: Record<"ts" | "json" | "bash" | "css", Regra[]> = {
  ts: [
    { kind: "comment", re: /^\/\/[^\n]*/ },
    { kind: "comment", re: /^\/\*[\s\S]*?\*\// },
    { kind: "string", re: /^(["'])(?:\\.|(?!\1)[^\\\n])*\1/ },
    { kind: "string", re: /^`(?:\\.|[^\\`])*`/ },
    comum.numero,
    comum.espaco,
    { kind: "plain", re: /^[A-Za-z_$][\w$]*/ },
    { kind: "punctuation", re: /^[{}()[\];,.<>/=+\-*!?:&|%^~@#]/ },
  ],
  json: [
    { kind: "property", re: /^"(?:\\.|[^\\"])*"(?=\s*:)/ },
    { kind: "string", re: /^"(?:\\.|[^\\"])*"/ },
    comum.numero,
    comum.espaco,
    { kind: "plain", re: /^[A-Za-z_]\w*/ },
    { kind: "punctuation", re: /^[{}[\],:]/ },
  ],
  bash: [
    { kind: "comment", re: /^#[^\n]*/ },
    { kind: "string", re: /^(["'])(?:\\.|(?!\1)[^\\])*\1/ },
    { kind: "property", re: /^--?[\w-]+/ },
    comum.espaco,
    { kind: "plain", re: /^[\w./@:+-]+/ },
    { kind: "punctuation", re: /^[|&;<>(){}$=\\]/ },
  ],
  css: [
    { kind: "comment", re: /^\/\*[\s\S]*?\*\// },
    { kind: "string", re: /^(["'])(?:\\.|(?!\1)[^\\\n])*\1/ },
    { kind: "property", re: /^[\w-]+(?=\s*:)/ },
    { kind: "number", re: /^-?\d*\.?\d+(px|rem|em|%|ms|s|deg|vh|vw)?/ },
    { kind: "number", re: /^#[0-9a-fA-F]{3,8}\b/ },
    comum.espaco,
    { kind: "plain", re: /^[\w-]+/ },
    { kind: "punctuation", re: /^[{}();:,.>+~*[\]=!]/ },
  ],
};

const familia = (l: CodeLanguage): keyof typeof REGRAS | null =>
  l === "ts" || l === "tsx" || l === "js" || l === "jsx" ? "ts" : l === "json" ? "json" : l === "bash" || l === "sh" ? "bash" : l === "css" ? "css" : null;

/** O código em pedaços com o tipo de cada um (para pintar). */
export function tokenize(codigo: string, linguagem: CodeLanguage): Token[] {
  const f = familia(linguagem);
  if (!f) return [{ kind: "plain", text: codigo }];
  const regras = REGRAS[f];
  const palavras = new Set(PALAVRAS[f] ?? []);
  const out: Token[] = [];
  let resto = codigo;
  const juntar = (t: Token) => {
    const ultimo = out.at(-1);
    if (ultimo && ultimo.kind === t.kind && t.kind === "plain") ultimo.text += t.text;
    else out.push(t);
  };
  while (resto.length > 0) {
    let achou = false;
    for (const r of regras) {
      const m = r.re.exec(resto);
      if (!m) continue;
      const texto = m[0];
      juntar({ kind: r.kind === "plain" && palavras.has(texto) ? "keyword" : r.kind, text: texto });
      resto = resto.slice(texto.length);
      achou = true;
      break;
    }
    if (!achou) {
      juntar({ kind: "plain", text: resto.charAt(0) });
      resto = resto.slice(1);
    }
  }
  return out;
}

/** As linhas, cada uma com os seus pedaços (para numerar). */
export function tokenizeLines(codigo: string, linguagem: CodeLanguage): Token[][] {
  const linhas: Token[][] = [[]];
  for (const t of tokenize(codigo, linguagem)) {
    t.text.split("\n").forEach((parte, i) => {
      if (i > 0) linhas.push([]);
      if (parte) linhas.at(-1)?.push({ kind: t.kind, text: parte });
    });
  }
  return linhas;
}
