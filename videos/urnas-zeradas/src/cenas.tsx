import React from "react";
import { Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  Barras,
  Boletim,
  Bonecos,
  Carimbo,
  Fichas,
  Grade100,
  GradeUrnas,
  MapaBrasil,
  Matriz,
  NumeroGrande,
  Pilula,
  Proporcao,
  Quadradinhos,
  Ranking,
  Recorte,
  Rosca,
  Rotulo,
  lonLat,
} from "./cartoes";
import { Cartao, FLAVIO, G, INTERNO, LULA, P, aparece } from "./layout";
import { LARGURA_UTIL, X0, local } from "./theme";

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

const coropletico = (atraso: number) =>
  URNAS.map(([id, , n], i) => ({
    id,
    cor: P.azul,
    atraso: atraso + i * 2,
    intensidade: 0.3 + 0.7 * (n / 30),
  }));

const FONTE_2T =
  "TSE, boletins de urna do 2º turno (25/10/2026) · levantamento Paris Group (Folha)";
const TABATINGA = lonLat(-69.94, -4.25);
const GUARANTA = lonLat(-54.9, -9.96);

const Legenda: React.FC<{
  left: number;
  top: number;
  largura: number;
  titulo: string;
  sub: string;
  atraso: number;
}> = ({ left, top, largura, titulo, sub, atraso }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: largura,
        textAlign: "center",
        opacity: aparece(frame, atraso),
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 900 }}>{titulo}</div>
      <div style={{ fontSize: 21, fontWeight: 600, color: P.tintaSuave }}>
        {sub}
      </div>
    </div>
  );
};

export const Abertura: React.FC = () => (
  <Cartao fonte={FONTE_2T}>
    <NumeroGrande
      top={0}
      valor={106}
      atraso={local("106", "abertura")}
      tamanho={200}
    />
    <Rotulo
      top={210}
      texto="urnas sem nenhum voto para Flávio Bolsonaro no 2º turno"
      tamanho={32}
      cor={P.tinta}
      atraso={local("106", "abertura")}
    />
    <GradeUrnas
      top={300}
      total={106}
      colunas={16}
      atraso={local("106", "abertura") + 10}
    />
    <Pilula
      top={620}
      texto="Lula: 14.860 votos nessas urnas"
      atraso={local("14860", "abertura")}
      fundo={LULA}
    />
  </Cartao>
);

export const Levantamento: React.FC = () => (
  <Cartao fonte={FONTE_2T}>
    <Recorte
      top={10}
      veiculo="Folha de S.Paulo"
      data="Painel · 27/10/2026"
      manchete="Flávio teve zero voto em 106 urnas, nas quais Lula somou quase 15 mil"
      credito="Levantamento da consultoria Paris Group"
    />
    <Carimbo
      top={395}
      texto="CONFERIDO NOS BOLETINS DO TSE"
      atraso={local("batem", "levantamento")}
    />
    <Fichas
      top={520}
      itens={[
        {
          valor: "106",
          rotulo: "urnas",
          atraso: local("boletins", "levantamento"),
        },
        {
          valor: "14.860",
          rotulo: "votos de Lula",
          atraso: local("boletins", "levantamento") + 10,
        },
        {
          valor: "0",
          rotulo: "votos de Flávio",
          atraso: local("boletins", "levantamento") + 20,
        },
      ]}
    />
  </Cartao>
);

export const MapaEstados: React.FC = () => (
  <Cartao fonte={FONTE_2T}>
    <Rotulo top={0} texto="URNAS COM ZERO VOTO PARA FLÁVIO, POR ESTADO" />
    <MapaBrasil
      left={0}
      top={50}
      largura={INTERNO}
      altura={650}
      destaques={coropletico(5)}
      pinos={[
        {
          id: "am",
          titulo: "Amazonas",
          sub: "30 urnas",
          atraso: local("am", "mapaEstados") + 10,
        },
        {
          id: "ma",
          titulo: "Maranhão",
          sub: "20 urnas",
          lado: "baixo",
          atraso: local("ma", "mapaEstados") + 20,
        },
        {
          id: "pa",
          titulo: "Pará",
          sub: "16 urnas",
          atraso: local("pa", "mapaEstados") + 10,
        },
      ]}
    />
  </Cartao>
);

