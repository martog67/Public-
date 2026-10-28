# 106 urnas com zero voto para Flávio (O Sul-Mato-Grossense)

Vídeo vertical 1080×1920, 30 fps, cerca de 2 min. Segue o roteiro e o conteúdo de um vídeo de referência de outro veículo, com layout próprio e a identidade do OSM.

- **Vídeo pronto:** [`entrega/urnas-zeradas.mp4`](entrega/urnas-zeradas.mp4), com 129 s.
- **Narração:** ElevenLabs, voz "Davi Andrei" (eleven_v4), em `public/audio/narracao.mp3`. Os tempos de cada frase em `src/legendas.ts` foram medidos nas pausas da fala. As cenas e animações seguem as frases marcadas (`marca`), então, com um áudio novo, basta ajustar esses tempos.
- **CTA da série OSM Explica:** "Este foi o OSM Explica. Siga O Sul-Mato-Grossense e O Campo-Grandense para mais conteúdos como este." Está em `public/audio/cta.mp3` e entra 0,4 s depois da narração (tempos em `src/legendas.ts`, objeto `CTA`). Na tela entra primeiro a assinatura OSM Explica (logo, fita amarela "EXPLICA" e estrela, sobre fundo preto) e depois "Siga nossos perfis", com @osulmatogrossense e @ocampograndense. A legenda some nessa cena para não repetir o texto.
- **Fonte tipográfica:** Bricolage Grotesque (SIL OFL).
- **Trilha:** composição original por síntese (`scripts/gerar-trilha.py`, sem licença de terceiros), em ré menor e 84 BPM. Tem tique-taque na abertura, pulso nos dados, respiro em Guarantã, final em suspenso e sinos nos números-chave. Os cortes saem das legendas. Para regerar, rode `python3 scripts/gerar-trilha.py src/legendas.ts trilha.wav` e depois `ffmpeg -i trilha.wav -af loudnorm=I=-16:TP=-1.5 -b:a 192k public/audio/trilha.mp3`.

## Diferenças em relação à referência
- **Layout próprio, no formato "dossiê de apuração":** sem a manchete fixa da referência.
  - **Topo:** logo do OSM, a etiqueta "ELEIÇÕES 2026" e uma barra de progresso.
  - **Capítulos numerados:** 01 O número, 02 De onde vem, 03 Onde estão, 04 A urna recordista, 05 Onde se vota, 06 Quem vota, 07 Bolsa Família, 08 Cidade × aldeia, 09 E o PL?, 10 O outro lado, 11 A proporção.
  - **Dados em cartões claros, tipo papel:** cada cartão tem a fonte no rodapé.
  - **Legenda:** em faixa própria, com fio amarelo.
  - **Gráficos:** grade com as 106 urnas, recorte de jornal com carimbo, mapa do Brasil inteiro (nunca cortado) com lupa para Tabatinga e Guarantã, ranking, boletim de urna, quadradinhos, barras, grade de 100 pontos, rosquinhas, tabela 1º × 2º turno e barra de proporção.
  - **Cores:** azul, verde e amarelo do avatar do OSM. Lula em azul e Flávio em âmbar, sem cor partidária.
- **Área segura do Instagram:** todo o conteúdo fica entre x 60–930 e y 250–1500 (regra do `CLAUDE.md`).
- **"Urna por urna, o número confere":** a referência diz "O Jornal Razão abriu os boletins do TSE, urna por urna, e o número confere". Essa conferência foi feita por eles, não pelo OSM. O texto foi trocado por "Conferidos nos boletins do TSE, urna por urna, os números batem". **Só publique essa frase se o OSM ou uma fonte citada tiver de fato conferido os boletins.** Se não, troque por algo como "segundo o levantamento".
- **Fechamento:** "O Sul-Mato-Grossense mostra os números, e quem tira a conclusão é você."

## Dados (como aparecem na referência)
| Cena | Dado | Fonte citada |
|---|---|---|
| Abertura | 106 urnas com zero voto para Flávio no 2º turno; Lula 14.860 votos nelas | TSE, boletins de urna do 2º turno (25/10/2026); levantamento Paris Group (Folha, Painel, 27/10) |
| Estados | AM 30, MA 20, PA 16, RR 8, TO 7, MT 5, BA 4, AC 3, CE 2, MG 2, RS 2, ES 1, MS 1, PB 1, PE 1, PI 1, PR 1, RO 1 (18 estados, 67 cidades) | idem |
| Tabatinga (AM) | E. M. Indígena Rainha dos Apóstolos, zona 36, seção 61: Lula 354, Flávio 0, nulos 11, brancos 0, comparecimento 365 | TSE, boletim de urna e cadastro de locais |
| Locais | 68 aldeias/escolas indígenas, 29 povoados rurais e ribeirinhos, 5 quilombos, 2 assentamentos, 2 presídios | TSE, locais de votação 2026 (tipo pelo nome e endereço) |
| Perfil | 19,5% de analfabetos em 89 urnas, contra 5,0% na média dos mesmos 7 estados (3,9×) | TSE, perfil do eleitorado por seção 2026 (AC, AM, MA, MT, PA, RR, TO) |
| Bolsa Família | 13,3 famílias por 100 moradores nas 67 cidades (563.598 famílias), contra 9,0 no Brasil (18,8 milhões) | Portal da Transparência (ago/2026); IBGE, Censo 2022 |
| Guarantã do Norte (MT) | Flávio 81,8% na cidade e 0% na urna da aldeia Sankorassan (povo Panará), onde Lula teve 145 votos | TSE, seção 284, zona 44 |
| PL no 1º turno, nas 106 urnas | Governador 2,7% (385 de 14.002); Senado 4,8% (1.274 de 26.382) | TSE, boletins do 1º turno (4/10/2026) |
| Roraima | Arthur Henrique (PL): 27,3% nas 8 urnas, 69,1% no estado | idem |
| Lula zero | 4 urnas (2 RS, 2 PA), onde Flávio teve 296 votos; no 1º turno, Flávio zerou em 81 urnas e Lula em 8 | TSE, boletins do 1º e do 2º turno |
| Final | 106 de 497.897 urnas = 0,02% | TSE |

**Verificação:** a imprensa confirma o número central, 106 urnas e 14.860 votos ([Folha da Política](https://folhadapolitica.com/flavio-bolsonaro-teve-zero-voto-em-106-urnas-nas-quais-lula-somou-quase-15-mil/), [Gazeta Brasil](https://gazetabrasil.com.br/brasil/2026/10/27/levantamento-aponta-zero-voto-para-flavio-em-106-urnas-onde-ele-havia-somado-quase-15-mil/)), e também os 354 votos em Tabatinga. Os demais números vêm do vídeo de referência e não foram conferidos no TSE, porque o site estava inacessível no ambiente onde o vídeo foi feito.

## Créditos
- Contornos dos estados: [@svg-maps/brazil](https://github.com/VictorCazanave/svg-maps) (CC-BY 4.0). A posição de Tabatinga e Guarantã do Norte é aproximada.
- Fonte tipográfica: Bricolage Grotesque (SIL OFL).

## Renderizar
```bash
npm i
npm run dev
npx remotion render Urnas-Zeradas out/urnas-zeradas.mp4
```
