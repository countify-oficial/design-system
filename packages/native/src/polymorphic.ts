import type { ComponentPropsWithRef, ElementType } from "react";

/** Props de um componente que troca o elemento pela prop `component` (igual ao @countify-oficial/core). */
export type PolymorphicProps<C extends ElementType, Own extends object = object> = Own & { component?: C | undefined } & Omit<
  ComponentPropsWithRef<C>,
  keyof Own | "component"
>;
