---
"@countify-oficial/provider": minor
---

Ajudantes que a web e o celular repetiam passam a vir daqui: `hasContent` (rótulo, descrição ou erro com o que desenhar; `true` só marca), `limitNumber` (min, max e arredondamento a `decimalScale` como o campo mostra), `phoneMask`, `initials`, `isValidJson`, `decimalPlaces` e `selectAllState`. `formatNumber` e `numberSeparators` reaproveitam um `Intl.NumberFormat` por idioma e opções (3000 números formatavam em 80 ms; agora em cerca de 1 ms). O build do React Native deixa o `react-native` de fora do pacote mesmo sem estar nas `peerDependencies`.
