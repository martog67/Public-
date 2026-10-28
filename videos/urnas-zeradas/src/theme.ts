import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT = "Bricolage Grotesque";

// Bricolage Grotesque (SIL OFL) vai até 800; o peso 900 usa o mesmo arquivo do 800.
for (const [weight, arquivo] of [
  ["500", "500"],
  ["600", "600"],
  ["700", "700"],
  ["800", "800"],
  ["900", "800"],
]) {
  loadFont({
    family: FONT,
    url: staticFile(`fonts/bricolage-grotesque-latin-${arquivo}-normal.woff2`),
    weight,
  });
}

// Anton (SIL OFL): letra condensada da fita "EXPLICA" da assinatura OSM Explica
export const FONT_EXPLICA = "Anton";
loadFont({
  family: FONT_EXPLICA,
  url: staticFile("fonts/anton-latin-400-normal.woff2"),
});

// Azul, verde e amarelo observados no avatar do OSM no Instagram
// (não há paleta oficial em marca/osm/; confirmar com o jornal).
export const COR = {
  fundo: "#06102E",
  fundoClaro: "#0E2470",
  azul: "#3070F0",
  azulClaro: "#6FA2FF",
  azulMapa: "#1D3F9E",
  bordaMapa: "#4F7FE8",
  verde: "#45A63A",
  verdeClaro: "#7FD36F",
  ba: "#A9C4FF",
  amarelo: "#F2C232",
  texto: "#FFFFFF",
  textoSuave: "rgba(255,255,255,0.7)",
  linha: "rgba(255,255,255,0.15)",
};

export const FPS = 30;

// Área segura do Instagram (CLAUDE.md): x 60–930, y 250–1500
export const SEGURA = { x0: 60, x1: 930, y0: 250, y1: 1500 };
// Respiro de 24 px dentro da área segura
export const X0 = SEGURA.x0 + 24;
export const LARGURA_UTIL = SEGURA.x1 - SEGURA.x0 - 48;
export const CONTEUDO = { top: 650, bottom: 1430 };

// As cenas começam em frases da narração (src/legendas.ts).
// Para sincronizar com um áudio novo, basta ajustar os tempos das legendas.
export { CENAS, DURACAO_TOTAL, inicioCena, local } from "./roteiro";
