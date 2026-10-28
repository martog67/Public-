import React, { useId } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ESTADOS } from "./brasil";
import { INTERNO, P, aparece, fmt, useMola } from "./layout";

// ---------------------------------------------------------------- Mapa inteiro (com lupa opcional)

const LIM = ESTADOS.reduce(
  (a, e) => ({
    x0: Math.min(a.x0, e.bbox[0]),
    x1: Math.max(a.x1, e.bbox[0] + e.bbox[2]),
    y0: Math.min(a.y0, e.bbox[1]),
    y1: Math.max(a.y1, e.bbox[1] + e.bbox[3]),
  }),
  { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity },
);

// Longitude/latitude -> posição aproximada no mapa (interpolação pelos extremos do país)
export const lonLat = (lon: number, lat: number): [number, number] => [
  LIM.x0 + ((lon + 73.99) / (73.99 - 34.79)) * (LIM.x1 - LIM.x0),
  LIM.y0 + ((5.27 - lat) / (5.27 + 33.75)) * (LIM.y1 - LIM.y0),
];

const centro = (id: string): [number, number] => {
  const e = ESTADOS.find((s) => s.id === id)!;
  return [e.cx, e.cy];
};

export type PinoMapa = {
  id?: string;
  pos?: [number, number];
  titulo: string;
  sub?: string;
  atraso: number;
  // lado do cartão em relação ao ponto (padrão: em cima)
  lado?: "cima" | "baixo" | "esquerda" | "direita";
};
export type Lupa = {
  pos: [number, number];
  zoom: number;
  x: number;
  y: number;
  r: number;
  atraso: number;
};

