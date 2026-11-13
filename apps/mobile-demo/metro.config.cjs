// O Expo já entende o monorepo do pnpm (pastas do workspace e links).
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
// Na web, a galeria também usa a entrada "react-native" dos pacotes da Countify (desenhada pelo react-native-web),
// e não a entrada da web (DOM + CSS Modules), que é para apps React comuns.
const porPlataforma = config.resolver.unstable_conditionsByPlatform ?? {};
config.resolver.unstable_conditionsByPlatform = { ...porPlataforma, web: ["react-native", ...(porPlataforma.web ?? ["browser"])] };

module.exports = config;
