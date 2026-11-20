"""Split a photograph into depth planes against its clean plate.

usage: python3 tools/layers.py <plate.png> <clean.png> <out_prefix> [--bands 0.62,0.84] [--width 1920]

The clean plate is the same photo with people and clutter removed. Everything
that differs between the two is lifted out, cut into connected pieces, and each
piece is sent to a depth band by its contact anchor: the lowest pixel, where it
meets the floor. Things that touch the floor higher in the frame are farther
away. Every piece keeps its own pixels and sits over the clean room, so when the
planes separate nothing tears and no hole opens.

Writes <prefix>-room.webp (opaque), <prefix>-far.webp, <prefix>-mid.webp,
<prefix>-near.webp (alpha), and <prefix>-check.jpg (each plane over magenta,
for inspecting edges).
"""
import sys

import cv2
import numpy as np
from PIL import Image


def arg(name, default):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default


plate_p, clean_p, prefix = sys.argv[1:4]
bands = [float(x) for x in arg("--bands", "0.62,0.84").split(",")]
width = int(arg("--width", "1920"))

P = cv2.imread(plate_p, cv2.IMREAD_COLOR)
H, W = P.shape[:2]
SEG = clean_p == "-" or "--seg" in sys.argv
if not SEG:
    C = cv2.imread(clean_p, cv2.IMREAD_COLOR)
    C = cv2.resize(C, (W, H), interpolation=cv2.INTER_LANCZOS4)

    # 1. Align the clean plate to the photo. Edits drift a few pixels; an affine
    #    fit on a downscaled copy pulls them back so the difference is the content.
    s = 0.25
    gp = cv2.cvtColor(cv2.resize(P, None, fx=s, fy=s), cv2.COLOR_BGR2GRAY).astype(np.float32)
    gc = cv2.cvtColor(cv2.resize(C, None, fx=s, fy=s), cv2.COLOR_BGR2GRAY).astype(np.float32)
    warp = np.eye(2, 3, dtype=np.float32)
    try:
        _, warp = cv2.findTransformECC(gp, gc, warp, cv2.MOTION_AFFINE,
                                       (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-5), None, 5)
        warp[:, 2] /= s
        C = cv2.warpAffine(C, warp, (W, H), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REFLECT)
        print("aligned, shift px:", warp[:, 2].round(1).tolist())
    except cv2.error:
        print("alignment did not converge; using the plate as-is")

    # 2. Difference in Lab, blurred so grain and re-rendered texture do not count.
    lp = cv2.cvtColor(cv2.GaussianBlur(P, (0, 0), 3), cv2.COLOR_BGR2LAB).astype(np.float32)
    lc = cv2.cvtColor(cv2.GaussianBlur(C, (0, 0), 3), cv2.COLOR_BGR2LAB).astype(np.float32)
    d = np.linalg.norm((lp - lc) * [0.6, 1.0, 1.0], axis=2)  # lightness counts less than colour
    thr = max(14.0, float(np.percentile(d, 55)) * 2.2)
    mask = (d > thr).astype(np.uint8) * 255
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, k)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25)))
    # fill holes inside figures (a shirt that happens to match the wall)
    ff = mask.copy()
    cv2.floodFill(ff, np.zeros((H + 2, W + 2), np.uint8), (0, 0), 255)
    mask = mask | cv2.bitwise_not(ff)
