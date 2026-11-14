// O miolo de um SVG do Tabler (o que vai dentro do <svg> do Icon), numa linha. Ele entra na página por innerHTML, então
// só passam formas simples, sem script, evento (on*), link (href) ou estilo: se o Tabler mudar o formato, o build para.
const shape = /<(?:path|circle|ellipse|line|polyline|polygon|rect)(?:\s+(?!on|href|style)[a-z][a-z-]*="[^"<>]*")*\s*\/>/g;

export function innerMarkup(svg, id) {
  const inner = /^\s*<svg\b[^>]*>([\s\S]*)<\/svg>\s*$/.exec(svg)?.[1]?.replace(/>\s+</g, "><").trim();
  if (inner === undefined || inner.replace(shape, "") !== "") throw new Error(`${id}: SVG fora do formato esperado do Tabler`);
  return inner;
}
