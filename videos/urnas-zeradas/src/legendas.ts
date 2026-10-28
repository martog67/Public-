// Legenda da narração (public/audio/narracao.mp3, ElevenLabs "Davi Andrei").
// Tempos (s) medidos nas pausas da fala. `marca` nomeia frases usadas nas animações.
export type Frase = {
  readonly inicio: number;
  readonly texto: string;
  readonly marca?: string;
};

export const LEGENDAS: readonly Frase[] = [
  { inicio: 0, texto: "Flávio Bolsonaro teve zero voto", marca: "abertura" },
  { inicio: 1.9, texto: "em 106 urnas no segundo turno", marca: "106" },
  { inicio: 4.5, texto: "Nas mesmas urnas" },
  { inicio: 6.0, texto: "Lula somou 14.860 votos", marca: "14860" },
  { inicio: 9.26, texto: "O levantamento saiu na Folha", marca: "folha" },
  { inicio: 10.9, texto: "de S.Paulo e viralizou nas redes" },
  { inicio: 12.81, texto: "Conferidos nos boletins", marca: "boletins" },
  { inicio: 14.0, texto: "do Tribunal Superior Eleitoral" },
  { inicio: 15.74, texto: "urna por urna, os números batem", marca: "batem" },
  { inicio: 17.84, texto: "O Amazonas lidera, com 30 urnas", marca: "am" },
  { inicio: 20.17, texto: "Depois vêm o Maranhão, com 20", marca: "ma" },
  { inicio: 21.9, texto: "e o Pará, com 16", marca: "pa" },
  {
    inicio: 23.81,
    texto: "Na sequência aparecem Roraima, com oito",
    marca: "ranking",
  },
  { inicio: 26.15, texto: "Tocantins, com sete", marca: "to" },
  { inicio: 27.51, texto: "e Mato Grosso, com cinco", marca: "mt" },
  {
    inicio: 29.16,
    texto: "São 18 estados e 67 cidades no total",
    marca: "18estados",
  },
  {
    inicio: 32.7,
    texto: "A urna com mais votos fica em Tabatinga",
    marca: "tabatinga",
  },
  { inicio: 34.6, texto: "na fronteira com a Colômbia e o Peru" },
  {
    inicio: 36.88,
    texto: "Numa escola indígena, Lula teve 354 votos",
    marca: "lula354",
  },
  { inicio: 40.86, texto: "Flávio, nenhum", marca: "flavio0" },
  { inicio: 42.4, texto: "O cadastro do TSE mostra", marca: "locais" },
  { inicio: 43.9, texto: "onde ficam as 106" },
  {
    inicio: 45.96,
    texto: "68 estão em aldeias e escolas indígenas",
    marca: "aldeias",
  },
  { inicio: 49.09, texto: "29, em povoados rurais", marca: "povoados" },
  { inicio: 50.9, texto: "e comunidades ribeirinhas" },
  {
    inicio: 52.58,
    texto: "Outras cinco ficam em quilombos",
    marca: "quilombos",
  },
  {
    inicio: 54.6,
    texto: "duas em assentamentos e duas em presídios",
    marca: "outros",
  },
  {
    inicio: 57.22,
    texto: "O perfil do eleitor também foge da média",
    marca: "perfil",
  },
  {
    inicio: 59.61,
    texto: "Em 89 delas, quase um em cada cinco",
    marca: "1em5",
  },
  {
    inicio: 62.0,
    texto: "eleitores está registrado como analfabeto",
    marca: "195",
  },
  {
    inicio: 64.88,
    texto: "Nos mesmos estados, a média é de 5%",
    marca: "media5",
  },
  {
    inicio: 67.83,
    texto: "Nas 67 cidades, o Bolsa Família atende",
    marca: "bolsa",
  },
  { inicio: 70.4, texto: "13 famílias para cada cem moradores", marca: "13" },
  { inicio: 73.12, texto: "No país inteiro, são nove", marca: "9" },
  {
    inicio: 74.96,
    texto: "E a aldeia não reflete a cidade",
    marca: "guaranta",
  },
  { inicio: 77.07, texto: "Em Guarantã do Norte, no Mato Grosso" },
  { inicio: 79.07, texto: "Flávio teve 81,8% dos votos", marca: "818" },
  { inicio: 82.5, texto: "Na aldeia Sankorassan, do povo Panará" },
  { inicio: 84.89, texto: "não teve nenhum", marca: "aldeia0" },
  {
    inicio: 86.08,
    texto: "O PL quase não teve voto nas 106 urnas",
    marca: "pl",
  },
  { inicio: 89.15, texto: "2,7% para governador", marca: "gov" },
  { inicio: 91.3, texto: "e 4,8% para o Senado", marca: "senado" },
  {
    inicio: 93.58,
    texto: "A exceção é Roraima, onde o governador eleito",
    marca: "roraima",
  },
  { inicio: 95.6, texto: "Arthur Henrique, do PL" },
  { inicio: 97.53, texto: "fez 27%", marca: "rr27" },
  {
    inicio: 99.23,
    texto: "Do outro lado, Lula teve zero voto",
    marca: "lula0",
  },
  { inicio: 100.9, texto: "em quatro urnas" },
  {
    inicio: 102.53,
    texto: "duas no Rio Grande do Sul e duas no Pará",
    marca: "rspa",
  },
  { inicio: 105.07, texto: "Nelas, Flávio somou 296 votos", marca: "296" },
  {
    inicio: 108.54,
    texto: "No primeiro turno, Flávio já tinha",
    marca: "turno1",
  },
  {
    inicio: 110.6,
    texto: "zerado em 81 urnas, e Lula, em oito",
    marca: "81e8",
  },
  { inicio: 113.33, texto: "As 106 urnas são 0,02%", marca: "final" },
  { inicio: 115.9, texto: "das quase 500 mil do país" },
  {
    inicio: 118.75,
    texto: "O Sul-Mato-Grossense mostra os números",
    marca: "osm",
  },
  {
    inicio: 120.4,
    texto: "e quem tira a conclusão é você",
    marca: "conclusao",
  },
  // CTA da série OSM Explica (public/audio/cta.mp3), depois da narração.
  { inicio: 123.15, texto: "Este foi o OSM Explica", marca: "cta" },
  {
    inicio: 125.57,
    texto: "Siga O Sul-Mato-Grossense e O Campo-Grandense",
    marca: "cta-siga",
  },
  { inicio: 127.0, texto: "para mais conteúdos como este" },
];

// Fim da narração principal (s)
export const FIM_AUDIO = 122.75;

// Áudio do CTA: começa logo depois da narração
export const CTA = { inicio: 123.15, duracao: 5.25 };
