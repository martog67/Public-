import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  BRASIL,
  Barras3D,
  BarrasH,
  Cabecalho,
  Fonte,
  Legenda,
  Mapa,
  Pictograma,
  Titulo,
  lonLat,
  mover,
} from "./componentes";
import {
  Boletim,
  CartaoFonte,
  Contador,
  Grade100,
  GradeUrnas,
  Quadradinhos,
  Ranking,
  Selo,
} from "./graficos";
import { IdCena } from "./roteiro";
import { CENAS, CONTEUDO, COR, FONT, LARGURA_UTIL, X0, local } from "./theme";

// Cores das candidaturas (neutras, sem cor partidária)
const LULA = COR.azulClaro;
const FLAVIO = COR.amarelo;

// Urnas com zero voto para Flávio, por estado (2º turno)
const URNAS: readonly [string, string, number][] = [
  ["am", "Amazonas", 30],
  ["ma", "Maranhão", 20],
  ["pa", "Pará", 16],
  ["rr", "Roraima", 8],
  ["to", "Tocantins", 7],
  ["mt", "Mato Grosso", 5],
  ["ba", "Bahia", 4],
  ["ac", "Acre", 3],
  ["ce", "Ceará", 2],
  ["mg", "Minas Gerais", 2],
  ["rs", "Rio Grande do Sul", 2],
  ["es", "Espírito Santo", 1],
  ["ms", "Mato Grosso do Sul", 1],
  ["pb", "Paraíba", 1],
  ["pe", "Pernambuco", 1],
  ["pi", "Piauí", 1],
  ["pr", "Paraná", 1],
  ["ro", "Rondônia", 1],
];

const coroplético = (atraso: number) =>
  URNAS.map(([id, , n], i) => ({
    id,
    cor: COR.azul,
    atraso: atraso + i * 2,
    intensidade: 0.35 + 0.65 * (n / 30),
  }));

const FONTE_2T =
  "TSE, boletins de urna do 2º turno (25/10/2026) · levantamento Paris Group citado pela Folha";

const TABATINGA = lonLat(-69.94, -4.25);
const GUARANTA = lonLat(-54.9, -9.96);

// ---------------------------------------------------------------- Cenas

const Abertura: React.FC = () => (
  <>
    <Contador
      top={CONTEUDO.top}
      valor={106}
      atraso={local("106", "abertura")}
      legenda="urnas com zero voto para Flávio"
    />
    <GradeUrnas
      top={CONTEUDO.top + 250}
      total={106}
      colunas={14}
      atraso={local("106", "abertura")}
    />
    <Selo
      top={CONTEUDO.bottom - 60}
      texto="Lula: 14.860 votos nessas urnas"
      atraso={local("14860", "abertura")}
      fundo={LULA}
      cor={COR.fundo}
    />
    <Fonte texto={FONTE_2T} />
  </>
);

const Levantamento: React.FC = () => (
  <>
    <CartaoFonte
      top={CONTEUDO.top}
      veiculo="FOLHA DE S.PAULO · COLUNA PAINEL, 27/10"
      titulo="Levantamento da Paris Group"
      atraso={0}
    />
    <Mapa
      camera={BRASIL}
      top={CONTEUDO.top + 150}
      altura={520}
      destaques={coroplético(15)}
    />
    <Selo
      top={CONTEUDO.bottom - 60}
      texto="✓ 106 urnas · 14.860 votos de Lula"
      atraso={local("batem", "levantamento")}
    />
    <Fonte texto={FONTE_2T} />
  </>
);

const MapaEstados: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = mover(frame, BRASIL, { x: 295, y: 200, zoom: 1.4 }, 0, 50);
  return (
    <>
      <Mapa
        camera={camera}
        destaques={coroplético(0)}
        pinos={[
          {
            id: "am",
            titulo: "Amazonas",
            sub: "30 urnas",
            cor: COR.texto,
            atraso: local("am", "mapaEstados") + 10,
          },
          {
            id: "ma",
            titulo: "Maranhão",
            sub: "20 urnas",
            cor: COR.texto,
            atraso: local("ma", "mapaEstados") + 15,
          },
          {
            id: "pa",
            titulo: "Pará",
            sub: "16 urnas",
            cor: COR.texto,
            atraso: local("pa", "mapaEstados") + 45,
          },
        ]}
      />
      <Fonte texto={FONTE_2T} />
    </>
  );
};

const RankingCena: React.FC = () => {
  const rr = local("ranking", "ranking");
  const atrasos: Record<string, number> = { rr, to: rr + 50, mt: rr + 95 };
  return (
    <>
      <Titulo
        rotulo="ZERO VOTO PARA FLÁVIO · 2º TURNO"
        titulo="18 estados · 67 cidades · 106 urnas"
      />
      <Ranking
        top={CONTEUDO.top + 130}
        max={30}
        itens={URNAS.map(([id, nome, n], i) => ({
          nome,
          n,
          atraso:
            atrasos[id] ??
            (i < 3 ? 0 : local("18estados", "ranking") + (i - 6) * 3),
        }))}
      />
      <Fonte texto={FONTE_2T} />
    </>
  );
};

