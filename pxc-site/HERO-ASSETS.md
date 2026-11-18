# Photographic hero: how it is made

**Rebuilt Nov 18, 2026, to the scroll-craft approved-collection rules.** One clinic, photographed in four moments and filmed in two, moving in true depth as the visitor scrolls. The same timeline renders a 25.9 s film with sound (`film/pxc-hero-film.mp4`).

| Beat | Source | What moves |
| --- | --- | --- |
| Packed waiting room | Qwen Image 3 edit, reasoning on, then a precise edit to remove a ghosted figure (`tools/hf_image.py --think`) | room, far (whispering patients), mid (the seated row with their chairs, the patient at the counter) |
| The wide desk | First frame of the turn | room, far, mid; settles exactly onto the footage |
| The turn | Seedance 2.5 image-to-video (`tools/seedance.py`) | footage |
| The calm desk | Last frame of the turn | room, far, mid |
| A medical assistant walks a patient back | Seedance 2.5 from the calm close-up: a real turn and walk, not a sliding cutout | a brief layered hold, then footage |

**Realism rules this build follows**
- Faces and hands are audited at full resolution before an image is used. The first waiting-room image failed (a malformed toddler, a duplicated woman, a ghosted doctor) and was replaced.
- Nothing floats. Phones, charts and paperwork stay where they sit on the desk.
- Plane rates 0.69, 0.80, 0.89 (adjacent planes 10 to 15 percent apart), under about 80px of travel, dolly under 5 percent, plain dissolves between scenes. From `references/devices.md`, "Layered scenes".
- Contact holds: a seated person moves with their chair; staff and paperwork behind the counter stay with the desk (`--keep-box`); a person never spans two planes (small depth fragments merge into their neighbour).

**How a photo becomes planes** (`tools/layers.py <photo> - <prefix> --t 0.3,0.95 --cut 90 --keep-box ...`): SegFormer-B2 (ADE20K, ONNX) finds people and their chairs; Depth Anything V2 Small separates overlapping people where depth jumps; pieces band by median depth; the room plane is the photo itself, filled from its own pixels only right behind what was lifted. Models live in `hero-src/models/`.

**Sound** (`tools/soundtrack.py`, `tools/mix.py`): realistic room tone with synchronized whispered complaints from Seedance native audio ("We've been here over an hour." "Nobody ever calls you back."), three office phone lines that never stop, a quiet composed music bed under it, then calm room tone with a receptionist's greeting. The film carries the full mix; the site plays two seamless loops, cross-faded by scroll, only when the visitor turns sound on.

**Rebuild**: `npm run build`, serve `site/` on port 4500, `python3 tools/mix.py`, then `node tools/film.mjs`.

Keys live in the git-ignored `.env` at the repo root (`KIE_AI_API_KEY`, `HF_KEY`), and kie.ai is also injected by the session proxy. `hero-src/` (raw generations, models, frames) is git-ignored.

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
