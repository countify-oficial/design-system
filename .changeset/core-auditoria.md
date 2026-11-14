---
"@countify-oficial/core": minor
---

- Janela sobre janela (Modal e Drawer): o Tab anda na de cima (antes voltava sempre ao primeiro botão dela) e o Esc fecha só a de cima. Um Popover com `trapFocus` dentro de um Modal também volta a prender o Tab.
- Select, Autocomplete, MultiSelect e TagsInput: sair do campo com Tab fecha a lista.
- Mentions: Esc (ou sair do campo) dispensa a lista da menção; outra menção abre de novo.
- NumberInput: ao sair do campo, o valor é arredondado a `decimalScale` (com 2 casas, "10,555" mostrava 10,56 e guardava 10.555).
- TagsInput: Enter na sugestão marcada cria só ela, sem criar antes o texto digitado.
- O `onFocus` do Autocomplete, o `onClick` do Select e do MultiSelect, os eventos de `inputProps` do MultiSelect e do TagsInput e o `aria-describedby` dos campos não são mais trocados pelos internos: somam-se a eles.
- Icon: mil ícones iguais do Tabler esperam um só pedido, e um pedaço que não baixou é tentado de novo na próxima montagem.
- `error={true}` no Checkbox e nos grupos (Checkbox, Radio, Switch e Chip) só marca o campo, sem um aviso vazio, como no TextInput.
- `phoneMask`, `initials`, `selectAllState` e os ajudantes do Combobox e da árvore vêm do provider (os nomes exportados não mudam).
