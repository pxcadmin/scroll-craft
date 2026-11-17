# Photographic hero: how it is made

**Built Nov 17, 2026.** Four photographs of one clinic, each cut into real depth planes, plus one filmed turn between them. The same timeline drives the live page (scroll) and a rendered 23.7 s film with a soundtrack (`film/pxc-hero-film.mp4`).

| Beat | Source | Planes | Film |
| --- | --- | --- | --- |
| Chaos, close (every seat taken, phones ringing, charts on the floor) | Qwen Image 3 edit of the chaos plate (`tools/hf_image.py`) | room, far, mid, near, floating phone, charts, paper, notes | 5.0 s, plus a 1.2 s handoff |
| Chaos, wide | First frame of the Seedance shot | room, far, mid, near, floating objects | 3.3 s |
| The turn | Seedance 2.5 image-to-video (`tools/seedance.py`) | footage | 6.0 s |
| Calm, wide | Last frame of the Seedance shot | room, far, mid, near | 2.5 s, plus a 1.2 s handoff |
| Calm, close (a nurse takes a patient back to be roomed; one friendly patient waits) | Qwen Image 3 edit from both closes | room, mid (nurse and patient together), near | 4.5 s |

**How a photo becomes planes** (`tools/layers.py`): a clean plate of the same frame with every person removed (Qwen edit) is aligned to the photo; everything that differs is lifted out; Depth Anything V2 Small (ONNX, CPU, `hero-src/models/depth.onnx`) cuts overlapping people apart where depth jumps; each piece goes to far, mid or near by its median depth. The room plane is the photo itself, borrowing the clean plate only right behind the cutouts, so at rest the stack reproduces the photo exactly and both handoffs to the footage are frame-identical. Contact pairs (the nurse's hand on the patient's shoulder) are kept in one plane with `--t`.

**Motion** (`src/hero.js`): planes move by depth (room 0, far .35, mid .65, near 1, objects 1.2 to 1.7). A scene arrives back to front, the room first and the nearest planes dropping in last from in front of the lens; it leaves by flying past the lens, nearest first, with motion blur.

**Sound** (`tools/soundtrack.py`): composed in code, royalty-free. A frantic, off-kilter 168 bpm with three phones that never stop, a tape-stop at the turn, then a warm 76 bpm with no phones. The film has the linear score; the site has two loops, cross-faded by scroll, that play only when the visitor turns sound on.

**Rebuild the film**: `npm run build`, serve `site/` on port 4500, then `node tools/film.mjs`.

Keys live in the git-ignored `.env` at the repo root (`KIE_AI_API_KEY`, `HF_KEY`). `hero-src/` (raw generations, depth model, frames) is git-ignored.

---

The original plan follows. It was written before generation was available and is kept for the prompt pack.

## Original asset plan

The hero becomes a camera moving through a real practice, first in its chaotic state, then through the PXC doorway into its calm state. This file is the plan and the prompt pack. The built hero uses a single shot instead of stacked stills; see the top of this file.

## Opening, midpoint, exit

| Scroll | What the visitor sees | What moves |
|---|---|---|
| 0 (opening) | A busy reception, eye level from the waiting room. Three patients queued, two staff on headsets, paper on the counter. Headline readable at frame one. | Idle drift only. Near patients breathe 0.4%. |
| 0.25 | The camera pushes toward the desk. Patients slide out past the frame edges faster than the desk; the room barely moves. | L2 fastest, L1 moderate, L0 least. |
| 0.5 (midpoint) | The PXC doorway mark grows from the corridor opening behind the desk, in perspective. | Before planes exit at their own rates. |
| 0.75 | The camera passes through the doorway. The calm room arrives from depth: same practice, same camera, no line. | After planes settle from 1.12 scale to 1.0 at their own rates. |
| 1 (exit) | Calm reception: one receptionist greeting one patient, clear counter, soft daylight. Pull back 2%. Three cards: Calls answered, Queue: 0, Next step: owned. | Nothing pulses. Calm is the point. |

