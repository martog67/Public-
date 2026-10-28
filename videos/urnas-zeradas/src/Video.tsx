import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  Abertura,
  Bolsa,
  Cta,
  Final,
  Guaranta,
  Levantamento,
  Locais,
  LulaZero,
  MapaEstados,
  PL,
  Perfil,
  RankingEstados,
  Tabatinga,
} from "./cenas";
import { Capitulo, Legenda, P, Topo } from "./layout";
import { IdCena } from "./roteiro";
import { CENAS, FONT } from "./theme";

// Capítulos do "dossiê": mapa e ranking dividem o capítulo 3
const CAPITULOS: Record<
  IdCena,
  { n: number; titulo: string; cena: React.FC; semTitulo?: boolean }
> = {
  abertura: { n: 1, titulo: "O número", cena: Abertura },
  levantamento: { n: 2, titulo: "De onde vem", cena: Levantamento },
  mapaEstados: { n: 3, titulo: "Onde estão", cena: MapaEstados },
  ranking: { n: 3, titulo: "Onde estão", cena: RankingEstados },
  tabatinga: { n: 4, titulo: "A urna recordista", cena: Tabatinga },
  locais: { n: 5, titulo: "Onde se vota", cena: Locais },
  perfil: { n: 6, titulo: "Quem vota", cena: Perfil },
  bolsa: { n: 7, titulo: "Bolsa Família", cena: Bolsa },
  guaranta: { n: 8, titulo: "Cidade × aldeia", cena: Guaranta },
  pl: { n: 9, titulo: "E o PL?", cena: PL },
  lulaZero: { n: 10, titulo: "O outro lado", cena: LulaZero },
  final: { n: 11, titulo: "A proporção", cena: Final },
  // encerramento: sem título de capítulo
  cta: { n: 11, titulo: "", cena: Cta, semTitulo: true },
};
const TOTAL_CAPITULOS = 11;

const Fundo: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 80% 55% at 50% 45%, #18264A 0%, ${P.fundo} 75%)`,
    }}
  />
);

const Progresso: React.FC = () => {
  const frame = useCurrentFrame();
  const atual = [...CENAS].reverse().find((c) => frame >= c.inicio) ?? CENAS[0];
  const n = CAPITULOS[atual.id].n;
  const doCapitulo = CENAS.filter((c) => CAPITULOS[c.id].n === n);
  const ini = doCapitulo[0].inicio;
  const ultimo = doCapitulo[doCapitulo.length - 1];
  const fim = ultimo.inicio + ultimo.duracao;
  return (
    <Topo
      capitulo={n}
      total={TOTAL_CAPITULOS}
      progresso={Math.min(1, (frame - ini) / (fim - ini))}
    />
  );
};

export const UrnasZeradas: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT, color: P.branco }}>
    <Fundo />
    <Progresso />
    {CENAS.map((c, i) => {
      const cap = CAPITULOS[c.id];
      const Cena = cap.cena;
      const continua = i > 0 && CAPITULOS[CENAS[i - 1].id].n === cap.n;
      return (
        <Sequence
          key={c.id}
          name={c.id}
          from={c.inicio}
          durationInFrames={c.duracao}
        >
          {cap.semTitulo ? null : (
            <Capitulo numero={cap.n} titulo={cap.titulo} animar={!continua} />
          )}
          <Cena />
        </Sequence>
      );
    })}
    <Legenda />
    <Audio src={staticFile("audio/narracao.mp3")} />
    {/* Trilha original (scripts/gerar-trilha.py), ~14 dB abaixo da voz */}
    <Audio src={staticFile("audio/trilha.mp3")} volume={0.09} />
  </AbsoluteFill>
);
