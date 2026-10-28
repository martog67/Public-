import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ESTADOS, Estado } from "./brasil";
import { LEGENDAS } from "./legendas";
import { COR, CONTEUDO, FPS, LARGURA_UTIL, SEGURA, X0 } from "./theme";

export const useEntrada = (atraso = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping } });
};

export const numero = (v: number, casas = 0) =>
  v.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });

// ---------------------------------------------------------------- Cabeçalho

export const Cabecalho: React.FC<{ linhas: readonly string[] }> = ({
  linhas,
}) => (
  <div
    style={{
      position: "absolute",
      top: SEGURA.y0 + 12,
      left: X0,
      width: LARGURA_UTIL,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Img
      src={staticFile("marca/osm-sigla-branco.png")}
      style={{ height: 58 }}
    />
    <div
      style={{
        marginTop: 14,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {linhas.map((l) => (
        <div
          key={l}
          style={{
            background: COR.azul,
            padding: "2px 16px",
            fontSize: 40,
            fontWeight: 800,
            lineHeight: 1.3,
          }}
        >
          {l}
        </div>
      ))}
    </div>
  </div>
);

export const Legenda: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const atual = [...LEGENDAS].reverse().find((l) => t >= l.inicio);
  if (!atual) return null;
  const desde = frame - Math.round(atual.inicio * FPS);
  const o = interpolate(desde, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: 532,
        left: X0,
        width: LARGURA_UTIL,
        textAlign: "center",
        fontSize: 32,
        fontWeight: 600,
        lineHeight: 1.25,
        opacity: o,
        transform: `translateY(${(1 - o) * 8}px)`,
      }}
    >
      {atual.texto}
    </div>
  );
};

export const Fonte: React.FC<{ texto: string }> = ({ texto }) => {
  const o = useEntrada(20);
  return (
    <div
      style={{
        position: "absolute",
        top: CONTEUDO.bottom + 22,
        left: X0,
        width: LARGURA_UTIL,
        textAlign: "center",
        fontSize: 22,
        fontWeight: 500,
        color: COR.textoSuave,
        opacity: o,
      }}
    >
      Fonte: {texto}
    </div>
  );
};

export const Titulo: React.FC<{ rotulo: string; titulo: string }> = ({
  rotulo,
  titulo,
}) => {
  const o = useEntrada(0);
  return (
    <div
      style={{
        position: "absolute",
        top: CONTEUDO.top,
        left: X0,
        width: LARGURA_UTIL,
        opacity: o,
        transform: `translateX(${(1 - o) * -20}px)`,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 2,
          color: COR.azulClaro,
        }}
      >
        {rotulo}
      </div>
      <div style={{ fontSize: 38, fontWeight: 800, marginTop: 4 }}>
        {titulo}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Mapa

export type Camera = { x: number; y: number; zoom: number };

export const BRASIL: Camera = { x: 306, y: 320, zoom: 1 };
export const focoEm = (id: string, zoom: number): Camera => {
  const e = ESTADOS.find((s) => s.id === id)!;
  return { x: e.cx, y: e.cy, zoom };
};

export const mover = (
  frame: number,
  de: Camera,
  para: Camera,
  ini: number,
  dur: number,
): Camera => {
  const p = interpolate(frame, [ini, ini + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  return {
    x: de.x + (para.x - de.x) * e,
    y: de.y + (para.y - de.y) * e,
    zoom: de.zoom + (para.zoom - de.zoom) * e,
  };
};

export type Pino = {
  id: string;
  titulo: string;
  sub?: string;
  cor: string;
  atraso: number;
  // posição no mapa (unidades do SVG); sem ela, o pino fica no centro do estado
  pos?: readonly [number, number];
};

// Extremos do Brasil no mapa (calculados das caixas dos estados)
const LIM = ESTADOS.reduce(
  (a, e) => ({
    x0: Math.min(a.x0, e.bbox[0]),
    x1: Math.max(a.x1, e.bbox[0] + e.bbox[2]),
    y0: Math.min(a.y0, e.bbox[1]),
    y1: Math.max(a.y1, e.bbox[1] + e.bbox[3]),
  }),
  { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity },
);

// Longitude/latitude -> posição aproximada no mapa (interpolação linear pelos extremos do país)
export const lonLat = (lon: number, lat: number): [number, number] => [
  LIM.x0 + ((lon + 73.99) / (73.99 - 34.79)) * (LIM.x1 - LIM.x0),
  LIM.y0 + ((5.27 - lat) / (5.27 + 33.75)) * (LIM.y1 - LIM.y0),
];

export const Mapa: React.FC<{
  camera: Camera;
  destaques: readonly {
    id: string;
    cor: string;
    atraso: number;
    intensidade?: number;
  }[];
  pinos?: readonly Pino[];
  top?: number;
  altura?: number;
}> = ({ camera, destaques, pinos = [], top = CONTEUDO.top, altura = 780 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const largura = LARGURA_UTIL;
  const vbW = 640 / camera.zoom;
  const vbH = (vbW * altura) / largura;
  const k = vbW / largura; // unidades do mapa por pixel da tela
  const viewBox = `${camera.x - vbW / 2} ${camera.y - vbH / 2} ${vbW} ${vbH}`;
  const entrada = spring({ frame, fps, config: { damping: 200 } });

  const brilho = (e: Estado) => {
    const d = destaques.find((x) => x.id === e.id);
    if (!d) return null;
    return {
      cor: d.cor,
      i: d.intensidade ?? 1,
      p: spring({ frame: frame - d.atraso, fps, config: { damping: 200 } }),
    };
  };

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: X0,
        width: largura,
        height: altura,
        opacity: entrada,
        WebkitMaskImage:
          "radial-gradient(ellipse 75% 75% at 50% 50%, black 70%, transparent 100%)",
      }}
    >
      <svg width={largura} height={altura} viewBox={viewBox}>
        {ESTADOS.map((e) => {
          const b = brilho(e);
          return (
            <path
              key={e.id}
              d={e.path}
              fill={b ? b.cor : COR.azulMapa}
              fillOpacity={b ? (0.25 + 0.75 * b.p) * b.i : 1}
              stroke={b && b.p > 0.05 ? "#FFFFFF" : COR.bordaMapa}
              strokeWidth={(b ? 2.5 : 1) * k}
              strokeLinejoin="round"
            />
          );
        })}
        {pinos.map((p) => {
          const est = ESTADOS.find((s) => s.id === p.id)!;
          const e = p.pos ? { cx: p.pos[0], cy: p.pos[1] } : est;
          const s = spring({
            frame: frame - p.atraso,
            fps,
            config: { damping: 14 },
          });
          const haste = 120 * s * k;
          const largCard =
            (Math.max(p.titulo.length, (p.sub ?? "").length) * 17 + 40) * k;
          const altCard = (p.sub ? 82 : 52) * k;
          const yCard = e.cy - haste - altCard;
          return (
            <g key={p.id} opacity={Math.min(1, s * 2)}>
              <line
                x1={e.cx}
                y1={e.cy}
                x2={e.cx}
                y2={e.cy - haste}
                stroke="#FFFFFF"
                strokeWidth={4 * k}
              />
              <circle cx={e.cx} cy={e.cy} r={9 * k} fill="#FFFFFF" />
              <circle
                cx={e.cx}
                cy={e.cy}
                r={(9 + 16 * ((frame / 30) % 1)) * k}
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity={1 - ((frame / 30) % 1)}
                strokeWidth={2 * k}
              />
              <rect
                x={e.cx - largCard / 2}
                y={yCard}
                width={largCard}
                height={altCard}
                rx={12 * k}
                fill={p.cor}
              />
              <text
                x={e.cx}
                y={yCard + 36 * k}
                textAnchor="middle"
                fontSize={28 * k}
                fontWeight={800}
                fill={COR.fundo}
              >
                {p.titulo}
              </text>
              {p.sub ? (
                <text
                  x={e.cx}
                  y={yCard + 68 * k}
                  textAnchor="middle"
                  fontSize={24 * k}
                  fontWeight={700}
                  fill={COR.fundo}
                >
                  {p.sub}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- Barras horizontais

export type Linha = {
  rotulo: string;
  sub?: string;
  valor: number;
  texto: string;
  cor: string;
  atraso: number;
};

export const BarrasH: React.FC<{
  linhas: readonly Linha[];
  max: number;
  top?: number;
  alturaLinha?: number;
  larguraRotulo?: number;
}> = ({
  linhas,
  max,
  top = CONTEUDO.top + 170,
  alturaLinha = 190,
  larguraRotulo = 250,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const trilho = 650 - larguraRotulo;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: X0,
        width: LARGURA_UTIL,
      }}
    >
      {linhas.map((l) => {
        const s = spring({
          frame: frame - l.atraso,
          fps,
          config: { damping: 200 },
        });
        const destaque = spring({
          frame: frame - l.atraso,
          fps,
          config: { damping: 12 },
        });
        return (
          <div
            key={l.rotulo}
            style={{
              display: "flex",
              alignItems: "center",
              height: alturaLinha,
              opacity: interpolate(s, [0, 0.2], [0.25, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div style={{ width: larguraRotulo }}>
              <div style={{ fontSize: 36, fontWeight: 800 }}>{l.rotulo}</div>
              {l.sub ? (
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: COR.textoSuave,
                    marginTop: 2,
                  }}
                >
                  {l.sub}
                </div>
              ) : null}
            </div>
            <div
              style={{
                width: trilho,
                height: 40,
                borderRadius: 20,
                background: "rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  width: Math.max(40, (trilho * l.valor * s) / max),
                  height: 40,
                  borderRadius: 20,
                  background: l.cor,
                  boxShadow: `0 0 ${24 * s}px ${l.cor}66`,
                }}
              />
            </div>
            <div
              style={{
                marginLeft: 18,
                fontSize: 44,
                fontWeight: 900,
                color: l.cor,
                transform: `scale(${0.6 + 0.4 * destaque})`,
                transformOrigin: "left center",
              }}
            >
              {l.texto}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- Barras 3D

export type Coluna = {
  rotulo: string;
  sub: string;
  valor: number;
  texto: string;
  cor: string;
  lateral: string;
  topo: string;
  atraso: number;
};

export const Barras3D: React.FC<{
  colunas: readonly Coluna[];
  max: number;
  alturaMax?: number;
}> = ({ colunas, max, alturaMax = 460 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const base = CONTEUDO.bottom - 120;
  const larg = 170;
  const prof = 34;
  const passo = LARGURA_UTIL / colunas.length;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: base,
          left: X0 + 20,
          width: LARGURA_UTIL - 40,
          height: 3,
          background: COR.linha,
        }}
      />
      {colunas.map((c, i) => {
        const s = spring({
          frame: frame - c.atraso,
          fps,
          config: { damping: 200 },
        });
        const h = Math.max(4, (alturaMax * c.valor * s) / max);
        const x = X0 + passo * i + (passo - larg - prof) / 2;
        return (
          <React.Fragment key={c.rotulo}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: base - h,
                width: larg,
                height: h,
                background: c.cor,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x + larg,
                top: base - h - prof,
                width: prof,
                height: h,
                background: c.lateral,
                transform: "skewY(-45deg)",
                transformOrigin: "left bottom",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x,
                top: base - h - prof,
                width: larg,
                height: prof,
                background: c.topo,
                transform: "skewX(-45deg)",
                transformOrigin: "left bottom",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x - 40,
                width: larg + 80,
                top: base - h - prof - 70,
                textAlign: "center",
                fontSize: 46,
                fontWeight: 900,
                opacity: s,
              }}
            >
              {c.texto}
            </div>
            <div
              style={{
                position: "absolute",
                left: x - 50,
                width: larg + 100,
                top: base + 18,
                textAlign: "center",
                opacity: interpolate(s, [0, 0.2], [0.3, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 800 }}>{c.rotulo}</div>
              <div
                style={{ fontSize: 22, fontWeight: 600, color: COR.azulClaro }}
              >
                {c.sub}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- Pictograma

const Pessoa: React.FC<{ cheia: boolean; cor: string; tamanho: number }> = ({
  cheia,
  cor,
  tamanho,
}) => (
  <svg width={tamanho} height={tamanho * 1.35} viewBox="0 0 40 54">
    <circle
      cx="20"
      cy="11"
      r="9"
      fill={cheia ? cor : "none"}
      stroke={cheia ? cor : COR.azulClaro}
      strokeWidth="2.5"
    />
    <path
      d="M4 52 V36 a16 16 0 0 1 32 0 V52 Z"
      fill={cheia ? cor : "none"}
      stroke={cheia ? cor : COR.azulClaro}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const Pictograma: React.FC<{
  top: number;
  rotulo: string;
  valor: string;
  frase: string;
  total: number;
  porLinha: number;
  cor: string;
  atraso: number;
}> = ({ top, rotulo, valor, frase, total, porLinha, cor, atraso }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - atraso, fps, config: { damping: 200 } });
  const tamanho = Math.min(52, Math.floor(LARGURA_UTIL / porLinha) - 12);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: X0,
        width: LARGURA_UTIL,
        opacity: interpolate(s, [0, 0.3], [0.2, 1], {
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <div style={{ fontSize: 34, fontWeight: 800 }}>{rotulo}</div>
        <div style={{ fontSize: 56, fontWeight: 900, color: cor }}>{valor}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: COR.textoSuave }}>
          {frase}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginTop: 16,
          width: porLinha * (tamanho + 12),
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const si = spring({
            frame: frame - atraso - i * 2,
            fps,
            config: { damping: 200 },
          });
          return (
            <div
              key={i}
              style={{
                opacity: si,
                transform: `translateY(${(1 - si) * 12}px)`,
              }}
            >
              <Pessoa cheia={i === 0} cor={cor} tamanho={tamanho} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Linha do tempo

export type Mandato = {
  de: number;
  ate: number;
  partido: string;
  nome: string;
  atraso: number;
};

export const LinhaTempo: React.FC<{
  top: number;
  estado: string;
  cor: string;
  mandatos: readonly Mandato[];
}> = ({ top, estado, cor, mandatos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inicio = 1999;
  const fim = 2027;
  const larg = LARGURA_UTIL;
  const x = (ano: number) => ((ano - inicio) / (fim - inicio)) * larg;
  return (
    <div style={{ position: "absolute", top, left: X0, width: larg }}>
      <div
        style={{ fontSize: 30, fontWeight: 800, color: cor, marginBottom: 14 }}
      >
        {estado}
      </div>
      <div style={{ position: "relative", height: 150 }}>
        {mandatos.map((m, i) => {
          const s = spring({
            frame: frame - m.atraso,
            fps,
            config: { damping: 200 },
          });
          return (
            <div
              key={m.de}
              style={{
                position: "absolute",
                left: x(m.de) + 3,
                width: (x(m.ate + 1) - x(m.de) - 6) * s,
                height: 70,
                borderRadius: 10,
                background: cor,
                opacity: 0.45 + 0.55 * (i % 2 === 0 ? 1 : 0.7),
                overflow: "hidden",
                color: COR.fundo,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                fontWeight: 900,
              }}
            >
              {s > 0.6 ? m.partido : ""}
            </div>
          );
        })}
        {mandatos.map((m) => {
          const s = spring({
            frame: frame - m.atraso - 8,
            fps,
            config: { damping: 200 },
          });
          return (
            <div
              key={`n${m.de}`}
              style={{
                position: "absolute",
                top: 80,
                left: x(m.de) + 3,
                width: x(m.ate + 1) - x(m.de) - 6,
                textAlign: "center",
                fontSize: 21,
                fontWeight: 700,
                lineHeight: 1.2,
                opacity: s,
              }}
            >
              {m.nome}
              <div style={{ color: COR.textoSuave, fontWeight: 600 }}>
                {m.de}–{m.ate}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Cartão de tendência

export const Tendencia: React.FC<{
  top: number;
  estado: string;
  cor: string;
  itens: readonly {
    rotulo: string;
    de: string;
    para: string;
    subiu: boolean;
  }[];
  atraso: number;
}> = ({ top, estado, cor, itens, atraso }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - atraso, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: X0,
        width: LARGURA_UTIL,
        padding: "22px 28px",
        borderRadius: 24,
        border: `2px solid ${cor}`,
        background: "rgba(255,255,255,0.05)",
        boxSizing: "border-box",
        opacity: interpolate(s, [0, 0.3], [0.15, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `translateY(${(1 - s) * 30}px)`,
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 800, color: cor }}>{estado}</div>
      {itens.map((it, i) => {
        const si = spring({
          frame: frame - atraso - 15 - i * 20,
          fps,
          config: { damping: 12 },
        });
        return (
          <div
            key={it.rotulo}
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 16,
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            <div style={{ width: 330 }}>{it.rotulo}</div>
            <div style={{ color: COR.textoSuave, width: 170 }}>{it.de}</div>
            <div
              style={{
                width: 50,
                fontSize: 34,
                color: it.subiu ? COR.amarelo : COR.verdeClaro,
                transform: `scale(${si})`,
              }}
            >
              {it.subiu ? "▲" : "▼"}
            </div>
            <div
              style={{
                fontWeight: 900,
                color: it.subiu ? COR.amarelo : COR.verdeClaro,
              }}
            >
              {it.para}
            </div>
          </div>
        );
      })}
    </div>
  );
};
