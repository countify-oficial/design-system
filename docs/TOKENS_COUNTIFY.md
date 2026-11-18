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
| controlBorder | #667085 | #94A3B8 | contorno de controle (item 40) |
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
modos, sem nenhum pixel diferente, e aprovada pelo dono do projeto. A página da proposta e a simulação ficaram no
git, com o CSS da 0.1.0 que elas usam: `git show 45541ec:legacy/ui/docs/proposta-tokens.html` e
`legacy/ui/docs/simulacao-painel.html` (o `legacy/ui/` saiu do repositório depois desse commit).

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
    fundo; no celular, opacidade 0,8 ao tocar. Origem: **0.1.0** (a `@countify/ui`), que segue o "Bloqueado aparece
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
17. **Blocos do "Carregando"** (`skeletonStat`): o cartão de número tem blocos de 96 × 16, 140 × 32 e 112 × 16, com
    canto de 4 (a cor era a da divisória; agora é a do chip, ver 42). Origem: **mockup** `X-DocEstados`.
18. **Tons** (`tones`): para Badge, ThemeIcon, Avatar, Alert e Progress, cada tom junta três papéis que já existem:
    texto, fundo claro e fundo cheio. A queda não tem tinta na identidade, então o fundo claro dela é o do chip.
19. **Linha compacta de 56** (`compactRowHeight`): lista com caixas e interruptor (**mockup** `X-DocComponentes`) e o
    cabeçalho do acordeão (**0.1.0**).
20. **Espaço entre letras do rótulo** (`overlineTracking`): 0,08 em no rótulo de seção em maiúsculas. Origem: **0.1.0**.
21. **Interruptor** (`switchSize`): trilho de 52 × 32, bolinha de 24 (recuo de 4). Origem: **mockup** `X-DocComponentes`.
22. **Estrela** (`icons.star`): acrescentada para o Rating, no traço do conjunto (1,8 numa caixa de 22). Não vem da
    identidade nem da 0.1.0: **a confirmar com o design**.
23. **Alerta, folha e véu** (`dialogWidth`, `sheetHandle`, `state.scrimOpacity`): alerta de 440, alça da folha de
    36 × 4 na cor da borda forte, véu na cor scrim a 72%. Origem: **mockup** (`W-Confirmar`, telas M- com folha).

## Passo 10

24. **Ícone de menu** (`icons.menu`, aprovado em 13/11/2026): três traços iguais, no traço do conjunto (1,8 numa
    caixa de 22), para o Burger; aberto, ele mostra o `close`. A identidade não tem menu escondido (abas embaixo no
    celular, menu no topo no computador, `X-DocNavegacao`): **a confirmar com o design**.
25. **Barras do Stepper**: uma barra de 4 (`space[1]`) por passo, com 4 entre elas, cheia na cor principal até o
    passo atual e na borda forte depois; embaixo, "2 de 4 · **Nome**". Origem: **0.1.0** (`.cf-steps`); as telas do
    mockup não têm passos.
26. **Navegação composta de valores da identidade** (sem valor novo): as abas na página são o Segmentado e a fileira
    de chips (`M-Instalacao`); a linha do NavLink é a "Lista: Linha de 64" (quadro de ícone 40, seta na cor `text3`) e
    a escolhida é a da lista-detalhe (`W-Avisos`: fundo `accentTint`, canto 12); as páginas da Pagination usam o
    botão de 44 com canto 12 das setas de mês (`W-Periodo`); o índice segue o "Nesta aba" (`X-DocIndice`: número em
    negrito na cor principal, rótulo 17/500, linha da borda). Breadcrumbs e Pagination não aparecem no mockup (ele usa
    o link "Voltar" e a linha "Ver todos"); são feitos só com esses tokens.

## Passo 11

27. **AppShell** (`appShell`): no computador, cabeçalho de 64 (fundo `nav`, linha da divisória embaixo, recuo de 32,
    32 entre logo, menu e o lado direito); itens do menu de 44, recuo de 12, canto 12, ícone de 20, rótulo 15/500 na
    cor `label`, o atual em pílula (`accent` sobre `accentTint`). No celular, abas embaixo: barra com recuo de 4, canto
    20, fundo `card` e anel da divisória, a 16 das bordas; itens de 56, ícone de 24, rótulo 13/500 na cor `text2`, o
    atual em pílula de canto 16. De 768 a 1279, o menu fica só com ícones (o nome continua para o leitor de tela).
    Origem: **mockup** (`M-Hoje`, `W-Hoje`, `X-DocNavegacao`).
