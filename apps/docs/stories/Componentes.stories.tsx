/// <reference types="vite/client" />
import { Icon, ThemeIcon, type IconProps } from "@countify-oficial/core";
import { composeStory, type Meta, type StoryObj } from "@storybook/react-vite";
import { Component, type ComponentType, type ReactNode } from "react";
import { categorias, descricoes, idDoTitulo, linkDaPagina } from "./_catalogo";

// todas as páginas de componentes, lidas dos próprios arquivos de histórias: o índice nunca sai de sincronia
type Modulo = { default: Meta & { title: string } } & Record<string, unknown>;
const modulos = import.meta.glob<Modulo>(["./*.stories.tsx", "!./Componentes.stories.tsx"], { eager: true });

// páginas cuja primeira história não serve de miniatura (desenha fora do cartão)
const semPrevia: Record<string, IconProps["name"]> = { "Primitivos/Portal": "box-multiple" };

interface Pagina {
  titulo: string;
  nome: string;
  descricao: string;
  Previa: ComponentType | null;
  icone: IconProps["name"];
}

const paginas: Pagina[] = Object.values(modulos).flatMap((m) => {
  const meta = m.default as Modulo["default"] | undefined;
  if (!meta?.title) return [];
  const primeira = Object.entries(m).find(([nome, valor]) => nome !== "default" && typeof valor === "object" && valor !== null);
  const Previa = !semPrevia[meta.title] && primeira ? (composeStory(primeira[1] as StoryObj, meta) as ComponentType) : null;
  return [{
    titulo: meta.title,
    nome: meta.title.split("/").slice(1).join(" / "),
    descricao: descricoes[meta.title] ?? "",
    Previa,
    icone: semPrevia[meta.title] ?? "components",
  }];
});

// uma miniatura que quebre não derruba o índice: mostra o ícone no lugar
class Protecao extends Component<{ reserva: ReactNode; children: ReactNode }, { erro: boolean }> {
  override state = { erro: false };
  static getDerivedStateFromError() {
    return { erro: true };
  }
  override render() {
    return this.state.erro ? this.props.reserva : this.props.children;
  }
}

function Cartao({ p }: { p: Pagina }) {
  const reserva = <ThemeIcon size="xl"><Icon name={p.icone} /></ThemeIcon>;
  return (
    <article className="cf-cartao">
      <div className="cf-cartao-previa" inert>
        <div className="cf-cartao-escala">
          <Protecao reserva={reserva}>{p.Previa ? <p.Previa /> : reserva}</Protecao>
        </div>
      </div>
      <div className="cf-cartao-corpo">
        <h3 className="cf-cartao-titulo">
          <a href={linkDaPagina(p.titulo)} target="_top">{p.nome}</a>
        </h3>
        <p className="cf-cartao-texto">{p.descricao}</p>
        <span className="cf-cartao-ver" aria-hidden="true">Ver {p.nome} →</span>
      </div>
    </article>
  );
}

// só as páginas das categorias (fica de fora, por exemplo, o próprio índice)
const total = paginas.filter((p) => categorias.some(([c]) => p.titulo.startsWith(`${c}/`))).length;

function Indice() {
  return (
    <div className="cf-indice">
      <p className="cf-indice-total">{total} páginas em {categorias.length} categorias. Clique num cartão para ver o componente, os exemplos e as props.</p>
      {categorias.map(([categoria, frase]) => {
        const daCategoria = paginas.filter((p) => p.titulo.startsWith(`${categoria}/`)).sort((a, b) => a.nome.localeCompare(b.nome));
        return (
          <section key={categoria} aria-labelledby={`cat-${idDoTitulo(categoria)}`}>
            <h2 id={`cat-${idDoTitulo(categoria)}`} className="cf-indice-categoria">
              {categoria} <span className="cf-indice-contagem">{daCategoria.length}</span>
            </h2>
            <p className="cf-indice-frase">{frase}</p>
            <div className="cf-indice-grade">{daCategoria.map((p) => <Cartao key={p.titulo} p={p} />)}</div>
          </section>
        );
      })}
    </div>
  );
}

// a página é o Componentes.mdx; esta história escondida desenha os cartões dentro dela
const meta = {
  title: "Índice de componentes",
  tags: ["!autodocs"],
  // as miniaturas repetem os exemplos das páginas (ids e nomes iguais); a acessibilidade é testada em cada página
  parameters: { layout: "fullscreen", a11y: { test: "off" } },
} satisfies Meta;
export default meta;

export const Galeria: StoryObj = { name: "Índice", tags: ["!dev"], render: () => <Indice /> };
