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

// Linha do tempo (em frames), sincronizada com public/audio/narracao.mp3 (76,8 s).
// Cada corte fica no meio da pausa entre dois blocos da narração.
export const T = {
  intro: 146,
  // desemprego, renda, mortes violentas, analfabetismo
  indicadores: [334, 303, 409, 275],
  governo: 334,
  tendencia: 310,
  final: 244,
};

// Frame (dentro de cada indicador) em que o ponto vai para o placar,
// logo depois de a narração citar o segundo estado.
export const PONTOS = [225, 205, 265, 240];

export const INICIO_INDICADOR = T.indicadores.map(
  (_, i) => T.intro + T.indicadores.slice(0, i).reduce((a, b) => a + b, 0),
);
export const INICIO_GOVERNO =
  T.intro + T.indicadores.reduce((a, b) => a + b, 0);
export const INICIO_TENDENCIA = INICIO_GOVERNO + T.governo;
export const INICIO_FINAL = INICIO_TENDENCIA + T.tendencia;
export const DURACAO_TOTAL = INICIO_FINAL + T.final;