28. **Velocidade do Marquee** (`marqueeSpeed`, aprovado em 13/11/2026): 50 px por segundo; para com o mouse em cima,
    com o foco dentro e para quem pediu menos movimento.
29. **Composto de valores da identidade** (sem valor novo): a barra de rolagem do ScrollArea é fina, na cor da borda
    forte (pedido do dono em 14/11/2026: o `tokens.css` põe essa barra na página toda, com `scrollbar-width: thin` e
    `scrollbar-color: var(--cf-color-border-strong) transparent` no `:root` e em cada modo; as duas herdam); a alça
    do Splitter tem 8 de área (`space[2]`) com a linha da divisória, que fica na cor principal no foco e ao arrastar; a
    Toolbar separa os botões por 8, como as ações do cabeçalho da 0.1.0.

## Passo 12

30. **Aviso rápido** (`duration.notification`): some sozinho em 4 s. Origem: **0.1.0** (`Toast`). O mockup não tem aviso
    rápido.
31. **Calendário** (`calendar`, `colors.rangeTint`, escolha de 13/11/2026: "tudo como o celular"): o mockup desenha o
    calendário duas vezes e as versões não batem; valem as medidas do **mockup** `M-Periodo` na web e no celular.
    Dia em círculo de 40, número 17; setas de 44 redondas; título 17/700; iniciais "D S T Q Q S S" 13 na cor `text2`;
    hoje com anel de 1,5 na cor do texto; dia escolhido e pontas do período em círculo cheio na cor `button` (a mesma
    nos dois modos) com o número branco em 700; o meio do período numa faixa sem canto, `#E7F0FB` no claro (azul
    próprio do mockup, fora da escala) e `#172F50` no escuro; dias fora do limite na cor da borda forte, sem toque.
32. **Gráficos** (`chart`): o que a identidade desenha vem do **mockup** (W-Hoje, W-Datas, W-Comparar, W-Montar,
    M-Montar, W-Analises, W-Indicadores). Rótulos 13 na cor `text2`; base na cor `border`; grade na `divider`; série na
    `accent`; previsto na `text2`, traço 2 tracejado 5 5 (na legenda também); real com traço 3 e pontos de 4; trecho
    em andamento pontilhado (1 6) com o último ponto vazio; faixa normal cheia na `divider`; "agora" em linha de 1,5
    tracejada 3 3 na `text3`; lacuna hachurada (quadro de 7 girado 45°, traço de 3, cor `hatch`); barras com canto 2 e
    4 entre elas, as comuns na `border` e o pico na `accent`; ranking com barra de 8 (trilho `divider`) e marca de 2;
    dispersão com pontos de 5 e anel de 2 na cor do cartão; mapa de calor com células de 20, canto 3 e a série em 18,
    36, 54, 76 e 100%; barra de conversão de 16. Onde web e celular divergem (tracejado, cor das barras comuns,
    trilho do ranking), vale a **web** (escolha de 13/11/2026).
33. **Tipos que a identidade não desenha** (aprovados em 13/11/2026, **a confirmar com o design**): área com a série
    a 18% (o tom mais claro do mapa de calor); pizza e rosca de 200, com 2 de vão na cor do cartão e a espessura da
    rosca em 1/5 (como o anel); radar com a grade na `divider` e a série como a área; minigráfico de 40 de altura com a
    linha da série (traço 2, sem pontos); várias séries nos degraus 6, 4, 2 e 8 da escala azul no claro e 3, 5, 1 e 4 no
    escuro. Sem valor novo (aprovado em 18/11/2026): barras com várias séries nessas cores, encostadas
    dentro do grupo e com o vão de 4 entre os grupos; empilhadas com o canto 2 em cada pedaço; o combinado com a
    barra cinza, a linha cheia como o real (traço 3, pontos de 4, cor da série seguinte; com pico, a 2ª) e a meta como o previsto; o
    eixo da direita com os mesmos 44 do da esquerda; a dica é a do Tooltip e a linha-guia vai na `text3` com traço 1.
34. **Código** (escolha de 13/11/2026, **a confirmar**): o mockup só mostra código em mono (`ui-monospace, Menlo,
    Consolas`), sem fundo e com o link "Copiar". O bloco usa o fundo `field`, canto 12 e recuo 16; as cores do realce
    são papéis que já existem: palavra-chave `accent`, texto `up`, número `warn`, comentário `text3`, propriedade
    `label`, pontuação `text2`.
