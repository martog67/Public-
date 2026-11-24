#!/usr/bin/env python3
"""Gera index.html e compositions/*.html a partir de roteiro.json.

Uso (na pasta do projeto):  python3 scripts/montar.py

Todos os tempos saem do roteiro. Sem narração gravada, a duração de cada
bloco é estimada pelo tamanho do texto; com assets/audio/narracao.mp3 e os
campos narracao_inicio/narracao_fim preenchidos, valem os tempos reais.
"""
import json
import os
import re
from html import escape

AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = json.load(open(os.path.join(AQUI, "roteiro.json"), encoding="utf-8"))
NARRACAO = "assets/audio/narracao.mp3"
TEM_NARRACAO = os.path.exists(os.path.join(AQUI, NARRACAO))

W, H = 1080, 1920
# Área segura do Instagram (CLAUDE.md): x 60–930, y 250–1500. Respiro de 24 px.
X0, LARG = 84, 822
CENTRO_X = 495
TOPO_PALCO = 400
LEGENDA_TOPO = 1300
FONTE_TOPO = 1222

PRETO = "#0F0F11"
AMARELO = "#F2DA4A"
CARTAO = "#1A1A1E"
CINZA = "rgba(255,255,255,0.66)"
CINZA2 = "rgba(255,255,255,0.5)"
LINHA = "rgba(255,255,255,0.14)"


def r2(x):
    return round(x + 1e-9, 2)


# ---------------------------------------------------------------- tempos
def duracao_estimada(b):
    # ElevenLabs em português lê cerca de 14,5 caracteres por segundo
    return len(b["fala"]) / 14.5 + 0.15


t = 0.0
for i, b in enumerate(R["blocos"]):
    if b["tipo"] == "motta":
        d = b["fim"] - b["inicio"]
    elif "narracao_inicio" in b and TEM_NARRACAO:
        d = b["narracao_fim"] - b["narracao_inicio"]
    else:
        d = duracao_estimada(b)
    b["t0"], b["t1"] = r2(t), r2(t + d)
    t = b["t1"] + (0 if b.get("colado_no_proximo") else R["intervalo"])

T_CTA = r2(R["blocos"][-1]["t1"] + 0.6)
CTA = R["cta"]
T_CTA_AUDIO = r2(T_CTA + CTA["atraso"])
FIM = r2(T_CTA_AUDIO + CTA["duracao"] + CTA["sobra"])

ORDEM = ["discurso", "pratica", "tablets", "senado", "outrolado", "fecho"]
CENA = {}
for c in ORDEM:
    bs = [b for b in R["blocos"] if b["cena"] == c]
    CENA[c] = {"t0": 0.0 if c == "discurso" else bs[0]["t0"], "blocos": {b["id"]: b for b in bs}}
for i, c in enumerate(ORDEM):
    CENA[c]["t1"] = CENA[ORDEM[i + 1]]["t0"] if i + 1 < len(ORDEM) else T_CTA
B = {b["id"]: b for b in R["blocos"]}


def L(cena, abs_t):
    """Tempo absoluto -> tempo local da cena."""
    return r2(abs_t - CENA[cena]["t0"])


# ---------------------------------------------------------------- comum
FONTES = "\n".join(
    f"""@font-face {{ font-family: "Bricolage Grotesque"; font-weight: {p}; src: url("assets/fonts/bricolage-grotesque-latin-{a}-normal.woff2") format("woff2"); }}"""
    for p, a in [(500, 500), (600, 600), (700, 700), (800, 800), (900, 800)]
) + """
@font-face { font-family: "Anton"; font-weight: 400; src: url("assets/fonts/anton-latin-400-normal.woff2") format("woff2"); }"""

BASE_CSS = f"""
{FONTES}
#root {{ position: absolute; inset: 0; font-family: "Bricolage Grotesque", sans-serif; color: #fff; }}
#root * {{ box-sizing: border-box; margin: 0; padding: 0; }}
#root .abs {{ position: absolute; }}
#root .chip {{ position: absolute; top: {TOPO_PALCO}px; left: {X0}px; font-weight: 800; font-size: 28px; letter-spacing: 0.14em; padding: 10px 18px 8px; line-height: 1; }}
#root .chip-branco {{ background: #fff; color: {PRETO}; }}
#root .chip-amarelo {{ background: {AMARELO}; color: {PRETO}; }}
#root .kicker {{ position: absolute; top: {TOPO_PALCO + 6}px; left: {X0}px; width: {LARG}px; font-weight: 800; font-size: 26px; letter-spacing: 0.1em; color: {AMARELO}; }}
#root .fonte {{ position: absolute; top: {FONTE_TOPO}px; left: {X0}px; width: {LARG}px; font-weight: 600; font-size: 24px; line-height: 1.2; color: {CINZA2}; }}
"""


