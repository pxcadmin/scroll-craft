"""Seedance 2.5 image-to-video through the official Higgsfield SDK.

usage:
  python3 tools/seedance.py draft <start.png> <end.png or ->  <out.mp4> "<prompt>" [--dur 5]
  python3 tools/seedance.py final <draft_id> <out.mp4>

Credentials: HF_KEY ("KEY_ID:KEY_SECRET"), read from the environment or from
the nearest .env walking up from this file. Never commit the key.

Docs: https://docs.higgsfield.ai/docs/how-to/sdk
      https://open.higgsfield.ai/models/bytedance/seedance-2.5/image-to-video/api-reference
A draft is 480p (about $0.12 per output second). Finalize a draft you like to
1080p within seven days (about $0.65 per output second); prompt, media and
duration carry over from the draft.
"""
import os
import sys
import tempfile
import urllib.request
from pathlib import Path


def load_key():
    if os.environ.get("HF_KEY"):
        return
    d = Path(__file__).resolve().parent
    for _ in range(6):
        env = d / ".env"
        if env.exists():
            for line in env.read_text().splitlines():
                if line.strip().startswith("HF_KEY="):
                    os.environ["HF_KEY"] = line.split("=", 1)[1].strip().strip("'\"")
                    return
        d = d.parent
    sys.exit("HF_KEY not set and not found in a .env")


load_key()
import higgsfield_client as hc  # noqa: E402  (needs HF_KEY first)
from PIL import Image  # noqa: E402


def upload(path):
    # Send a 1920-wide JPEG: the model works at 1080p at most, and a smaller upload is faster.
    im = Image.open(path).convert("RGB")
    if im.width > 1920:
        im = im.resize((1920, round(im.height * 1920 / im.width)), Image.LANCZOS)
    tmp = Path(tempfile.mkdtemp()) / (Path(path).stem + ".jpg")
    im.save(tmp, quality=92)
    return hc.upload_file(tmp)


def run(app, args, out):
    def upd(s):
        print("  status:", type(s).__name__, flush=True)
    res = hc.subscribe(app, args, on_enqueue=lambda rid: print("  request:", rid, flush=True), on_queue_update=upd)
    url = (res.get("video") or {}).get("url") if isinstance(res, dict) else None
    if not url:
        sys.exit(f"no video in result: {res}")
    urllib.request.urlretrieve(url, out)
    print(out, "| draft_id/request:", res.get("request_id") or res.get("id") or "see request above")
    return res


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "draft":
        start, end, out, prompt = sys.argv[2:6]
        dur = int(sys.argv[sys.argv.index("--dur") + 1]) if "--dur" in sys.argv else 5
        args = {"image_url": upload(start), "prompt": prompt,
                "duration": dur, "generate_audio": False, "draft": True}
        if end != "-":  # "-" lets the model find its own last frame
            args["end_image_url"] = upload(end)
        run("bytedance/seedance-2.5/image-to-video", args, out)
    elif cmd == "final":
        draft_id, out = sys.argv[2:4]
        run("bytedance/seedance-2.5/finalize-draft", {"draft_id": draft_id, "resolution": "1080p"}, out)
    else:
        sys.exit(__doc__)
