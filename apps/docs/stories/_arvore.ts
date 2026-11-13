import type { TreeNode } from "@countify-oficial/core";

/** Rede → cidade → loja, para as histórias de Tree, TreeSelect e Cascader. */
export const redeDeLojas: TreeNode[] = [
  {
    value: "ce",
    label: "Ceará",
    children: [
      { value: "for", label: "Fortaleza", children: [{ value: "jardins", label: "Lume Jardins" }, { value: "aldeota", label: "Lume Aldeota" }, { value: "orla", label: "Lume Orla" }] },
      { value: "sob", label: "Sobral", children: [{ value: "centro", label: "Lume Centro" }] },
    ],
  },
  { value: "sp", label: "São Paulo", children: [{ value: "pinheiros", label: "Lume Pinheiros" }, { value: "moema", label: "Lume Moema", disabled: true }] },
];
