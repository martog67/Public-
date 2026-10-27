import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { INDICADORES, Indicador, Valor, formatar } from "./data";
import { BA_SHAPE, MS_SHAPE, StateShape } from "./shapes";
import {
  COR,
  FONT,
  INICIO_FINAL,
  INICIO_GOVERNO,
  INICIO_TENDENCIA,
  T,
} from "./theme";

// Layout 1080×1920
const PAINEL_MS = { top: 190, height: 560 };
const PLACAR = { top: 770, height: 120 };
const PAINEL_BA = { top: 910, height: 560 };
const LEGENDA_TOP = 1500;
const LADO = 80;

// Momento (dentro de cada indicador) em que o ponto vai para o placar
const PONTO_EM = 150;

const useEntrada = (atraso = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping: 200 } });
};

const Fundo: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, ${COR.fundoTopo} 0%, ${COR.fundoBase} 100%)`,
    }}
  />
);

const Cabecalho: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 70,
      left: LADO,
      right: LADO,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Img
      src={staticFile("marca/osm-sigla-branco.png")}
      style={{ height: 80 }}
    />
    <div
      style={{
        fontSize: 32,
        fontWeight: 800,
        letterSpacing: 4,
        color: COR.textoSuave,
      }}
    >
      COMPARATIVO
    </div>
  </div>
);

const Mapa: React.FC<{
  shape: StateShape;
  cor: string;
  preenchido: number;
  style: React.CSSProperties;
}> = ({ shape, cor, preenchido, style }) => (
  <svg
    viewBox={shape.viewBox}
    style={{
      position: "absolute",
      opacity: 0.35 + 0.65 * preenchido,
      ...style,
    }}
  >
    <path
      d={shape.path}
      fill={cor}
      fillOpacity={0.12 + 0.75 * preenchido}
      stroke={cor}
      strokeWidth={1.2}
      strokeLinejoin="round"
    />
  </svg>
);

const Painel: React.FC<{
  nome: string;
  cor: string;
  shape: StateShape;
  pos: { top: number; height: number };
  atraso: number;
}> = ({ nome, cor, shape, pos, atraso }) => {
  const frame = useCurrentFrame();
  const entrada = useEntrada(atraso);
  // Mapa cheio na abertura, depois vira marca d'água atrás dos números
  const preenchido = interpolate(frame, [T.intro - 25, T.intro], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: pos.top,
        height: pos.height,
        borderRadius: 36,
        background: COR.painel,
        border: `2px solid ${COR.linha}`,
        overflow: "hidden",
        opacity: entrada,
        transform: `translateY(${(1 - entrada) * 40}px)`,
      }}
    >
      <Mapa
        shape={shape}
        cor={cor}
        preenchido={preenchido * entrada}
        style={{ right: 30, top: 70, width: 430, height: 430 }}
      />
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 36,
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: 1,
        }}
      >
        {nome}
        <div
          style={{ width: 60, height: 8, borderRadius: 4, background: cor }}
        />
      </div>
    </div>
  );
};

const NumeroEstado: React.FC<{
  valor: Valor;
  cor: string;
  pos: { top: number; height: number };
  vence: boolean;
}> = ({ valor, cor, pos, vence }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const contagem = interpolate(frame, [10, 55], [0, valor.numero], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const selo = spring({
    frame: frame - PONTO_EM,
    fps,
    config: { damping: 12 },
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 40 + 44,
        right: 40 + 44,
        top: pos.top + 150,
        opacity: entrada,
        transform: `translateY(${(1 - entrada) * 30}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          fontSize: 170,
          fontWeight: 900,
          letterSpacing: -4,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatar(valor, contagem)}
        {vence ? (
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              background: cor,
              color: COR.fundoTopo,
              fontSize: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${selo})`,
            }}
          >
            ✓
          </div>
        ) : null}
      </div>
      <div
        style={{
          marginTop: 26,
          fontSize: 44,
          fontWeight: 700,
          color: cor,
          maxWidth: 820,
          lineHeight: 1.2,
        }}
      >
        {valor.nota}
      </div>
    </div>
  );
};

const Legenda: React.FC<{ texto: string; atraso?: number }> = ({
  texto,
  atraso = 20,
}) => {
  const entrada = useEntrada(atraso);
  return (
    <div
      style={{
        position: "absolute",
        top: LEGENDA_TOP,
        left: LADO,
        right: LADO,
        textAlign: "center",
        fontSize: 52,
        fontWeight: 800,
        lineHeight: 1.25,
        opacity: entrada,
        transform: `translateY(${(1 - entrada) * 20}px)`,
      }}
    >
      {texto}
    </div>
  );
};

const Fonte: React.FC<{ texto: string }> = ({ texto }) => {
  const entrada = useEntrada(30);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: LADO,
        right: LADO,
        textAlign: "center",
        fontSize: 30,
        fontWeight: 500,
        color: COR.textoSuave,
        opacity: entrada,
      }}
    >
      Fonte: {texto}
    </div>
  );
};

const CenaIndicador: React.FC<{ indicador: Indicador }> = ({ indicador }) => (
  <AbsoluteFill>
    <NumeroEstado valor={indicador.ms} cor={COR.ms} pos={PAINEL_MS} vence />
    <NumeroEstado
      valor={indicador.ba}
      cor={COR.ba}
      pos={PAINEL_BA}
      vence={false}
    />
    <Legenda texto={indicador.legenda} atraso={40} />
    <Fonte texto={indicador.fonte} />
  </AbsoluteFill>
);

const Placar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame: frame - 15, fps, config: { damping: 200 } });

  const indice = Math.floor((frame - T.intro) / T.indicador);
  const pontos = INDICADORES.filter(
    (_, i) => frame >= T.intro + i * T.indicador + PONTO_EM,
  ).length;
  // "pulo" do placar quando entra um ponto
  const ultimoPonto = T.intro + (pontos - 1) * T.indicador + PONTO_EM;
  const pulo =
    pontos > 0
      ? spring({ frame: frame - ultimoPonto, fps, config: { damping: 10 } })
      : 1;
  const escala =
    pontos > 0 && frame - ultimoPonto < 30 ? 1 + 0.12 * (1 - pulo) : 1;

  let rotulo = "";
  if (frame < T.intro) rotulo = "PLACAR";
  else if (frame < INICIO_GOVERNO) rotulo = INDICADORES[indice].rotulo;
  else if (frame < INICIO_TENDENCIA) rotulo = "QUEM GOVERNA";
  else if (frame < INICIO_FINAL) rotulo = "TENDÊNCIA EM 2025";
  else rotulo = "PLACAR FINAL";

  return (
    <div
      style={{
        position: "absolute",
        top: PLACAR.top,
        height: PLACAR.height,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        opacity: entrada,
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: 900,
          letterSpacing: 3,
          color: COR.fundoTopo,
          background: COR.destaque,
          padding: "4px 16px",
          borderRadius: 8,
        }}
      >
        {rotulo}
      </div>
      <div
        style={{
          fontSize: 60,
          fontWeight: 900,
          transform: `scale(${escala})`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ color: COR.ms }}>MS {pontos}</span>
        <span style={{ color: COR.textoSuave }}> × </span>
        <span style={{ color: COR.ba }}>0 BA</span>
      </div>
    </div>
  );
};

const CenaIntro: React.FC = () => (
  <AbsoluteFill>
    <Legenda
      texto="Mato Grosso do Sul × Bahia: os mesmos números, lado a lado."
      atraso={25}
    />
  </AbsoluteFill>
);

const BlocoTexto: React.FC<{
  pos: { top: number; height: number };
  cor: string;
  titulo: string;
  linhas: readonly string[];
}> = ({ pos, cor, titulo, linhas }) => {
  const entrada = useEntrada(10);
  return (
    <div
      style={{
        position: "absolute",
        left: 40 + 44,
        right: 40 + 44,
        top: pos.top + 140,
        opacity: entrada,
        transform: `translateY(${(1 - entrada) * 30}px)`,
      }}
    >
      <div
        style={{
          fontSize: 76,
          fontWeight: 900,
          lineHeight: 1.05,
          color: cor,
          whiteSpace: "pre-line",
        }}
      >
        {titulo}
      </div>
      {linhas.map((l) => (
        <div
          key={l}
          style={{
            marginTop: 22,
            fontSize: 42,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
};

const CenaGoverno: React.FC = () => (
  <AbsoluteFill>
    <BlocoTexto
      pos={PAINEL_MS}
      cor={COR.ms}
      titulo={"Eduardo Riedel\n(PP)"}
      linhas={[
        "No cargo desde 2023, reeleito em 2026",
        "Antes: PSDB, MDB e PT",
      ]}
    />
    <BlocoTexto
      pos={PAINEL_BA}
      cor={COR.ba}
      titulo="PT desde 2007"
      linhas={["Wagner, Rui Costa e", "Jerônimo Rodrigues"]}
    />
    <Legenda
      texto="MS alternou PT, MDB, PSDB e PP. A Bahia tem o mesmo partido há quase 20 anos."
      atraso={40}
    />
    <Fonte texto="TSE e governos estaduais" />
  </AbsoluteFill>
);

const CenaTendencia: React.FC = () => (
  <AbsoluteFill>
    <BlocoTexto
      pos={PAINEL_MS}
      cor={COR.ms}
      titulo="Piorou em 2 itens"
      linhas={[
        "▲ Mortes violentas: +4,9%",
        "▲ Analfabetismo: de 3,7% para 3,9%",
      ]}
    />
    <BlocoTexto
      pos={PAINEL_BA}
      cor={COR.ba}
      titulo="Melhorou nos 2"
      linhas={[
        "▼ Mortes violentas: −9,6%",
        "▼ Analfabetismo: de 9,9% para 9,5%",
      ]}
    />
    <Legenda
      texto="MS está à frente nos quatro. Mas a Bahia melhorou onde MS piorou."
      atraso={40}
    />
    <Fonte texto="Anuário FBSP 2026; IBGE/PNAD Educação 2025" />
  </AbsoluteFill>
);

const CenaFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame, fps, config: { damping: 200 } });
  const logo = spring({ frame: frame - 45, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COR.fundoTopo} 0%, ${COR.fundoBase} 100%)`,
        opacity: entrada,
        alignItems: "center",
        justifyContent: "center",
        padding: LADO,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 40,
          fontWeight: 900,
          letterSpacing: 3,
          color: COR.textoSuave,
        }}
      >
        PLACAR FINAL
      </div>
      <div style={{ fontSize: 150, fontWeight: 900, marginTop: 10 }}>
        <span style={{ color: COR.ms }}>MS 4</span>
        <span style={{ color: COR.textoSuave }}> × </span>
        <span style={{ color: COR.ba }}>0 BA</span>
      </div>
      <div
        style={{
          fontSize: 84,
          fontWeight: 900,
          lineHeight: 1.1,
          marginTop: 90,
        }}
      >
        Em qual estado você preferiria viver?
      </div>
      <div
        style={{
          fontSize: 60,
          fontWeight: 800,
          color: COR.destaque,
          marginTop: 40,
        }}
      >
        Comenta aqui.
      </div>
      <Img
        src={staticFile("marca/osm-nome-completo-branco.png")}
        style={{ width: 1000, marginTop: 80, opacity: logo }}
      />
    </AbsoluteFill>
  );
};

