# Tokens da Countify: origem de cada valor

Fonte de cada token do `@countify-oficial/tokens` (`packages/tokens/src/`). Cada valor vem da identidade (abaixo) ou da
proposta aprovada em 13/11/2026 (seção "Aprovado", no fim). O teste do pacote confere o contraste de todos os papéis
nos dois modos.

| Grupo | Onde está no código |
|---|---|
| Escalas de 10 tons, papéis por modo, cor principal | `colors.ts`: `palette`, `colors`, `primaryColor`, `primaryShade` |
| Letra, espaço, cantos, tamanhos, sombras, camadas, movimento, pontos de quebra | `scales.ts` |
| Variáveis CSS (`--cf-*`) | `css.ts`, gravado em `dist/tokens.css` (`@countify-oficial/tokens/tokens.css`) |
| React Native (família por peso, altura de linha em px, sombra) | `native.ts`: `nativeTokens` |

Abreviações das fontes (repositório Countify, pasta `docs/design/`):
- **guia**: `countify-guia-de-ui-ux.html` (gerado por `mockup/tools/extras.py`, seção "Guia de estilo")
- **cores**: `mockup/tools/cores.py` (tabela `MODOS`, a mesma do `gerar.py`)
- **marca**: `marca/README.md`, `marca/svg/logo/{claro,escuro}/countify-{header,icon,wordmark,avatar}.svg` e `marca/fonte-logo/`
- **decisões**: `../decisoes.md`, D-23 e "Decisões de produto" (identidade visual e uso das cores)
- **app**: `../app.md` §1.1 (layout de computador) e §3.0.0 (abertura)
- **interfaces**: `../desenvolvimento/equipe-interfaces.md` §3 e §4 ("o mockup é a referência visual"; regras de interface)
- **mockup**: `mockup/project/*.dc.html`, as telas (M- celular, W- computador). Quando o guia e o mockup divergem, vale o mockup

## Cores por papel (claro / escuro)

Origem: **cores** (índices da lista `MODOS[modo]["cores"]`). Contraste mínimo do **guia**: 4,5:1 no texto, 3:1 nos gráficos
(conferido no teste de contraste).

| Token | Claro | Escuro | Papel (cores.py) |
|---|---|---|---|
| bg | #F4F6FA | #0B1120 | fundo |
| text | #182A42 | #F8FAFC | texto |
| accent | #225BA5 | #8CBAF2 | destaque |
| accentHover | #184680 | #B9D4F6 | hover |
| up | #326B53 | #8BC9AC | alta |
| down | #B42318 | #FDA4AF | queda |
| card | #FFFFFF | #111827 | cartão |
| nav | #FFFFFF | #111827 | menu |
| divider | #EEF2F6 | #253044 | divisória |
| border | #D0D5DD | #475569 | borda |
| text2 | #475569 | #94A3B8 | texto2 |
| text3 | #667085 | #94A3B8 | texto3 |
| label | #334155 | #CBD5E1 | rótulo |
| hatch | #CBD5E1 | #475569 | hachura |
| accentTint | #EBF2FC | #172F50 | tinta-destaque |
| field | #FFFFFF | #172033 | superfície 2 |
| chip | #E8EDF3 | #22334A | chip |
| borderStrong | #CBD5E1 | #475569 | borda+ |
| scrim | #C9CFD8 | #020617 | véu |
| sheet | #F4F6FA | #111827 | folha |
| upTint | #E9F7F0 | #16372F | tinta-verde |
| button / onButton | #225BA5 / #FFFFFF | #225BA5 / #FFFFFF | `botao`, `botao_txt` |

Cores do logo (**marca**): quadrado #225BA5 / #8CBAF2, anel #FFFFFF / #111827, arco #8CBAF2 / #225BA5,
letras #111827 / #F8FAFC. O avatar usa as letras na cor do anel.

Uso das cores nos componentes (**decisões**): botão principal #225BA5 com texto branco nos dois modos; item
selecionado (chip, segmento, aba) com fundo `accentTint`, contorno e texto `accent`; chip não selecionado com
contorno fino e texto `text2`; cartões com contorno fino; campos com fundo `field`; barra de abas flutuante com a aba
ativa num retângulo `accentTint`.

## Tipografia

Origem: **guia**, "Tipografia". Roboto 400, 500 e 700 (Google Fonts, toda a interface). Números com tabular-nums. Nada abaixo de 13.

