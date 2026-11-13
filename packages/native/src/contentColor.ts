import { createContext, useContext } from "react";

/**
 * A cor do conteúdo de um botão (o "currentColor" da web): Button, ActionIcon e Toggle dizem qual é, e Icon, Loader
 * e Text usam como cor padrão. O React Native não herda cor de uma View para o texto de dentro.
 */
export const ContentColor = createContext<string | undefined>(undefined);
export const useContentColor = (): string | undefined => useContext(ContentColor);