const Tabatinga: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = mover(
    frame,
    BRASIL,
    { x: TABATINGA[0] + 25, y: TABATINGA[1] - 32, zoom: 3.2 },
    0,
    60,
  );
  const boletim = local("lula354", "tabatinga") - 20;
  return (
    <>
      <Mapa
        camera={camera}
        altura={400}
        destaques={[{ id: "am", cor: COR.azul, atraso: 0 }]}
        pinos={[
          {
            id: "am",
            pos: TABATINGA,
            titulo: "Tabatinga (AM)",
            sub: "fronteira: Colômbia e Peru",
            cor: COR.texto,
            atraso: 40,
          },
        ]}
      />
      <Boletim
        top={CONTEUDO.top + 400}
        atraso={boletim}
        cabecalho={[
          "BOLETIM DE URNA · 2º TURNO",
          "E. M. Indígena Rainha dos Apóstolos",
          "Tabatinga (AM) · zona 36 · seção 61",
        ]}
        linhas={[
          {
            rotulo: "13 LULA",
            votos: 354,
            atraso: local("lula354", "tabatinga"),
          },
          {
            rotulo: "22 FLÁVIO",
            votos: 0,
            destaque: true,
            atraso: local("flavio0", "tabatinga"),
          },
          { rotulo: "NULOS", votos: 11, atraso: boletim + 20 },
          { rotulo: "BRANCOS", votos: 0, atraso: boletim + 20 },
          { rotulo: "COMPARECERAM", votos: 365, atraso: boletim + 20 },
        ]}
      />
      <Fonte texto="TSE, boletim de urna e cadastro de locais de votação 2026" />
    </>
  );
};

const Locais: React.FC = () => (
  <>
    <Titulo
      rotulo="ONDE FICAM AS 106 URNAS"
      titulo="Locais de votação, pelo cadastro do TSE"
    />
    <Quadradinhos
      top={CONTEUDO.top + 130}
      colunas={18}
      categorias={[
        {
          rotulo: "Aldeias e escolas indígenas",
          n: 68,
          cor: COR.azul,
          atraso: local("aldeias", "locais"),
        },
        {
          rotulo: "Povoados rurais e ribeirinhos",
          n: 29,
          cor: COR.texto,
          atraso: local("povoados", "locais"),
        },
        {
          rotulo: "Quilombos",
          n: 5,
          cor: COR.verdeClaro,
          atraso: local("quilombos", "locais"),
        },
        {
          rotulo: "Assentamentos",
          n: 2,
          cor: COR.amarelo,
          atraso: local("outros", "locais"),
        },
        {
          rotulo: "Presídios",
          n: 2,
          cor: "#FF8A65",
          atraso: local("outros", "locais") + 25,
        },
      ]}
    />
    <Fonte texto="TSE, locais de votação 2026 · tipo pelo nome e endereço do local" />
  </>
);

const Perfil: React.FC = () => (
  <>
    <Titulo rotulo="PERFIL DO ELEITOR" titulo="Registrados como analfabetos" />
    <Pictograma
      top={CONTEUDO.top + 120}
      rotulo="Quase"
      valor="1 em cada 5"
      frase="eleitores"
      total={5}
      porLinha={5}
      cor={COR.amarelo}
      atraso={local("1em5", "perfil")}
    />
    <Barras3D
      max={20}
      alturaMax={260}
      colunas={[
        {
          rotulo: "Urnas zeradas",
          sub: "3,9 vezes a média",
          valor: 19.5,
          texto: "19,5%",
          cor: "#E9EFFC",
          lateral: "#8FA3CF",
          topo: "#FFFFFF",
          atraso: local("195", "perfil"),
        },
        {
          rotulo: "Média dos 7 estados",
          sub: "19 milhões de eleitores",
          valor: 5,
          texto: "5,0%",
          cor: COR.azul,
          lateral: "#1E4FB5",
          topo: COR.azulClaro,
          atraso: local("media5", "perfil"),
        },
      ]}
    />
    <Fonte texto="TSE, perfil do eleitorado por seção 2026 · AC, AM, MA, MT, PA, RR e TO" />
  </>
);

