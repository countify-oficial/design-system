# Changesets

Toda mudança que um app vai sentir ganha um arquivo aqui: rode `pnpm changeset`, escolha os pacotes e o tipo
(patch, minor, major) e escreva uma linha em pt-BR. `pnpm version-packages` aplica as versões e o CHANGELOG de
cada pacote; `pnpm release` publica no registry privado.
