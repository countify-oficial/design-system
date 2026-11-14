---
"@countify-oficial/core": patch
---

Menu, Popover, HelpTip e as listas de seleção abriam no canto da tela (0,0): a animação de abrir sobrescrevia o transform da posição. A posição agora vai em left/top. No NativeSelect (e em qualquer campo com seção da direita sem clique), a seta fica por cima do campo, que vai de borda a borda: clicar na seta ou na borda abre a lista.