| Uso | Tamanho · peso | Altura de linha | Origem |
|---|---|---|---|
| Título das telas de aba no celular (Painel, Análises, Avisos, Ajustes) | 32 · 700 | 1,15 | **mockup** (6 telas) |
| Título da página no computador | 28 · 700 | 1,2 | **mockup** (44 telas) |
| Número de indicador | 28 · 700 | 1,15 | **guia** e **mockup** |
| Título das telas internas no celular | 22 · 700 | 1,2 | **guia** e **mockup** (41 telas) |
| Título de seção | 20 · 700 | 1,25 | **guia** e **mockup** |
| Texto, listas e campos | 17 · 400 | 1,4 | **guia** e **mockup** |
| Texto secundário, rótulos e chips | 15 · 400 | 1,4 | **guia** e **mockup** |
| Rótulo de seção e eixo de gráfico | 13 · 700 | 1,4 | **guia** e **mockup** |

> Divergência: o **guia** diz 32 para o título da página no computador; o **mockup** usa 28 em todas as 44 telas de
> computador, e 32 só no título das telas de aba do celular. Vale o mockup (a `@countify/ui` 0.1.0 já usa 28).

A letra do logo (CountifyDisplay Bold, **marca** `fonte-logo/`) é só da marca, não da interface: o logo é sempre SVG.
Códigos em fonte de largura fixa (**decisões**); a família não está definida (veja "Falta").

## Espaçamento

Origem: **guia**, "Espaçamento". Múltiplos de 4: 4, 8, 12, 16, 20, 24, 32. Margem lateral 20 no celular e 32 no
computador. Entre chips 8, entre cartões 12, dentro do cartão 16. Computador: grade de 12 colunas (**app** §1.1).
Áreas seguras do celular no mockup: 48 no topo e 36 embaixo (**interfaces** §4); no app valem as do aparelho.

## Cantos (raios)

Origem: **guia**, "Cantos": 8 segmento · 12 botões, campos e chips · 16 cartões e listas · 20 dia escolhido no
calendário · 24 topo da folha. Retângulo arredondado, nunca pílula.

## Elevação

Origem: **guia**, "Elevação". São três, não uma escala:
- **Anel**: `inset 0 0 0 1px` na cor da divisória. Cartões, listas e chips. Sem sombra.
- **Sombra**: `0 16px 40px rgba(0, 0, 0, 0.35)` + anel. Painel lateral e menus no computador.
- **Véu**: fundo `scrim` + anel. Fundo do alerta de exclusão.

## Área de toque e alturas

Origem: **guia**, "Área de toque": 44 mínimo (ícone, chip) · 48 campo · 52 botão principal · 64 linha de lista.
Painel lateral no computador: 380 de largura (**mockup**, telas W- com folha aberta, como W-OutraData e W-Montar).

## Pontos de quebra

Origem: **guia** ("Abaixo de 768 px"; "Celular primeiro; o computador ganha espaço, não telas novas") e **app** §1.1:
- 768: a partir daqui, layout de computador (menu superior, folha vira painel lateral, lista vira tabela);
- 1280: entre 768 e 1279 os itens do menu superior mostram só o ícone.

## Movimento

A abertura do app não tem animação (**app** §3.0.0). Nenhum outro documento define duração ou curva.

## Aprovado em 13/11/2026

A identidade não definia estes itens. A proposta foi mostrada lado a lado com o Painel (tela 4) do mockup, nos quatro
modos, sem nenhum pixel diferente, e aprovada pelo dono do projeto. Página da proposta:
`legacy/ui/docs/proposta-tokens.html`. Simulação: `legacy/ui/docs/simulacao-painel.html`.