export const RankingEstados: React.FC = () => {
  const vez: Record<string, number> = {
    rr: local("ranking", "ranking") + 35,
    to: local("to", "ranking"),
    mt: local("mt", "ranking"),
  };
  const resto = local("18estados", "ranking");
  return (
    <Cartao fonte={FONTE_2T}>
      <Rotulo top={0} texto="18 ESTADOS · 67 CIDADES · 106 URNAS" />
      <Ranking
        top={50}
        max={30}
        itens={URNAS.map(([id, nome, n], i) => ({
          nome,
          n,
          atraso: vez[id] ?? (i < 3 ? 0 : resto + (i - 6) * 3),
        }))}
      />
    </Cartao>
  );
};

export const Tabatinga: React.FC = () => {
  const boletim = local("lula354", "tabatinga") - 15;
  return (
    <Cartao fonte="TSE, boletim de urna e cadastro de locais de votação 2026">
      <MapaBrasil
        left={-120}
        top={0}
        largura={INTERNO}
        altura={330}
        destaques={[{ id: "am", cor: P.azul, intensidade: 0.6, atraso: 0 }]}
        lupa={{ pos: TABATINGA, zoom: 7, x: 690, y: 150, r: 125, atraso: 20 }}
      />
      <Legenda
        left={441}
        top={286}
        largura={258}
        titulo="Tabatinga (AM)"
        sub="fronteira com Colômbia e Peru"
        atraso={30}
      />
      <Boletim
        top={370}
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
            atraso: local("lula354", "tabatinga") + 50,
          },
          {
            rotulo: "22 FLÁVIO",
            votos: 0,
            destaque: true,
            atraso: local("flavio0", "tabatinga"),
          },
          { rotulo: "NULOS", votos: 11, atraso: boletim + 20 },
          { rotulo: "COMPARECERAM", votos: 365, atraso: boletim + 20 },
        ]}
      />
    </Cartao>
  );
};

export const Locais: React.FC = () => (
  <Cartao fonte="TSE, locais de votação 2026 · tipo pelo nome e endereço do local">
    <Rotulo top={0} texto="ONDE FICAM AS 106 URNAS" />
    <Quadradinhos
      top={50}
      colunas={18}
      categorias={[
        {
          rotulo: "Aldeias e escolas indígenas",
          n: 68,
          cor: P.azul,
          atraso: local("aldeias", "locais"),
        },
        {
          rotulo: "Povoados rurais e ribeirinhos",
          n: 29,
          cor: P.tinta,
          atraso: local("povoados", "locais"),
        },
        {
          rotulo: "Quilombos",
          n: 5,
          cor: P.verde,
          atraso: local("quilombos", "locais"),
        },
        {
          rotulo: "Assentamentos",
          n: 2,
          cor: P.ambar,
          atraso: local("outros", "locais"),
        },
        {
          rotulo: "Presídios",
          n: 2,
          cor: "#C2410C",
          atraso: local("outros", "locais") + 30,
        },
      ]}
    />
  </Cartao>
);

export const Perfil: React.FC = () => (
  <Cartao fonte="TSE, perfil do eleitorado por seção 2026 · AC, AM, MA, MT, PA, RR e TO">
    <Rotulo top={0} texto="ELEITORES REGISTRADOS COMO ANALFABETOS" />
    <Rotulo
      top={44}
      texto="Quase 1 em cada 5"
      tamanho={56}
      cor={P.tinta}
      atraso={local("1em5", "perfil")}
    />
    <Bonecos
      top={125}
      total={5}
      cheios={1}
      cor={FLAVIO}
      tamanho={64}
      atraso={local("1em5", "perfil")}
    />
    <Barras
      top={250}
      max={20}
      linhas={[
        {
          rotulo: "Urnas zeradas",
          sub: "89 com dados",
          valor: 19.5,
          texto: "19,5%",
          cor: FLAVIO,
          atraso: local("195", "perfil"),
        },
        {
          rotulo: "Média dos 7 estados",
          sub: "19 mi de eleitores",
          valor: 5,
          texto: "5,0%",
          cor: P.azul,
          atraso: local("media5", "perfil"),
        },
      ]}
    />
    <Pilula
      top={580}
      texto="3,9 vezes a média"
      atraso={local("media5", "perfil") + 35}
      fundo={P.tinta}
    />
  </Cartao>
);

