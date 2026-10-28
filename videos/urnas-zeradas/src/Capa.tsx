import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { AMARELO_EXPLICA, Estrela, PRETO_EXPLICA } from "./cenas";
import { FONT, FONT_EXPLICA, LARGURA_UTIL, X0 } from "./theme";

// Capa do Reels (1080×1920). Tudo fica entre y 300 e 1480: dentro da área segura
// e do recorte 3:4 da grade do perfil.
const Destaque: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: AMARELO_EXPLICA }}>{children}</span>
);

export const Capa: React.FC = () => (
  <AbsoluteFill
    style={{ background: PRETO_EXPLICA, fontFamily: FONT, color: "#FFFFFF" }}
  >
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", opacity: 0.1 }}
    >
      <filter id="ruido">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves={2}
          seed={2}
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={1080} height={1920} filter="url(#ruido)" />
    </svg>

    {/* assinatura OSM Explica */}
    <Estrela x={862} y={350} tamanho={110} giro={12} escala={1} />
    <div
      style={{
        position: "absolute",
        top: 380,
        left: X0,
        width: LARGURA_UTIL,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Img
        src={staticFile("marca/osm-nome-completo-recorte.png")}
        style={{ width: 520 }}
      />
      <div
        style={{
          marginTop: 26,
          background: AMARELO_EXPLICA,
          color: PRETO_EXPLICA,
          fontFamily: FONT_EXPLICA,
          fontSize: 120,
          lineHeight: 1.05,
          letterSpacing: 3,
          padding: "4px 38px 0",
          clipPath:
            "polygon(0% 6%, 7% 0%, 16% 5%, 28% 1%, 41% 4%, 55% 0%, 68% 5%, 82% 1%, 93% 4%, 100% 0%, 98% 30%, 100% 62%, 97% 100%, 85% 95%, 71% 100%, 58% 96%, 44% 100%, 30% 95%, 17% 100%, 6% 96%, 0% 100%, 2% 66%, 0% 34%)",
          transform: "rotate(-1.5deg)",
        }}
      >
        EXPLICA
      </div>
    </div>

    {/* manchete */}
    <div
      style={{
        position: "absolute",
        top: 760,
        left: X0,
        width: LARGURA_UTIL,
        fontFamily: FONT_EXPLICA,
        textAlign: "center",
        lineHeight: 0.98,
        textTransform: "uppercase",
      }}
    >
      <div style={{ fontSize: 112 }}>Flávio Bolsonaro</div>
      <div style={{ fontSize: 112, marginTop: 10 }}>
        teve{" "}
        {/* o zero vai numa etiqueta amarela para não ser lido como a letra O */}
        <span
          style={{
            display: "inline-block",
            background: AMARELO_EXPLICA,
            color: PRETO_EXPLICA,
            padding: "2px 22px 0",
            margin: "0 6px",
            transform: "rotate(-3deg)",
            fontVariantNumeric: "slashed-zero",
          }}
        >
          0
        </span>{" "}
        <Destaque>votos</Destaque>
      </div>
      <div style={{ fontSize: 112, marginTop: 10 }}>
        em <Destaque>106 urnas</Destaque>
      </div>
    </div>

    {/* contexto e fonte do número */}
    <div
      style={{
        position: "absolute",
        top: 1215,
        left: X0,
        width: LARGURA_UTIL,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 700 }}>
        Lula somou 14.860 votos nelas
      </div>
      <div
        style={{
          height: 4,
          width: 120,
          background: AMARELO_EXPLICA,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: "rgba(255,255,255,0.65)",
          textAlign: "center",
        }}
      >
        2º turno 2026 · boletins de urna do TSE · levantamento Paris Group
        (Folha)
      </div>
    </div>
  </AbsoluteFill>
);
