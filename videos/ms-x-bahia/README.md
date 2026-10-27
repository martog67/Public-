# MS × Bahia — vídeo comparativo (O Sul-Mato-Grossense)

Vídeo vertical (1080×1920, 30 fps, 78,5 s, com narração) comparando Mato Grosso do Sul e Bahia nos mesmos indicadores de um vídeo viral que compara Santa Catarina e Bahia.

- **Vídeo pronto:** [`entrega/ms-x-bahia.mp4`](entrega/ms-x-bahia.mp4)
- **Análise do vídeo de referência:** [`ANALISE-VIDEO-ORIGINAL.md`](ANALISE-VIDEO-ORIGINAL.md)

## Roteiro

Narração: ElevenLabs (voz "Livia – Warm, Expressive and Calm", eleven_v4), em `public/audio/narracao.mp3`. O texto está em [`ROTEIRO-NARRACAO.md`](ROTEIRO-NARRACAO.md). As cenas cortam no meio da pausa entre os blocos da fala (tempos em `src/theme.ts`).

Trilha sonora: composição original gerada por síntese em `scripts/gerar-trilha.py` (sem licença de terceiros), em `public/audio/trilha.mp3`, cerca de 14 dB abaixo da voz. Ela segue os cortes do vídeo: pulso e bateria nos indicadores, um sino a cada ponto do placar, só a harmonia em "quem governa", tensão na tendência e resolução em dó maior no final. Se mudar os tempos em `src/theme.ts`, atualize as constantes no script e rode `python3 scripts/gerar-trilha.py trilha.wav`. Depois converta com `ffmpeg -i trilha.wav -af loudnorm=I=-16:TP=-1.5 -b:a 192k public/audio/trilha.mp3`.

| Tempo | Cena | MS | Bahia | Fonte na tela |
|---|---|---|---|---|
| 0–4,9 s | Abertura: mapas dos dois estados | | | |
| 4,9–16 s | Desemprego | 2,7% (entre as 5 menores) | 9,1% (2ª maior) | IBGE/PNAD Contínua, 2º tri 2026 |
| 16–26,1 s | Renda por pessoa (mês) | R$ 2.454 | R$ 1.465 (6ª menor) | IBGE, rendimento domiciliar per capita 2025 |
| 26,1–39,7 s | Mortes violentas / 100 mil | 20,2 (mortes +4,9% em 2025) | 36,8 (2ª maior) | Anuário Brasileiro de Segurança Pública 2026 |
| 39,7–48,9 s | Analfabetismo (15+) | 3,9% (era 3,7%) | 9,5% (1,1 milhão) | IBGE/PNAD Contínua Educação 2025 |
| 48,9–60 s | Quem governa | Eduardo Riedel (PP), desde 2023, reeleito em 2026 | PT desde 2007 | TSE |
| 60–70,4 s | Tendência em 2025 | Piorou em violência e analfabetismo | Melhorou nos dois | FBSP 2026; IBGE 2025 |
| 70,4–78,5 s | Placar final MS 4 × 0 BA + "Em qual estado você preferiria viver?" + logo OSM | | | |

Referências nacionais citadas: desemprego Brasil 5,4%; renda Brasil R$ 2.316; mortes violentas Brasil 19,1/100 mil; analfabetismo Brasil 4,9%.

### Escolhas editoriais (diferenças em relação ao vídeo original)
- O original é marcado como **opinião** e atribui o resultado ao partido ("um aposta no trabalho, o outro na dependência"). Esta versão mostra os dados e quem governa, sem afirmar causa.
- Inclui uma cena de **tendência**: MS lidera nos quatro indicadores, mas piorou em violência e analfabetismo em 2025, enquanto a Bahia melhorou nos dois. Sem isso, o placar 4 × 0 esconderia uma informação relevante para o leitor de MS.
- MS também já foi governado pelo PT (Zeca do PT, 1999–2006), o que o vídeo informa.

