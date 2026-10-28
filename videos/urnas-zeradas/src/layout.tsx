import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LEGENDAS } from "./legendas";
import { FPS, LARGURA_UTIL, SEGURA, X0 } from "./theme";

// Paleta do "dossiê": fundo escuro, cartões cor de papel, cores do avatar do OSM
export const P = {
  fundo: "#0A0F1F",
  papel: "#F6F4EE",
  branco: "#FFFFFF",
  tinta: "#10172A",
  tintaSuave: "#5A6378",
  linhaPapel: "#DAD6CB",
  azul: "#2F6BE8",
  azulClaro: "#9DB8F5",
  verde: "#3E9B34",
  amarelo: "#F2C232",
  ambar: "#D99A00",
  textoSuave: "rgba(255,255,255,0.7)",
};

// Candidaturas (cores neutras, sem cor partidária)
export const LULA = P.azul;
export const FLAVIO = P.ambar;

// Grade vertical da tela (tudo dentro da área segura: y 250–1500)
export const G = {
  topo: SEGURA.y0 + 14,
  progresso: 340,
  capitulo: 366,
  cartao: { top: 512, altura: 816 },
  legenda: { top: 1348, altura: 140 },
};
export const PAD = 32;
export const INTERNO = LARGURA_UTIL - 2 * PAD; // largura útil dentro do cartão

export const useMola = (atraso = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping } });
};

export const aparece = (frame: number, ini: number, dur = 12) =>
  interpolate(frame, [ini, ini + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const fmt = (v: number, casas = 0) =>
  v.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });

// ---------------------------------------------------------------- Topo fixo

export const Topo: React.FC<{
  capitulo: number;
  total: number;
  progresso: number;
}> = ({ capitulo, total, progresso }) => (
  <>
    <div
      style={{
        position: "absolute",
        top: G.topo,
        left: X0,
        width: LARGURA_UTIL,
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Img
        src={staticFile("marca/osm-sigla-branco.png")}
        style={{ height: 52 }}
      />
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 3,
          color: P.amarelo,
        }}
      >
        ELEIÇÕES 2026
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        top: G.progresso,
        left: X0,
        width: LARGURA_UTIL,
        display: "flex",
        gap: 6,
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const fill = n < capitulo ? 1 : n === capitulo ? progresso : 0;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              background: "rgba(255,255,255,0.15)",
            }}
          >
            <div
              style={{
                width: `${fill * 100}%`,
                height: 6,
                borderRadius: 3,
                background:
                  n === capitulo ? P.amarelo : "rgba(255,255,255,0.55)",
              }}
            />
          </div>
        );
      })}
    </div>
  </>
);

// ---------------------------------------------------------------- Capítulo

export const Capitulo: React.FC<{
  numero: number;
  titulo: string;
  animar: boolean;
}> = ({ numero, titulo, animar }) => {
  const s = useMola(0);
  const p = animar ? s : 1;
  return (
    <div
      style={{
        position: "absolute",
        top: G.capitulo,
        left: X0,
        width: LARGURA_UTIL,
        height: 120,
        display: "flex",
        alignItems: "center",
        gap: 24,
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 900,
          color: P.amarelo,
          letterSpacing: -3,
          width: 130,
          opacity: p,
          transform: `translateY(${(1 - p) * 30}px)`,
        }}
      >
        {String(numero).padStart(2, "0")}
      </div>
      <div
        style={{
          fontSize: 50,
          fontWeight: 800,
          lineHeight: 1.05,
          opacity: p,
          transform: `translateX(${(1 - p) * 30}px)`,
        }}
      >
        {titulo}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Cartão

export const Cartao: React.FC<{
  fonte: string;
  escuro?: boolean;
  children: React.ReactNode;
}> = ({ fonte, escuro = false, children }) => {
  const s = useMola(0);
  return (
    <div
      style={{
        position: "absolute",
        top: G.cartao.top,
        left: X0,
        width: LARGURA_UTIL,
        height: G.cartao.altura,
        borderRadius: 28,
        background: escuro ? "#141C33" : P.papel,
        color: escuro ? P.branco : P.tinta,
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        overflow: "hidden",
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px) scale(${0.97 + 0.03 * s})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: PAD,
          top: PAD,
          width: INTERNO,
          height: G.cartao.altura - 2 * PAD - 40,
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          left: PAD,
          bottom: 22,
          width: INTERNO,
          fontSize: 20,
          fontWeight: 600,
          color: escuro ? "rgba(255,255,255,0.55)" : P.tintaSuave,
          borderTop: `1px solid ${escuro ? "rgba(255,255,255,0.15)" : P.linhaPapel}`,
          paddingTop: 10,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Fonte: {fonte}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Legenda

export const Legenda: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const atual = [...LEGENDAS].reverse().find((l) => t >= l.inicio);
  if (!atual) return null;
  const o = aparece(frame, Math.round(atual.inicio * FPS), 6);
  return (
    <div
      style={{
        position: "absolute",
        top: G.legenda.top,
        left: X0,
        width: LARGURA_UTIL,
        height: G.legenda.altura,
        display: "flex",
        alignItems: "center",
        gap: 22,
      }}
    >
      <div
        style={{
          width: 8,
          alignSelf: "stretch",
          margin: "18px 0",
          borderRadius: 4,
          background: P.amarelo,
        }}
      />
      <div
        style={{
          fontSize: 40,
          fontWeight: 800,
          lineHeight: 1.2,
          opacity: o,
          transform: `translateY(${(1 - o) * 10}px)`,
        }}
      >
        {atual.texto}
      </div>
    </div>
  );
};
