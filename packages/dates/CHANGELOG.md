# @countify-oficial/dates

## 0.5.0

### Patch Changes

- 70568ce: Seletores de data do celular: rótulo, descrição e erro usam o `hasContent` do provider; `error={true}` só marca, sem texto vazio.
- 70568ce: DatePicker sem valor abre no mês de hoje mesmo com um `maxDate` no futuro (antes abria no mês do `maxDate`); o DateTimePicker, com um `maxDate` que já passou, abre no mês dele, como o Calendar. O DateInput da web passa `month`, `defaultMonth` e `onMonthChange` ao calendário, como o do celular. No DateTimePicker, um horário pela metade ("14:3") deixa o "Aplicar" apagado, em vez de aplicar a hora anterior. O estado dos campos de data fica num só lugar para a web e o celular. React Native, `react-native-svg` e `@countify-oficial/native` saem das `peerDependencies` (ficam opcionais só em `peerDependenciesMeta`): um app de Electron não instala mais o React Native.
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
- Updated dependencies [70568ce]
  - @countify-oficial/core@0.5.0
  - @countify-oficial/hooks@0.1.1
  - @countify-oficial/provider@0.3.0

## 0.1.3

### Patch Changes

- Updated dependencies [d1aa444]
- Updated dependencies [5d5b520]
- Updated dependencies [3588660]
- Updated dependencies [c0873ed]
- Updated dependencies [78154fc]
- Updated dependencies [f465573]
- Updated dependencies [6b9d730]
  - @countify-oficial/core@0.4.0
  - @countify-oficial/native@0.4.0
  - @countify-oficial/tokens@0.4.0
  - @countify-oficial/provider@0.2.2

## 0.1.2

### Patch Changes

- Updated dependencies [5a0d5d0]
  - @countify-oficial/tokens@0.3.0
  - @countify-oficial/core@0.3.0
  - @countify-oficial/native@0.3.0
  - @countify-oficial/provider@0.2.1

## 0.1.1

### Patch Changes

- Updated dependencies [dffe040]
- Updated dependencies [eeae023]
  - @countify-oficial/tokens@0.2.0
  - @countify-oficial/provider@0.2.0
  - @countify-oficial/core@0.2.0
  - @countify-oficial/native@0.2.0
