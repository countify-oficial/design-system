import "@countify-oficial/tokens/fonts.css";
import "@countify-oficial/tokens/tokens.css";
import "@countify-oficial/dates/styles.css";
import "@countify-oficial/modals/styles.css";
import "@countify-oficial/notifications/styles.css";
import "./preview.css";
import { CountifyProvider, type ColorSchemeSetting } from "@countify-oficial/provider";
import type { Preview } from "@storybook/react-vite";

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
  parameters: { a11y: { test: "error" }, controls: { expanded: true } },
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
