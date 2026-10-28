import { CTA, LEGENDAS } from "./legendas";

const FPS = 30;

export const segundos = (marca: string) => {
  const f = LEGENDAS.find((l) => l.marca === marca);
  if (!f) throw new Error(`Marca de legenda inexistente: ${marca}`);
  return f.inicio;
};

// Cada cena começa um pouco antes da frase que a abre
const ANTES = 0.25;
const ABERTURAS = [
  ["abertura", "abertura"],
  ["levantamento", "folha"],
  ["mapaEstados", "am"],
  ["ranking", "ranking"],
  ["tabatinga", "tabatinga"],
  ["locais", "locais"],
  ["perfil", "perfil"],
  ["bolsa", "bolsa"],
  ["guaranta", "guaranta"],
  ["pl", "pl"],
  ["lulaZero", "lula0"],
  ["final", "final"],
  ["cta", "cta"],
] as const;

export type IdCena = (typeof ABERTURAS)[number][0];

export const DURACAO_TOTAL = Math.round((CTA.inicio + CTA.duracao + 1) * FPS);

export const CENAS = ABERTURAS.map(([id, marca], i) => {
  const inicio = Math.max(0, Math.round((segundos(marca) - ANTES) * FPS));
  const prox = ABERTURAS[i + 1];
  const fim = prox
    ? Math.round((segundos(prox[1]) - ANTES) * FPS)
    : DURACAO_TOTAL;
  return { id, inicio, duracao: fim - inicio };
});

export const inicioCena = (id: IdCena) =>
  CENAS.find((c) => c.id === id)!.inicio;

// frame, dentro da cena, em que a frase marcada começa
export const local = (marca: string, cena: IdCena) =>
  Math.round(segundos(marca) * FPS) - inicioCena(cena);
