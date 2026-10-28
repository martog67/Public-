# 106 urnas com zero voto para Flávio (O Sul-Mato-Grossense)

Vídeo vertical 1080×1920, 30 fps, cerca de 2 min. Segue o roteiro e o conteúdo de um vídeo de referência de outro veículo, com layout próprio e a identidade do OSM.

- **Prévia sem áudio:** [`entrega/previa-sem-audio.mp4`](entrega/previa-sem-audio.mp4). Os tempos são provisórios, tirados do vídeo de referência.
- **Para sincronizar com a narração final:** ajuste os tempos em `src/legendas.ts`. As cenas e animações seguem as frases marcadas (`marca`), sem precisar mexer no resto.

## Diferenças em relação à referência
- **Layout próprio:** cabeçalho com o logo do OSM; azul, verde e amarelo do avatar do OSM; e outros elementos visuais: grade com as 106 urnas, boletim de urna em papel, quadradinhos para os locais de votação, grade de 100 pontos para o Bolsa Família e ranking em duas colunas.
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
- Fonte tipográfica: Inter (SIL OFL).

## Renderizar
```bash
npm i
npm run dev
npx remotion render Urnas-Zeradas out/urnas-zeradas.mp4
```
