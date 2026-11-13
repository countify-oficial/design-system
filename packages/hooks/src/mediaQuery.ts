// Media query no React Native: só o que faz sentido num celular, conferido contra a tela atual.
// Aceita (min-width: Npx), (max-width: Npx) e (prefers-color-scheme: light|dark), unidos por "and".
export interface MediaEnvironment {
  width: number;
  colorScheme: "light" | "dark";
}

export function matchesMediaQuery(query: string, env: MediaEnvironment): boolean {
  const partes = query.split(/\s+and\s+/i).map((p) => p.trim()).filter(Boolean);
  if (partes.length === 0) throw new Error(`Media query vazia: "${query}"`);
  return partes.every((parte) => {
    const m = /^\(\s*([a-z-]+)\s*:\s*([a-z0-9.]+)\s*\)$/i.exec(parte);
    if (!m) throw new Error(`Media query não suportada no React Native: "${parte}"`);
    const [, nome = "", valor = ""] = m;
    if (nome === "prefers-color-scheme") return env.colorScheme === valor;
    if (nome !== "min-width" && nome !== "max-width") throw new Error(`Media query não suportada no React Native: "${parte}"`);
    const px = /^(\d+(?:\.\d+)?)px$/.exec(valor);
    if (!px) throw new Error(`Use px em "${parte}"`);
    const n = Number(px[1]);
    return nome === "min-width" ? env.width >= n : env.width <= n;
  });
}
