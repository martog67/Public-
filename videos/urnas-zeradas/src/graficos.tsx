import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { numero } from "./componentes";
import { COR, LARGURA_UTIL, X0 } from "./theme";

const useMola = (atraso: number, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping } });
};

// ---------------------------------------------------------------- Número grande com contagem

export const Contador: React.FC<{
  top: number;
  valor: number;
  casas?: number;
  sufixo?: string;
  atraso: number;
  tamanho?: number;
  cor?: string;
  legenda?: string;
}> = ({
  top,
  valor,
  casas = 0,
  sufixo = "",
  atraso,
  tamanho = 160,
  cor = COR.texto,
  legenda,
}) => {
  const frame = useCurrentFrame();
  const s = useMola(atraso);
  const v = interpolate(frame, [atraso, atraso + 40], [0, valor], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: X0,
        width: LARGURA_UTIL,
        textAlign: "center",
        opacity: s,
        transform: `scale(${0.85 + 0.15 * s})`,
      }}
    >
      <div
        style={{
          fontSize: tamanho,
          fontWeight: 900,
          letterSpacing: -3,
          lineHeight: 1,
          color: cor,
        }}
      >
        {numero(v, casas)}
        {sufixo ? (
          <span style={{ fontSize: tamanho * 0.45 }}>{sufixo}</span>
        ) : null}
      </div>
      {legenda ? (
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            marginTop: 10,
            color: COR.textoSuave,
          }}
        >
          {legenda}
        </div>
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------- Selo (pílula)

export const Selo: React.FC<{
  top: number;
  texto: string;
  atraso: number;
  fundo?: string;
  cor?: string;
}> = ({ top, texto, atraso, fundo = COR.texto, cor = COR.azul }) => {
  const s = useMola(atraso, 14);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: X0,
        width: LARGURA_UTIL,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: fundo,
          color: cor,
          fontSize: 32,
          fontWeight: 800,
          padding: "10px 28px",
          borderRadius: 40,
          opacity: Math.min(1, s * 2),
          transform: `scale(${s})`,
        }}
      >
        {texto}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Grade de 106 urnas

const Urna: React.FC<{ largura: number; cheia: boolean }> = ({
  largura,
  cheia,
}) => (
  <svg width={largura} height={largura * 0.86} viewBox="0 0 50 43">
    <rect
      x="1.5"
      y="6"
      width="47"
      height="35"
      rx="5"
      fill={cheia ? COR.azul : "none"}
      stroke={COR.azulClaro}
      strokeWidth="2.5"
    />
    <rect
      x="7"
      y="12"
      width="20"
      height="13"
      rx="2"
      fill={cheia ? COR.fundo : "none"}
      stroke={COR.azulClaro}
      strokeWidth="2"
    />
    <text
      x="17"
      y="23.5"
      textAnchor="middle"
      fontSize="11"
      fontWeight={900}
      fill={COR.amarelo}
    >
      {cheia ? "0" : ""}
    </text>
    {[0, 1, 2].map((r) =>
      [0, 1].map((c) => (
        <rect
          key={`${r}${c}`}
          x={32 + c * 7}
          y={12 + r * 6}
          width="5"
          height="4"
          rx="1"
          fill={COR.azulClaro}
        />
      )),
    )}
    <rect x="12" y="1.5" width="26" height="5" rx="2" fill={COR.azulClaro} />
  </svg>
);

export const GradeUrnas: React.FC<{
  top: number;
  total: number;
  colunas: number;
  atraso: number;
}> = ({ top, total, colunas, atraso }) => {
  const frame = useCurrentFrame();
  const gap = 10;
  const larg = Math.floor((LARGURA_UTIL - gap * (colunas - 1)) / colunas);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: X0,
        width: LARGURA_UTIL,
        display: "flex",
        flexWrap: "wrap",
        gap,
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const t = atraso + i * 0.5;
        const p = interpolate(frame, [t, t + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              opacity: 0.25 + 0.75 * p,
              transform: `scale(${0.8 + 0.2 * p})`,
            }}
          >
            <Urna largura={larg} cheia={p > 0.5} />
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- Cartão de citação

export const CartaoFonte: React.FC<{
  top: number;
  veiculo: string;
  titulo: string;
  atraso: number;
}> = ({ top, veiculo, titulo, atraso }) => {
  const s = useMola(atraso);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: X0,
        width: LARGURA_UTIL,
        boxSizing: "border-box",
        padding: "20px 26px",
        borderRadius: 20,
        border: `2px solid ${COR.linha}`,
        borderLeft: `8px solid ${COR.amarelo}`,
        background: "rgba(255,255,255,0.06)",
        opacity: s,
        transform: `translateY(${(1 - s) * 20}px)`,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 1.5,
          color: COR.amarelo,
        }}
      >
        {veiculo}
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, marginTop: 6 }}>
        {titulo}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Boletim de urna

export type LinhaBoletim = {
  rotulo: string;
  votos: number;
  destaque?: boolean;
  atraso?: number;
};

