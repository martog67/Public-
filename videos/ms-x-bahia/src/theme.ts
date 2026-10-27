import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT = "Inter";

for (const weight of ["500", "700", "800", "900"]) {
  loadFont({
    family: FONT,
    url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`),
    weight,
  });
}

// Cores do vídeo (não são cores oficiais da marca OSM).
export const COR = {
  fundoTopo: "#0B1424",
  fundoBase: "#14233B",
  painel: "rgba(255,255,255,0.05)",
  linha: "rgba(255,255,255,0.14)",
  texto: "#FFFFFF",
  textoSuave: "rgba(255,255,255,0.72)",
  ms: "#3CCB9C",
  ba: "#F5A524",
  destaque: "#FFD24A",
};

export const FPS = 30;

// Linha do tempo (em frames)
export const T = {
  intro: 120,
  indicador: 240,
  governo: 210,
  tendencia: 240,
  final: 165,
};

export const INICIO_GOVERNO = T.intro + 4 * T.indicador;
export const INICIO_TENDENCIA = INICIO_GOVERNO + T.governo;
export const INICIO_FINAL = INICIO_TENDENCIA + T.tendencia;
export const DURACAO_TOTAL = INICIO_FINAL + T.final;
