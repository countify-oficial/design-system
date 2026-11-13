// Cores, medidas e letras do Countify: a única fonte.
// O build.mjs transforma em variáveis CSS (--cf-...) para a web e o Electron; o React Native importa daqui direto.
// As cores são as do mockup (docs/design/mockup/tools/cores.py no repositório do Countify).
export const colors = {
    light: {
        bg: "#F4F6FA", card: "#FFFFFF", sheet: "#F4F6FA", field: "#FFFFFF", chip: "#E8EDF3", nav: "#FFFFFF",
        text: "#182A42", text2: "#475569", text3: "#667085", label: "#334155",
        accent: "#225BA5", accentHover: "#184680", accentTint: "#EBF2FC",
        button: "#225BA5", onButton: "#FFFFFF",
        up: "#326B53", upTint: "#E9F7F0", down: "#B42318",
        divider: "#EEF2F6", border: "#D0D5DD", borderStrong: "#CBD5E1", hatch: "#CBD5E1", scrim: "#C9CFD8",
        logoTile: "#225BA5", logoRing: "#FFFFFF", logoArc: "#8CBAF2", logoWord: "#111827",
    },
    dark: {
        bg: "#0B1120", card: "#111827", sheet: "#111827", field: "#172033", chip: "#22334A", nav: "#111827",
        text: "#F8FAFC", text2: "#94A3B8", text3: "#94A3B8", label: "#CBD5E1",
        accent: "#8CBAF2", accentHover: "#B9D4F6", accentTint: "#172F50",
        button: "#225BA5", onButton: "#FFFFFF",
        up: "#8BC9AC", upTint: "#16372F", down: "#FDA4AF",
        divider: "#253044", border: "#475569", borderStrong: "#475569", hatch: "#475569", scrim: "#020617",
        logoTile: "#8CBAF2", logoRing: "#111827", logoArc: "#225BA5", logoWord: "#F8FAFC",
    },
};
// múltiplos de 4: a chave vezes 4 dá o valor (space[4] = 16)
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32 };
// retângulo arredondado, não pílula
export const radius = { segment: 8, control: 12, card: 16, dialog: 20, sheet: 24 };
// nada clicável abaixo de 44
export const size = { touch: 44, field: 48, button: 52, row: 64, tile: 40, gutter: 20, gutterDesktop: 32, panel: 380 };
// Roboto 400, 500 e 700; nada abaixo de 13
export const fontSize = { pageTitleDesktop: 28, number: 28, pageTitle: 22, section: 20, body: 17, label: 15, small: 13 };
export const font = {
    web: "Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif",
    // nomes do @expo-google-fonts/roboto; o app carrega com useFonts (veja o README)
    native: { 400: "Roboto_400Regular", 500: "Roboto_500Medium", 700: "Roboto_700Bold" },
};
// a partir daqui a web usa o layout de computador (o React Native é só celular)
export const breakpoint = 768;