def cena_html(cid, corpo, js, css="", variaveis=None):
    return f"""<template>
  <style>
{BASE_CSS}
{css}
  </style>
  <div id="root" data-composition-id="{cid}" data-width="{W}" data-height="{H}">
{corpo}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
{js}
    window.__timelines["{cid}"] = tl;
  </script>
</template>
"""


def entra(sel, t, y=24, dur=0.35, extra=""):
    return f'    tl.fromTo("{sel}", {{ opacity: 0, y: {y} {extra and ", " + extra.split("|")[0]} }}, {{ opacity: 1, y: 0 {extra and ", " + extra.split("|")[1]}, duration: {dur}, ease: "power3.out" }}, {r2(max(t, 0))});\n'


def sai(sel, t, dur=0.25):
    return f'    tl.to("{sel}", {{ opacity: 0, duration: {dur}, ease: "power2.in" }}, {r2(max(t, 0))});\n'


def fonte(id_, texto):
    return f'    <div id="{id_}" class="fonte">{texto}</div>\n'


# ---------------------------------------------------------------- cena: discurso
def cena_discurso():
    c = "discurso"
    blocos = [b for b in R["blocos"] if b["cena"] == c]
    videos = ""
    n = 0
    for i, b in enumerate(blocos):
        if b["tipo"] != "motta":
            continue
        # a imagem segue (muda) até o próximo trecho de fala dele ou o fim da cena
        seguintes = [x for x in blocos[i + 1:] if x["tipo"] == "motta"]
        prox = seguintes[0]["t0"] if seguintes else CENA[c]["t1"]
        off = b["inicio"] - b["fonte_inicio"]
        n += 1
        videos += f'        <video id="d-v{n}" class="clip" src="{b["arquivo"]}" data-start="{L(c, b["t0"])}" data-duration="{r2(b["t1"] - b["t0"])}" data-media-start="{r2(off)}" data-has-audio="true" data-volume="1" data-track-index="0" playsinline></video>\n'
        resto = r2(prox - b["t1"])
        if resto > 0.01:
            n += 1
            videos += f'        <video id="d-v{n}" class="clip" src="{b["arquivo"]}" data-start="{L(c, b["t1"])}" data-duration="{resto}" data-media-start="{r2(off + b["t1"] - b["t0"])}" data-track-index="0" muted playsinline></video>\n'
    n1 = B["n1"]
    css = f"""
#root #d-moldura {{ left: {X0}px; top: 470px; width: {LARG}px; height: 438px; border-radius: 18px; overflow: hidden; background: #000; }}
#root #d-zoom {{ position: absolute; inset: 0; }}
#root #d-zoom video {{ position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; }}
#root #d-nome {{ left: {X0}px; top: 938px; width: {LARG}px; }}
#root #d-nome .n {{ font-weight: 800; font-size: 52px; line-height: 1.05; }}
#root #d-nome .c {{ font-weight: 600; font-size: 29px; color: {CINZA}; margin-top: 8px; }}
#root #d-credito {{ left: {X0}px; top: 1096px; width: {LARG}px; font-weight: 600; font-size: 25px; line-height: 1.25; color: {CINZA2}; }}
"""
    corpo = f"""    <div id="d-chip" class="chip chip-branco">O DISCURSO</div>
    <div id="d-moldura" class="abs">
      <div id="d-zoom">
{videos}      </div>
    </div>
    <div id="d-nome" class="abs"><div class="n">Hugo Motta</div><div class="c">Presidente da Câmara dos Deputados (Republicanos-PB)</div></div>
    <div id="d-credito" class="abs">Trechos de fala no plenário da Câmara, nov. 2026.<br>Reprodução: Câmara dos Deputados (@camaradosdeputados)</div>
"""
    js = (
        '    tl.set("#d-chip", { opacity: 1 }, 0);\n'
        + f'    tl.fromTo("#d-zoom", {{ scale: 1 }}, {{ scale: 1.08, duration: {r2(CENA[c]["t1"])}, ease: "none" }}, 0);\n'
        + entra("#d-nome", L(c, n1["t0"]), y=20)
        + entra("#d-credito", L(c, n1["t0"]) + 0.25, y=12)
    )
    return cena_html(c, corpo, js, css)