const Bolsa: React.FC = () => {
  const larg = (LARGURA_UTIL - 60) / 2;
  return (
    <>
      <Titulo
        rotulo="BOLSA FAMÍLIA · AGOSTO DE 2026"
        titulo="Famílias atendidas a cada 100 moradores"
      />
      <Grade100
        left={X0}
        top={CONTEUDO.top + 150}
        largura={larg}
        valor={13.3}
        texto="13,3"
        rotulo="Nas 67 cidades"
        sub="563.598 famílias"
        cor={COR.amarelo}
        atraso={local("13", "bolsa")}
      />
      <Grade100
        left={X0 + larg + 60}
        top={CONTEUDO.top + 150}
        largura={larg}
        valor={9}
        texto="9,0"
        rotulo="Brasil"
        sub="18,8 milhões de famílias"
        cor={COR.azulClaro}
        atraso={local("9", "bolsa")}
      />
      <Fonte texto="Portal da Transparência, Novo Bolsa Família (ago/2026) · IBGE, Censo 2022" />
    </>
  );
};

const Guaranta: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = mover(
    frame,
    BRASIL,
    { x: GUARANTA[0], y: GUARANTA[1] - 30, zoom: 3 },
    0,
    60,
  );
  return (
    <>
      <Mapa
        camera={camera}
        altura={400}
        destaques={[{ id: "mt", cor: COR.azul, atraso: 0 }]}
        pinos={[
          {
            id: "mt",
            pos: GUARANTA,
            titulo: "Guarantã do Norte (MT)",
            sub: "Aldeia Sankorassan · Panará",
            cor: COR.texto,
            atraso: 45,
          },
        ]}
      />
      <div
        style={{
          position: "absolute",
          top: CONTEUDO.top + 420,
          left: X0,
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: 1.5,
          color: COR.azulClaro,
        }}
      >
        VOTOS DE FLÁVIO NO 2º TURNO
      </div>
      <BarrasH
        top={CONTEUDO.top + 460}
        max={100}
        alturaLinha={140}
        larguraRotulo={260}
        linhas={[
          {
            rotulo: "Na cidade",
            sub: "Guarantã do Norte",
            valor: 81.8,
            texto: "81,8%",
            cor: FLAVIO,
            atraso: local("818", "guaranta"),
          },
          {
            rotulo: "Na aldeia",
            sub: "Lula teve 145 votos",
            valor: 0,
            texto: "0%",
            cor: FLAVIO,
            atraso: local("aldeia0", "guaranta"),
          },
        ]}
      />
      <Fonte texto="TSE, resultado do 2º turno e boletim da seção 284, zona 44 (MT)" />
    </>
  );
};

const PL: React.FC = () => {
  const rr = local("roraima", "pl");
  return (
    <>
      <Sequence durationInFrames={rr} layout="none">
        <Titulo
          rotulo="VOTO NO PL NAS 106 URNAS"
          titulo="1º turno, 4 de outubro"
        />
        <BarrasH
          max={100}
          linhas={[
            {
              rotulo: "Governador",
              sub: "385 de 14.002 votos",
              valor: 2.7,
              texto: "2,7%",
              cor: COR.texto,
              atraso: local("gov", "pl"),
            },
            {
              rotulo: "Senado",
              sub: "1.274 de 26.382 votos",
              valor: 4.8,
              texto: "4,8%",
              cor: COR.texto,
              atraso: local("senado", "pl"),
            },
          ]}
        />
        <div
          style={{
            position: "absolute",
            top: CONTEUDO.top + 560,
            left: X0,
            width: LARGURA_UTIL,
            fontSize: 24,
            color: COR.textoSuave,
            fontWeight: 600,
          }}
        >
          Barra inteira = 100% dos votos válidos
        </div>
      </Sequence>
      <Sequence from={rr} layout="none">
        <Titulo
          rotulo="A EXCEÇÃO: RORAIMA"
          titulo="Arthur Henrique (PL), governador eleito"
        />
        <BarrasH
          max={100}
          larguraRotulo={300}
          linhas={[
            {
              rotulo: "Nas 8 urnas",
              sub: "com zero do Flávio",
              valor: 27.3,
              texto: "27,3%",
              cor: COR.texto,
              atraso: local("rr27", "pl") - rr,
            },
            {
              rotulo: "No estado",
              sub: "eleito no 1º turno",
              valor: 69.1,
              texto: "69,1%",
              cor: COR.azulClaro,
              atraso: local("rr27", "pl") - rr + 40,
            },
          ]}
        />
      </Sequence>
      <Fonte texto="TSE, boletins de urna do 1º turno (4/10/2026) nas mesmas 106 urnas" />
    </>
  );
};