## Fontes (verificadas em 27/10/2026)
- Desemprego, 2º tri 2026: [IBGE — PNAD Contínua Trimestral](https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/47774-pnad-continua-trimestral-desocupacao-cai-em-13-das-27-ufs-no-2-trimestre-de-2026); [Funtrab-MS, boletim PNAD 2º tri 2026](https://www.funtrab.ms.gov.br/wp-content/uploads/2026/08/Pnad-2%C2%B0-tri-2026.pdf); [Dourados News](https://www.douradosnews.com.br/noticias/brasil/desemprego-cai-em-13-estados-no-2o-trimestre-de-2026-diz-ibge/1286428/)
- Renda per capita 2025: [IBGE (PDF via Poder360)](https://static.poder360.com.br/2026/04/IBGE-Rendimento-domiciliar-per-capita-2025.pdf); [Agência Brasil](https://agenciabrasil.ebc.com.br/economia/noticia/2026-02/renda-domiciliar-capita-chega-r-2316-em-2025-diz-ibge); [ISTOÉ Dinheiro, ranking](https://istoedinheiro.com.br/ibge-renda-media-per-capita-brasil-ranking)
- Mortes violentas 2025: [Anuário FBSP 2026 (PDF)](https://forumseguranca.org.br/wp-content/uploads/2026/07/anuario-2026.pdf); [A Crítica — MS](https://acritica.net/policia/violencia-letal-cresce-mato-grosso-do-sul-2025/); [Jornal Grande Bahia — BA](https://jornalgrandebahia.com.br/2026/07/anuario-2026-bahia-tem-segunda-maior-taxa-de-mortes-violentas-do-brasil-e-cinco-cidades-entre-as-dez-mais-letais/); [CNN Brasil](https://www.cnnbrasil.com.br/nacional/brasil/mortes-violentas-caem-82-no-brasil-em-2025-sete-estados-registram-alta/)
- Analfabetismo 2025: [IBGE — PNAD Contínua Educação 2025](https://biblioteca.ibge.gov.br/visualizacao/livros/liv102286_informativo.pdf); [A Crítica — MS](https://acritica.net/educacao/ibge-educacao-ms-2025-analfabetismo-ensino-superior/); [Capital News — MS](https://www.capitalnews.com.br/cotidiano/educacao/analfabetismo-volta-a-crescer-e-atinge-87-mil-pessoas-em-mato-grosso-do-sul/442990); [Correio — BA](https://www.correio24horas.com.br/minha-bahia/bahia-e-o-unico-estado-do-brasil-com-mais-de-1-milhao-de-analfabetos-aponta-ibge-0626)
- Governo de MS: [TSE](https://www.tse.jus.br/comunicacao/noticias/2026/Outubro/eduardo-riedel-pp-e-eleito-governador-de-mato-grosso-do-sul)

**Antes de publicar:** os sites do IBGE e do FBSP não puderam ser abertos diretamente no ambiente onde o vídeo foi feito. Os números de MS de mortes violentas (20,2) e analfabetismo (3,9%) vieram de reportagens que citam essas publicações. Vale conferir no Anuário FBSP 2026 (tabela de MVI por UF) e no SIDRA/IBGE (tabela 7113).

## Créditos de terceiros
- Contornos dos estados: [@svg-maps/brazil](https://github.com/VictorCazanave/svg-maps), licença CC-BY 4.0.
- Fonte tipográfica: Inter (SIL Open Font License), em `public/fonts/`.

## Editar e renderizar
```bash
npm i
npm run dev          # Remotion Studio para editar/pré-visualizar
npx remotion render MS-x-Bahia out/ms-x-bahia.mp4
```
Números, notas, legendas e fontes ficam em `src/data.ts`; cores e tempos das cenas em `src/theme.ts`; layout em `src/Comparativo.tsx`.
No ambiente em nuvem do Claude, adicione `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.
