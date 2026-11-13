> **Legado.** Esta é a `@countify/ui` 0.1.0 (pacote único, CSS puro + React + React Native), substituída pelo monorepo
> na raiz (`@countify-oficial/tokens`, `@countify-oficial/core`, `@countify-oficial/native`…). Fica aqui só como referência para portar os
> componentes; sai quando a `docs/MATRIZ_COMPONENTES.md` cobrir todos. Não está no workspace do pnpm.

# @countify/ui

Componentes do Countify para **HTML puro, React, Electron e React Native**: os mesmos nomes,
as mesmas props e o mesmo visual. Funciona como o Bootstrap: cada projeto instala uma versão
e, para atualizar, troca o número da versão.

- `dist/countify.css`: CSS puro, classes `cf-*`. Serve a qualquer página HTML e ao Electron.
- `react/`: componentes React para a web e o Electron, sobre o CSS.
- `native/`: os mesmos componentes em React Native (Expo).
- `tokens.js`: cores dos modos claro e escuro, medidas e letras. É a única fonte; o CSS é
  gerado dele.
- `icons.js`, `charts.js`, `lib.js`: ícones, gráficos em SVG e regras comuns. A web e o
  celular usam o mesmo código.

O desenho segue o Guia de UI/UX do Countify (`docs/design/countify-guia-de-ui-ux.html` no repositório do Countify).
Para ver todos os componentes, abra a vitrine `docs/index.html` (veja "Desenvolver").

## Instalar

O repositório é privado, então a instalação é pelo git com uma etiqueta de versão:

```bash
npm install github:ORG/countify-ui#v0.1.0     # ou pnpm add / yarn add
```

Para atualizar, troque `#v0.1.0` pela versão nova e rode a instalação de novo. O que mudou em
cada versão está no [CHANGELOG](CHANGELOG.md).

Se um dia o repositório for público, a página HTML pode puxar direto do CDN, sem instalar:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ORG/countify-ui@0.1.0/dist/countify.min.css">
```

## Usar

### HTML puro

```html
<link rel="stylesheet" href="node_modules/@countify/ui/dist/countify.css">

<button class="cf-button cf-button--primary" type="button">Salvar</button>
<span class="cf-icon cf-icon-store"></span>
```

Cada componente da vitrine tem o botão **Ver HTML** com a marcação pronta para copiar. A
letra Roboto já vem no pacote (`fonts/`): funciona sem internet e com CSP fechado.

### React (web)

```js
import "@countify/ui/countify.css";
import { Button, Stat, Sheet } from "@countify/ui";

<Stat label="Ticket médio" value="158" unit="R$" detail="3,2 peças" change="3%" trend="down" base="vs. qua." />
<Button onPress={salvar}>Salvar</Button>
```

- Com `href`, o que se toca vira `<a>`; sem `href`, vira `<button>`.
- `onPress` é o clique, igual no celular.
- Os tipos estão em `index.d.ts`.

### Electron

Na janela do Electron vale tudo o que vale na web. Importe o CSS e os componentes React no
processo de renderização, como no exemplo acima. As fontes e os ícones são locais, então a
política de segurança pode ficar em `default-src 'self'`.

### React Native (Expo)

```bash
npx expo install react-native-svg react-native-safe-area-context @expo-google-fonts/roboto
```

```js
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { Screen, Stat, Button } from "@countify/ui";   // o Metro pega a versão nativa sozinho