1. **Escalas de 10 tons** (`palette`): azul, verde, vermelho, âmbar e cinza. Os tons da identidade ficam no degrau de
   mesma luminosidade; os que faltam saem por interpolação em OKLCH entre eles (âmbar: matiz 70, todos gerados). Os
   papéis continuam com os valores da identidade. Cor principal: azul, degrau 6 no claro (#225BA5) e 3 no escuro (#8CBAF2).
2. **Aviso** (`warn`, `warnTint`): âmbar nos degraus que alta e queda já usam: claro #805000 sobre #FFEEDC, escuro
   #F1A43E sobre #442800. **Informação** usa o `accent`, como o Notice da 0.1.0.
3. **Tamanhos xs–xl** (`controlHeight`, `controlFontSize`, `controlPaddingX`, `iconSize`, `avatarSize`): nada que se
   toca abaixo de 44. Botão 44/44/52/56/64, campo 44/44/48/52/56, letra 13/15/17/17/20, recuo 12/16/20/24/28, ícone
   16/18/22/28/32, avatar 24/32/40/48/64. Espaço, cantos e letra xs–xl só dão nome a valores da identidade.
4. **Sombras** (`shadows`, `raisedShadow`): xs, sm e md são só o anel; lg e xl são a sombra da identidade
   (0 16px 40px), com o anel. No escuro, rgba(0, 0, 0, 0.35) (identidade); no claro, rgba(24, 42, 66, 0.16), a cor do
   texto a 16%. No React Native: raio 20 (metade do desfoque) e elevation 16 no Android.
5. **Letra de largura fixa** (`fontFamily.mono`): Roboto Mono 400 e 500, com a do sistema de reserva.
6. **Camadas** (`zIndex`): base 0, sticky 10, app 100, overlay 200, dropdown 300, notification 400, tooltip 500, max 9999.
7. **Movimento** (`duration`, `easing`): fast 120, base 150, slow 200, spin 800, pulse 1400 ms (as da 0.1.0); com
   "reduzir movimento", tudo vira 0.

## Aprovado em 13/11/2026 (passo 3)

A identidade não tem anel de foco (os mockups só usam `outline: none`) nem distância de animação. Aprovado pelo dono
do projeto:

8. **Anel de foco** (`focusRing`): linha de 2 px na cor `accent`, a 2 px do elemento (`--cf-focus-ring-width`,
   `--cf-focus-ring-offset`). Atende o WCAG 2.2: 2 px e contraste de 3:1 nos dois modos.
9. **Distâncias da animação** (`transition`): `slide` desloca 8 px (o `space` 2) e `scale` cresce de 0,95; as duas com
   fade. As durações são as do item 7.

## Vindos do mockup e da 0.1.0 (passo 5)

Valores que a identidade já usa, agora com nome nos tokens:

10. **Linhas** (`borderWidth`): fina 1 (contorno do Cancelar, anel do chip) e grossa 1,5 (chip escolhido, tracejado
    do Adicionar). Origem: **mockup** `X-DocComponentes` (Botões, Chips de escolha, Segmentado).
11. **Estados** (`state`): apagado com opacidade 0,4; no hover, véu cinza a 10% (`rgb(127 127 127 / 0.1)`) por cima do
    fundo; no celular, opacidade 0,8 ao tocar. Origem: **0.1.0** (`legacy/ui`), que segue o "Bloqueado aparece
    apagado" do mockup.
12. **Girador** (`loaderStroke`): traço de 2,5 e uma volta em 800 ms (`duration.spin`); o tamanho é o do ícone.
    Origem: **0.1.0**. Para carregar uma tela, a identidade usa blocos cinza (`X-DocEstados`, "Sem girador").
13. **Ícones** (`icons`, `iconGrid`): os da 0.1.0, traço de 1,8 numa caixa de 22, na cor do texto.
14. **Letra** (`fonts.css`): a Roboto 400, 500 e 700 vem no pacote (licença OFL), como na 0.1.0, para funcionar sem
    internet e com CSP fechado.

## Passo 6

15. **Anel e semicírculo de progresso** (`ringProgress`, aprovado em 13/11/2026): anel de 120 e semicírculo de 200;
    a espessura é sempre 1/5 do tamanho, a proporção do anel da marca (`X-DocMarca`: 200 com traço de 40).
16. **Pulso do Skeleton** (`state.pulseOpacity`): vai a 0,5 no meio de cada pulso de 1400 ms. Origem: **0.1.0**.
17. **Blocos do "Carregando"** (`skeletonStat`): o cartão de número tem blocos de 96 × 16, 140 × 32 e 112 × 16, na cor
    da divisória e com canto de 4. Origem: **mockup** `X-DocEstados`.
18. **Tons** (`tones`): para Badge, ThemeIcon, Avatar, Alert e Progress, cada tom junta três papéis que já existem:
    texto, fundo claro e fundo cheio. A queda não tem tinta na identidade, então o fundo claro dela é o do chip.
19. **Linha compacta de 56** (`compactRowHeight`): lista com caixas e interruptor (**mockup** `X-DocComponentes`) e o
    cabeçalho do acordeão (**0.1.0**).
20. **Espaço entre letras do rótulo** (`overlineTracking`): 0,08 em no rótulo de seção em maiúsculas. Origem: **0.1.0**.
21. **Interruptor** (`switchSize`): trilho de 52 × 32, bolinha de 24 (recuo de 4). Origem: **mockup** `X-DocComponentes`.
22. **Estrela** (`icons.star`): acrescentada para o Rating, no traço do conjunto (1,8 numa caixa de 22). Não vem da
    identidade nem da 0.1.0: **a confirmar com o design**.
