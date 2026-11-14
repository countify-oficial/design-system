---
"@countify-oficial/hooks": patch
---

useControllableState: no modo controlado, se o pai recusa uma mudança (o `value` não muda), pedir a mesma mudança de novo volta a chamar o `onChange` (antes o segundo clique numa aba guardada por um confirm era ignorado). useMediaQuery (e o useReducedMotion): uma MediaQueryList e um ouvinte por query, divididos entre todos os componentes, em vez de um por instância. O build do React Native deixa o `react-native` e o `expo-clipboard` de fora do pacote mesmo sem estarem nas `peerDependencies`.
