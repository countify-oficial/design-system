export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[] | undefined;
  disabled?: boolean | undefined;
}

/** As folhas (sem filhos) debaixo de um nó, ele incluído se for folha. */
export function treeLeaves(no: TreeNode): string[] {
  return no.children?.length ? no.children.flatMap(treeLeaves) : [no.value];
}

/** all: todas as folhas marcadas; some: algumas; none: nenhuma. */
export function treeCheckState(no: TreeNode, marcados: string[]): "all" | "some" | "none" {
  const folhas = treeLeaves(no);
  const n = folhas.filter((f) => marcados.includes(f)).length;
  return n === 0 ? "none" : n === folhas.length ? "all" : "some";
}

/** Acha o nó pelo valor. */
export function findTreeNode(dados: TreeNode[], valor: string): TreeNode | undefined {
  for (const no of dados) {
    if (no.value === valor) return no;
    const achado = no.children ? findTreeNode(no.children, valor) : undefined;
    if (achado) return achado;
  }
  return undefined;
}

/** O caminho de rótulos até o valor ("Ceará / Fortaleza / Lume Jardins"). */
export function treePath(dados: TreeNode[], valor: string, caminho: TreeNode[] = []): TreeNode[] | undefined {
  for (const no of dados) {
    if (no.value === valor) return [...caminho, no];
    const achado = no.children ? treePath(no.children, valor, [...caminho, no]) : undefined;
    if (achado) return achado;
  }
  return undefined;
}

/** A menção que está sendo escrita antes do cursor ("@an" em "oi @an|"): onde começa e o que buscar. */
export function mentionQuery(texto: string, cursor: number, prefixo: string): { inicio: number; busca: string } | null {
  const antes = texto.slice(0, cursor);
  const i = antes.lastIndexOf(prefixo);
  if (i < 0) return null;
  const anterior = antes[i - 1];
  const busca = antes.slice(i + prefixo.length);
  if ((anterior !== undefined && !/\s/.test(anterior)) || /\s/.test(busca)) return null;
  return { inicio: i, busca };
}
