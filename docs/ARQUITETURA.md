# Arquitetura

```
packages/
  tokens/          @countify-oficial/tokens: a única fonte de cor, medida, letra e movimento
  tsconfig/        @countify-oficial/tsconfig: base estrita (privado)
  eslint-config/   @countify-oficial/eslint-config: regras comuns (privado)
apps/              (vazio por enquanto: docs, desktop-demo, mobile-demo)
legacy/ui/         @countify/ui 0.1.0, só referência; fora do workspace
docs/              TOKENS_COUNTIFY.md, ARQUITETURA.md, CONTRIBUINDO.md
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

## Modo claro e escuro

Web: as variáveis seguem `prefers-color-scheme`; `data-cf-color-scheme` num elemento força o modo daquele elemento
para baixo (o `CountifyProvider` vai gravar no `<html>`). React Native: `colors[scheme]`, escolhido pelo provider.
