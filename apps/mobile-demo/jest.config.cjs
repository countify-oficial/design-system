// Testes da galeria (jest-expo cuida dos módulos do Expo, como as fontes).
module.exports = {
  // o 1º teste de cada arquivo transforma o React Native inteiro; com o monorepo todo em paralelo, 5 s não bastam
  testTimeout: 15000,
  preset: "jest-expo",
  testMatch: ["<rootDir>/test/**/*.test.{ts,tsx}"],
  // sem o módulo nativo da área de transferência no Jest
  moduleNameMapper: { "^expo-clipboard$": "<rootDir>/test/expo-clipboard.mock.cjs" },
  transformIgnorePatterns: [
    "node_modules/(?!(?:\\.pnpm/[^/]+/node_modules/)?(?:react-native|@react-native|react-native-svg|react-native-safe-area-context|expo|expo-.*|@expo|@expo-google-fonts)/)",
  ],
};
