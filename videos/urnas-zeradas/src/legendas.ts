// Legenda da narração. Tempos (s) provisórios, tirados do vídeo de referência;
// troque pelos tempos do áudio final. `marca` nomeia frases usadas nas animações.
export type Frase = {
  readonly inicio: number;
  readonly texto: string;
  readonly marca?: string;
};

export const LEGENDAS: readonly Frase[] = [
  { inicio: 0, texto: "Flávio Bolsonaro teve zero voto", marca: "abertura" },
  { inicio: 1.5, texto: "em 106 urnas no segundo turno", marca: "106" },
  { inicio: 4, texto: "Nas mesmas urnas" },
  { inicio: 5.5, texto: "Lula somou 14.860 votos", marca: "14860" },
  { inicio: 8.5, texto: "O levantamento saiu na Folha", marca: "folha" },
  { inicio: 10, texto: "de S.Paulo e viralizou nas redes" },
  { inicio: 12.5, texto: "Conferidos nos boletins", marca: "boletins" },
  { inicio: 15, texto: "do Tribunal Superior Eleitoral" },
  { inicio: 16.5, texto: "urna por urna, os números batem", marca: "batem" },
  { inicio: 19.5, texto: "O Amazonas lidera, com 30 urnas", marca: "am" },
  { inicio: 21.5, texto: "Depois vêm o Maranhão", marca: "ma" },
  { inicio: 22.5, texto: "com 20, e o Pará, com 16", marca: "pa" },
  { inicio: 25.5, texto: "Na sequência aparecem Roraima", marca: "ranking" },
  { inicio: 27, texto: "com oito, Tocantins, com sete" },
  { inicio: 28.5, texto: "e Mato Grosso, com cinco" },
  {
    inicio: 30,
    texto: "São 18 estados e 67 cidades no total",
    marca: "18estados",
  },
  {
    inicio: 34,
    texto: "A urna com mais votos fica em Tabatinga",
    marca: "tabatinga",
  },
  { inicio: 36.5, texto: "na fronteira com a Colômbia e o Peru" },
  {
    inicio: 39,
    texto: "Numa escola indígena, Lula teve 354 votos",
    marca: "lula354",
  },
  { inicio: 42.5, texto: "Flávio, nenhum", marca: "flavio0" },
  { inicio: 44.5, texto: "O cadastro do TSE mostra", marca: "locais" },
  { inicio: 45.5, texto: "onde ficam as 106" },
  {
    inicio: 47.5,
    texto: "68 estão em aldeias e escolas indígenas",
    marca: "aldeias",
  },
  { inicio: 50.5, texto: "29, em povoados rurais", marca: "povoados" },
  { inicio: 52.5, texto: "e comunidades ribeirinhas" },
  { inicio: 54, texto: "Outras cinco ficam em quilombos", marca: "quilombos" },
  {
    inicio: 56,
    texto: "duas em assentamentos e duas em presídios",
    marca: "outros",
  },
  {
    inicio: 58.5,
    texto: "O perfil do eleitor também foge da média",
    marca: "perfil",
  },
  { inicio: 61, texto: "Em 89 delas, quase um em cada cinco", marca: "1em5" },
  {
    inicio: 63.5,
    texto: "eleitores está registrado como analfabeto",
    marca: "195",
  },
  { inicio: 66, texto: "Nos mesmos estados, a média é de 5%", marca: "media5" },
  {
    inicio: 69,
    texto: "Nas 67 cidades, o Bolsa Família atende",
    marca: "bolsa",
  },
  { inicio: 72, texto: "13 famílias para cada cem moradores", marca: "13" },
  { inicio: 74, texto: "No país inteiro, são nove", marca: "9" },
  { inicio: 76.5, texto: "E a aldeia não reflete a cidade", marca: "guaranta" },
  { inicio: 78.5, texto: "Em Guarantã do Norte, no Mato Grosso" },
  { inicio: 81, texto: "Flávio teve 81,8% dos votos", marca: "818" },
  { inicio: 84, texto: "Na aldeia Sankorassan", marca: "aldeia0" },
  { inicio: 85.5, texto: "do povo Panará, não teve nenhum" },
  { inicio: 88, texto: "O PL quase não teve voto nas 106", marca: "pl" },
  { inicio: 89.5, texto: "urnas: 2,7% para governador", marca: "gov" },
  { inicio: 92.5, texto: "e 4,8% para o Senado", marca: "senado" },
  {
    inicio: 95,
    texto: "A exceção é Roraima, onde o governador",
    marca: "roraima",
  },
  {
    inicio: 96.5,
    texto: "eleito, Arthur Henrique, do PL, fez 27%",
    marca: "rr27",
  },
  { inicio: 101, texto: "Do outro lado, Lula teve", marca: "lula0" },
  { inicio: 102.5, texto: "zero voto em quatro urnas" },
  {
    inicio: 104,
    texto: "duas no Rio Grande do Sul e duas no Pará",
    marca: "rspa",
  },
  { inicio: 106.5, texto: "Nelas, Flávio somou 296 votos", marca: "296" },
  {
    inicio: 109.5,
    texto: "No primeiro turno, Flávio já tinha",
    marca: "turno1",
  },
  {
    inicio: 110.5,
    texto: "zerado em 81 urnas, e Lula, em oito",
    marca: "81e8",
  },
  { inicio: 114.5, texto: "As 106 urnas são 0,02%", marca: "final" },
  { inicio: 116.5, texto: "das quase 500 mil do país" },
  { inicio: 118.5, texto: "O OSM mostra os números", marca: "osm" },
  {
    inicio: 120.5,
    texto: "e quem tira a conclusão é você",
    marca: "conclusao",
  },
];

// Duração total do áudio (s)
export const FIM_AUDIO = 123.9;
