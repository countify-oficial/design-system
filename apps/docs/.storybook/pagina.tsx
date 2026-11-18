import { Controls, Description, Heading, Primary, Source, Stories, Title, useOf } from "@storybook/addon-docs/blocks";
import { descricoes, importacao, linkDaPagina } from "../stories/_catalogo";

/** A página de docs de cada componente: trilha, título, descrição, importação, prévia com as props e os exemplos. */
export function Pagina() {
  const { preparedMeta } = useOf("meta", ["meta"]);
  const titulo = preparedMeta.title;
  const categoria = titulo.split("/")[0] ?? "";
  const componente = (preparedMeta.component as { displayName?: string; name?: string } | undefined);
  const linha = importacao(titulo, componente?.displayName ?? componente?.name);
  return (
    <>
      <nav aria-label="Trilha" className="cf-trilha">
        <a href={linkDaPagina("Componentes")} target="_top">Componentes</a>
        <span aria-hidden="true">›</span>
        <span>{categoria}</span>
      </nav>
      <Title />
      {descricoes[titulo] && <p className="cf-resumo">{descricoes[titulo]}</p>}
      <Description />
      {linha && (
        <>
          <Heading>Importação</Heading>
          <Source language="tsx" code={linha} dark={false} />
        </>
      )}
      <Heading>Prévia</Heading>
      <Primary />
      <Controls />
      <Stories title="Exemplos" includePrimary={false} />
    </>
  );
}
