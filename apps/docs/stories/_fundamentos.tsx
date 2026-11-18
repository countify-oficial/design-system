// Blocos das páginas de Fundamentos: desenhados direto dos valores de @countify-oficial/tokens,
// para a documentação nunca sair de sincronia com os tokens. HTML simples, sem o provider (são páginas MDX).
import {
  colors, fontFamily, fontSize, fontWeight, headings, iconSvg, icons, palette, primaryColor, primaryShade, radius, shadows,
  space, spacing, type ColorRole, type IconName, type Size,
} from "@countify-oficial/tokens";

const kebab = (s: string) => s.replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`);
const tamanhos: Size[] = ["xs", "sm", "md", "lg", "xl"];

// texto escuro ou claro sobre uma amostra, pelo brilho da cor
function contraste(hex: string): string {
  const canal = (i: number) => parseInt(hex.slice(i, i + 2), 16);
  return (canal(1) * 299 + canal(3) * 587 + canal(5) * 114) / 1000 > 150 ? "#111827" : "#FFFFFF";
}

const nomesDaPaleta: Record<string, string> = { blue: "Azul", green: "Verde", red: "Vermelho", amber: "Âmbar", gray: "Cinza" };

/** As cinco escalas de 10 tons, com o tom principal de cada modo marcado. */
export function Paleta() {
  return (
    <div className="cf-fund-paleta">
      {Object.entries(palette).map(([nome, tons]) => (
        <div key={nome} className="cf-fund-escala">
          <div className="cf-fund-escala-nome">
            {nomesDaPaleta[nome]} <code>{nome}</code>
          </div>
          <div className="cf-fund-escala-tons">
            {tons.map((hex, i) => {
              const principal = nome === primaryColor && (i === primaryShade.light || i === primaryShade.dark);
              return (
                <div key={hex} className="cf-fund-tom" style={{ background: hex, color: contraste(hex) }}>
                  <span>{i}{principal ? " ★" : ""}</span>
                  <span>{hex}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Os papéis de cor (o que os componentes usam), lado a lado no claro e no escuro. */
export function Papeis() {
  const papeis = Object.keys(colors.light) as ColorRole[];
  return (
    <table className="cf-fund-tabela">
      <thead>
        <tr><th>Papel</th><th>Claro</th><th>Escuro</th><th>Variável CSS</th></tr>
      </thead>
      <tbody>
        {papeis.map((p) => (
          <tr key={p}>
            <td><code>{p}</code></td>
            {(["light", "dark"] as const).map((m) => (
              <td key={m}>
                <span className="cf-fund-amostra" style={{ background: colors[m][p] }} />
                <code>{colors[m][p]}</code>
              </td>
            ))}
            <td><code>--cf-color-{kebab(p)}</code></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const nomesDosTitulos: Record<string, string> = {
  tabTitle: "Título de aba (celular)", pageTitle: "Título de página (computador)", screenTitle: "Título de tela interna",
  section: "Seção", number: "Número de indicador", overline: "Rótulo de seção",
};

/** Os níveis de título e a escala de texto, escritos na própria letra. */
export function Tipografia() {
  return (
    <div className="cf-fund-tipo" style={{ fontFamily: fontFamily.sans }}>
      {Object.entries(headings).map(([nome, h]) => (
        <div key={nome} className="cf-fund-tipo-linha">
          <div className="cf-fund-tipo-meta">
            <strong>{nomesDosTitulos[nome]}</strong>
            <code>{h.fontSize}px · {h.fontWeight} · {h.lineHeight}</code>
            <code>--cf-heading-{kebab(nome)}-size</code>
          </div>
          <div
            style={{
              fontSize: h.fontSize, fontWeight: h.fontWeight, lineHeight: h.lineHeight,
              ...(nome === "overline" && { textTransform: "uppercase", letterSpacing: "0.08em" }),
              ...(nome === "number" && { fontVariantNumeric: "tabular-nums" }),
            }}
          >
            {nome === "number" ? "12.480" : nome === "overline" ? "Lojas da região" : "Contagem de estoque"}
          </div>
        </div>
      ))}
      {tamanhos.map((s) => (
        <div key={s} className="cf-fund-tipo-linha">
          <div className="cf-fund-tipo-meta">
            <strong>Texto {s}</strong>
            <code>{fontSize[s]}px</code>
            <code>--cf-font-size-{s}</code>
          </div>
          <div style={{ fontSize: fontSize[s], lineHeight: 1.4 }}>A loja recebeu 48 caixas e conferiu todas.</div>
        </div>
      ))}
    </div>
  );
}

/** Os três pesos da letra. */
export function Pesos() {
  return (
    <div className="cf-fund-pesos" style={{ fontFamily: fontFamily.sans }}>
      {Object.entries(fontWeight).map(([nome, peso]) => (
        <div key={nome}>
          <div style={{ fontSize: 28, fontWeight: peso }}>Aa</div>
          <code>{nome} · {peso}</code>
        </div>
      ))}
    </div>
  );
}

/** A grade de 4 e os tamanhos xs–xl de espaço. */
export function Espacos() {
  const linhas: [string, number][] = [
    ...Object.entries(space).map(([k, v]): [string, number] => [`space ${k}`, v]),
    ...tamanhos.map((s): [string, number] => [`spacing ${s}`, spacing[s]]),
  ];
  return (
    <table className="cf-fund-tabela">
      <thead><tr><th>Token</th><th>Valor</th><th /></tr></thead>
      <tbody>
        {linhas.map(([nome, v]) => (
          <tr key={nome}>
            <td><code>{nome}</code></td>
            <td><code>{v}px</code></td>
            <td><span className="cf-fund-barra" style={{ width: v * 4 }} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Cantos e sombras, um quadrado por tamanho. */
export function Formas() {
  return (
    <div className="cf-fund-formas">
      {tamanhos.map((s) => (
        <div key={s} className="cf-fund-forma">
          <div style={{ borderRadius: radius[s], boxShadow: `var(--cf-shadow-${s})` }} />
          <code>radius {s} · {radius[s]}px</code>
          <code>shadow {s} · {shadows[s] === "ring" ? "anel" : "elevada"}</code>
        </div>
      ))}
    </div>
  );
}

/** Os ícones próprios da Countify, com o nome para usar no <Icon name>. */
export function Icones() {
  return (
    <div className="cf-fund-icones">
      {(Object.keys(icons) as IconName[]).map((nome) => (
        <div key={nome} className="cf-fund-icone">
          {/* SVG das constantes do próprio pacote de tokens, não de entrada de usuário */}
          <span dangerouslySetInnerHTML={{ __html: iconSvg(nome, "#182A42") }} />
          <code>{nome}</code>
        </div>
      ))}
    </div>
  );
}
