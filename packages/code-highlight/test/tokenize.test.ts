import { describe, expect, it } from "vitest";
import { tokenize, tokenizeLines } from "../src/tokenize";

const tipos = (c: string, l: Parameters<typeof tokenize>[1]) => tokenize(c, l).filter((t) => t.kind !== "plain" && t.kind !== "punctuation").map((t) => `${t.kind}:${t.text}`);

describe("realce de código", () => {
  it("TypeScript: palavras-chave, textos, números e comentários", () => {
    expect(tipos('const n = 42; // fim\nimport { a } from "b";', "ts")).toEqual(["keyword:const", "number:42", "comment:// fim", "keyword:import", "keyword:from", 'string:"b"']);
  });

  it("JSON: chaves e valores", () => {
    expect(tipos('{ "loja": "Jardins", "ativa": true, "n": 3 }', "json")).toEqual(['property:"loja"', 'string:"Jardins"', 'property:"ativa"', "keyword:true", 'property:"n"', "number:3"]);
  });

  it("shell e CSS", () => {
    expect(tipos("pnpm add @countify-oficial/core --save # nota", "bash")).toEqual(["property:--save", "comment:# nota"]);
    expect(tipos(".a { color: #225BA5; }", "css")).toEqual(["property:color", "number:#225BA5"]);
  });

  it("linhas para numerar; língua desconhecida sai sem cor", () => {
    expect(tokenizeLines("a\nb\n", "ts")).toHaveLength(3);
    expect(tokenize("x", "text")).toEqual([{ kind: "plain", text: "x" }]);
  });
});
