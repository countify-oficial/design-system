import type { ComponentPropsWithRef, ElementType } from "react";

/** Props de um componente que troca o elemento pela prop `component`: as próprias, mais as do elemento escolhido (com o ref). */
export type PolymorphicProps<C extends ElementType, Own extends object = object> = Own & { component?: C | undefined } & Omit<
  ComponentPropsWithRef<C>,
  keyof Own | "component"
>;
