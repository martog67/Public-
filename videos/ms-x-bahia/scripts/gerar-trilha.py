"""Gera a trilha sonora do vídeo MS x Bahia por síntese (composição original, sem licença de terceiros).

Uso: python3 scripts/gerar-trilha.py public/audio/trilha.wav
Os tempos dos cortes e dos pontos do placar seguem src/theme.ts (30 fps).
"""

import sys
import wave

import numpy as np

SR = 44100
FPS = 30
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT

# Espelha src/theme.ts
INTRO = 146
INDICADORES = [334, 303, 409, 275]
GOVERNO, TENDENCIA, FINAL = 334, 310, 244
PONTOS = [225, 205, 265, 240]

inicio_ind = [INTRO + sum(INDICADORES[:i]) for i in range(4)]
inicio_gov = INTRO + sum(INDICADORES)
inicio_tend = inicio_gov + GOVERNO
inicio_final = inicio_tend + TENDENCIA
total_frames = inicio_final + FINAL

s = lambda f: f / FPS  # frames -> segundos
DUR = s(total_frames)
CORTES = [s(f) for f in [*inicio_ind, inicio_gov, inicio_tend, inicio_final]]
PONTOS_S = [s(inicio_ind[i] + PONTOS[i]) for i in range(4)]

N = int(DUR * SR) + SR
mix = np.zeros((N, 2))
rng = np.random.default_rng(7)


def nota(n):
    """Número MIDI -> Hz"""
    return 440.0 * 2 ** ((n - 69) / 12)


def add(sinal, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N:
        return
    sinal = sinal[: N - i]
    l, r = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
    mix[i : i + len(sinal), 0] += sinal * gain * l
    mix[i : i + len(sinal), 1] += sinal * gain * r


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
        f = nota(n)
        for k, amp in [(1, 1.0), (2, 0.35), (3, 0.15)]:
            for det in (-0.12, 0.12):  # leve desafinação = coro
                out += amp * np.sin(2 * np.pi * f * k * (1 + det / 100) * t + rng.random() * 6)
    out *= 0.9 + 0.1 * np.sin(2 * np.pi * 0.25 * t)
    return out / (len(notas) * 4) * env(len(t), a=0.6, r=0.8)


def baixo(n, dur):
    t = np.arange(int(dur * SR)) / SR
    f = nota(n)
    x = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)
    return x * np.exp(-t * 5) * env(len(t), a=0.004, r=0.03)


def bumbo():
    t = np.arange(int(0.45 * SR)) / SR
    freq = 45 + 85 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 9)


def chimbal(dur=0.05):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    x = np.diff(np.diff(x, prepend=0), prepend=0)  # passa-altas simples
    return x * np.exp(-np.arange(n) / SR * 70) * 0.25


def sino(n=88):
    t = np.arange(int(1.6 * SR)) / SR
    f = nota(n)
    x = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * d) for k, a, d in [(1, 1, 3), (2.76, 0.4, 5), (5.4, 0.2, 8)])
    return x * env(len(t), a=0.002, r=0.1)


def impacto():
    t = np.arange(int(1.8 * SR)) / SR
    boom = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-t * 12)) / SR) * np.exp(-t * 2.5)
    ruido = rng.standard_normal(len(t)) * np.exp(-t * 6) * 0.15
    return boom + ruido


def whoosh(dur=0.9):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    k = 40
    x = np.convolve(x, np.ones(k) / k, mode="same")  # suaviza (passa-baixas)
    return x * np.linspace(0, 1, n) ** 2 * 1.6


# Progressões (lá menor). Cada acorde dura 1 compasso.
AM, F, C, G, DM, E = [57, 60, 64], [53, 57, 60], [48, 55, 64], [55, 59, 62], [50, 53, 57], [52, 56, 59]
RAIZ = {id(AM): 45, id(F): 41, id(C): 48, id(G): 43, id(DM): 38, id(E): 40}


def secao(t0, t1, acordes, bateria, pulso):
    t, i = t0, 0
    while t < t1 - 0.05:
        ac = acordes[i % len(acordes)]
        dur = min(BAR, t1 - t)
        add(pad(ac, dur + 0.6), t, gain=0.55)
        if pulso:
            for b in range(8):
                tb = t + b * BEAT / 2
                if tb < t1:
                    add(baixo(RAIZ[id(ac)], BEAT / 2), tb, gain=0.45)
        if bateria:
            for b in range(4):
                tb = t + b * BEAT
                if tb >= t1:
                    break
                if bateria == "cheia" or b in (0, 2):
                    if b in (0, 2) or bateria == "cheia" and b == 3 and i % 2:
                        add(bumbo(), tb, gain=0.7)
                for h in range(2 if bateria == "cheia" else 1):
                    th = tb + h * BEAT / 2 + (BEAT / 2 if bateria != "cheia" else 0)
                    if th < t1:
                        add(chimbal(), th, gain=0.5, pan=0.3)
        t += BAR
        i += 1


c = CORTES
secao(0, c[0], [AM], None, False)  # abertura: só pad crescendo
secao(c[0], c[4], [AM, F, C, G], "cheia", True)  # 4 indicadores
secao(c[4], c[5], [DM, F, AM, G], None, False)  # quem governa: respiro
secao(c[5], c[6], [AM, F, DM, E], "meia", True)  # tendência: tensão
secao(c[6], DUR, [F, G, C], None, False)  # final: resolve em dó maior

for corte in c:
    add(whoosh(), corte - 0.9, gain=0.18)
    add(impacto(), corte, gain=0.5)
for p in PONTOS_S:
    add(sino(), p, gain=0.22, pan=-0.2)

# Fade final, eco curto para dar espaço, normalização
fade = int(2.5 * SR)
fim = int(DUR * SR)
mix[fim - fade : fim] *= np.linspace(1, 0, fade)[:, None]
mix[fim:] = 0
eco = np.zeros_like(mix)
for atraso, g in [(0.11, 0.25), (0.23, 0.15), (0.37, 0.08)]:
    d = int(atraso * SR)
    eco[d:] += mix[:-d] * g
mix = (mix + eco)[:fim]
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.2) * 0.89

with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print(f"trilha: {DUR:.2f}s, cortes {[round(x, 2) for x in c]}, pontos {[round(x, 2) for x in PONTOS_S]}")
