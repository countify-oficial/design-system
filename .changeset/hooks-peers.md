---
"@countify-oficial/hooks": patch
---

React Native e `expo-clipboard` saem das `peerDependencies` (opcionais só em `peerDependenciesMeta`): vindo do GitHub Packages, o npm os tratava como obrigatórios e instalava o React Native e o Expo num app de Electron.
