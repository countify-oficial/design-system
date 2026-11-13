// Testes do React Native (Jest + React Native Testing Library); os da web rodam no Vitest.
module.exports = {
  // o 1º teste de cada arquivo transforma o React Native inteiro; com o monorepo todo em paralelo, 5 s não bastam
  testTimeout: 15000,
  preset: "@react-native/jest-preset",
  testMatch: ["<rootDir>/test-native/**/*.test.{ts,tsx}"],
  // com o pnpm os pacotes ficam em node_modules/.pnpm/<nome>/node_modules/<nome>: o React Native vem em ESM e precisa do Babel
  transformIgnorePatterns: ["node_modules/(?!(?:\\.pnpm/[^/]+/node_modules/)?(?:react-native|@react-native|expo-clipboard|expo-modules-core)/)"],
};
