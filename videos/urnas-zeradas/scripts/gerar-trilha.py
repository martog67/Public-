"""Gera a trilha do vídeo das 106 urnas por síntese (composição original, sem licença de terceiros).

Uso: python3 scripts/gerar-trilha.py src/legendas.ts trilha.wav
Os cortes e os sinos saem das frases marcadas em src/legendas.ts.
"""

import re
import sys
import wave

import numpy as np

SR = 44100
BPM = 84
BEAT = 60 / BPM
BAR = 4 * BEAT

src = open(sys.argv[1], encoding="utf-8").read()
MARCAS = {m: float(t) for t, m in re.findall(r'inicio: ([\d.]+),[^}]*?marca: "([^"]+)"', src)}
cta = re.search(r"CTA = \{ inicio: ([\d.]+), duracao: ([\d.]+) \}", src)
DUR = float(cta.group(1)) + float(cta.group(2)) + 1  # igual a src/roteiro.ts
corte = lambda m: max(0.0, MARCAS[m] - 0.25)  # igual a src/roteiro.ts

N = int(DUR * SR) + SR
mix = np.zeros((N, 2))
rng = np.random.default_rng(11)


def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def add(x, t0, g=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N:
        return
    x = x[: N - i]
    mix[i : i + len(x), 0] += x * g * np.sqrt((1 - pan) / 2)
    mix[i : i + len(x), 1] += x * g * np.sqrt((1 + pan) / 2)


def env(n, a=0.01, r=0.2):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def pad(notas, dur):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(t)
    for n in notas:
        for k, amp in [(1, 1.0), (2, 0.3), (3, 0.12)]:
            for det in (-0.15, 0.15):
                out += amp * np.sin(2 * np.pi * hz(n) * k * (1 + det / 100) * t + rng.random() * 6)
    out *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.2 * t)
    return out / (len(notas) * 4) * env(len(t), a=0.8, r=1.0)


def baixo(n, dur):
    t = np.arange(int(dur * SR)) / SR
    x = np.sin(2 * np.pi * hz(n) * t) + 0.35 * np.sin(4 * np.pi * hz(n) * t)
    return x * np.exp(-t * 4) * env(len(t), a=0.004, r=0.03)


def bumbo():
    t = np.arange(int(0.5 * SR)) / SR
    return np.sin(2 * np.pi * np.cumsum(42 + 80 * np.exp(-t * 28)) / SR) * np.exp(-t * 8)


def tique(dur=0.03, brilho=1.0):
    n = int(dur * SR)
    x = np.diff(np.diff(rng.standard_normal(n), prepend=0), prepend=0)
    return x * np.exp(-np.arange(n) / SR * 120) * 0.25 * brilho


def sino(n=86):
    t = np.arange(int(1.8 * SR)) / SR
    x = sum(a * np.sin(2 * np.pi * hz(n) * k * t) * np.exp(-t * d) for k, a, d in [(1, 1, 2.5), (2.76, 0.35, 4.5), (5.4, 0.15, 7)])
    return x * env(len(t), a=0.002, r=0.1)


def impacto():
    t = np.arange(int(2.0 * SR)) / SR
    boom = np.sin(2 * np.pi * np.cumsum(28 + 55 * np.exp(-t * 10)) / SR) * np.exp(-t * 2.2)
    return boom + rng.standard_normal(len(t)) * np.exp(-t * 7) * 0.12


def whoosh(dur=0.8):
    n = int(dur * SR)
    x = np.convolve(rng.standard_normal(n), np.ones(50) / 50, mode="same")
    return x * np.linspace(0, 1, n) ** 2 * 1.6


# Acordes em ré menor (notas MIDI) e fundamental do baixo
DM, BB, F, C, GM, A, DM9 = [62, 65, 69], [58, 62, 65], [57, 60, 65], [55, 60, 64], [55, 58, 62], [57, 61, 64], [62, 64, 65, 69]
RAIZ = {id(DM): 38, id(BB): 34, id(F): 41, id(C): 36, id(GM): 43, id(A): 33, id(DM9): 38}


def secao(t0, t1, acordes, bateria, pulso, tiquetaque=False):
    t, i = t0, 0
    while t < t1 - 0.05:
        ac = acordes[i % len(acordes)]
        dur = min(BAR, t1 - t)
        add(pad(ac, dur + 0.8), t, g=0.55)
        for b in range(8):
            tb = t + b * BEAT / 2
            if tb >= t1:
                break
            if pulso:
                add(baixo(RAIZ[id(ac)], BEAT / 2), tb, g=0.42)
            if tiquetaque:
                add(tique(brilho=1.0 if b % 2 == 0 else 0.6), tb, g=0.6, pan=0.4 if b % 2 else -0.4)
            if bateria:
                if b in (0, 4) or (bateria == "cheia" and b == 6 and i % 2):
                    add(bumbo(), tb, g=0.65)
                if b % 2 == 1 or bateria == "cheia":
                    add(tique(0.05), tb, g=0.45, pan=0.25)
        t += BAR
        i += 1


c = {m: corte(m) for m in ["abertura", "folha", "am", "perfil", "guaranta", "pl", "final", "cta"]}
secao(0, c["am"], [DM, BB], None, False, tiquetaque=True)  # abertura e levantamento: tique-taque
secao(c["am"], c["perfil"], [DM, BB, F, C], "leve", True)  # estados, Tabatinga, locais
secao(c["perfil"], c["guaranta"], [GM, DM, BB, A], "cheia", True)  # perfil e Bolsa Família
secao(c["guaranta"], c["pl"], [DM, BB], None, False)  # Guarantã: respiro
secao(c["pl"], c["final"], [GM, DM, A, DM], "leve", True)  # PL, Roraima, Lula zero
secao(c["final"], c["cta"], [DM9], None, False)  # final em suspenso
secao(c["cta"], DUR, [BB, F], None, True)  # CTA: resolve em fá maior

CORTES = [corte(m) for m in ["folha", "am", "ranking", "tabatinga", "locais", "perfil", "bolsa", "guaranta", "pl", "lula0", "final", "cta"]]
for t in CORTES:
    add(whoosh(), t - 0.8, g=0.15)
    add(impacto(), t, g=0.4)
for m, extra in [("106", 0), ("14860", 0.8), ("batem", 0), ("lula354", 1.7), ("flavio0", 0.4), ("media5", 0.3), ("9", 0.3), ("aldeia0", 0), ("rr27", 0), ("296", 0.6), ("final", 1.0)]:
    add(sino(), MARCAS[m] + extra, g=0.2, pan=-0.2)

fade = int(3.0 * SR)
fim = int(DUR * SR)
mix[fim - fade : fim] *= np.linspace(1, 0, fade)[:, None]
eco = np.zeros_like(mix)
for atraso, g in [(0.13, 0.25), (0.27, 0.15), (0.41, 0.08)]:
    d = int(atraso * SR)
    eco[d:] += mix[:-d] * g
mix = (mix + eco)[:fim]
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.2) * 0.89

with wave.open(sys.argv[2], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print(f"trilha {DUR:.2f}s, cortes {[round(x, 2) for x in CORTES]}")
