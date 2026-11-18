import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

// a moldura do Storybook (barra lateral e topo) com a marca e as cores da Countify; valores de @countify-oficial/tokens
addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Countify Design System",
    brandUrl: "./",
    brandImage: "marca/countify-claro.svg",
    brandTarget: "_self",
    colorPrimary: "#225BA5",
    colorSecondary: "#225BA5",
    fontBase: "Roboto, system-ui, sans-serif",
    appBg: "#F4F6FA",
    appContentBg: "#FFFFFF",
    appBorderColor: "#E8EDF3",
    appBorderRadius: 12,
    textColor: "#182A42",
    textMutedColor: "#475569",
    barBg: "#FFFFFF",
    barSelectedColor: "#225BA5",
  }),
  sidebar: { showRoots: true },
});
