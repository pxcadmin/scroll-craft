"""Higgsfield image edit (Qwen Image 3) through the official SDK.

usage:
  python3 tools/hf_image.py <out.png> "<prompt>" <ref1.png> [ref2.png ...] [--ar 16:9] [--seed N]

Docs: https://open.higgsfield.ai/models/alibaba/qwen-image-3/edit/api-reference
Reads HF_KEY ("KEY_ID:KEY_SECRET") from the environment or the nearest .env.
"""
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import seedance  # noqa: E402  (loads HF_KEY and gives upload())
import higgsfield_client as hc  # noqa: E402


def main():
    argv = sys.argv[1:]
    def opt(name, default=None):
        if name in argv:
            i = argv.index(name); v = argv[i + 1]; del argv[i:i + 2]; return v
        return default
    ar, seed = opt("--ar", "16:9"), opt("--seed")
    out, prompt, *refs = argv
    args = {"image_urls": [seedance.upload(r) for r in refs], "prompt": prompt, "resolution": "2k",
            "aspect_ratio": ar, "prompt_extend": False, "enable_thinking": False,
            "negative_prompt": "text, letters, watermark, logo, cartoon, CGI, render, distorted faces, extra limbs"}
    if seed is not None:
        args["seed"] = int(seed)
    res = hc.subscribe("alibaba/qwen-image-3/edit", args, on_enqueue=lambda r: print("  request:", r, flush=True))
    img = (res.get("images") or [{}])[0]
    url = img.get("url") if isinstance(img, dict) else img
    if not url:
        sys.exit(f"no image in result: {res}")
    urllib.request.urlretrieve(url, out)
    print(out)


if __name__ == "__main__":
    main()