export const MapaBrasil: React.FC<{
  left: number;
  top: number;
  largura: number;
  altura: number;
  destaques: readonly {
    id: string;
    cor: string;
    intensidade?: number;
    atraso: number;
  }[];
  pinos?: readonly PinoMapa[];
  lupa?: Lupa;
}> = ({ left, top, largura, altura, destaques, pinos = [], lupa }) => {
  const frame = useCurrentFrame();
  const clip = useId();
  // viewBox com a mesma proporção da caixa, com o Brasil inteiro centralizado
  const margem = 8;
  const bw = LIM.x1 - LIM.x0 + 2 * margem;
  const bh = LIM.y1 - LIM.y0 + 2 * margem;
  const k = Math.max(bw / largura, bh / altura); // unidades por pixel
  const vbW = largura * k;
  const vbH = altura * k;
  const vbX = (LIM.x0 + LIM.x1) / 2 - vbW / 2;
  const vbY = (LIM.y0 + LIM.y1) / 2 - vbH / 2;
  const entrada = useMola(0);

  const paths = (escala: number) =>
    ESTADOS.map((e) => {
      const d = destaques.find((x) => x.id === e.id);
      const p = d ? aparece(frame, d.atraso, 15) * (d.intensidade ?? 1) : 0;
      return (
        <g key={e.id}>
          <path
            d={e.path}
            fill="#DCE3F1"
            stroke="#FFFFFF"
            strokeWidth={1.2 * k * escala}
            strokeLinejoin="round"
          />
          {d ? (
            <path
              d={e.path}
              fill={d.cor}
              fillOpacity={p}
              stroke="#FFFFFF"
              strokeWidth={1.2 * k * escala}
              strokeLinejoin="round"
            />
          ) : null}
        </g>
      );
    });

  const lupaP = lupa ? aparece(frame, lupa.atraso, 18) : 0;
  const lupaC: [number, number] | null = lupa
    ? [vbX + lupa.x * k, vbY + lupa.y * k]
    : null;

  return (
    <svg
      width={largura}
      height={altura}
      viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
      style={{
        position: "absolute",
        left,
        top,
        opacity: entrada,
        overflow: "visible",
      }}
    >
      {paths(1)}
      {pinos.map((pn) => {
        const [x, y] = pn.pos ?? centro(pn.id!);
        const s = aparece(frame, pn.atraso, 12);
        const lw =
          (Math.max(pn.titulo.length, (pn.sub ?? "").length) * 15 + 36) * k;
        const lh = (pn.sub ? 74 : 46) * k;
        const haste = 54 * k * s;
        const lado = pn.lado ?? "cima";
        const vertical = lado === "cima" || lado === "baixo";
        // ponta da haste, no lado escolhido
        const [hx, hy] =
          lado === "cima"
            ? [x, y - haste]
            : lado === "baixo"
              ? [x, y + haste]
              : lado === "esquerda"
                ? [x - haste, y]
                : [x + haste, y];
        const lx0 = vertical ? x - lw / 2 : lado === "esquerda" ? hx - lw : hx;
        const ly0 =
          lado === "cima" ? hy - lh : lado === "baixo" ? hy : y - lh / 2;
        // o cartão nunca sai do mapa
        const lx = Math.min(Math.max(lx0, vbX), vbX + vbW - lw);
        const ly = Math.min(Math.max(ly0, vbY), vbY + vbH - lh);
        return (
          <g key={pn.titulo} opacity={s}>
            <line
              x1={x}
              y1={y}
              x2={hx}
              y2={hy}
              stroke={P.tinta}
              strokeWidth={3 * k}
            />
            <circle
              cx={x}
              cy={y}
              r={8 * k}
              fill={P.tinta}
              stroke="#FFFFFF"
              strokeWidth={3 * k}
            />
            <rect
              x={lx}
              y={ly}
              width={lw}
              height={lh}
              rx={10 * k}
              fill={P.tinta}
            />
            <text
              x={lx + lw / 2}
              y={ly + 32 * k}
              textAnchor="middle"
              fontSize={26 * k}
              fontWeight={800}
              fill="#FFFFFF"
            >
              {pn.titulo}
            </text>
            {pn.sub ? (
              <text
                x={lx + lw / 2}
                y={ly + 62 * k}
                textAnchor="middle"
                fontSize={22 * k}
                fontWeight={600}
                fill={P.amarelo}
              >
                {pn.sub}
              </text>
            ) : null}
          </g>
        );
      })}
      {lupa && lupaC ? (
        <g opacity={lupaP}>
          <line
            x1={lupa.pos[0]}
            y1={lupa.pos[1]}
            x2={lupaC[0]}
            y2={lupaC[1]}
            stroke={P.tinta}
            strokeWidth={3 * k}
            strokeDasharray={`${8 * k} ${6 * k}`}
          />
          <circle
            cx={lupa.pos[0]}
            cy={lupa.pos[1]}
            r={14 * k}
            fill="none"
            stroke={P.tinta}
            strokeWidth={3 * k}
          />
          <clipPath id={clip}>
            <circle cx={lupaC[0]} cy={lupaC[1]} r={lupa.r * k * lupaP} />
          </clipPath>
          <circle
            cx={lupaC[0]}
            cy={lupaC[1]}
            r={lupa.r * k * lupaP}
            fill="#EEF2FA"
          />
          <g clipPath={`url(#${clip})`}>
            <g
              transform={`translate(${lupaC[0]} ${lupaC[1]}) scale(${lupa.zoom}) translate(${-lupa.pos[0]} ${-lupa.pos[1]})`}
            >
              {paths(1 / lupa.zoom)}
              <circle
                cx={lupa.pos[0]}
                cy={lupa.pos[1]}
                r={(9 * k) / lupa.zoom}
                fill={P.tinta}
                stroke="#FFFFFF"
                strokeWidth={(3 * k) / lupa.zoom}
              />
            </g>
          </g>
          <circle
            cx={lupaC[0]}
            cy={lupaC[1]}
            r={lupa.r * k * lupaP}
            fill="none"
            stroke={P.tinta}
            strokeWidth={6 * k}
          />
        </g>
      ) : null}
    </svg>
  );
};