export const Boletim: React.FC<{
  top: number;
  cabecalho: readonly string[];
  linhas: readonly LinhaBoletim[];
  atraso: number;
}> = ({ top, cabecalho, linhas, atraso }) => {
  const frame = useCurrentFrame();
  const s = useMola(atraso);
  const altura = interpolate(s, [0, 1], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: X0 + 90,
        width: LARGURA_UTIL - 180,
        background: "#F4F6FB",
        color: "#111A33",
        fontFamily: "'DejaVu Sans Mono', monospace",
        padding: "22px 30px 26px",
        boxSizing: "border-box",
        clipPath: `inset(0 0 ${(1 - altura) * 100}% 0)`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
      }}
    >
      {cabecalho.map((c, i) => (
        <div
          key={c}
          style={{
            textAlign: "center",
            fontSize: i === 0 ? 26 : 21,
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          {c}
        </div>
      ))}
      <div style={{ borderTop: "2px dashed #9AA6C4", margin: "12px 0" }} />
      {linhas.map((l) => {
        const v = interpolate(
          frame,
          [l.atraso ?? atraso, (l.atraso ?? atraso) + 30],
          [0, l.votos],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        const d = l.destaque
          ? interpolate(
              frame,
              [l.atraso ?? atraso, (l.atraso ?? atraso) + 8],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          : 0;
        return (
          <div
            key={l.rotulo}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1.6,
              padding: "0 8px",
              background: `rgba(242,194,50,${0.55 * d})`,
            }}
          >
            <span>{l.rotulo}</span>
            <span>{numero(Math.round(v))}</span>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- Quadradinhos (waffle)

export type Categoria = {
  rotulo: string;
  n: number;
  cor: string;
  atraso: number;
};

export const Quadradinhos: React.FC<{
  top: number;
  categorias: readonly Categoria[];
  colunas: number;
}> = ({ top, categorias, colunas }) => {
  const frame = useCurrentFrame();
  const gap = 7;
  const lado = Math.floor((LARGURA_UTIL - gap * (colunas - 1)) / colunas);
  const celulas: { cor: string; atraso: number }[] = [];
  categorias.forEach((c) => {
    for (let i = 0; i < c.n; i++)
      celulas.push({ cor: c.cor, atraso: c.atraso + i * 0.6 });
  });
  const linhasGrade = Math.ceil(celulas.length / colunas);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top,
          left: X0,
          width: LARGURA_UTIL,
          display: "flex",
          flexWrap: "wrap",
          gap,
        }}
      >
        {celulas.map((c, i) => {
          const p = interpolate(frame, [c.atraso, c.atraso + 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                width: lado,
                height: lado,
                borderRadius: 6,
                background: p > 0 ? c.cor : "transparent",
                border: `2px solid ${p > 0 ? c.cor : COR.linha}`,
                boxSizing: "border-box",
                opacity: 0.3 + 0.7 * p,
                transform: `scale(${0.6 + 0.4 * p})`,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: top + linhasGrade * (lado + gap) + 26,
          left: X0,
          width: LARGURA_UTIL,
        }}
      >
        {categorias.map((c) => {
          const p = interpolate(frame, [c.atraso, c.atraso + 10], [0.25, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={c.rotulo}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 32,
                fontWeight: 700,
                lineHeight: 1.6,
                opacity: p,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: c.cor,
                }}
              />
              <div style={{ flex: 1 }}>{c.rotulo}</div>
              <div style={{ fontWeight: 900, fontSize: 38 }}>{c.n}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- Grade de 100 pontos

export const Grade100: React.FC<{
  left: number;
  top: number;
  largura: number;
  valor: number;
  texto: string;
  rotulo: string;
  sub: string;
  cor: string;
  atraso: number;
}> = ({ left, top, largura, valor, texto, rotulo, sub, cor, atraso }) => {
  const frame = useCurrentFrame();
  const s = useMola(atraso);
  const gap = 8;
  const d = (largura - gap * 9) / 10;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: largura,
        opacity: 0.3 + 0.7 * s,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: cor,
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        {texto}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap, marginTop: 22 }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const parcial = Math.max(0, Math.min(1, valor - i));
          const p = interpolate(
            frame,
            [atraso + i * 0.6, atraso + i * 0.6 + 6],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <div
              key={i}
              style={{
                width: d,
                height: d,
                borderRadius: d,
                border: `2px solid ${COR.linha}`,
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {parcial > 0 ? (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${parcial * 100 * p}%`,
                    background: cor,
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", marginTop: 18 }}>
        <div style={{ fontSize: 30, fontWeight: 800 }}>{rotulo}</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: COR.azulClaro }}>
          {sub}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Ranking compacto em duas colunas

export type ItemRanking = { nome: string; n: number; atraso: number };

export const Ranking: React.FC<{
  top: number;
  itens: readonly ItemRanking[];
  max: number;
}> = ({ top, itens, max }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const porColuna = Math.ceil(itens.length / 2);
  const larg = (LARGURA_UTIL - 30) / 2;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: X0,
        width: LARGURA_UTIL,
        display: "flex",
        gap: 30,
      }}
    >
      {[0, 1].map((col) => (
        <div key={col} style={{ width: larg }}>
          {itens.slice(col * porColuna, (col + 1) * porColuna).map((it, j) => {
            const pos = col * porColuna + j + 1;
            const s = spring({
              frame: frame - it.atraso,
              fps,
              config: { damping: 200 },
            });
            return (
              <div
                key={it.nome}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 62,
                  gap: 10,
                  opacity: 0.25 + 0.75 * s,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    background: pos <= 3 ? COR.texto : "rgba(255,255,255,0.12)",
                    color: pos <= 3 ? COR.fundo : COR.texto,
                    fontSize: 20,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {pos}º
                </div>
                <div
                  style={{
                    width: 175,
                    fontSize: 24,
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  {it.nome}
                </div>
                <div style={{ flex: 1, height: 16, borderRadius: 8 }}>
                  <div
                    style={{
                      width: `${(100 * it.n * s) / max}%`,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 8,
                      background: pos <= 3 ? COR.texto : COR.azulClaro,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 36,
                    textAlign: "right",
                    fontSize: 26,
                    fontWeight: 900,
                  }}
                >
                  {it.n}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