const LulaZero: React.FC = () => {
  const t1 = local("81e8", "lulaZero");
  return (
    <>
      <Mapa
        camera={{ ...BRASIL, zoom: 1.05 }}
        altura={420}
        destaques={[
          { id: "pa", cor: LULA, atraso: local("rspa", "lulaZero") },
          { id: "rs", cor: LULA, atraso: local("rspa", "lulaZero") },
        ]}
        pinos={[
          {
            id: "pa",
            titulo: "Pará: Lula 0",
            sub: "2 urnas",
            cor: LULA,
            atraso: local("rspa", "lulaZero") + 25,
          },
          {
            id: "rs",
            titulo: "RS: Lula 0",
            sub: "2 urnas",
            cor: LULA,
            atraso: local("rspa", "lulaZero"),
          },
        ]}
      />
      <Selo
        top={CONTEUDO.top + 360}
        texto="Flávio nessas 4 urnas: 296 votos"
        atraso={local("296", "lulaZero")}
        fundo={FLAVIO}
        cor={COR.fundo}
      />
      <div
        style={{
          position: "absolute",
          top: CONTEUDO.top + 440,
          left: X0,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 1.5,
          color: COR.azulClaro,
        }}
      >
        URNAS COM ZERO VOTO
      </div>
      <BarrasH
        top={CONTEUDO.top + 470}
        max={106}
        alturaLinha={78}
        larguraRotulo={260}
        linhas={[
          {
            rotulo: "Flávio",
            sub: "2º turno",
            valor: 106,
            texto: "106",
            cor: FLAVIO,
            atraso: 0,
          },
          {
            rotulo: "Lula",
            sub: "2º turno",
            valor: 4,
            texto: "4",
            cor: LULA,
            atraso: 10,
          },
          {
            rotulo: "Flávio",
            sub: "1º turno",
            valor: 81,
            texto: "81",
            cor: FLAVIO,
            atraso: t1,
          },
          {
            rotulo: "Lula",
            sub: "1º turno",
            valor: 8,
            texto: "8",
            cor: LULA,
            atraso: t1 + 20,
          },
        ]}
      />
      <Fonte texto="TSE, boletins de urna do 1º e do 2º turno" />
    </>
  );
};

const Final: React.FC = () => (
  <>
    <Mapa camera={BRASIL} altura={400} destaques={coroplético(0)} />
    <Contador
      top={CONTEUDO.top + 400}
      valor={0.02}
      casas={2}
      sufixo="%"
      atraso={10}
      tamanho={170}
    />
    <div
      style={{
        position: "absolute",
        top: CONTEUDO.top + 590,
        left: X0,
        width: LARGURA_UTIL,
        textAlign: "center",
        fontSize: 32,
        fontWeight: 700,
      }}
    >
      106 das 497.897 urnas do Brasil
    </div>
    <Selo
      top={CONTEUDO.top + 650}
      texto="Dados: boletins de urna do TSE"
      atraso={40}
    />
    <Selo
      top={CONTEUDO.top + 730}
      texto="O OSM mostra os números. A conclusão é sua."
      atraso={local("osm", "final")}
      fundo={COR.azul}
      cor={COR.texto}
    />
    <Fonte texto="TSE, boletins de urna do 2º turno · 497.897 urnas no Brasil" />
  </>
);

const COMPONENTES: Record<IdCena, React.FC> = {
  abertura: Abertura,
  levantamento: Levantamento,
  mapaEstados: MapaEstados,
  ranking: RankingCena,
  tabatinga: Tabatinga,
  locais: Locais,
  perfil: Perfil,
  bolsa: Bolsa,
  guaranta: Guaranta,
  pl: PL,
  lulaZero: LulaZero,
  final: Final,
};

const Fundo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 90% 60% at 50% 55%, ${COR.fundoClaro} 0%, ${COR.fundo} 70%)`,
      }}
    >
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", opacity: 0.16 }}
      >
        {Array.from({ length: 13 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={540}
            y1={900}
            x2={-600 + i * 190}
            y2={1920}
            stroke={COR.azulClaro}
            strokeWidth={1.5}
          />
        ))}
        {Array.from({ length: 9 }).map((_, i) => {
          const p = ((i + ((frame / 90) % 1)) / 9) ** 2;
          return (
            <line
              key={`h${i}`}
              x1={0}
              y1={900 + p * 1020}
              x2={1080}
              y2={900 + p * 1020}
              stroke={COR.azulClaro}
              strokeWidth={1.5}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const UrnasZeradas: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT, color: COR.texto }}>
    <Fundo />
    <Cabecalho
      linhas={[
        "Lula faz 14.860 votos em 106 urnas",
        "em que Flávio zera, e 68 delas ficam",
        "em aldeias e escolas indígenas",
      ]}
    />
    <Legenda />
    {CENAS.map((c) => {
      const Cena = COMPONENTES[c.id];
      return (
        <Sequence
          key={c.id}
          name={c.id}
          from={c.inicio}
          durationInFrames={c.duracao}
        >
          <Cena />
        </Sequence>
      );
    })}
    {/* Narração e trilha entram quando o áudio do ElevenLabs chegar */}
  </AbsoluteFill>
);
