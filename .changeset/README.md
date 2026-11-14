# Changesets

Toda mudança que um app vai sentir ganha um arquivo aqui: rode `pnpm changeset`, escolha os pacotes e o tipo
(patch, minor, major) e escreva uma linha em pt-BR. `pnpm version-packages` aplica as versões e o CHANGELOG de
cada pacote; `pnpm release` publica no registry privado.

O core, o native e as extensões (carousel, charts, code-highlight, dates, dropzone, modals, notifications, spotlight)
ficam num grupo `linked`: saem com a mesma versão e o mesmo tipo de mudança. Assim, quando o core sobe de 0.4 para
0.5, a extensão que pede `core ^0.5` também sobe de minor, e um app com `^0.4` não a recebe sem querer.
`pnpm release` só publica com a árvore limpa e com build, typecheck, lint e testes passando.