// ---------------------------------------------------------------- Texto de apoio

export const Rotulo: React.FC<{
  top: number;
  texto: string;
  cor?: string;
  tamanho?: number;
  atraso?: number;
}> = ({ top, texto, cor = P.tintaSuave, tamanho = 24, atraso = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: INTERNO,
        fontSize: tamanho,
        fontWeight: 800,
        letterSpacing: tamanho < 30 ? 1.5 : 0,
        color: cor,
        lineHeight: 1.2,
        opacity: aparece(frame, atraso),
      }}
    >
      {texto}
    </div>
  );
};

export const Pilula: React.FC<{
  top: number;
  texto: string;
  atraso: number;
  fundo: string;
  cor?: string;
  alinhar?: "left" | "center";
}> = ({ top, texto, atraso, fundo, cor = "#FFFFFF", alinhar = "center" }) => {
  const s = useMola(atraso, 14);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: INTERNO,
        display: "flex",
        justifyContent: alinhar === "center" ? "center" : "flex-start",
      }}
    >
      <div
        style={{
          background: fundo,
          color: cor,
          fontSize: 32,
          fontWeight: 800,
          padding: "10px 26px",
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

// ---------------------------------------------------------------- Número grande

export const NumeroGrande: React.FC<{
  top: number;
  valor: number;
  casas?: number;
  sufixo?: string;
  atraso: number;
  tamanho: number;
  cor?: string;
}> = ({
  top,
  valor,
  casas = 0,
  sufixo = "",
  atraso,
  tamanho,
  cor = P.tinta,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [atraso, atraso + 40], [0, valor], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: INTERNO,
        fontSize: tamanho,
        fontWeight: 900,
        letterSpacing: -4,
        lineHeight: 1,
        color: cor,
        opacity: aparece(frame, atraso, 8),
      }}
    >
      {fmt(v, casas)}
      {sufixo ? (
        <span style={{ fontSize: tamanho * 0.45 }}>{sufixo}</span>
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------- Grade de urnas

const Urna: React.FC<{ largura: number; acesa: number }> = ({
  largura,
  acesa,
}) => (
  <svg width={largura} height={largura * 0.86} viewBox="0 0 50 43">
    <rect
      x="1.5"
      y="6"
      width="47"
      height="35"
      rx="5"
      fill={acesa > 0.5 ? P.tinta : "none"}
      stroke={P.tinta}
      strokeOpacity={0.25 + 0.75 * acesa}
      strokeWidth="2.5"
    />
    <rect
      x="7"
      y="12"
      width="20"
      height="13"
      rx="2"
      fill={acesa > 0.5 ? P.papel : "none"}
      stroke={acesa > 0.5 ? P.papel : P.tinta}
      strokeOpacity={0.3 + 0.7 * acesa}
      strokeWidth="2"
    />
    {acesa > 0.5 ? (
      <text
        x="17"
        y="23.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight={900}
        fill={P.ambar}
      >
        0
      </text>
    ) : null}
    {[0, 1, 2].map((r) =>
      [0, 1].map((c) => (
        <rect
          key={`${r}${c}`}
          x={32 + c * 7}
          y={12 + r * 6}
          width="5"
          height="4"
          rx="1"
          fill={acesa > 0.5 ? P.azulClaro : P.linhaPapel}
        />
      )),
    )}
  </svg>
);

export const GradeUrnas: React.FC<{
  top: number;
  total: number;
  colunas: number;
  atraso: number;
}> = ({ top, total, colunas, atraso }) => {
  const frame = useCurrentFrame();
  const gap = 8;
  const larg = Math.floor((INTERNO - gap * (colunas - 1)) / colunas);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: INTERNO,
        display: "flex",
        flexWrap: "wrap",
        gap,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <Urna
          key={i}
          largura={larg}
          acesa={aparece(frame, atraso + i * 0.45, 6)}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------- Recorte de jornal + carimbo

export const Recorte: React.FC<{
  top: number;
  veiculo: string;
  data: string;
  manchete: string;
  credito: string;
}> = ({ top, veiculo, data, manchete, credito }) => {
  const s = useMola(0);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 30,
        width: INTERNO - 60,
        background: "#FFFFFF",
        padding: "28px 32px",
        boxSizing: "border-box",
        boxShadow: "0 12px 30px rgba(16,23,42,0.18)",
        transform: `rotate(${-1.5 * s}deg) translateY(${(1 - s) * 30}px)`,
        opacity: s,
        clipPath:
          "polygon(0 2%, 4% 0, 30% 1.5%, 60% 0, 96% 1%, 100% 3%, 99% 97%, 95% 100%, 70% 98.5%, 40% 100%, 3% 98.5%, 0 96%)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          fontWeight: 700,
          color: P.tintaSuave,
          borderBottom: `2px solid ${P.tinta}`,
          paddingBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, 'DejaVu Serif', serif",
            fontSize: 30,
            fontWeight: 700,
            color: P.tinta,
          }}
        >
          {veiculo}
        </span>
        <span>{data}</span>
      </div>
      <div
        style={{
          fontFamily: "Georgia, 'DejaVu Serif', serif",
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1.2,
          marginTop: 18,
        }}
      >
        {manchete}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: P.tintaSuave,
          marginTop: 16,
        }}
      >
        {credito}
      </div>
    </div>
  );
};

