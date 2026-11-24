# O discurso e a prática (OSM Explica)

Vídeo vertical 1080×1920, 30 fps, para o Instagram. Feito em HyperFrames.

**A pauta:** Hugo Motta, presidente da Câmara, defende um ajuste fiscal em nome "dos que mais precisam", enquanto a Câmara e o Senado licitam tablets e celulares de alto padrão. O vídeo mostra os dois lados: a fala, os números dos editais e a justificativa oficial de cada Casa.

- **Rascunho:** [`entrega/rascunho-sem-narracao.mp4`](entrega/rascunho-sem-narracao.mp4), com cerca de 86 s. Tem as falas do Motta e o CTA com áudio, mas a narração principal ainda não está gravada: as legendas mostram o texto, e os tempos são estimados.
- **Texto para o ElevenLabs:** [`narracao-elevenlabs.txt`](narracao-elevenlabs.txt). Use a mesma voz do CTA ("Davi Andrei", eleven_v4) e salve o resultado como `assets/audio/narracao.mp3`.
- **CTA:** reaproveitado de `videos/urnas-zeradas` (`assets/audio/cta.mp3`). Entra 0,4 s depois da narração, sobre a assinatura OSM Explica.

## Roteiro
| # | Cena | Áudio | Na tela |
|---|---|---|---|
| m1 | O discurso | Motta: "Esse ajuste será muito importante para o nosso país, adequar o orçamento público" | Etiqueta "O DISCURSO", vídeo da fala |
| n1 | O discurso | "Hugo Motta, presidente da Câmara, defende um ajuste nas contas públicas." | Nome, cargo e crédito da imagem |
| m2 + m3 | O discurso | Motta: "cuidando dos que mais precisam" / "proteger as pessoas mais carentes" | Legenda entre aspas |
| n2 | A prática | "Mas veja o que a própria Câmara quer comprar." | Etiqueta "A PRÁTICA" e card da reportagem do OSM |
| n3–n5 | Tablets | 604 tablets, até R$ 5,77 milhões; 513 para deputados (teto de quase R$ 10 mil cada), 91 para a administração; iPad Pro entre os modelos de referência | 604 / até R$ 5,77 milhões, grade com 604 pontos (513 + 91), modelos do edital |
| n6–n8 | Senado | Celulares: 95 iPhones 18 Pro e 330 aparelhos, troca a cada dois anos; estimado em R$ 6 mi, fechado em R$ 4,95 mi | Card da reportagem, grade com 425 aparelhos (95 + 330), barras estimado × pregão |
| n9 | O outro lado | Justificativas da Câmara e do Senado | Painéis com o que complementa a fala: o valor da Câmara é teto; no Senado, a operadora empresta e mantém os aparelhos |
| n10 | Fecho | "O ajuste nas contas vale para o país. Vale também para o Congresso?" | O discurso × a prática, com os dois valores |
| CTA | Assinatura | CTA gravado | Assinatura OSM Explica e "Siga nossos perfis" |