const [ok] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold });
```

- A barra de abas é o `NavBar`, usado como `tabBar` das `<Tabs>` do Expo Router.
- Para navegar a partir de um componente, envolva-o em `<Link href="…" asChild>`.
- Para estilos próprios da tela, use `useColors()`: as cores do modo atual.

### Tema

- O app segue o modo do aparelho.
- `<ThemeProvider scheme="dark">` força o modo escuro, e `scheme="light"` força o claro.
- No HTML puro, o mesmo efeito vem de `<html data-theme="dark">`.

## Componentes

| Grupo | Componentes |
|---|---|
| Base | `ThemeProvider`, `Icon` (48 ícones), `Logo`, `Text` |
| Estrutura | `Screen`, `Grid`, `Card`, `Divider`, `SectionTitle`, `SectionLabel`, `PageHeader`, `NavBar` (abas no celular, menu superior no computador) |
| Ações | `Button`, `IconButton`, `HelpButton` (o "?"), `ActionLink` |
| Entrada | `TextField` (texto, e-mail, senha com olho, telefone, decimal, código, hora, várias linhas), `SearchField`, `Select`, `Checkbox`, `CheckList` (com "Selecionar todos"), `RadioList`, `Switch`, `Segmented`, `Chip`, `FilterChip`, `ChipGroup`, `Calendar` |
| Dados | `Stat`, `List`, `ListItem`, `IconTile`, `Avatar`, `Badge`, `Status`, `DetailList`, `Table`, `ProgressBar`, `BarList` (ranking e funil), `Accordion`, `Steps`, `Pagination` |
| Gráficos | `LineChart` (real × previsto, faixa, lacuna, agora), `BarChart`, `ScatterChart`, `Heatmap`, `Legend` |
| Camadas | `Sheet` (folha no celular, painel de 380 px no computador), `Dialog`, `ConfirmDialog` (Cancelar/Excluir), `Popover`, `Toast` |
| Estados | `Notice` (sem conexão, erro, muitas tentativas), `EmptyState`, `Skeleton`, `Spinner` |

O que o pacote garante, para ninguém precisar lembrar:
- **Toque**: nada clicável abaixo de 44 px; cantos de 12 px.
- **Números**: a variação sempre aparece com ▲▼, a cor e a base de comparação.
- **Seleção múltipla**: toda lista começa com "Selecionar todos".
- **Exclusão**: pergunta antes de apagar, e o foco começa em Cancelar.
- **Situação**: a cor sempre vem com texto.
- **Contraste**: no mínimo 4,5:1 nos dois modos, conferido por teste.

### Comparação com outras bibliotecas

A lista foi conferida contra o Mantine, o shadcn/ui e o React Native Paper.

**Já coberto por outro componente:**

| Nas outras bibliotecas | No @countify/ui |
|---|---|
| Tabs, SegmentedControl, ToggleGroup | `Segmented` (de 2 a 4 opções) |
| Drawer, Modal | `Sheet`, `Dialog` |
| Menu, Combobox, MultiSelect | `Popover` com `List`, ou `Select` |
| PinInput, PasswordInput, NumberInput, Textarea, TimeInput | `TextField` com o `type` certo |
| Alert, Banner | `Notice` |
| Stepper | `Steps` |
| DatePicker | `Calendar` dentro de `Sheet` |

**Ficou de fora de propósito:**
- `Tooltip`: o celular não tem passar o mouse; a explicação fica no "?" e o botão de ícone
  leva `title`.
- `Breadcrumbs`: o Voltar sempre volta para a origem.
- `Slider`: os valores do produto são digitados.
- `Rating`, `ColorPicker`, `Carousel`, editor de texto, `Spotlight`, `Tour`, `Kbd`, `Tree`,
  `Timeline`, `FileInput`: o produto não usa. Quando precisar, entram aqui, nos dois lados.

## Desenvolver

```bash
npm install          # só o React, para os testes
npm run build        # gera dist/countify.css a partir de tokens.js, icons.js e css/
npm test             # dist em dia, web e celular iguais, ícones, contraste, regras e marcação
python3 -m http.server 8765    # vitrine em http://localhost:8765/docs/
```

Regras:
- **Cor ou medida nova**: vai no `tokens.js` e depois `npm run build`. Nunca edite
  `dist/countify.css` à mão.
- **Componente novo**: entra nos três lugares: `css/`, `react/index.js` e
  `native/index.js`. Também recebe a assinatura em `index.d.ts`, um exemplo em
  `test-react.mjs` e uma amostra na vitrine. O teste falha se um lado ficar sem ele.
- **Lógica que os dois lados usam**: fica em `lib.js` ou `charts.js`, com teste.

## Lançar uma versão

1. Atualize o `CHANGELOG.md` e a `version` do `package.json`. Use versão semântica:
   - correção: 0.1.**1**;
   - componente ou prop nova: 0.**2**.0;
   - mudança que quebra quem já usa (nome, prop removida, classe renomeada): **1**.0.0.
2. Rode `npm run build` e `npm test`.
3. Faça o commit e crie a etiqueta: `git tag v0.2.0 && git push --tags`.
4. Nos projetos, troque a versão e rode a instalação.
