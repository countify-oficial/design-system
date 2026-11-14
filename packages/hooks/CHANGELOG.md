# @countify-oficial/hooks

## 0.1.1

### Patch Changes

- 70568ce: useControllableState: no modo controlado, se o pai recusa uma mudança (o `value` não muda), pedir a mesma mudança de novo volta a chamar o `onChange` (antes o segundo clique numa aba guardada por um confirm era ignorado). useMediaQuery (e o useReducedMotion): uma MediaQueryList e um ouvinte por query, divididos entre todos os componentes, em vez de um por instância. O build do React Native deixa o `react-native` e o `expo-clipboard` de fora do pacote mesmo sem estarem nas `peerDependencies`.
- 70568ce: React Native e `expo-clipboard` saem das `peerDependencies` (opcionais só em `peerDependenciesMeta`): vindo do GitHub Packages, o npm os tratava como obrigatórios e instalava o React Native e o Expo num app de Electron.