export const Bolsa: React.FC = () => {
  const larg = (INTERNO - 60) / 2;
  return (
    <Cartao fonte="Portal da Transparência, Novo Bolsa Família (ago/2026) · IBGE, Censo 2022">
      <Rotulo top={0} texto="FAMÍLIAS NO BOLSA FAMÍLIA A CADA 100 MORADORES" />
      <Grade100
        left={0}
        top={60}
        largura={larg}
        valor={13.3}
        texto="13,3"
        rotulo="Nas 67 cidades"
        sub="563.598 famílias"
        cor={FLAVIO}
        atraso={local("13", "bolsa")}
      />
      <Grade100
        left={larg + 60}
        top={60}
        largura={larg}
        valor={9}
        texto="9,0"
        rotulo="Brasil"
        sub="18,8 milhões de famílias"
        cor={P.azul}
        atraso={local("9", "bolsa")}
      />
    </Cartao>
  );
};

export const Guaranta: React.FC = () => (
  <Cartao fonte="TSE, resultado do 2º turno e boletim da seção 284, zona 44 (MT)">
    <MapaBrasil
      left={-120}
      top={0}
      largura={INTERNO}
      altura={300}
      destaques={[{ id: "mt", cor: P.azul, intensidade: 0.6, atraso: 0 }]}
      lupa={{ pos: GUARANTA, zoom: 6, x: 690, y: 135, r: 115, atraso: 20 }}
    />
    <Legenda
      left={441}
      top={262}
      largura={258}
      titulo="Guarantã do Norte"
      sub="Mato Grosso"
      atraso={30}
    />
    <Rotulo top={345} texto="VOTOS DE FLÁVIO NO 2º TURNO" />
    <Rosca
      left={70}
      top={390}
      tamanho={230}
      pct={81.8}
      texto="81,8%"
      cor={FLAVIO}
      rotulo="Na cidade"
      atraso={local("818", "guaranta")}
    />
    <Rosca
      left={INTERNO - 300}
      top={390}
      tamanho={230}
      pct={0}
      texto="0%"
      cor={FLAVIO}
      rotulo="Na aldeia Sankorassan"
      sub="povo Panará · Lula teve 145"
      atraso={local("aldeia0", "guaranta")}
    />
  </Cartao>
);

export const PL: React.FC = () => {
  const rr = local("roraima", "pl");
  return (
    <Cartao fonte="TSE, boletins de urna do 1º turno (4/10/2026) nas mesmas 106 urnas">
      <Sequence durationInFrames={rr} layout="none">
        <Rotulo top={0} texto="VOTO NO PL NAS 106 URNAS · 1º TURNO" />
        <Rosca
          left={20}
          top={90}
          tamanho={320}
          pct={2.7}
          texto="2,7%"
          cor={P.tinta}
          rotulo="Governador"
          sub="385 de 14.002 votos válidos"
          atraso={local("gov", "pl")}
        />
        <Rosca
          left={INTERNO - 340}
          top={90}
          tamanho={320}
          pct={4.8}
          texto="4,8%"
          cor={P.tinta}
          rotulo="Senado"
          sub="1.274 de 26.382 votos válidos"
          atraso={local("senado", "pl")}
        />
      </Sequence>
      <Sequence from={rr} layout="none">
        <Rotulo top={0} texto="A EXCEÇÃO: RORAIMA" />
        <Rotulo
          top={40}
          texto="Arthur Henrique (PL), governador eleito"
          tamanho={40}
          cor={P.tinta}
        />
        <Rosca
          left={20}
          top={150}
          tamanho={300}
          pct={27.3}
          texto="27,3%"
          cor={P.tinta}
          rotulo="Nas 8 urnas"
          sub="com zero voto para Flávio"
          atraso={local("rr27", "pl") - rr}
        />
        <Rosca
          left={INTERNO - 320}
          top={150}
          tamanho={300}
          pct={69.1}
          texto="69,1%"
          cor={P.azul}
          rotulo="No estado inteiro"
          sub="eleito no 1º turno"
          atraso={local("rr27", "pl") - rr + 30}
        />
      </Sequence>
    </Cartao>
  );
};

