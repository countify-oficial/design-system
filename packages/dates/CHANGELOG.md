# @countify-oficial/dates

## 0.7.0

### Minor Changes

- e38b598: EventCalendar (web e celular): o calendário de eventos do mês. Na web, a grade do Calendar com os eventos de cada dia em chips (Badge com o tom do evento), "+N mais" que abre a lista do dia num Popover, hoje marcado, `role="grid"` com setas, e `onEventClick` e `onDayClick`; no celular, o mês com pontos nos dias que têm evento e a lista do dia escolhido embaixo. Mensagens novas no provider: `eventCount`, `moreEvents` e `noEvents`.

### Patch Changes

- Updated dependencies [1aa5f0e]
- Updated dependencies [da0fa21]
- Updated dependencies [e17705b]
- Updated dependencies [e38b598]
- Updated dependencies [43178a7]
  - @countify-oficial/provider@0.5.0
  - @countify-oficial/core@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies [358a6db]
- Updated dependencies [76c73f4]
- Updated dependencies [d4cc0d0]
- Updated dependencies [0dc2592]
- Updated dependencies [12511a7]
- Updated dependencies [3a43a5b]
  - @countify-oficial/provider@0.4.0
  - @countify-oficial/core@0.6.0

## 0.5.3

### Patch Changes

- Updated dependencies [fe5fdc5]
  - @countify-oficial/tokens@0.5.0
  - @countify-oficial/core@0.5.3
  - @countify-oficial/provider@0.3.1

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
