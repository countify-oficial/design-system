# Arquitetura

```
packages/
  tokens/          @countify-oficial/tokens: a única fonte de cor, medida, letra e movimento
  hooks/           @countify-oficial/hooks: hooks da web e do React Native
  provider/        @countify-oficial/provider: CountifyProvider (tema, modo, textos)
  tsconfig/        @countify-oficial/tsconfig: base estrita (privado)
  eslint-config/   @countify-oficial/eslint-config: regras comuns (privado)
apps/              (vazio por enquanto: docs, desktop-demo, mobile-demo)
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
