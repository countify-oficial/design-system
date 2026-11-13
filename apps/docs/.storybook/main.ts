import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "node:url";

// código-fonte do @countify-oficial/core (fora da raiz deste app)
const core = fileURLToPath(new URL("../../../packages/core/", import.meta.url));

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  core: { disableTelemetry: true },
  typescript: {
    // lê os tipos e os comentários das props direto do código do @countify-oficial/core, sem as props do HTML
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      tsconfigPath: `${core}tsconfig.json`,
      include: [`${core}src/**/*.tsx`],
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => !prop.parent || !prop.parent.fileName.includes("node_modules"),
    },
  },
  viteFinal: (vite) => ({
    ...vite,
    // o core vem do código-fonte (não do dist): tabela de props com os comentários e recarga ao editar
    resolve: {
      ...vite.resolve,
      alias: { "@countify-oficial/core": `${core}src/index.ts` },
    },
  }),
};
export default config;