## Layer contract

| Plane | File | Depth | Scroll travel | Pointer | Contact rule |
|---|---|---|---|---|---|
| L0 room | `{state}-room.webp` (clean plate, people and counter removed, rebuilt behind) | Far | 1.00 to 1.04 scale | 4 px | No duplicate staff, doorway at the same pixel in both states |
| L1 desk | `{state}-desk.webp` (counter plus seated staff, alpha) | Mid | 1.00 to 1.10 | 14 px | Counter base sits on the L0 floor line; shared pivot at the counter base |
| L2 near | `{state}-near.webp` (patients in line or, after, one patient; alpha, slight blur) | Near | 1.00 to 1.28, exits past the edges | 30 px | Feet stay on the floor line until they leave frame |
| Doorway | Inline SVG of the logo's doorway mark | Transition | Grows from the corridor opening | none | Centred on the real corridor opening |
| Copy | HTML | Fixed | none | none | Left 45% of the frame stays quiet in every plate |

Phones get their own 9:16 plates with two planes (room, and desk plus people merged) and the doorway. Desktop layers are served 1920 wide, phone layers 960 wide. Budget: 900 KB desktop, 450 KB phone.

## Prompt pack

Use the same style preamble, word for word, in every prompt. Generate the before plate first, then make every other image as an edit of it so the camera, lens and light match.

**Style preamble**

> Documentary photograph inside a real independent family medical practice. Eye level from the waiting room, 24mm lens, f/5.6, everything from 2 to 8 metres sharp. Warm overhead practical light mixed with soft window daylight from the left. Natural skin, cool shadows, slight film grain. Real, unstaged people of mixed ages and backgrounds. No text, no logos, no signage, no readable screens. Keep the left 45% of the frame calm and low in detail for a headline.

| # | File | Ratio | Prompt after the preamble |
|---|---|---|---|
| 1 | `before-plate.png` | 16:9, at least 2560 wide | Busy reception mid-morning. Curved wooden front desk centred at 62% of the frame width. Two receptionists in navy scrubs with headsets behind it, one on the phone, one turning to a colleague. Paper stacks and sticky notes on the counter and monitors. Three patients queue at the counter, backs to camera, one holding a clipboard. Behind the desk, an open doorway to a bright corridor, centred at 62% width. |
| 2 | `after-plate.png` | 16:9, edit of #1 | Same room, same camera, same lens, same doorway. Calm late morning. Clear counter with one neat tray. One receptionist smiling as she greets a single patient at the counter. No line. Softer, brighter daylight. |
| 3 | `before-room.png` | edit of #1 | Same room and camera. Remove every person and the front desk counter. Rebuild the floor, wall and doorway that were behind them. |
| 4 | `after-room.png` | edit of #2 | Same as #3, for the calm room. |
| 5 | `before-desk.png` / `after-desk.png` | edit of #1 / #2 | Remove the patients in front of the counter and rebuild the counter front. Then cut out the counter and the seated staff with background removal. |
| 6 | `before-near.png` / `after-near.png` | from #1 / #2 | Cut out only the patients in front of the counter with background removal. |
| 7 | `before-plate-m.png` / `after-plate-m.png` | 9:16 | Same scene recomposed for a phone: desk and doorway in the top 55%, quiet floor in the bottom 45% for the headline. |

Optional, desktop only: a 5-second start-and-end-frame video from #1 to #2, "slow dolly forward through the reception toward the corridor doorway", encoded with `scripts/encode.sh` for scrubbing.

## Checks before the layers ship

- Inspect every alpha edge over white and over black. No halos, no clipped hands or chair legs.
- The doorway opening sits at the same pixel in #1, #2, #3 and #4 (within 1%).
- No readable text anywhere in any image.
- These are illustrations, not clients or patients. The footer already says so.
