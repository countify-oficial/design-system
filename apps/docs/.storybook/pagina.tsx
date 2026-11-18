import { Controls, Description, Heading, Primary, Source, Stories, Title, useOf } from "@storybook/addon-docs/blocks";
import { Fragment, useState, type ReactNode } from "react";
import { descricoes, importacao, linkDaPagina } from "../stories/_catalogo";
import { importacaoNoCelular, plataformasDe, type Estado, type Linha } from "../stories/_plataformas";

const nomesDasPlataformas = { web: "Web", desktop: "Desktop", mobile: "Mobile" } as const;
type Plataforma = keyof typeof nomesDasPlataformas;
const textoDoEstado: Record<Estado, string> = { ok: "Sim", adaptado: "Adaptado", "N/A": "Não" };

// larguras da prévia: as dos pontos de quebra dos tokens (768 e 1280) e um celular comum
const larguras = [
  { nome: "Na página", largura: 0 },
  { nome: "Celular", largura: 390 },
  { nome: "Tablet", largura: 768 },
  { nome: "Computador", largura: 1280 },
] as const;

/** Estado de uma plataforma na página toda: "N/A" só se nada existir nela; "adaptado" se algo for adaptado. */
function resumo(linhas: Linha[], p: Plataforma): Estado {
  if (linhas.every((l) => l[p] === "N/A")) return "N/A";
  return linhas.some((l) => l[p] !== "ok") ? "adaptado" : "ok";
}

// `código` e **negrito** do texto da matriz
function textoDaMatriz(texto: string): ReactNode {
  return texto.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((parte, i) =>
    parte.startsWith("`") ? <code key={i}>{parte.slice(1, -1)}</code>
    : parte.startsWith("**") ? <strong key={i}>{parte.slice(2, -2)}</strong>
    : <Fragment key={i}>{parte}</Fragment>,
  );
}

function Abas<T extends string>({ rotulo, opcoes, valor, aoMudar }: { rotulo: string; opcoes: readonly T[]; valor: T; aoMudar: (v: T) => void }) {
  return (
    <div role="group" aria-label={rotulo} className="cf-abas">
      {opcoes.map((o) => (
        <button key={o} type="button" aria-pressed={o === valor} onClick={() => aoMudar(o)}>{o}</button>
      ))}
    </div>
  );
}

/** A página de docs de cada componente: trilha, plataformas, importação, prévia em tamanhos de tela, props e exemplos. */
export function Pagina() {
  const { csfFile, preparedMeta } = useOf("meta", ["meta"]);
  const titulo = preparedMeta.title;
  const categoria = titulo.split("/")[0] ?? "";
  const componente = preparedMeta.component as { displayName?: string; name?: string } | undefined;
  const linha = importacao(titulo, componente?.displayName ?? componente?.name);
  const plataformas = plataformasDe(linha);
  const noCelular = linha ? importacaoNoCelular(linha) : null;
  const primeira = Object.keys(csfFile.stories)[0];

  const [abaDeImportacao, setAbaDeImportacao] = useState<"Web e desktop" | "Mobile">("Web e desktop");
  const [tamanho, setTamanho] = useState<(typeof larguras)[number]["nome"]>("Na página");
  const largura = larguras.find((l) => l.nome === tamanho)?.largura ?? 0;

  return (
    <>
      <nav aria-label="Trilha" className="cf-trilha">
        <a href={linkDaPagina("Componentes")} target="_top">Componentes</a>
        <span aria-hidden="true">›</span>
        <span>{categoria}</span>
      </nav>
      <Title />
      {descricoes[titulo] && <p className="cf-resumo">{descricoes[titulo]}</p>}
      {plataformas.length > 0 && (
        <ul className="cf-selos" aria-label="Plataformas">
          {(Object.keys(nomesDasPlataformas) as Plataforma[]).map((p) => {
            const e = resumo(plataformas, p);
            return (
              <li key={p} data-estado={e}>
                {nomesDasPlataformas[p]}
                <span className="cf-selo-estado">{e === "ok" ? "✓" : e === "adaptado" ? "≈" : "—"}</span>
                <span className="cf-sr">{textoDoEstado[e]}</span>
              </li>
            );
          })}
        </ul>
      )}
      <Description />

      {linha && (
        <>
          <Heading>Importação</Heading>
          <Abas rotulo="Plataforma da importação" opcoes={["Web e desktop", "Mobile"] as const} valor={abaDeImportacao} aoMudar={setAbaDeImportacao} />
          {abaDeImportacao === "Web e desktop" ? (
            <Source language="tsx" code={linha} dark={false} />
          ) : noCelular ? (
            <Source language="tsx" code={noCelular} dark={false} />
          ) : (
            <p className="cf-aviso">Não existe no mobile. {plataformas[0] && textoDaMatriz(plataformas[0].motivo)}</p>
          )}
        </>
      )}

      <Heading>Prévia</Heading>
      <Abas rotulo="Tamanho de tela" opcoes={larguras.map((l) => l.nome)} valor={tamanho} aoMudar={setTamanho} />
      {largura === 0 || !primeira ? (
        <Primary />
      ) : (
        <div className="cf-moldura">
          <iframe
            title={`${titulo} em ${largura} px`}
            src={`iframe.html?id=${primeira}&viewMode=story`}
            style={{ width: largura }}
          />
          <p className="cf-moldura-legenda">{tamanho}: {largura} px de largura. Role para os lados se não couber.</p>
        </div>
      )}
      <Controls />

      {plataformas.length > 0 && (
        <>
          <Heading>Plataformas</Heading>
          <table className="cf-plataformas">
            <thead>
              <tr><th>Componente</th><th>Web</th><th>Desktop (Electron)</th><th>Mobile (React Native)</th><th>Observação</th></tr>
            </thead>
            <tbody>
              {plataformas.map((l) => (
                <tr key={l.nome}>
                  <td><code>{l.nome}</code></td>
                  {(["web", "desktop", "mobile"] as const).map((p) => <td key={p} data-estado={l[p]}>{textoDoEstado[l[p]]}</td>)}
                  <td>{textoDaMatriz(l.motivo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <Stories title="Exemplos" includePrimary={false} />
    </>
  );
}
