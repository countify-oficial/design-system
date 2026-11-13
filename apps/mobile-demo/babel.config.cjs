// O Expo transforma o app e os pacotes do workspace (o Metro lê a entrada "react-native" de cada um).
module.exports = (api) => {
  api.cache(true);
  return { presets: ["babel-preset-expo"] };
};
