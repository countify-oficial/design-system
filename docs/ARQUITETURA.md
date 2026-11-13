# Arquitetura

```
packages/
  tokens/          @countify-oficial/tokens: a única fonte de cor, medida, letra e movimento
  hooks/           @countify-oficial/hooks: hooks da web e do React Native
  provider/        @countify-oficial/provider: CountifyProvider (tema, modo, textos)
  core/            @countify-oficial/core: componentes da web e do Electron (React + CSS Modules)
  native/          @countify-oficial/native: componentes do React Native (mesma API do core)
  tsconfig/        @countify-oficial/tsconfig: base estrita (privado)
  eslint-config/   @countify-oficial/eslint-config: regras comuns (privado)
apps/
  docs/            Storybook da web (privado); desktop-demo e mobile-demo vêm depois
legacy/ui/         @countify/ui 0.1.0, só referência; fora do workspace
docs/              TOKENS_COUNTIFY.md, MATRIZ_COMPONENTES.md, ARQUITETURA.md, CONTRIBUINDO.md
```

## Tokens

- `src/colors.ts` e `src/scales.ts` têm os valores. Os papéis de cor (`accent`, `up`, `warn`…) apontam para um degrau
  das escalas quando o tom existe nelas; os que não existem (fundos e bordas do escuro, por exemplo) são o hex da
  identidade.
- `src/css.ts` gera as variáveis `--cf-*`. O `pnpm build` grava `dist/tokens.css`. Nenhum CSS de componente escreve
  hex, px de medida ou fonte: usa estas variáveis.
- `src/native.ts` entrega o que o React Native pede em outro formato (família por peso, altura de linha em px,
  sombra em props). Cores e tamanhos são os mesmos objetos da web.

## Build

Cada pacote compila com tsup para `dist/` (ESM, CJS e `.d.ts`). O Turborepo roda `build` antes de `typecheck`, `lint`
e `test` dos pacotes que dependem dele. O `dist/` não vai para o git: o pacote é publicado no registry privado.

## Web e React Native no mesmo pacote

O que muda por plataforma fica em `arquivo.native.ts(x)` ao lado de `arquivo.ts(x)`. Cada pacote tem duas entradas,
`src/index.ts` (web) e `src/index.native.ts`, e o tsup gera `dist/index.js` e `dist/index.native.js`. O `package.json`
aponta a nativa na condição `react-native` dos `exports`: o Metro escolhe sozinho, e o app importa o mesmo nome nas
duas plataformas. Testes: os da web em `test/` (Vitest), os do React Native em `test-native/` (Jest).

## Tema, modo e textos

O `@countify-oficial/provider` guarda o contexto: o tema (ajustes por componente: `defaultProps`, `classNames`, `styles`),
o modo e os textos. Componentes leem com `useComponentProps(nome, padrão, props)` (padrão < tema < props) e
`useComponentTheme(nome)`.

- Web: as variáveis seguem `prefers-color-scheme`; com `light` ou `dark`, o provider grava `data-cf-color-scheme` no
  `<html>` e o CSS segue. Em "auto", tira o atributo.
- React Native: o provider lê o modo do aparelho (`useColorScheme`) e entrega `colors` do modo em uso.
- Cores e medidas não estão no tema: vêm sempre do `@countify-oficial/tokens`.

## Componentes

- Uma pasta por componente: `src/Text/Text.tsx` e, na web, `Text.module.css`. O `src/index.ts` exporta o componente e
  os tipos. Os testes ficam em `test/` (um arquivo por componente); as histórias, em `apps/docs/stories/`.
- **Polimorfismo**: `component` troca o elemento (`<Text component="label">`) e traz as props e o ref dele
  (`PolymorphicProps` em `src/polymorphic.ts`). O ref é uma prop comum (React 19), sem `forwardRef`.
- **Props**: `useComponentProps(nome, {}, props)` aplica os `defaultProps` do tema; o padrão do componente fica na
  desestruturação (`size = "md"`). Ordem: padrão < tema < props.
- **CSS (web)**: cada `.module.css` só usa variáveis `--cf-*`. O componente passa os valores das props como variáveis
  próprias (`--text-size: var(--cf-font-size-md)`) e marca o estado em data-attributes (`data-disabled`,
  `data-size`), que o CSS e o app podem usar. O tsup junta todos os módulos em `dist/index.css`, com classes locais
  (`Text_root`): o app importa uma vez `@countify-oficial/core/styles.css`.
- **Styles API (web)**: `useStyles(nome, classes, props)` monta `className` e `style` de cada parte: CSS Module < tema
  (`classNames`/`styles`) < props. `className` e `style` soltos vão para a raiz.
- **React Native**: mesmo nome e mesmas props; estilo com `StyleSheet` e os valores do `@countify-oficial/tokens`
  (cores do modo em uso por `useCountifyTheme().colors`). O tema entra por `styles.root`. Botões têm alvo de toque de
  44 no mínimo e `accessibilityRole`; o que não existe no celular está na `MATRIZ_COMPONENTES.md` com o motivo.
- **Espaço**: as props de espaço recebem `Spacing` (`xs`–`xl` ou um degrau da grade de 4, `3` = 12). Na web viram
  `var(--cf-spacing-*)` ou `var(--cf-space-*)` (`spacingVar`); no celular, px (`resolveSpacing`, dos tokens).
- **Ponto de quebra**: `Responsive<T>` é um valor ou `{ base, sm, lg }`. Na web, `responsiveVars` grava `--nome`,
  `--nome-sm` e `--nome-lg`, e o CSS Module escolhe em `@media (min-width: 768px)` e `(min-width: 1280px)` (media
  query não aceita variável; o `test/css.test.ts` confere que os números são os de `tokens.breakpoints`). No
  celular, `useResponsive` escolhe pela largura da tela.
- **Grade no celular**: o React Native não tem grid. `SimpleGrid` e `Grid` usam linha com quebra, células em
  porcentagem com meio espaço de recuo de cada lado e margem negativa na grade.
- **Cor do conteúdo (celular)**: o React Native não herda cor. `Button`, `ActionIcon` e `Toggle` publicam a cor do
  conteúdo em `ContentColor`; `Icon`, `Loader` e `Text` usam essa cor quando não recebem uma (é o `currentColor`
  da web).
- **Ícones**: o desenho (`icons`) fica nos tokens, como o resto da identidade. Na web o `Icon` é um `<svg>`; no
  celular, `SvgXml` com o mesmo texto (`iconSvg`).
- **Movimento**: as durações vêm dos tokens; com "reduzir movimento" (`useReducedMotion`), viram 0 nas duas plataformas.