export const Carimbo: React.FC<{
  top: number;
  texto: string;
  atraso: number;
}> = ({ top, texto, atraso }) => {
  const s = useMola(atraso, 10);
  const frame = useCurrentFrame();
  if (frame < atraso) return null;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: INTERNO,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          border: `6px solid ${P.verde}`,
          color: P.verde,
          fontSize: 34,
          fontWeight: 900,
          letterSpacing: 2,
          padding: "10px 24px",
          borderRadius: 10,
          transform: `rotate(-6deg) scale(${2 - s})`,
          opacity: Math.min(1, s * 1.5),
          background: "rgba(246,244,238,0.85)",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

export const Fichas: React.FC<{
  top: number;
  itens: readonly { valor: string; rotulo: string; atraso: number }[];
}> = ({ top, itens }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: INTERNO,
        display: "flex",
        gap: 16,
      }}
    >
      {itens.map((it) => {
        const p = aparece(frame, it.atraso);
        return (
          <div
            key={it.rotulo}
            style={{
              flex: 1,
              background: P.tinta,
              color: "#FFFFFF",
              borderRadius: 18,
              padding: "18px 10px",
              textAlign: "center",
              opacity: p,
              transform: `translateY(${(1 - p) * 20}px)`,
            }}
          >
            <div style={{ fontSize: 46, fontWeight: 900, color: P.amarelo }}>
              {it.valor}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{it.rotulo}</div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- Ranking

export const Ranking: React.FC<{
  top: number;
  itens: readonly { nome: string; n: number; atraso: number }[];
  max: number;
}> = ({ top, itens, max }) => {
  const frame = useCurrentFrame();
  const porColuna = Math.ceil(itens.length / 2);
  const gapCol = 30;
  const larg = (INTERNO - gapCol) / 2;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: INTERNO,
        display: "flex",
        gap: gapCol,
      }}
    >
      {[0, 1].map((col) => (
        <div key={col} style={{ width: larg }}>
          {itens.slice(col * porColuna, (col + 1) * porColuna).map((it, j) => {
            const pos = col * porColuna + j + 1;
            const p = aparece(frame, it.atraso, 15);
            return (
              <div
                key={it.nome}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 64,
                  gap: 10,
                  borderBottom: `1px solid ${P.linhaPapel}`,
                  opacity: 0.3 + 0.7 * p,
                }}
              >
                <div
                  style={{
                    width: 34,
                    fontSize: 22,
                    fontWeight: 900,
                    color: pos <= 3 ? P.azul : P.tintaSuave,
                  }}
                >
                  {pos}º
                </div>
                <div
                  style={{
                    flex: 1,
                    fontSize: 24,
                    fontWeight: 700,
                    lineHeight: 1.05,
                  }}
                >
                  {it.nome}
                </div>
                <div style={{ width: 90 }}>
                  <div
                    style={{
                      width: `${(100 * it.n * p) / max}%`,
                      minWidth: 10,
                      height: 14,
                      borderRadius: 7,
                      background: pos <= 3 ? P.azul : P.azulClaro,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 36,
                    textAlign: "right",
                    fontSize: 28,
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

// ---------------------------------------------------------------- Boletim de urna

export const Boletim: React.FC<{
  top: number;
  cabecalho: readonly string[];
  linhas: readonly {
    rotulo: string;
    votos: number;
    atraso: number;
    destaque?: boolean;
  }[];
  atraso: number;
}> = ({ top, cabecalho, linhas, atraso }) => {
  const frame = useCurrentFrame();
  const s = useMola(atraso);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        width: INTERNO - 140,
        background: "#FFFFFF",
        color: P.tinta,
        fontFamily: "'DejaVu Sans Mono', monospace",
        padding: "20px 28px 24px",
        boxSizing: "border-box",
        clipPath: `inset(0 0 ${(1 - s) * 100}% 0)`,
        boxShadow: "0 12px 30px rgba(16,23,42,0.18)",
      }}
    >
      {cabecalho.map((c, i) => (
        <div
          key={c}
          style={{
            textAlign: "center",
            fontSize: i === 0 ? 24 : 19,
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          {c}
        </div>
      ))}
      <div
        style={{ borderTop: `2px dashed ${P.linhaPapel}`, margin: "10px 0" }}
      />
      {linhas.map((l) => {
        const v = interpolate(frame, [l.atraso, l.atraso + 30], [0, l.votos], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const d = l.destaque ? aparece(frame, l.atraso, 8) : 0;
        return (
          <div
            key={l.rotulo}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 25,
              fontWeight: 700,
              lineHeight: 1.55,
              padding: "0 8px",
              background: `rgba(242,194,50,${0.6 * d})`,
            }}
          >
            <span>{l.rotulo}</span>
            <span>{fmt(Math.round(v))}</span>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- Quadradinhos

export const Quadradinhos: React.FC<{
  top: number;
  colunas: number;
  categorias: readonly {
    rotulo: string;
    n: number;
    cor: string;
    atraso: number;
  }[];
}> = ({ top, colunas, categorias }) => {
  const frame = useCurrentFrame();
  const gap = 7;
  const lado = Math.floor((INTERNO - gap * (colunas - 1)) / colunas);
  const celulas = categorias.flatMap((c) =>
    Array.from({ length: c.n }, (_, i) => ({
      cor: c.cor,
      atraso: c.atraso + i * 0.6,
    })),
  );
  const alturaGrade = Math.ceil(celulas.length / colunas) * (lado + gap);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top,
          left: 0,
          width: INTERNO,
          display: "flex",
          flexWrap: "wrap",
          gap,
        }}
      >
        {celulas.map((c, i) => {
          const p = aparece(frame, c.atraso, 6);
          return (
            <div
              key={i}
              style={{
                width: lado,
                height: lado,
                borderRadius: 6,
                boxSizing: "border-box",
                border: `2px solid ${p > 0 ? c.cor : P.linhaPapel}`,
                background: p > 0 ? c.cor : "transparent",
                transform: `scale(${0.6 + 0.4 * p})`,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: top + alturaGrade + 24,
          left: 0,
          width: INTERNO,
        }}
      >
        {categorias.map((c) => (
          <div
            key={c.rotulo}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              height: 52,
              fontSize: 30,
              fontWeight: 700,
              opacity: 0.3 + 0.7 * aparece(frame, c.atraso),
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
            <div style={{ fontSize: 38, fontWeight: 900 }}>{c.n}</div>
          </div>
        ))}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- Bonequinhos

export const Bonecos: React.FC<{
  top: number;
  total: number;
  cheios: number;
  cor: string;
  atraso: number;
  tamanho: number;
}> = ({ top, total, cheios, cor, atraso, tamanho }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: INTERNO,
        display: "flex",
        gap: 18,
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const p = aparece(frame, atraso + i * 4, 8);
        const cheio = i < cheios;
        return (
          <svg
            key={i}
            width={tamanho}
            height={tamanho * 1.35}
            viewBox="0 0 40 54"
            style={{ opacity: 0.25 + 0.75 * p }}
          >
            <circle
              cx="20"
              cy="11"
              r="9"
              fill={cheio ? cor : "none"}
              stroke={cheio ? cor : P.tinta}
              strokeWidth="2.5"
            />
            <path
              d="M4 52 V36 a16 16 0 0 1 32 0 V52 Z"
              fill={cheio ? cor : "none"}
              stroke={cheio ? cor : P.tinta}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- Barras comparadas

export const Barras: React.FC<{
  top: number;
  max: number;
  linhas: readonly {
    rotulo: string;
    sub?: string;
    valor: number;
    texto: string;
    cor: string;
    atraso: number;
  }[];
  espessura?: number;
  passo?: number;
}> = ({ top, max, linhas, espessura = 48, passo = 150 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top, left: 0, width: INTERNO }}>
      {linhas.map((l) => {
        const p = aparece(frame, l.atraso, 20);
        return (
          <div
            key={l.rotulo + l.texto}
            style={{ height: passo, opacity: 0.3 + 0.7 * Math.min(1, p * 3) }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span style={{ fontSize: 32, fontWeight: 800 }}>
                  {l.rotulo}
                </span>
                {l.sub ? (
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      color: P.tintaSuave,
                      marginLeft: 12,
                    }}
                  >
                    {l.sub}
                  </span>
                ) : null}
              </div>
              <div style={{ fontSize: 44, fontWeight: 900, color: l.cor }}>
                {l.texto}
              </div>
            </div>
            <div
              style={{
                marginTop: 8,
                height: espessura,
                borderRadius: 10,
                background: "#E6E2D8",
              }}
            >
              <div
                style={{
                  width: `${(100 * l.valor * p) / max}%`,
                  minWidth: l.valor > 0 ? 10 : 0,
                  height: espessura,
                  borderRadius: 10,
                  background: l.cor,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- Grade de 100

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
  const gap = 7;
  const d = (largura - gap * 9) / 10;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: largura,
        opacity: 0.35 + 0.65 * aparece(frame, atraso),
      }}
    >
      <div
        style={{
          fontSize: 80,
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
          const p = aparece(frame, atraso + i * 0.5, 6);
          return (
            <div
              key={i}
              style={{
                width: d,
                height: d,
                borderRadius: d,
                boxSizing: "border-box",
                border: `2px solid ${P.linhaPapel}`,
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
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <div style={{ fontSize: 30, fontWeight: 800 }}>{rotulo}</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: P.tintaSuave }}>
          {sub}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Rosca

export const Rosca: React.FC<{
  left: number;
  top: number;
  tamanho: number;
  pct: number;
  texto: string;
  cor: string;
  rotulo: string;
  sub?: string;
  atraso: number;
}> = ({ left, top, tamanho, pct, texto, cor, rotulo, sub, atraso }) => {
  const frame = useCurrentFrame();
  const p = aparece(frame, atraso, 30);
  const r = tamanho / 2 - 18;
  const circ = 2 * Math.PI * r;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: tamanho,
        textAlign: "center",
        opacity: 0.3 + 0.7 * Math.min(1, p * 3),
      }}
    >
      <div style={{ position: "relative", width: tamanho, height: tamanho }}>
        <svg width={tamanho} height={tamanho}>
          <circle
            cx={tamanho / 2}
            cy={tamanho / 2}
            r={r}
            fill="none"
            stroke="#E6E2D8"
            strokeWidth={30}
          />
          <circle
            cx={tamanho / 2}
            cy={tamanho / 2}
            r={r}
            fill="none"
            stroke={cor}
            strokeWidth={30}
            strokeDasharray={`${(circ * pct * p) / 100} ${circ}`}
            transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`}
            strokeLinecap="butt"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: tamanho * 0.2,
            fontWeight: 900,
            color: cor,
          }}
        >
          {texto}
        </div>
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          lineHeight: 1.15,
          // o texto pode ser mais largo que a rosca
          margin: "12px -70px 0",
        }}
      >
        {rotulo}
      </div>
      {sub ? (
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: P.tintaSuave,
            margin: "4px -70px 0",
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------- Tabela 1º × 2º turno

export const Matriz: React.FC<{
  top: number;
  colunas: readonly string[];
  linhas: readonly {
    rotulo: string;
    cor: string;
    valores: readonly { v: number; atraso: number }[];
  }[];
}> = ({ top, colunas, linhas }) => {
  const frame = useCurrentFrame();
  const larg = (INTERNO - 200) / colunas.length;
  return (
    <div style={{ position: "absolute", top, left: 0, width: INTERNO }}>
      <div style={{ display: "flex", marginLeft: 200 }}>
        {colunas.map((c) => (
          <div
            key={c}
            style={{
              width: larg,
              textAlign: "center",
              fontSize: 26,
              fontWeight: 800,
              color: P.tintaSuave,
            }}
          >
            {c}
          </div>
        ))}
      </div>
      {linhas.map((l) => (
        <div
          key={l.rotulo}
          style={{
            display: "flex",
            alignItems: "center",
            height: 105,
            borderTop: `2px solid ${P.linhaPapel}`,
          }}
        >
          <div
            style={{ width: 200, fontSize: 36, fontWeight: 900, color: l.cor }}
          >
            {l.rotulo}
          </div>
          {l.valores.map((v, i) => {
            const p = aparece(frame, v.atraso, 15);
            return (
              <div
                key={i}
                style={{
                  width: larg,
                  textAlign: "center",
                  fontSize: 64,
                  fontWeight: 900,
                  opacity: p,
                  transform: `scale(${0.7 + 0.3 * p})`,
                }}
              >
                {Math.round(v.v * p)}
              </div>
            );
          })}
        </div>
      ))}
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: P.tintaSuave,
          marginTop: 6,
        }}
      >
        urnas em que o candidato teve zero voto
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Proporção: 106 de 497.897

export const Proporcao: React.FC<{
  top: number;
  parte: number;
  total: number;
  atraso: number;
}> = ({ top, parte, total, atraso }) => {
  const frame = useCurrentFrame();
  const p = aparece(frame, atraso, 30);
  const lupa = aparece(frame, atraso + 30, 15);
  const frac = parte / total;
  return (
    <div style={{ position: "absolute", top, left: 0, width: INTERNO }}>
      <div
        style={{
          height: 56,
          borderRadius: 12,
          background: "rgba(255,255,255,0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ width: `${100 * p}%`, height: 56, background: P.azul }} />
        {/* a fatia real tem menos de 1 pixel; o traço amarelo marca onde ela fica */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 4,
            height: 56,
            background: P.amarelo,
            opacity: lupa,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          fontWeight: 700,
          marginTop: 10,
          color: "rgba(255,255,255,0.75)",
        }}
      >
        <span>{fmt(total)} urnas no país</span>
        <span style={{ color: P.amarelo, opacity: lupa }}>
          {fmt(parte)} urnas ({fmt(frac * 100, 2)}%)
        </span>
      </div>
    </div>
  );
};