export const LulaZero: React.FC = () => {
  const rspa = local("rspa", "lulaZero");
  const t1 = local("81e8", "lulaZero");
  return (
    <Cartao fonte="TSE, boletins de urna do 1º e do 2º turno">
      <MapaBrasil
        left={0}
        top={0}
        largura={INTERNO}
        altura={340}
        destaques={[
          { id: "pa", cor: LULA, atraso: rspa },
          { id: "rs", cor: LULA, atraso: rspa },
        ]}
        pinos={[
          {
            id: "pa",
            titulo: "Pará",
            sub: "Lula 0 em 2 urnas",
            lado: "direita",
            atraso: rspa + 20,
          },
          {
            id: "rs",
            titulo: "Rio Grande do Sul",
            sub: "Lula 0 em 2 urnas",
            lado: "esquerda",
            atraso: rspa,
          },
        ]}
      />
      <Pilula
        top={352}
        texto="Flávio teve 296 votos nessas 4 urnas"
        atraso={local("296", "lulaZero")}
        fundo={FLAVIO}
      />
      <Matriz
        top={430}
        colunas={["1º turno", "2º turno"]}
        linhas={[
          {
            rotulo: "Flávio",
            cor: FLAVIO,
            valores: [
              { v: 81, atraso: t1 },
              { v: 106, atraso: 0 },
            ],
          },
          {
            rotulo: "Lula",
            cor: LULA,
            valores: [
              { v: 8, atraso: t1 + 25 },
              { v: 4, atraso: 30 },
            ],
          },
        ]}
      />
    </Cartao>
  );
};

export const Final: React.FC = () => (
  <Cartao
    fonte="TSE, boletins de urna do 2º turno · 497.897 urnas no Brasil"
    escuro
  >
    <NumeroGrande
      top={40}
      valor={0.02}
      casas={2}
      sufixo="%"
      atraso={10}
      tamanho={220}
      cor={P.branco}
    />
    <Rotulo
      top={290}
      texto="das urnas do país tiveram zero voto para Flávio"
      tamanho={36}
      cor={P.branco}
      atraso={20}
    />
    <Proporcao top={420} parte={106} total={497897} atraso={30} />
    <Pilula
      top={580}
      texto="Dados: boletins de urna do TSE"
      atraso={60}
      fundo={P.branco}
      cor={P.azul}
    />
  </Cartao>
);

// Encerramento da série OSM Explica: chamada para seguir os perfis
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const siga = aparece(frame, 5, 15);
  const logos = [
    {
      src: "marca/osm-nome-completo-recorte.png",
      largura: 680,
      sub: "@osulmatogrossense",
      atraso: local("cta-siga", "cta") + 10,
    },
    {
      src: "marca/campo-grandense-recorte.png",
      largura: 540,
      sub: "",
      atraso: local("cta-siga", "cta") + 30,
    },
  ];
  return (
    <div
      style={{
        position: "absolute",
        top: G.capitulo,
        left: X0,
        width: LARGURA_UTIL,
        // a legenda some no CTA, então a cena ocupa até o fim da área segura
        height: G.legenda.top + G.legenda.altura - G.capitulo,
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 76,
          fontWeight: 800,
          lineHeight: 1.05,
          textAlign: "center",
          opacity: siga,
          transform: `translateY(${(1 - siga) * 20}px)`,
        }}
      >
        Siga nossos perfis
      </div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 600,
          color: P.textoSuave,
          marginTop: 14,
          opacity: siga,
        }}
      >
        para mais conteúdos como este
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 70,
          marginTop: 90,
        }}
      >
        {logos.map((l) => {
          const p = aparece(frame, l.atraso, 15);
          return (
            <div
              key={l.src}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: p,
                transform: `translateY(${(1 - p) * 20}px)`,
              }}
            >
              <Img src={staticFile(l.src)} style={{ width: l.largura }} />
              {l.sub ? (
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: P.amarelo,
                    marginTop: 14,
                  }}
                >
                  {l.sub}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