# ---------------------------------------------------------------- cena: prática (virada)
def cena_pratica():
    c = "pratica"
    h = 740
    w = round(h * 1179 / 1694)
    css = f"""
#root #p-card {{ left: {CENTRO_X - w // 2}px; top: 474px; width: {w}px; height: {h}px; border-radius: 10px; box-shadow: 0 30px 80px rgba(0,0,0,0.6); }}
#root #p-rotulo {{ left: {X0}px; top: 1222px; width: {LARG}px; font-weight: 600; font-size: 26px; color: {CINZA2}; text-align: center; }}
"""
    corpo = f"""    <div id="p-chip" class="chip chip-amarelo">A PRÁTICA</div>
    <img id="p-card" class="abs" src="assets/fonte/card-camara-tablets.jpg" alt="Reportagem do OSM sobre os tablets da Câmara" />
    <div id="p-rotulo" class="abs">Reportagem de O Sul-Mato-Grossense</div>
"""
    js = (
        entra("#p-chip", 0.0, y=0, dur=0.25, extra="scale: 1.4|scale: 1")
        + f'    tl.fromTo("#p-card", {{ opacity: 0, y: 160, rotation: 4 }}, {{ opacity: 1, y: 0, rotation: -2, duration: 0.5, ease: "back.out(1.4)" }}, 0.1);\n'
        + f'    tl.fromTo("#p-card", {{ scale: 1 }}, {{ scale: 1.04, duration: {r2(CENA[c]["t1"] - CENA[c]["t0"])}, ease: "none" }}, 0.1);\n'
        + entra("#p-rotulo", 0.4, y=8)
    )
    return cena_html(c, corpo, js, css)