35. **Carrossel** (escolha de 13/11/2026): os cartões rolam com encaixe e, no celular, sangram à direita como as
    fileiras de chips (`M-Datas`); na web, as setas de 44 do Scroller; no lugar de pontos, o contador "2 de 5" das
    fotos (`M-CadastroFoto`).
36. **Dropzone e Spotlight**: não existem no mockup; usam só valores dele. A área de soltar é o botão tracejado de
    enviar (`W-Integracao`: borda 1,5 tracejada na `text3`, canto 12, ícone `upload`); ao arrastar um arquivo aceito,
    fundo `accentTint` e borda `accent`; recusado, borda e texto `down`. A busca rápida tem a largura do seletor de
    estabelecimento (`spotlightWidth` = 460, `W-Seletor`), o campo de busca de 48 e as linhas de 56 com o quadro de
    ícone de 40.

## Depois da aplicação no countify-label (13/11/2026)

37. **Cabeçalho de página** (`screenHeaderHeight`, `pageTitleTracking`): no celular, a linha do voltar tem 60 de altura
    mínima (**mockup**, telas M- com Voltar); no computador, o título de 28 tem -0,01 em entre as letras (**mockup**, h1
    das telas W-*).
38. **Ajuda e chip de filtro** (`helpIconSize`, `filterChipChevronSize`): o "?" tem ícone de 20 num alvo redondo de 44
    que não aumenta a linha, e a seta do chip de filtro tem 14. Origem: **mockup** `X-DocComponentes` ("Botão de ícone
    e ajuda" e "Chip de filtro").
39. **Chip de filtro com filtro aplicado** (aprovado em 13/11/2026, no mockup "Countify Label · atual × sugestão"): o
    guia só desenha o chip neutro; com um filtro diferente do padrão ele usa a tinta e o anel do destaque, os mesmos do
    chip de escolha marcado.
40. **Contorno de controle** (`controlBorder`, aprovado em 14/11/2026, no mockup "Countify Label · melhorias da avaliação"):
    o contorno de campo, caixa de marcar e opção usa o texto 3 de cada modo, #667085 no claro e #94A3B8 no escuro, com
    3:1 ou mais sobre bg, card, sheet e field (WCAG 1.4.11). A `border` (#D0D5DD, 1,47:1 sobre o branco) continua nos
    contornos que não são de controle.
41. **Linhas mais baixas na tabela** (`verticalSpacing` da Table, aprovado em 14/11/2026): o espaço acima e abaixo da
    célula pode ir do padrão `space-3` (12) para `space-2` (8), com o mesmo token da grade de 4; o campo dentro da célula
    continua com a altura de toque (44).
42. **Cor dos blocos do "Carregando"** (aprovado em 14/11/2026): o Skeleton, o SkeletonLoader e o SkeletonMask usam o
    papel `chip` (#E8EDF3 no claro, #22334A no escuro) no lugar da `divider`. A divisória quase não aparecia sobre o
    cartão branco e sumia sobre o fundo. Canto de 4 e pulso (`state.pulseOpacity`, `duration.pulse`) continuam.

## Componentes de 18/11/2026 (aprovados em 18/11/2026)

43. **StatCard, Meter, NotificationList e DataGrid**, sem token novo, com o que já existe no lugar do que o mockup pede:
    - StatCard: a linha do rótulo tem 24 de altura mínima (`space 6`, a altura com o "?") no lugar dos 22 do W-Hoje,
      para os cartões com e sem ajuda ficarem alinhados.
    - Meter `lg` (Conversão do W-Indicadores): o número usa o `tabTitle` (32) no lugar dos 40 do mockup; o traço do
      esperado é o do Progress (16, passando 4) no lugar dos 18.
    - NotificationList: o mockup não desenha "não lido"; o título fica em negrito e há um ponto de 8 (o do
      Indicator) na cor `accent`, 8 depois da hora.
    - DataGrid: linha da altura do campo `sm` mais a borda fina (45, ou 37 na densidade compacta); célula ativa com o
      anel de foco por dentro na `accent`; seleção com fundo `accentTint`; editor `Input` sm com canto `xs`; a mensagem
      de erro com o visual do Tooltip, presa à célula, e o anel do campo na `down`.
