---
"@countify-oficial/dates": patch
---

DatePicker sem valor abre no mês de hoje mesmo com um `maxDate` no futuro (antes abria no mês do `maxDate`); o DateTimePicker, com um `maxDate` que já passou, abre no mês dele, como o Calendar. O DateInput da web passa `month`, `defaultMonth` e `onMonthChange` ao calendário, como o do celular. No DateTimePicker, um horário pela metade ("14:3") deixa o "Aplicar" apagado, em vez de aplicar a hora anterior. O estado dos campos de data fica num só lugar para a web e o celular. React Native, `react-native-svg` e `@countify-oficial/native` saem das `peerDependencies` (ficam opcionais só em `peerDependenciesMeta`): um app de Electron não instala mais o React Native.