# ---------------------------------------------------------------- cena: tablets
def cena_tablets():
    c = "tablets"
    n4, n5 = B["n4"], B["n5"]
    cols, pitch, d = 38, LARG / 38, 15
    pontos = ""
    for k in range(604):
        x, y = (k % cols) * pitch, (k // cols) * 21
        cor = AMARELO if k < 513 else "rgba(255,255,255,0.85)"
        pontos += f'<i style="left:{x:.1f}px;top:{y}px;background:{cor}"></i>'
    css = f"""
#root #t-num {{ left: {X0 - 6}px; top: 448px; display: flex; align-items: baseline; gap: 22px; }}
#root #t-num b {{ font-weight: 800; font-size: 214px; line-height: 0.9; letter-spacing: -0.03em; }}
#root #t-num span {{ font-weight: 700; font-size: 58px; }}
#root #t-valor {{ left: {X0}px; top: 686px; font-weight: 800; font-size: 66px; color: {AMARELO}; line-height: 1; }}
#root #t-valor small {{ font-weight: 600; font-size: 26px; color: {CINZA}; margin-left: 14px; }}
#root #t-grade {{ left: {X0}px; top: 800px; width: {LARG}px; height: 336px; }}
#root #t-grade i {{ position: absolute; width: {d}px; height: {d}px; border-radius: 50%; }}
#root #t-leg {{ left: {X0}px; top: 1146px; width: {LARG}px; font-weight: 600; font-size: 26px; line-height: 1.32; }}
#root #t-leg .q {{ display: inline-block; width: 18px; height: 18px; border-radius: 50%; margin-right: 12px; vertical-align: 1px; }}
#root #t-leg em {{ font-style: normal; color: {CINZA}; }}
#root #t-mod {{ left: {X0}px; top: 800px; width: {LARG}px; }}
#root #t-mod .tt {{ font-weight: 800; font-size: 26px; letter-spacing: 0.1em; color: {AMARELO}; margin-bottom: 18px; }}
#root #t-mod .r {{ display: flex; justify-content: space-between; align-items: baseline; border-top: 2px solid {LINHA}; padding: 22px 0; }}
#root #t-mod .r b {{ font-weight: 800; font-size: 50px; }}
#root #t-mod .r span {{ font-weight: 600; font-size: 32px; color: {CINZA}; }}
"""
    corpo = f"""    <div id="t-kicker" class="kicker">CÂMARA DOS DEPUTADOS · TABLETS</div>
    <div id="t-num" class="abs"><b>604</b><span>tablets</span></div>
    <div id="t-valor" class="abs">até R$ 5,77 milhões<small>valor máximo</small></div>
    <div id="t-grade" class="abs" data-layout-ignore>{pontos}</div>
    <div id="t-leg" class="abs"><div><span class="q" style="background:{AMARELO}"></span>513 deputados (5G) <em>· até R$ 9.809,86 cada</em></div><div><span class="q" style="background:#fff"></span>91 administração (Wi-Fi) <em>· até R$ 8.119,99 cada</em></div></div>
    <div id="t-mod" class="abs"><div class="tt">MODELOS DE REFERÊNCIA NO EDITAL</div><div class="r"><b>iPad Pro 11</b><span>Apple</span></div><div class="r"><b>Galaxy Tab S11</b><span>Samsung</span></div><div class="r"><b>Galaxy Tab S10+</b><span>Samsung</span></div></div>
{fonte("t-fonte", "Fonte: Câmara dos Deputados, Pregão Eletrônico nº 242/2026 (nov. 2026). Valores máximos.")}"""
    a4, a5 = L(c, n4["t0"]), L(c, n5["t0"])
    js = (
        entra("#t-kicker", 0.0, y=0, dur=0.25)
        + entra("#t-num", 0.05, y=40, dur=0.4, extra="scale: 0.85|scale: 1")
        + entra("#t-valor", 0.9, y=20)
        + f'    tl.fromTo("#t-num b", {{ scale: 1 }}, {{ scale: 1.05, duration: {r2(L(c, n4["t0"]))}, ease: "none", transformOrigin: "0% 100%" }}, 0.45);\n'
        + entra("#t-fonte", 0.3, y=0)
        + f'    tl.fromTo("#t-grade", {{ clipPath: "inset(0% 0% 100% 0%)" }}, {{ clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power2.inOut" }}, {a4});\n'
        + f'    tl.set("#t-grade", {{ opacity: 0 }}, 0);\n    tl.set("#t-grade", {{ opacity: 1 }}, {a4});\n'
        + entra("#t-leg", a4 + 0.4, y=12)
        + sai("#t-grade", a5 - 0.05)
        + sai("#t-leg", a5 - 0.05)
        + entra("#t-mod", a5 + 0.2, y=24)
    )
    return cena_html(c, corpo, js, css)


# ---------------------------------------------------------------- cena: senado
def cena_senado():
    c = "senado"
    n7, n8 = B["n7"], B["n8"]
    h = 740
    w = round(h * 1179 / 1433)
    cols, px, py = 34, LARG / 34, 34
    fones = ""
    for k in range(425):
        x, y = (k % cols) * px, (k // cols) * py
        cor = AMARELO if k < 95 else "rgba(255,255,255,0.8)"
        fones += f'<i style="left:{x:.1f}px;top:{y}px;background:{cor}"></i>'
    css = f"""
#root #s-card {{ left: {CENTRO_X - w // 2}px; top: 474px; width: {w}px; height: {h}px; border-radius: 10px; box-shadow: 0 30px 80px rgba(0,0,0,0.6); }}
#root #s-grade {{ left: {X0}px; top: 476px; width: {LARG}px; height: 442px; }}
#root #s-grade i {{ position: absolute; width: 16px; height: 27px; border-radius: 4px; }}
#root #s-leg {{ left: {X0}px; top: 946px; width: {LARG}px; font-weight: 700; font-size: 34px; line-height: 1.4; }}
#root #s-leg .q {{ display: inline-block; width: 16px; height: 27px; border-radius: 4px; margin-right: 14px; vertical-align: -3px; }}
#root #s-leg em {{ font-style: normal; font-weight: 600; color: {CINZA}; }}
#root #s-barras {{ left: {X0}px; top: 480px; width: {LARG}px; }}
#root #s-barras .lin {{ margin-bottom: 64px; }}
#root #s-barras .rot {{ font-weight: 600; font-size: 30px; color: {CINZA}; }}
#root #s-barras .val {{ font-weight: 800; font-size: 76px; line-height: 1.1; }}
#root #s-barras .bar {{ height: 34px; border-radius: 6px; transform-origin: 0 50%; margin-top: 10px; }}
#root #s-dif {{ left: {X0}px; top: 900px; width: {LARG}px; font-weight: 600; font-size: 28px; color: {CINZA}; }}
"""
    corpo = f"""    <div id="s-kicker" class="kicker">SENADO FEDERAL · CELULARES</div>
    <img id="s-card" class="abs" src="assets/fonte/card-senado-iphones.jpg" alt="Reportagem do OSM sobre os celulares do Senado" />
    <div id="s-grade" class="abs" data-layout-ignore>{fones}</div>
    <div id="s-leg" class="abs"><div><span class="q" style="background:{AMARELO}"></span>95 iPhone 18 Pro</div><div><span class="q" style="background:#fff"></span>330 <em>Samsung e Motorola</em></div></div>
    <div id="s-barras" class="abs">
      <div class="lin"><div class="rot">Valor estimado</div><div class="val">R$ 6 milhões</div><div id="s-b1" class="bar" style="background:rgba(255,255,255,0.85)"></div></div>
      <div class="lin"><div class="rot">Valor do pregão</div><div class="val" style="color:{AMARELO}">R$ 4,95 milhões</div><div id="s-b2" class="bar" style="background:{AMARELO}"></div></div>
    </div>
    <div id="s-dif" class="abs">R$ 1,05 milhão abaixo do estimado</div>
{fonte("s-fonte", "Fonte: Senado Federal, Pregão Eletrônico nº 290/2026; resultado do pregão: CNN Brasil (nov. 2026).")}"""
    a7, a8 = L(c, n7["t0"]), L(c, n8["t0"])
    js = (
        entra("#s-kicker", 0.0, y=0, dur=0.25)
        + f'    tl.fromTo("#s-card", {{ opacity: 0, y: 160, rotation: -4 }}, {{ opacity: 1, y: 0, rotation: 2, duration: 0.5, ease: "back.out(1.4)" }}, 0.05);\n'
        + sai("#s-card", a7 - 0.25)
        + f'    tl.fromTo("#s-grade", {{ clipPath: "inset(0% 0% 100% 0%)", opacity: 1 }}, {{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.4, ease: "power2.inOut" }}, {a7});\n'
        + f'    tl.set("#s-grade", {{ opacity: 0 }}, 0);\n'
        + entra("#s-leg", a7 + 0.5, y=12)
        + entra("#s-fonte", a7, y=0)
        + sai("#s-grade", a8 - 0.05)
        + sai("#s-leg", a8 - 0.05)
        + entra("#s-barras", a8 + 0.15, y=20)
        + f'    tl.fromTo("#s-b1", {{ scaleX: 0 }}, {{ scaleX: 1, duration: 0.8, ease: "power3.out" }}, {r2(a8 + 0.3)});\n'
        + f'    tl.fromTo("#s-b2", {{ scaleX: 0 }}, {{ scaleX: {r2(4.95 / 6)}, duration: 0.8, ease: "power3.out" }}, {r2(a8 + 1.6)});\n'
        + entra("#s-dif", a8 + 2.4, y=10)
    )
    return cena_html(c, corpo, js, css)


# ---------------------------------------------------------------- cena: outro lado
def cena_outrolado():
    c = "outrolado"
    css = f"""
#root .painel {{ position: absolute; left: {X0}px; width: {LARG}px; background: {CARTAO}; border-radius: 20px; padding: 34px 38px; border-left: 8px solid {AMARELO}; }}
#root .painel .tt {{ font-weight: 800; font-size: 28px; letter-spacing: 0.12em; color: {AMARELO}; margin-bottom: 14px; }}
#root .painel .tx {{ font-weight: 700; font-size: 40px; line-height: 1.2; }}
#root #o-cam {{ top: 486px; }}
#root #o-sen {{ top: 836px; }}
"""
    corpo = f"""    <div id="o-chip" class="chip chip-branco">O OUTRO LADO</div>
    <div id="o-cam" class="painel"><div class="tt">CÂMARA</div><div class="tx">R$ 5,77 milhões é o teto. O gasto final depende das propostas no pregão.</div></div>
    <div id="o-sen" class="painel"><div class="tt">SENADO</div><div class="tx">A operadora empresta os aparelhos e cobre manutenção e troca.</div></div>
{fonte("o-fonte", "Fontes: editais e justificativas da Câmara e do Senado (nov. 2026).")}"""
    meio = r2((B["n9"]["t1"] - B["n9"]["t0"]) * 0.5)
    js = (
        entra("#o-chip", 0.0, y=0, dur=0.3, extra="scale: 1.3|scale: 1")
        + entra("#o-cam", 0.2, y=30)
        + entra("#o-sen", meio, y=30)
        + entra("#o-fonte", 0.3, y=0)
    )
    return cena_html(c, corpo, js, css)


# ---------------------------------------------------------------- cena: fecho
def cena_fecho():
    c = "fecho"
    dur = r2(CENA[c]["t1"] - CENA[c]["t0"])
    css = f"""
#root #f-moldura {{ left: {X0}px; top: 466px; width: {LARG}px; height: 290px; border-radius: 18px; overflow: hidden; background: #000; }}
#root #f-moldura video {{ position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }}
#root #f-chip2 {{ top: 800px; }}
#root .linha {{ position: absolute; left: {X0}px; width: {LARG}px; display: flex; align-items: baseline; gap: 18px; border-top: 2px solid {LINHA}; padding-top: 16px; }}
#root .linha b {{ font-weight: 800; font-size: 62px; color: {AMARELO}; white-space: nowrap; }}
#root .linha span {{ font-weight: 600; font-size: 30px; color: {CINZA}; }}
#root #f-l1 {{ top: 870px; }}
#root #f-l2 {{ top: 1010px; }}
"""
    corpo = f"""    <div id="f-chip1" class="chip chip-branco">O DISCURSO: AJUSTE FISCAL</div>
    <div id="f-moldura" class="abs"><video id="f-v" class="clip" src="assets/motta-b.mp4" data-start="0" data-duration="{dur}" data-media-start="0" data-track-index="0" muted playsinline></video></div>
    <div id="f-chip2" class="chip chip-amarelo">A PRÁTICA</div>
    <div id="f-l1" class="linha"><b>até R$ 5,77 mi</b><span>604 tablets · Câmara</span></div>
    <div id="f-l2" class="linha"><b>R$ 4,95 mi</b><span>425 celulares · Senado</span></div>
{fonte("f-fonte", "Fontes: Câmara (Pregão 242/2026) e Senado (Pregão 290/2026; resultado: CNN Brasil), nov. 2026.")}"""
    js = (
        entra("#f-chip1", 0.0, y=0, dur=0.25)
        + entra("#f-moldura", 0.05, y=20)
        + entra("#f-chip2", 0.5, y=0, dur=0.25, extra="scale: 1.3|scale: 1")
        + entra("#f-l1", 0.7, y=16)
        + entra("#f-l2", 0.95, y=16)
        + entra("#f-fonte", 0.5, y=0)
    )
    return cena_html(c, corpo, js, css)


# ---------------------------------------------------------------- assinatura OSM Explica + CTA
def cena_assinatura():
    c = "assinatura"
    siga = r2(CTA["atraso"] + CTA["siga"])
    pts = []
    import math
    for k in range(32):
        r = 50 if k % 2 == 0 else 34
        a = math.pi * k / 16
        pts.append(f"{60 + r * math.cos(a):.1f},{60 + r * math.sin(a):.1f}")
    estrela = " ".join(pts)
    css = f"""
#root #a-fundo {{ position: absolute; inset: 0; background: {PRETO}; }}
#root #a-ruido {{ position: absolute; inset: 0; opacity: 0.09; }}
#root #a-grupo {{ position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; }}
#root #a-logo {{ position: absolute; left: {CENTRO_X - 290}px; top: 690px; width: 580px; }}
#root #a-fita-w {{ position: absolute; left: {X0}px; top: 850px; width: {LARG}px; display: flex; justify-content: center; }}
#root #a-fita {{ background: {AMARELO}; color: {PRETO}; font-family: "Anton", sans-serif; font-size: 168px; line-height: 1.05; letter-spacing: 3px; padding: 6px 46px 0;
  clip-path: polygon(0% 6%, 7% 0%, 16% 5%, 28% 1%, 41% 4%, 55% 0%, 68% 5%, 82% 1%, 93% 4%, 100% 0%, 98% 30%, 100% 62%, 97% 100%, 85% 95%, 71% 100%, 58% 96%, 44% 100%, 30% 95%, 17% 100%, 6% 96%, 0% 100%, 2% 66%, 0% 34%); }}
#root #a-estrela {{ position: absolute; left: 780px; top: 600px; width: 120px; height: 120px; }}
#root #a-siga {{ position: absolute; left: {X0}px; top: 930px; width: {LARG}px; display: flex; flex-direction: column; align-items: center; }}
#root #a-siga .t {{ font-weight: 800; font-size: 66px; }}
#root #a-siga .perfis {{ width: 700px; margin-top: 44px; display: flex; flex-direction: column; gap: 34px; }}
#root #a-siga .pf {{ display: flex; align-items: center; justify-content: space-between; border-top: 2px solid {LINHA}; padding-top: 24px; }}
#root #a-siga .pf span {{ font-weight: 800; font-size: 36px; color: {AMARELO}; }}
"""
    corpo = f"""    <div id="a-fundo"></div>
    <svg id="a-ruido" width="{W}" height="{H}" data-layout-ignore><filter id="a-f"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3"/><feColorMatrix type="saturate" values="0"/></filter><rect width="{W}" height="{H}" filter="url(#a-f)"/></svg>
    <div id="a-grupo">
      <svg id="a-estrela" viewBox="0 0 120 120"><polygon points="{estrela}" fill="{AMARELO}"/></svg>
      <img id="a-logo" src="assets/marca/osm-nome-completo-recorte.png" alt="O Sul-Mato-Grossense" />
      <div id="a-fita-w"><div id="a-fita">EXPLICA</div></div>
    </div>
    <div id="a-siga">
      <div class="t">Siga nossos perfis</div>
      <div class="perfis">
        <div id="a-pf1" class="pf"><img src="assets/marca/osm-sigla-branco.png" style="height:56px" alt="OSM" /><span>@osulmatogrossense</span></div>
        <div id="a-pf2" class="pf"><img src="assets/marca/campo-grandense-recorte.png" style="height:56px" alt="O Campo-Grandense" /><span>@ocampograndense</span></div>
      </div>
    </div>
"""
    js = (
        entra("#a-logo", 0.1, y=20, dur=0.4)
        + '    tl.fromTo("#a-fita", { opacity: 0, scale: 1.3, rotation: 4.5 }, { opacity: 1, scale: 1, rotation: -1.5, duration: 0.45, ease: "back.out(2)" }, 0.35);\n'
        + '    tl.fromTo("#a-estrela", { scale: 0, rotation: 0 }, { scale: 1, rotation: 40, duration: 0.6, ease: "back.out(3)" }, 0.7);\n'
        + f'    tl.to("#a-estrela", {{ rotation: 120, duration: {r2(FIM - T_CTA)}, ease: "none" }}, 1.3);\n'
        + f'    tl.to("#a-grupo", {{ y: -250, duration: 0.6, ease: "power3.inOut" }}, {siga});\n'
        + f'    tl.fromTo("#a-siga", {{ opacity: 0, y: 40 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }}, {r2(siga + 0.15)});\n'
        + f'    tl.fromTo("#a-pf1", {{ opacity: 0, x: 30 }}, {{ opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }}, {r2(siga + 0.4)});\n'
        + f'    tl.fromTo("#a-pf2", {{ opacity: 0, x: 30 }}, {{ opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }}, {r2(siga + 0.85)});\n'
    )
    return cena_html(c, corpo, js, css)


# ---------------------------------------------------------------- moldura (logo + etiqueta)
def cena_moldura():
    c = "moldura"
    css = f"""
#root #m-logo {{ position: absolute; left: {X0}px; top: 272px; height: 58px; }}
#root #m-tag {{ position: absolute; top: 284px; right: {W - 906}px; font-weight: 800; font-size: 28px; letter-spacing: 0.14em; color: {AMARELO}; }}
#root #m-linha {{ position: absolute; left: {X0}px; top: 354px; width: {LARG}px; height: 2px; background: {LINHA}; transform-origin: 0 50%; }}
"""
    corpo = f"""    <img id="m-logo" src="assets/marca/osm-sigla-branco.png" alt="OSM" />
    <div id="m-tag">OSM EXPLICA</div>
    <div id="m-linha"></div>
"""
    js = (
        '    tl.set("#m-logo", { opacity: 1 }, 0);\n'
    )
    return cena_html(c, corpo, js, css)


# ---------------------------------------------------------------- legendas
FRACAS = set("a o as os e de da do das dos em no na nos nas um uma com para por que se ao à sai".split())


def grupos(texto, max_palavras):
    texto = re.sub(r"R\$ [\d.,]+(?: milhões| milhão| mil)?", lambda m: m.group(0).replace(" ", "\u00a0"), texto)
    palavras = texto.split(" ")
    gs, atual = [], []
    for j, p in enumerate(palavras):
        atual.append(p)
        fim_frase = re.search(r"[.,?!:;]$", p)
        # não termina um grupo em palavra de ligação ("de", "a", "com"...)
        ligacao = p.lower() in FRACAS and j + 1 < len(palavras) and len(atual) < max_palavras + 2
        if (len(atual) >= max_palavras and not ligacao) or (fim_frase and len(atual) >= 2):
            gs.append(atual)
            atual = []
    if atual:
        if gs and len(atual) == 1:
            gs[-1] += atual
        else:
            gs.append(atual)
    return [" ".join(g) for g in gs]


def cena_legendas():
    c = "legendas"
    itens = ""
    js = ""
    k = 0
    for b in R["blocos"]:
        motta = b["tipo"] == "motta"
        gs = grupos(b["legenda"], 5)
        pesos = [len(g) + 4 for g in gs]
        total = sum(pesos)
        d = b["t1"] - b["t0"]
        t = b["t0"]
        for i, g in enumerate(gs):
            t_ini = t
            t_fim = t + d * pesos[i] / total
            t = t_fim
            ini = r2(t_ini + (0.05 if i == 0 else 0))
            fim = r2(t_fim + (0.12 if i == len(gs) - 1 else 0))
            k += 1
            txt = escape(g)
            if motta:
                txt = f'<q>“</q>{txt}<q>”</q>'
            classe = "g motta" if motta else "g"
            itens += f'    <div id="lg{k}" class="clip {classe}" data-start="{ini}" data-duration="{r2(fim - ini)}" data-track-index="0"><span>{txt}</span></div>\n'
            js += f'    tl.fromTo("#lg{k} span", {{ opacity: 0, y: 14 }}, {{ opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }}, {ini});\n'
    css = f"""
#root .g {{ position: absolute; left: {X0}px; top: {LEGENDA_TOPO}px; width: {LARG}px; }}
#root .g span {{ display: block; font-weight: 800; font-size: 48px; line-height: 1.16; border-left: 6px solid {AMARELO}; padding-left: 22px; }}
#root .g.motta span {{ font-weight: 600; border-left-color: #fff; }}
#root .g q {{ quotes: none; color: {AMARELO}; font-weight: 800; }}
"""
    return cena_html(c, itens, js, css)


# ---------------------------------------------------------------- raiz
def raiz():
    hosts = ""
    for c in ORDEM:
        t0, t1 = CENA[c]["t0"], CENA[c]["t1"]
        hosts += f'      <div id="{c}" data-composition-id="{c}" data-composition-src="compositions/{c}.html" data-start="{t0}" data-duration="{r2(t1 - t0)}" data-track-index="1" data-track-kind="graphics" data-width="{W}" data-height="{H}"></div>\n'
    hosts += f'      <div id="assinatura" data-composition-id="assinatura" data-composition-src="compositions/assinatura.html" data-start="{T_CTA}" data-duration="{r2(FIM - T_CTA)}" data-track-index="1" data-track-kind="graphics" data-width="{W}" data-height="{H}"></div>\n'
    hosts += f'      <div id="moldura" data-composition-id="moldura" data-composition-src="compositions/moldura.html" data-start="0" data-duration="{T_CTA}" data-track-index="2" data-track-kind="graphics" data-width="{W}" data-height="{H}"></div>\n'
    hosts += f'      <div id="legendas" data-composition-id="legendas" data-composition-src="compositions/legendas.html" data-start="0" data-duration="{T_CTA}" data-track-index="3" data-track-kind="captions" data-width="{W}" data-height="{H}"></div>\n'
    audios = ""
    if TEM_NARRACAO:
        for b in R["blocos"]:
            if b["tipo"] == "narracao" and "narracao_inicio" in b:
                audios += f'      <audio id="voz-{b["id"]}" class="clip" src="{NARRACAO}" data-start="{b["t0"]}" data-duration="{r2(b["t1"] - b["t0"])}" data-media-start="{b["narracao_inicio"]}" data-volume="1" data-track-index="4"></audio>\n'
    audios += f'      <audio id="voz-cta" class="clip" src="{CTA["arquivo"]}" data-start="{T_CTA_AUDIO}" data-duration="{CTA["duracao"]}" data-volume="1" data-track-index="4"></audio>\n'
    return f"""<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <title>O discurso e a prática — OSM Explica</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: {W}px; height: {H}px; overflow: hidden; background: {PRETO}; }}
      #root {{ position: relative; width: {W}px; height: {H}px; background: {PRETO}; }}
      #fundo {{ position: absolute; inset: 0; background: radial-gradient(120% 70% at 50% 40%, #1b1b20 0%, {PRETO} 70%); }}
    </style>
  </head>
  <body>
    <!-- Gerado por scripts/montar.py a partir de roteiro.json. Edite o roteiro e rode o script de novo. -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="{FIM}" data-width="{W}" data-height="{H}">
      <div id="fundo"></div>
{hosts}{audios}    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
"""


os.makedirs(os.path.join(AQUI, "compositions"), exist_ok=True)
saidas = {
    "index.html": raiz(),
    "compositions/discurso.html": cena_discurso(),
    "compositions/pratica.html": cena_pratica(),
    "compositions/tablets.html": cena_tablets(),
    "compositions/senado.html": cena_senado(),
    "compositions/outrolado.html": cena_outrolado(),
    "compositions/fecho.html": cena_fecho(),
    "compositions/assinatura.html": cena_assinatura(),
    "compositions/moldura.html": cena_moldura(),
    "compositions/legendas.html": cena_legendas(),
}
for nome, conteudo in saidas.items():
    with open(os.path.join(AQUI, nome), "w", encoding="utf-8") as f:
        f.write(conteudo)

print(f"narração gravada: {'sim' if TEM_NARRACAO else 'não (tempos estimados)'}")
for b in R["blocos"]:
    print(f"  {b['id']:>4} {b['cena']:<10} {b['t0']:6.2f} – {b['t1']:6.2f}")
print(f"  CTA {T_CTA:.2f} (áudio {T_CTA_AUDIO:.2f}) · fim {FIM:.2f} s")
