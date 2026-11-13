// Testes do React Native (Jest + React Native Testing Library); os da web rodam no Vitest.
module.exports = {
  preset: "@react-native/jest-preset",
  testMatch: ["<rootDir>/test-native/**/*.test.{ts,tsx}"],
  // com o pnpm os pacotes ficam em node_modules/.pnpm/<nome>/node_modules/<nome>: o React Native vem em ESM e precisa do Babel
  transformIgnorePatterns: ["node_modules/(?!(?:\\.pnpm/[^/]+/node_modules/)?(?:react-native|@react-native|expo-clipboard|expo-modules-core)/)"],
};
