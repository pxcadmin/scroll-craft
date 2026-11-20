"""Mix the hero soundtrack: realistic room tone over a quiet music bed.

usage: python3 tools/mix.py [--film-seconds 25.88] [--turn 12]

Inputs (hero-src/audio/):
  chaos-tone.mp4, calm-tone.mp4   room tone with synchronized speech (Seedance native audio)
  film.wav, chaos-loop.wav, calm-loop.wav   the composed music (tools/soundtrack.py)
Outputs:
  hero-src/audio/film-mix.wav           the film's soundtrack
  src/assets/hero/chaos-loop.m4a        site loop, chaos (room tone + music)
  src/assets/hero/calm-loop.m4a         site loop, calm
"""
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
A = Path(__file__).resolve().parent.parent / "hero-src" / "audio"
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "hero"


def arg(n, d):
    return float(sys.argv[sys.argv.index(n) + 1]) if n in sys.argv else d


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "s16le", "-ac", "2", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, "<i2").reshape(-1, 2).astype(np.float32) / 32768


def rms(x):
    return float(np.sqrt(np.mean(x ** 2)) + 1e-9)


def fit(x, n):
    """Loop or trim to n samples, crossfading the loop seam."""
    if len(x) >= n:
        return x[:n].copy()
    out, xf = x.copy(), int(0.5 * SR)
    while len(out) < n:
        ramp = np.linspace(0, 1, xf)[:, None]
        out[-xf:] = out[-xf:] * (1 - ramp) + x[:xf] * ramp
        out = np.concatenate([out, x[xf:]])
    return out[:n]


def ramp(n, a, b, fade_in, fade_out):
    """Envelope that is 1 between a and b (seconds), with fades outside."""
    t = np.arange(n) / SR
    e = np.clip((t - (a - fade_in)) / max(fade_in, 1e-3), 0, 1) * np.clip(((b + fade_out) - t) / max(fade_out, 1e-3), 0, 1)
    return e[:, None]


def loopable(x, xf=0.6):
    """Make a clip loop seamlessly by folding its tail into its head."""
    n = int(xf * SR)
    head, tail = x[:n], x[-n:]
    r = np.linspace(0, 1, n)[:, None]
    y = x[:-n].copy()
    y[:n] = tail * (1 - r) + head * r
    return y


def phones(n, seed=3):
    """Three office lines that never stop: a modern desk-phone trill at the desk, an
    older two-tone ringer down the counter, a third line farther off. Each has its
    own cadence, distance and pan, run through short room reflections so it sits in
    the space instead of on top of it."""
    rng = np.random.default_rng(seed)
    out = np.zeros((n, 2), np.float32)

    def trill(dur):  # electronic desk phone: two tones alternating ~18 times a second
        t = np.arange(int(dur * SR)) / SR
        f = np.where((t * 18) % 1 < 0.5, 1209.0, 1477.0)
        tone = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.35 * np.sin(4 * np.pi * np.cumsum(f) / SR)
        return tone * np.minimum(1, np.minimum(t, dur - t) / 0.01)

    def bell(dur):  # older ringer: 440 + 480 Hz, amplitude-modulated at 20 Hz like a clapper
        t = np.arange(int(dur * SR)) / SR
        tone = np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t) + 0.3 * np.sin(2 * np.pi * 960 * t)
        return tone * (0.65 + 0.35 * np.sign(np.sin(2 * np.pi * 20 * t))) * np.minimum(1, np.minimum(t, dur - t) / 0.01)

    lines = [  # (sound, on-pattern, period s, start s, gain, pan)
        (trill, [(0, 0.4), (0.6, 1.0)], 3.0, 0.15, 0.30, 0.45),
        (bell, [(0, 2.0)], 4.0, 1.1, 0.20, -0.35),
        (trill, [(0, 0.4), (0.6, 1.0)], 3.4, 2.0, 0.13, 0.8),
    ]
    for snd, pattern, period, start, g, pan in lines:
        t0 = start
        while t0 < n / SR:
            for a0, a1 in pattern:
                seg = snd(a1 - a0) * g
                i = int((t0 + a0) * SR)
                if i >= n:
                    break
                seg = seg[: n - i]
                l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
                out[i:i + len(seg), 0] += seg * l
                out[i:i + len(seg), 1] += seg * r
            t0 += period + rng.uniform(-0.08, 0.08)
    # a small room: a few early reflections and a soft tail, darker than the direct sound
    wet = np.zeros_like(out)
    for d_ms, gn in ((11, 0.45), (23, 0.32), (37, 0.24), (61, 0.16), (97, 0.1)):
        k = int(d_ms * SR / 1000)
        wet[k:] += out[:-k] * gn
    wet = np.convolve(wet[:, 0], np.ones(6) / 6, "same")[:, None] * [1, 0] + np.convolve(wet[:, 1], np.ones(6) / 6, "same")[:, None] * [0, 1]
    return (out * 0.75 + wet * 0.6).astype(np.float32)


def save_wav(path, x):
    x = x / max(1e-6, np.abs(x).max()) * 0.89
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def save_m4a(path, x):
    tmp = A / (path.stem + ".tmp.wav")
    save_wav(tmp, x)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-c:a", "aac", "-b:a", "112k", "-movflags", "+faststart", str(path)], check=True)
    tmp.unlink()


if __name__ == "__main__":
    total, turn = arg("--film-seconds", 25.88), arg("--turn", 12.0)
    n = int(total * SR)
    chaos_tone, calm_tone = load(A / "chaos-tone.mp4"), load(A / "calm-tone.mp4")
    music = fit(load(A / "film.wav"), n)
    # levels: room tone carries the scene; music sits about 9 dB under it
    chaos_tone *= 0.25 / rms(chaos_tone)
    calm_tone *= 0.16 / rms(calm_tone)
    music *= 0.09 / rms(music)

    film = music.copy()
    film += fit(chaos_tone, n) * ramp(n, 0, turn - 0.6, 0.01, 1.4)
    film += phones(n) * ramp(n, 0, turn - 1.0, 0.01, 0.8)  # the phones stop just before the turn
    calm_start = int((turn + 0.4) * SR)
    calm = np.zeros_like(film)
    seg = fit(calm_tone, n - calm_start)
    calm[calm_start:] = seg
    film += calm * ramp(n, turn + 1.2, total - 1.2, 0.8, 1.2)
    save_wav(A / "film-mix.wav", film)
    print("film-mix.wav", f"{total:.2f}s")

    for name, tone, loop, gain in (("chaos", chaos_tone, "chaos-loop.wav", 0.10), ("calm", calm_tone, "calm-loop.wav", 0.07)):
        m = load(A / loop)
        m *= gain / rms(m)
        length = max(len(tone), len(m))
        mix = fit(tone, length) + fit(m, length)
        if name == "chaos":
            mix += phones(length)
        save_m4a(OUT / f"{name}-loop.m4a", loopable(mix))
        print(f"{name}-loop.m4a", f"{len(mix) / SR:.1f}s")