export const Comparativo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: COR.texto }}>
      <Fundo />
      <Cabecalho />
      <Painel
        nome="MATO GROSSO DO SUL"
        cor={COR.ms}
        shape={MS_SHAPE}
        pos={PAINEL_MS}
        atraso={0}
      />
      <Painel
        nome="BAHIA"
        cor={COR.ba}
        shape={BA_SHAPE}
        pos={PAINEL_BA}
        atraso={8}
      />
      <Placar />

      <Sequence name="Abertura" durationInFrames={T.intro}>
        <CenaIntro />
      </Sequence>
      {INDICADORES.map((ind, i) => (
        <Sequence
          key={ind.id}
          name={ind.rotulo}
          from={T.intro + i * T.indicador}
          durationInFrames={T.indicador}
        >
          <CenaIndicador indicador={ind} />
        </Sequence>
      ))}
      <Sequence
        name="Quem governa"
        from={INICIO_GOVERNO}
        durationInFrames={T.governo}
      >
        <CenaGoverno />
      </Sequence>
      <Sequence
        name="Tendência"
        from={INICIO_TENDENCIA}
        durationInFrames={T.tendencia}
      >
        <CenaTendencia />
      </Sequence>
      <Sequence name="Final" from={INICIO_FINAL} durationInFrames={T.final}>
        <CenaFinal />
      </Sequence>
    </AbsoluteFill>
  );
};
