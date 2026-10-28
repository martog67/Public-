# Repositório de materiais do jornal O Sul-Mato-Grossense (OSM)

## Marca
- Todo material produzido para o jornal (vídeos, cards, thumbnails, posts) deve levar o logo do OSM. Os logos ficam em `marca/osm/logos/`; veja `marca/osm/README.md` para qual versão usar.
- Os logos são brancos com fundo transparente: use sobre fundo escuro.
- Não invente cores, fontes ou slogans da marca que não estejam em `marca/osm/`.
- O jornal também publica o perfil **O Campo-Grandense**. O logo dele fica em `marca/campo-grandense/logos/`.

## Série OSM Explica
- Vídeos explicativos (dados, apuração) fazem parte da série **OSM Explica**: a etiqueta "OSM EXPLICA" vai no topo.
- Todo vídeo da série termina com um CTA: "Siga nossos perfis", com os logos do OSM (@osulmatogrossense) e do O Campo-Grandense.
- A narração do CTA é gravada separada e entra depois da narração principal.
- Não repita na tela o texto que já está na legenda: legenda e grafismo devem se completar, não se duplicar.
- Fonte dos vídeos: Bricolage Grotesque (SIL OFL). É uma escolha de design, não uma fonte oficial da marca.

## Conteúdo jornalístico
- Todo número em um material precisa de fonte e período visíveis na tela (ex.: "IBGE/PNAD Contínua, 2º tri 2026").
- Registre as fontes completas (com links) no README do projeto do material.

## Vídeos
- Projetos de vídeo em Remotion ficam em `videos/<nome-do-video>/`. Use as skills `remotion-*` em `.claude/skills/`.

### Área segura do Instagram (regra obrigatória para vídeos verticais)
A interface do Instagram (perfil, áudio, menu, legenda do post e botões) cobre partes do vídeo. Em vídeos 1080×1920:
- **Área morta no topo: 250 px.** Nome do perfil, "Áudio original" e menu.
- **Área morta embaixo: 420 px.** Foto e nome do perfil, legenda do post e barra.
- **Área morta à direita: 150 px.** Curtir, comentar, repostar, enviar e salvar.
- **Margem à esquerda: 60 px.**
- **Todo conteúdo (logo, textos, números, fontes, legendas, placar e mapas) fica dentro da área segura: x de 60 a 930 e y de 250 a 1500 (870×1250).** Fora dela, só o fundo, que pode ocupar a tela inteira.
- Em outros tamanhos, mantenha as mesmas proporções.
- Antes de entregar, sobreponha `marca/instagram-area-segura-1080x1920.png` a frames de cada cena e confira que nada importante cai na área vermelha.