## Dados e fontes
| Dado | Fonte |
|---|---|
| Fala de Hugo Motta sobre o ajuste fiscal (trechos m1, m2 e m3) | Vídeo publicado pela Câmara dos Deputados (@camaradosdeputados), nov. 2026: [`assets/fonte/motta-ajuste-fiscal-original.mp4`](assets/fonte/motta-ajuste-fiscal-original.mp4). Transcrição feita com Whisper e conferida. Contexto: [Agência Câmara](https://www.camara.leg.br/noticias/1322184-motta-ve-ajuste-fiscal-como-essencial-para-avancar-com-investimentos-em-2027), [Congresso em Foco](https://www.congressoemfoco.com.br/noticia/131812/hugo-motta-celebra-aprovacao-do-ajuste-fiscal--primeiro-passo) |
| Câmara: Pregão Eletrônico nº 242/2026, 604 tablets (513 deputados com 5G + 91 administração com Wi-Fi), valor máximo de R$ 5.771.377,27, até R$ 9.809,86 (deputados) e R$ 8.119,99 (administração) por unidade, modelos de referência iPad Pro 11 e Galaxy Tab S11/S10+, justificativa (documentos, sistemas, reuniões virtuais, menos papel) | [Metrópoles](https://www.metropoles.com/brasil/camara-abre-pregao-de-r-57-milhoes-para-adquirir-ipads-para-deputados), [ND+](https://ndmais.com.br/politica/camara-abre-licitacao-para-adquirir-604-tablets-para-deputados-federais-no-valor-de-5-milhoes-de-reais/), [A Tarde](https://atarde.com.br/politica/camara-quer-gastar-r-57-milhoes-em-tablets-para-uso-de-deputados-1409203), [Plox](https://plox.com.br/noticia/11/11/2026/camara-compra-604-tablets) |
| Senado: Pregão Eletrônico nº 290/2026, 95 iPhones 18 Pro (senadores e diretores) e 330 aparelhos Samsung e Motorola (servidores), estimativa de R$ 6 milhões, empréstimo (comodato) com troca a cada dois anos, justificativa (mais barato que comprar) | [CNN Brasil](https://www.cnnbrasil.com.br/politica/senado-dara-95-iphones-18-pro-e-330-celulares-a-parlamentares-e-servidores/), [Tecnoblog](https://tecnoblog.net/noticias/senado-vai-fornecer-iphones-18-pro-a-senadores-em-contrato-de-r-6-milhoes/), [Plox](https://plox.com.br/noticia/10/11/2026/senado-licitacao-6-milhoes-iphones) |
| Senado: pregão fechado por R$ 4,95 milhões | [CNN Brasil](https://www.cnnbrasil.com.br/politica/senado-fecha-pregao-de-iphones-para-parlamentares-por-r-495-milhoes/) |

### Conferir antes de publicar
Os sites acima estavam bloqueados no ambiente onde o vídeo foi feito. Os dados vêm dos resumos de busca, em que vários veículos publicaram os mesmos números, e não da leitura direta das páginas nem dos editais.
- **R$ 4,95 milhões no Senado:** consta só na manchete da CNN Brasil. Confirme o valor e a empresa vencedora no resultado do Pregão 290/2026. Se não se confirmar, troque n8 e o fecho para "estimado em R$ 6 milhões".
- **Resultado do pregão da Câmara:** estava marcado para 17/11/2026. Se já houver resultado, vale trocar "até R$ 5,77 milhões" pelo valor fechado.
- **Data e local da fala:** o crédito diz "plenário da Câmara, nov. 2026". Confira a data exata no post original da Câmara.
- **Montagem da fala:** m2 e m3 são trechos separados do mesmo discurso. O crédito avisa "Trechos de fala". Nenhum trecho muda o sentido do que ele disse: os dois falam em proteger os mais pobres.
- **Senado ≠ Hugo Motta:** a compra dos celulares é do Senado, presidido por outra pessoa. O texto não atribui essa compra ao Motta.

## Editar e renderizar
Tudo sai do [`roteiro.json`](roteiro.json): textos, trechos da fala e tempos. O script [`scripts/montar.py`](scripts/montar.py) gera `index.html` e `compositions/`. Não edite esses arquivos à mão, porque o script sobrescreve.

```bash
python3 scripts/montar.py        # gera as composições
npx hyperframes check            # confere regras e layout
npx hyperframes preview          # pré-visualização
npx hyperframes render -o renders/discurso-x-pratica.mp4
```

**Quando a narração chegar:** coloque o arquivo em `assets/audio/narracao.mp3` e preencha `narracao_inicio` e `narracao_fim` de cada bloco `n*` no roteiro, com os tempos medidos no áudio (Whisper). Depois rode o script de novo: as cenas, as legendas e os cortes passam a seguir a voz real.

## Visual
- Fundo preto #0F0F11 e amarelo #F2DA4A, as cores da assinatura OSM Explica. Fonte: Bricolage Grotesque (SIL OFL); a fita "EXPLICA" usa Anton (SIL OFL).
- Logo do OSM e etiqueta "OSM EXPLICA" no topo durante todo o vídeo.
- Todo o conteúdo fica na área segura do Instagram (x 60–930, y 250–1500). Os frames de cada cena foram conferidos com `marca/instagram-area-segura-1080x1920.png` sobreposto.
- Os cards das reportagens do OSM (`assets/fonte/card-*.jpg`) aparecem como recorte na virada para "a prática" e na abertura do Senado.
- **Sem trilha sonora:** não havia uma trilha licenciada disponível. Se quiser, dá para gerar uma trilha original por script, como em `urnas-zeradas`.
