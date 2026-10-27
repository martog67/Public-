// Números do comparativo. Fontes completas (com links) no README.md do projeto.

export type Valor = {
  readonly numero: number;
  readonly casas: number;
  readonly prefixo?: string;
  readonly sufixo?: string;
  readonly nota: string;
};

export type Indicador = {
  readonly id: string;
  readonly rotulo: string;
  readonly ms: Valor;
  readonly ba: Valor;
  readonly legenda: string;
  readonly fonte: string;
};

export const INDICADORES: readonly Indicador[] = [
  {
    id: "desemprego",
    rotulo: "DESEMPREGO",
    ms: {
      numero: 2.7,
      casas: 1,
      sufixo: "%",
      nota: "entre as 5 menores do país",
    },
    ba: { numero: 9.1, casas: 1, sufixo: "%", nota: "2ª maior do país" },
    legenda: "Na Bahia, o desemprego é mais que o triplo.",
    fonte: "IBGE/PNAD Contínua, 2º tri 2026",
  },
  {
    id: "renda",
    rotulo: "RENDA POR PESSOA",
    ms: {
      numero: 2454,
      casas: 0,
      prefixo: "R$ ",
      nota: "por mês · acima da média do Brasil",
    },
    ba: {
      numero: 1465,
      casas: 0,
      prefixo: "R$ ",
      nota: "por mês · 6ª menor do país",
    },
    legenda: "Em MS, a renda por pessoa é 67% maior.",
    fonte: "IBGE, rendimento domiciliar per capita 2025",
  },
  {
    id: "violencia",
    rotulo: "MORTES VIOLENTAS",
    ms: { numero: 20.2, casas: 1, nota: "por 100 mil · mortes +4,9% em 2025" },
    ba: { numero: 36.8, casas: 1, nota: "por 100 mil · 2ª maior taxa" },
    legenda:
      "Na Bahia, quase o dobro. Mas MS ficou acima da média do Brasil (19,1).",
    fonte: "Anuário Brasileiro de Segurança Pública 2026, dados de 2025",
  },
  {
    id: "analfabetismo",
    rotulo: "ANALFABETISMO",
    ms: {
      numero: 3.9,
      casas: 1,
      sufixo: "%",
      nota: "87 mil pessoas · era 3,7% em 2024",
    },
    ba: { numero: 9.5, casas: 1, sufixo: "%", nota: "1,1 milhão de pessoas" },
    legenda: "Na Bahia, a taxa é mais que o dobro.",
    fonte: "IBGE/PNAD Contínua Educação 2025 · 15 anos ou mais",
  },
];

export const formatar = (v: Valor, numero: number) =>
  `${v.prefixo ?? ""}${numero.toLocaleString("pt-BR", {
    minimumFractionDigits: v.casas,
    maximumFractionDigits: v.casas,
  })}${v.sufixo ?? ""}`;
