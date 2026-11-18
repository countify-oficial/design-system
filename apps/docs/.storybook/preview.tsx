import "@countify-oficial/tokens/fonts.css";
import "@countify-oficial/tokens/tokens.css";
import "@countify-oficial/carousel/styles.css";
import "@countify-oficial/charts/styles.css";
import "@countify-oficial/code-highlight/styles.css";
import "@countify-oficial/dates/styles.css";
import "@countify-oficial/dropzone/styles.css";
import "@countify-oficial/modals/styles.css";
import "@countify-oficial/notifications/styles.css";
import "@countify-oficial/spotlight/styles.css";
import "./preview.css";
import { CountifyProvider, type ColorSchemeSetting } from "@countify-oficial/provider";
import type { Preview } from "@storybook/react-vite";
import { Pagina } from "./pagina";

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    colorScheme: {
      description: "Modo",
      toolbar: {
        title: "Modo",
        icon: "mirror",
        items: [
          { value: "auto", title: "Automático" },
          { value: "light", title: "Claro" },
          { value: "dark", title: "Escuro" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { colorScheme: "auto" },
  parameters: {
    a11y: { test: "error" },
    controls: { expanded: true },
    // os mesmos tamanhos da prévia das páginas (pagina.tsx), no seletor de tela do modo de exemplo
    viewport: {
      options: {
        celular: { name: "Celular (390)", styles: { width: "390px", height: "844px" }, type: "mobile" },
        tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
        computador: { name: "Computador (1280)", styles: { width: "1280px", height: "800px" }, type: "desktop" },
      },
    },
    docs: {
      page: Pagina,
      // "Nesta página" sem os títulos de dentro dos exemplos; do índice de componentes, só as categorias
      toc: { headingSelector: "h2, h3", ignoreSelector: ".sb-story :not(.cf-indice-categoria)", title: "Nesta página" },
    },
    options: {
      storySort: {
        order: [
          "Introdução",
          "Fundamentos", ["Cores", "Tipografia", "Espaço e formas", "Ícones"],
          "Componentes",
          // as mesmas categorias, na mesma ordem, do stories/_catalogo.ts
          "Primitivos", "Layout", "Tipografia", "Botões", "Campos", "Escolhas", "Combobox", "Dados", "Feedback",
          "Navegação", "Sobreposições", "Extensões", "Modelos",
        ],
      },
    },
  },
  decorators: [
    (Story, { globals }) => (
      <CountifyProvider colorScheme={globals["colorScheme"] as ColorSchemeSetting}>
        <div className="cf-story">
          <Story />
        </div>
      </CountifyProvider>
    ),
  ],
};
export default preview;