else:
    # Segmentation route, for frames where no clean plate lines up (an edit that
    # removes a crowd re-frames the room). SegFormer-B2 (ADE20K, ONNX) marks every
    # person; the room behind them is filled from the photo's own pixels. With the
    # restrained parallax at most ~25px of that fill is ever revealed at an edge.
    import onnxruntime as ort
    from pathlib import Path
    seg_model = str(Path(__file__).resolve().parent.parent / "hero-src" / "models" / "seg.onnx")
    ss = ort.InferenceSession(seg_model, providers=["CPUExecutionProvider"])
    xi = cv2.resize(cv2.cvtColor(P, cv2.COLOR_BGR2RGB), (512, 512), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    xi = ((xi - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None].astype(np.float32)
    logits = ss.run(None, {ss.get_inputs()[0].name: xi})[0][0]
    up = np.stack([cv2.resize(l, (W, H), interpolation=cv2.INTER_LINEAR) for l in logits])
    cls = up.argmax(0)
    # people, and the chairs they sit in: a seated person and their chair are one
    # physical object and must move together (ADE20K: 12 person, 19 chair, 30 armchair)
    mask = np.isin(cls, [12, 19, 30]).astype(np.uint8) * 255
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
    # fill behind people from the photo itself, at half size for speed
    hole = cv2.dilate(mask, np.ones((21, 21), np.uint8))
    small = cv2.inpaint(cv2.resize(P, (W // 2, H // 2)), cv2.resize(hole, (W // 2, H // 2)), 12, cv2.INPAINT_TELEA)
    C = P.copy()
    fill = cv2.resize(small, (W, H), interpolation=cv2.INTER_CUBIC)
    C[hole > 0] = fill[hole > 0]
    print("segmentation route: person pixels", round(float((mask > 0).mean()), 3))

# 3. Depth. Depth Anything V2 Small (ONNX, CPU) estimates relative depth for
#    the photo, near = high. Overlapping people are one blob in the mask; the
#    depth jumps between them are where the blob is cut apart.
import onnxruntime as ort
from pathlib import Path
model = arg("--depth-model", str(Path(__file__).resolve().parent.parent / "hero-src" / "models" / "depth.onnx"))
sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
dh, dw = 518, 14 * round(518 * W / H / 14)
x = cv2.resize(cv2.cvtColor(P, cv2.COLOR_BGR2RGB), (dw, dh), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255
x = ((x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None].astype(np.float32)
dep = sess.run(None, {"pixel_values": x})[0][0]
dep = cv2.resize(dep, (W, H), interpolation=cv2.INTER_CUBIC)
dep = (dep - dep.min()) / (dep.max() - dep.min() + 1e-6)
cv2.imwrite(f"{prefix}-depth.png", (dep * 255).astype(np.uint8))

# 4. Cut the mask at depth edges, then regrow every cut pixel to its piece.
ds = cv2.GaussianBlur(dep, (0, 0), 2)
g = np.hypot(cv2.Sobel(ds, cv2.CV_32F, 1, 0, ksize=3), cv2.Sobel(ds, cv2.CV_32F, 0, 1, ksize=3))
inside = mask > 0
edge = (g > np.percentile(g[inside], float(arg("--cut", "80")))) & inside
core = (inside & ~cv2.dilate(edge.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)).astype(np.uint8)
n, lab, stats, _ = cv2.connectedComponentsWithStats(core, 8)
markers = np.zeros((H, W), np.int32)
markers[~inside] = 1  # background
keep = 0
for i in range(1, n):
    if stats[i][4] >= H * W * 0.0004:
        keep += 1
        markers[lab == i] = keep + 1
cv2.watershed(P, markers)
markers[~inside] = 1
markers[markers == -1] = 1

# 4b. Keep people whole. A seated person's knees are nearer than their head, so a
#     depth cut can split one body into pieces. Any small piece joins the
#     neighbouring piece it shares the longest border with, repeatedly, so a
#     body never ends up in two planes.
min_keep = H * W * float(arg("--min-piece", "0.012"))
changed = True
while changed:
    changed = False
    ids, counts = np.unique(markers[markers > 1], return_counts=True)
    for k, c in sorted(zip(ids, counts), key=lambda kc: kc[1]):
        if c >= min_keep:
            continue
        ring = cv2.dilate((markers == k).astype(np.uint8), np.ones((7, 7), np.uint8)).astype(bool) & (markers > 1) & (markers != k)
        if not ring.any():
            continue
        nb, nc = np.unique(markers[ring], return_counts=True)
        markers[markers == k] = nb[nc.argmax()]
        changed = True
        break

# 5. Band each piece by its median depth: three bands over the depths present.
pieces = [(k, float(np.median(dep[markers == k])), int((markers == k).sum())) for k in range(2, keep + 2)]
pieces = [pc for pc in pieces if pc[2] > 0]
vals = np.array([v for _, v, _ in pieces])
q = [float(x) for x in arg("--q", "0.4,0.75").split(",")]
t1, t2 = (np.quantile(dep[inside], q[0]), np.quantile(dep[inside], q[1])) if len(vals) else (0.4, 0.7)
if "--t" in sys.argv:  # absolute thresholds, when a contact pair must share a plane
    t1, t2 = [float(x) for x in arg("--t", "").split(",")]
planes = {"far": np.zeros((H, W), np.uint8), "mid": np.zeros((H, W), np.uint8), "near": np.zeros((H, W), np.uint8)}
# Things that belong to a surface stay with it: staff seated behind the desk and the
# paperwork on it ride with the room, so nothing slides across the counter.
boxes = [[float(v) for v in b.split(",")] for b in arg("--keep-box", "").split(";") if b]
def kept(k):
    ys, xs = np.nonzero(markers == k)
    cx, cy = xs.mean() / W, ys.mean() / H
    return any(b[0] <= cx <= b[2] and b[1] <= cy <= b[3] for b in boxes)
for k, v, area in pieces:
    if boxes and kept(k):
        print(f"  piece {k}: stays with the room (keep-box)")
        continue
    band = "far" if v < t1 else "mid" if v < t2 else "near"
    planes[band][markers == k] = 255
    if area > H * W * 0.001:
        print(f"  piece {k}: depth {v:.2f} area {area / (H * W):.3f} -> {band}")
# a cut leaves hairline gaps between neighbours in different bands; close each plane slightly
for name in planes:
    planes[name] = cv2.morphologyEx(planes[name], cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)) & mask


def save(img, path, alpha=None):
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    im = Image.fromarray(rgb)
    if alpha is not None:
        a = cv2.GaussianBlur(alpha, (0, 0), 1.6)
        im.putalpha(Image.fromarray(a))
    h = round(H * width / W)
    im = im.resize((width, h), Image.LANCZOS)
    im.save(path, quality=80 if alpha is None else 82, method=6)
    return im


# The room is the photo itself, borrowing the clean plate only just behind the
# cutouts. Anything the mask missed (navy trousers on a navy chair) stays put,
# and at rest the stack reproduces the photo exactly.
lifted = planes['far'] | planes['mid'] | planes['near']  # only what actually left the room
behind = cv2.GaussianBlur(cv2.dilate(lifted, np.ones((15, 15), np.uint8)), (0, 0), 4).astype(np.float32)[..., None] / 255
room = (P.astype(np.float32) * (1 - behind) + C.astype(np.float32) * behind).astype(np.uint8)
save(room, f"{prefix}-room.webp")
sheet = []
for name, m in planes.items():
    im = save(P, f"{prefix}-{name}.webp", m)
    bg = Image.new("RGB", im.size, (255, 0, 255))
    bg.paste(im, (0, 0), im)
    sheet.append(bg.resize((640, round(640 * im.height / im.width))))
out = Image.new("RGB", (640 * len(sheet), sheet[0].height))
for i, s_ in enumerate(sheet):
    out.paste(s_, (i * 640, 0))
out.save(f"{prefix}-check.jpg", quality=85)
print("wrote", prefix, "planes")
