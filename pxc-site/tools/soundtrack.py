"""Compose the PXC hero soundtrack in code. Royalty-free by construction.

usage: python3 tools/soundtrack.py <out_dir> [--film-seconds 23] [--turn 11.5]

Writes:
  film.wav        the linear score for the rendered film: frantic, off-kilter
                  168 bpm with non-stop phones, a tape-stop at the turn, then a
                  warm 76 bpm calm with no phones at all.
  chaos-loop.wav  an 8-bar loop of the chaos for the site (opt-in sound)
  calm-loop.wav   an 8-bar loop of the calm for the site
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def t_(sec):
    return np.arange(int(sec * SR)) / SR


def env(n, a=0.005, r=0.2):
    e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)
    if nr < n:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def place(buf, sig, at, pan=0.0, gain=1.0):
    i = int(at * SR)
    if i < 0:  # timing jitter can push the very first hit before zero
        sig, i = sig[-i:], 0
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(sig), 0] += sig * l
    buf[i:i + len(sig), 1] += sig * r


def kick(dec=0.28):
    t = t_(dec)
    f = 48 + 110 * np.exp(-t * 32)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def hat(dec=0.05):
    t = t_(dec)
    n = rng.standard_normal(len(t))
    n = np.diff(n, prepend=0)  # crude high-pass
    return n * np.exp(-t * 70) * 0.35


def snare():
    t = t_(0.18)
    return (rng.standard_normal(len(t)) * 0.6 + np.sin(2 * np.pi * 190 * t) * 0.5) * np.exp(-t * 22)


def saw(freq, dur, detune=0.0):
    t = t_(dur)
    out = 0
    for d in (-detune, 0, detune):
        ph = (t * freq * (1 + d)) % 1
        out = out + (2 * ph - 1)
    return out / 3


def stab(freqs, dur, wobble=0.0):
    t = t_(dur)
    sig = sum(saw(f, dur, 0.012 + wobble) for f in freqs)
    # lowpass-ish: moving average
    k = 12
    sig = np.convolve(sig, np.ones(k) / k, mode="same")
    return sig * env(len(t), 0.003, dur * 0.7) * 0.22


def ring_us(dur):  # North American ring: 440 + 480 Hz
    t = t_(dur)
    return (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * 0.5 * env(len(t), 0.01, 0.03)


def ring_trill(dur):  # electronic desk phone trill
    t = t_(dur)
    f = np.where((t * 16) % 1 < 0.5, 1320, 1580)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.35 * env(len(t), 0.01, 0.03)


def pad(freqs, dur):
    t = t_(dur)
    sig = 0
    for f in freqs:
        for d in (-0.003, 0.003):
            sig = sig + np.sin(2 * np.pi * f * (1 + d) * t) + 0.25 * np.sin(2 * np.pi * 2 * f * (1 + d) * t)
    return sig / (len(freqs) * 2.5) * env(len(t), dur * 0.35, dur * 0.4)


def pluck(f, dur=0.9):
    t = t_(dur)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 3 * f * t)) * np.exp(-t * 5) * 0.25


def note(n):  # MIDI to Hz
    return 440 * 2 ** ((n - 69) / 12)


def chaos(buf, start, end, rings=True):
    bpm = 168
    beat = 60 / bpm
    step = beat / 4
    # an off-kilter 7-step kick pattern over 16th notes, with timing jitter
    kp = [0, 3, 6, 7, 10, 13, 14]
    i, t = 0, start
    while t < end:
        s = i % 16
        jitter = rng.normal(0, 0.006)
        if s in kp or (i // 16) % 3 == 2 and s == 11:
            place(buf, kick(), t + jitter, 0, 0.9)
        if s in (4, 12):
            place(buf, snare(), t + jitter, 0.1, 0.45)
        place(buf, hat(), t + jitter * 2, rng.uniform(-0.6, 0.6), 0.5 if s % 2 else 0.25)
        i += 1
        t += step
    # dissonant stabs: minor-second clusters, slightly out of tune, irregular placement
    chords = [[57, 58, 64], [55, 56, 62], [58, 59, 65], [53, 54, 60]]
    t, k = start, 0
    while t < end:
        c = chords[k % len(chords)]
        place(buf, stab([note(n) * (1 + rng.normal(0, 0.004)) for n in c], beat * 1.5, rng.uniform(0, 0.02)), t, rng.uniform(-0.4, 0.4), 0.9)
        t += beat * rng.choice([1.5, 2, 2.5, 1.25])
        k += 1
    if rings:
        # three phones that never stop, out of phase, plus a trilling desk phone
        for pan, off, kind in ((-0.7, 0.0, ring_us), (0.6, 1.3, ring_us), (0.0, 2.6, ring_trill), (0.85, 0.7, ring_trill)):
            t = start + off
            while t < end - 0.2:
                if kind is ring_us:
                    place(buf, kind(min(2.0, end - t)), t, pan, 0.16)
                    t += 4.0 + rng.uniform(-0.2, 0.2)
                else:
                    for b in (0, 0.45):
                        place(buf, kind(0.36), t + b, pan, 0.12)
                    t += 2.2 + rng.uniform(-0.15, 0.15)


def calm(buf, start, end):
    bpm = 76
    beat = 60 / bpm
    prog = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 64]]  # Cmaj7 Am7 Fmaj7 G6
    t, k = start, 0
    while t < end:
        c = prog[k % 4]
        dur = min(beat * 4 + 1.5, end - t + 0.01)
        place(buf, pad([note(n) for n in c], dur), t, 0, 0.55)
        place(buf, pad([note(c[0] - 12)], dur), t, 0, 0.35)
        for j, n in enumerate([c[0] + 12, c[2] + 12, c[1] + 12, c[3] + 12]):
            if t + j * beat < end:
                place(buf, pluck(note(n)), t + j * beat, -0.3 + 0.2 * j, 0.6)
        if t < end:
            place(buf, kick(0.4) * 0.5, t, 0, 0.5)
        t += beat * 4
        k += 1


def reverb(buf, sec=1.8, mix=0.22):
    n = int(sec * SR)
    ir = rng.standard_normal((n, 2)) * np.exp(-np.linspace(0, 6, n))[:, None]
    ir /= np.abs(ir).sum(axis=0)
    out = np.zeros((len(buf) + n - 1, 2))
    for ch in range(2):
        out[:, ch] = np.fft.irfft(np.fft.rfft(buf[:, ch], len(out)) * np.fft.rfft(ir[:, ch], len(out)), len(out))
    return buf * (1 - mix) + out[: len(buf)] * mix * 6


def write(path, buf):
    buf = buf / max(1e-6, np.abs(buf).max()) * 0.89
    data = (buf * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(path, f"{len(buf) / SR:.1f}s")


def tape_stop(buf, at, dur=0.9):
    """Slow the last moment of the chaos to a halt, like a tape machine losing power."""
    i, n = int(at * SR), int(dur * SR)
    seg = buf[i:i + n].copy()
    speed = np.linspace(1, 0.05, n)
    pos = np.cumsum(speed)
    pos = pos / pos[-1] * (n - 1) * 0.55
    for ch in range(2):
        buf[i:i + n, ch] = np.interp(pos, np.arange(n), seg[:, ch]) * np.linspace(1, 0, n)
    buf[i + n:i + n + int(0.25 * SR)] = 0


if __name__ == "__main__":
    out = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    out.mkdir(parents=True, exist_ok=True)
    argv = sys.argv
    total = float(argv[argv.index("--film-seconds") + 1]) if "--film-seconds" in argv else 23.0
    turn = float(argv[argv.index("--turn") + 1]) if "--turn" in argv else 11.5

    film = np.zeros((int(total * SR), 2))
    chaos(film, 0, turn)
    tape_stop(film, turn - 0.9)
    calm(film, turn + 0.3, total)
    film = reverb(film)
    fade = int(1.2 * SR)
    film[-fade:] *= np.linspace(1, 0, fade)[:, None]
    write(out / "film.wav", film)

    loop = 60 / 168 * 4 * 8  # 8 bars
    c = np.zeros((int(loop * SR), 2))
    chaos(c, 0, loop)
    write(out / "chaos-loop.wav", reverb(c, mix=0.15))
    loop = 60 / 76 * 4 * 4  # 4 bars
    k = np.zeros((int(loop * SR), 2))
    calm(k, 0, loop)
    write(out / "calm-loop.wav", reverb(k))
