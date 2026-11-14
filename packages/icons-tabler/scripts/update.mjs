// Traz os ícones do Tabler para assets/icons/tabler/ sem alterá-los: baixa o @tabler/icons do npm (npm pack, que não
// roda script nenhum do pacote), confere a estrutura, a licença e o LICENSE, copia os SVGs byte a byte, grava o
// manifest.json e compara contagem e hash de cada arquivo copiado com o do pacote.
// Uso: pnpm --filter @countify-oficial/icons-tabler update-tabler [versão]   (sem versão: a mais nova)
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const variants = ["outline", "filled"];
const out = fileURLToPath(new URL("../assets/icons/tabler/", import.meta.url));
const tmp = mkdtempSync(join(tmpdir(), "tabler-icons-"));
const stop = (why) => {
  throw new Error(`${why}. Nada foi copiado; o pacote baixado ficou em ${tmp}`);
};

execFileSync("npm", ["pack", `@tabler/icons@${process.argv[2] ?? "latest"}`, "--ignore-scripts", "--loglevel=warn", "--pack-destination", tmp], { stdio: ["ignore", "ignore", "inherit"] });
const tarball = readdirSync(tmp).find((f) => f.endsWith(".tgz"));
if (!tarball) stop("O npm pack não deixou o .tgz");
execFileSync("tar", ["-xzf", join(tmp, tarball), "-C", tmp]);
const pkg = join(tmp, "package");
const meta = JSON.parse(readFileSync(join(pkg, "package.json"), "utf8"));

// para antes de copiar qualquer coisa se o pacote estiver fora do esperado
if (meta.license !== "MIT") stop(`A licença do pacote é ${meta.license}, não MIT`);
if (!existsSync(join(pkg, "LICENSE"))) stop("O pacote não tem LICENSE");
// .gitkeep: arquivo vazio do repositório do Tabler, não é ícone
const folders = readdirSync(join(pkg, "icons")).filter((f) => f !== ".gitkeep");
if (folders.sort().join() !== [...variants].sort().join()) stop(`icons/ tem ${folders.join(", ")}, não só outline e filled`);
const files = {};
for (const variant of variants) {
  const entries = readdirSync(join(pkg, "icons", variant), { withFileTypes: true });
  const odd = entries.find((e) => !e.isFile() || !/^[a-z0-9]+(-[a-z0-9]+)*\.svg$/.test(e.name));
  if (odd) stop(`icons/${variant}/${odd.name} não é um SVG com nome em kebab-case`);
  files[variant] = entries.map((e) => e.name).sort();
}

const icons = [];
for (const variant of variants) {
  rmSync(join(out, variant), { recursive: true, force: true });
  mkdirSync(join(out, variant), { recursive: true });
  for (const file of files[variant]) {
    copyFileSync(join(pkg, "icons", variant, file), join(out, variant, file));
    icons.push({ name: file.slice(0, -".svg".length), variant, path: `${variant}/${file}` });
  }
}
copyFileSync(join(pkg, "LICENSE"), join(out, "LICENSE"));
// path: relativo a esta pasta (assets/icons/tabler/)
const manifest = { package: meta.name, version: meta.version, license: meta.license, repository: "https://github.com/tabler/tabler-icons", icons };
writeFileSync(join(out, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

// conferência: mesma contagem e mesmo hash, arquivo por arquivo
const sha = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
let ok = sha(join(pkg, "LICENSE")) === sha(join(out, "LICENSE"));
for (const variant of variants) {
  const copied = readdirSync(join(out, variant)).length;
  const changed = files[variant].filter((f) => sha(join(pkg, "icons", variant, f)) !== sha(join(out, variant, f))).length;
  console.log(`${variant}: ${files[variant].length} no pacote, ${copied} copiados, ${changed} com hash diferente`);
  ok &&= copied === files[variant].length && changed === 0;
}
console.log(`${meta.name} ${meta.version}: ${ok ? "cópia idêntica ao pacote" : "CÓPIA DIFERENTE DO PACOTE"}`);
if (!ok) stop("A cópia não bate com o pacote");
rmSync(tmp, { recursive: true, force: true });
