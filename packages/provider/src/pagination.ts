/** As páginas a mostrar, com "dots" nos saltos: [1, "dots", 4, 5, 6, "dots", 10]. */
export function paginationRange(total: number, atual: number, irmas = 1, bordas = 1): (number | "dots")[] {
  const faixa = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);
  // cabem todas: as bordas, as irmãs dos dois lados, a atual e os dois "dots"
  if (total <= bordas * 2 + irmas * 2 + 3) return faixa(1, total);
  const ini = Math.max(Math.min(atual - irmas, total - bordas - irmas * 2 - 1), bordas + 2);
  const fim = Math.min(Math.max(atual + irmas, bordas + irmas * 2 + 2), total - bordas - 1);
  return [
    ...faixa(1, bordas),
    ini > bordas + 2 ? ("dots" as const) : bordas + 1,
    ...faixa(ini, fim),
    fim < total - bordas - 1 ? ("dots" as const) : total - bordas,
    ...faixa(total - bordas + 1, total),
  ];
}

/** "21–40 de 340": os itens mostrados na página. */
export function pageLabel(pagina: number, porPagina: number, total: number): string {
  if (!total) return "0 de 0";
  return `${(pagina - 1) * porPagina + 1}–${Math.min(pagina * porPagina, total)} de ${total}`;
}
