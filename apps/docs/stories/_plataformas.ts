/// <reference types="vite/client" />
// Plataformas de cada componente, lidas da docs/MATRIZ_COMPONENTES.md (a fonte única): a documentação nunca diverge da matriz.
import matriz from "../../../docs/MATRIZ_COMPONENTES.md?raw";

export type Estado = "ok" | "adaptado" | "N/A";
export interface Linha {
  nome: string;
  web: Estado;
  desktop: Estado;
  mobile: Estado;
  motivo: string;
}

const estado = (s: string): Estado => (s === "adaptado" || s === "N/A" ? s : "ok");

// "Checkbox (+ Group)", "dates: Calendar", "Slider, RangeSlider" → um nome por componente, apontando para a mesma linha
const linhas = new Map<string, Linha>();
for (const texto of matriz.split("\n")) {
  const celulas = texto.split("|").map((c) => c.trim());
  if (celulas.length < 7 || !["ok", "adaptado", "N/A"].includes(celulas[2] ?? "")) continue;
  const [, nomes = "", web = "", desktop = "", mobile = "", motivo = ""] = celulas;
  const limpos = nomes.replace(/^[a-z-]+:\s*/, "").replace(/\s*\(\+ Group\)/, "").split(/,\s*/);
  for (const nome of limpos) {
    linhas.set(nome, { nome, web: estado(web), desktop: estado(desktop), mobile: estado(mobile), motivo });
  }
}

/** As linhas da matriz dos componentes e pacotes de uma página (pelos nomes da linha de importação). */
export function plataformasDe(importacao: string): Linha[] {
  const achadas: Linha[] = [];
  for (const [, nomes = "", pacote = ""] of importacao.matchAll(/import \{([^}]*)\} from "@countify-oficial\/([a-z-]+)"/g)) {
    const doPacote = nomes.split(",").map((n) => n.trim()).filter((n) => /^[A-Z]/.test(n));
    const daMatriz = doPacote.map((n) => linhas.get(n)).filter((l): l is Linha => !!l);
    // as extensões têm uma linha por pacote (carousel, dropzone…) quando os componentes não têm a própria
    const linhaDoPacote = linhas.get(pacote);
    if (daMatriz.length) achadas.push(...daMatriz);
    else if (linhaDoPacote) achadas.push({ ...linhaDoPacote, nome: doPacote.join(", ") || pacote });
  }
  return achadas.filter((l, i, todas) => todas.findIndex((o) => o.nome === l.nome) === i);
}

/**
 * A importação equivalente no celular, sem o que não existe lá: o core vira o native; as extensões são o mesmo
 * pacote (o Metro escolhe a versão). null quando nada da página existe no celular.
 */
export function importacaoNoCelular(importacao: string): string | null {
  const existe = (nome: string, pacote: string) => (linhas.get(nome) ?? linhas.get(pacote))?.mobile !== "N/A";
  const resultado = importacao.split("\n").flatMap((linha) => {
    const m = /import \{([^}]*)\} from "@countify-oficial\/([a-z-]+)";/.exec(linha);
    if (!m) return [linha];
    const pacote = m[2] ?? "";
    const nomes = (m[1] ?? "").split(",").map((n) => n.trim()).filter((n) => n && existe(n, pacote));
    if (!nomes.length) return [];
    return [`import { ${nomes.join(", ")} } from "@countify-oficial/${pacote === "core" ? "native" : pacote}";`];
  });
  return resultado.length ? resultado.join("\n") : null;
}
