"""
Regenerate hero video start + end frames with linen (#F5F3EE) background.

Replaces the white/marble backgrounds in the current frames to match
the Brew Story color palette.

Usage:
  python scripts/regenerate_hero_frames.py          # generate both
  python scripts/regenerate_hero_frames.py start     # start frame only
  python scripts/regenerate_hero_frames.py end       # end frame only
  python scripts/regenerate_hero_frames.py upscale   # 4x upscale both (after pushing to GitHub)
"""
import requests
import time
import json
import os
import sys

API_KEY = os.environ.get("KIE_AI_API_KEY", "")
BASE_URL = "https://api.kie.ai/api/v1/jobs"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'generated')

NEGATIVE_PROMPT = (
    "speech bubbles, talking, text, words, letters, watermarks, signatures, "
    "extra limbs, deformed, distorted, bad anatomy, bad proportions, duplicate, "
    "white marble, bright white background, cold tones, blue tones"
)

GITHUB_RAW_BASE = "https://raw.githubusercontent.com/ptolomea9/brew_story/main/public/images/generated"

# ── Frame definitions with linen background ──

START_FRAME = {
    "name": "video_frame_start_v3",
    "prompt": (
        "Side view editorial food photograph of dark roasted coffee beans pouring "
        "from a rustic wooden scoop into an elegant thin-walled porcelain coffee cup, "
        "European cafe style, clean smooth white porcelain with no speckles no texture "
        "no glaze imperfections, refined minimalist high-end ceramic. The beans are "
        "mid-cascade, some splashing into dark liquid already in the cup. "
        "The surface and background are a warm linen tone (#F5F3EE), soft matte finish, "
        "NOT marble, NOT white — a warm creamy off-white with subtle warmth. "
        "A folded sage green linen napkin sits to the left. "
        "Warm golden morning light from the left side, shallow depth of field, "
        "editorial food cinematography, premium artisanal coffee aesthetic, "
        "minimalist styling, muted earth tones, cream olive and sage color palette"
    ),
    "aspect_ratio": "9:16",
}

END_FRAME = {
    "name": "video_frame_end_v3",
    "prompt": (
        "Overhead top-down editorial food photograph of a finished latte in an elegant "
        "thin-walled porcelain coffee cup, European cafe style, clean smooth white "
        "porcelain. The latte art is etched into rich golden-brown crema with NO milk "
        "swirl and NO white foam base — the entire cup surface is golden-brown crema "
        "with the following white milk design etched on top: "
        "a small vertical oval outline containing a coffee plant sprig — "
        "one central vertical stem, two pointed leaves angling upward-left and "
        "upward-right from the stem each with a center vein, two smaller rounded "
        "leaves angling downward-left and downward-right, and a tight cluster of "
        "six small round coffee cherries at the center where the leaves meet. "
        "The design is compact and contained within the oval, like a botanical emblem "
        "or crest stamp. Drawn in thin white milk lines on golden crema, barista "
        "etching style. Fine cinnamon powder dusted lightly across the surface. "
        "The surface and background are a warm linen tone (#F5F3EE), soft matte finish, "
        "NOT marble, NOT white — a warm creamy off-white with subtle warmth. "
        "Scattered dark roasted coffee beans around the cup, a folded sage green linen "
        "napkin to the lower right, a gold spoon beside the cup. "
        "Warm golden morning light, shallow depth of field, editorial food photography, "
        "premium artisanal coffee aesthetic, minimalist styling, "
        "cream olive and sage color palette"
    ),
    "aspect_ratio": "9:16",
}


def create_task(model: str, input_data: dict) -> str | None:
    payload = {"model": model, "input": input_data}
    try:
        r = requests.post(f"{BASE_URL}/createTask", headers=HEADERS, json=payload, timeout=30)
        r.raise_for_status()
        data = r.json()
        task_id = data.get("data", {}).get("taskId") or data.get("taskId")
        if task_id:
            print(f"    Task created: {task_id}")
            return task_id
        print(f"    ERROR: No taskId in response: {json.dumps(data, indent=2)}")
        return None
    except Exception as e:
        print(f"    ERROR creating task: {e}")
        return None


def poll_task(task_id: str, max_wait: int = 300) -> dict | None:
    start = time.time()
    while time.time() - start < max_wait:
        try:
            r = requests.get(
                f"{BASE_URL}/recordInfo",
                headers=HEADERS,
                params={"taskId": task_id},
                timeout=15,
            )
            r.raise_for_status()
            data = r.json().get("data", r.json())
            status = (data.get("state") or data.get("status") or "").lower()

            if status == "success":
                return data
            elif status in ("failed", "error"):
                print(f"    Task {task_id} FAILED: {data.get('failMsg') or data.get('message', 'unknown')}")
                return None

            elapsed = int(time.time() - start)
            print(f"    Waiting... ({elapsed}s, status: {status})")
            time.sleep(5)
        except Exception as e:
            print(f"    Poll error: {e}")
            time.sleep(5)

    print(f"    Task {task_id} TIMED OUT after {max_wait}s")
    return None


def download_result(result: dict, output_path: str) -> bool:
    try:
        result_json = result.get("resultJson", "{}")
        if isinstance(result_json, str):
            result_json = json.loads(result_json)

        urls = result_json.get("resultUrls", [])
        if not urls:
            urls = result.get("resultUrls", [])
        if not urls:
            print(f"    No result URLs found")
            return False

        url = urls[0]
        print(f"    Downloading: {url[:80]}...")
        r = requests.get(url, timeout=60)
        r.raise_for_status()

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'wb') as f:
            f.write(r.content)

        size_kb = len(r.content) / 1024
        print(f"    Saved: {output_path} ({size_kb:.0f} KB)")
        return True
    except Exception as e:
        print(f"    Download error: {e}")
        return False


def generate_frame(frame_def: dict) -> str | None:
    name = frame_def["name"]
    output = os.path.join(OUTPUT_DIR, f"{name}.png")

    print(f"\n  Generating: {name}")
    print(f"    Prompt: {frame_def['prompt'][:100]}...")

    task_id = create_task("nano-banana-pro", {
        "prompt": frame_def["prompt"],
        "negative_prompt": NEGATIVE_PROMPT,
        "aspect_ratio": frame_def["aspect_ratio"],
    })
    if not task_id:
        return None

    result = poll_task(task_id, max_wait=180)
    if result and download_result(result, output):
        return output
    return None


def edit_frame(image_url: str, prompt: str, output_name: str) -> str | None:
    """Use nano-banana-edit to transform an existing image."""
    output = os.path.join(OUTPUT_DIR, f"{output_name}.png")

    print(f"\n  Editing: {output_name}")
    print(f"    Source: {image_url}")
    print(f"    Prompt: {prompt[:100]}...")

    task_id = create_task("nano-banana-edit", {
        "image": image_url,
        "prompt": prompt,
    })
    if not task_id:
        return None

    result = poll_task(task_id, max_wait=180)
    if result and download_result(result, output):
        return output
    return None


def upscale_frame(filename: str) -> str | None:
    url = f"{GITHUB_RAW_BASE}/{filename}"
    output = os.path.join(OUTPUT_DIR, filename.replace('.png', '_4x.png'))

    print(f"\n  Upscaling: {filename}")
    print(f"    Source: {url}")

    task_id = create_task("recraft/crisp-upscale", {"image": url})
    if not task_id:
        return None

    result = poll_task(task_id, max_wait=300)
    if result and download_result(result, output):
        return output
    return None


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "both"

    if mode in ("both", "start", "end"):
        print("=== REGENERATING HERO FRAMES (linen background) ===")

        if mode in ("both", "start"):
            result = generate_frame(START_FRAME)
            if result:
                print(f"\n  START frame saved: {result}")
            else:
                print("\n  START frame generation FAILED")

        if mode in ("both", "end"):
            result = generate_frame(END_FRAME)
            if result:
                print(f"\n  END frame saved: {result}")
            else:
                print("\n  END frame generation FAILED")

        print("\n=== NEXT STEPS ===")
        print("1. Review the generated frames")
        print("2. Push to GitHub: git add public/images/generated && git commit && git push")
        print("3. Upscale: python scripts/regenerate_hero_frames.py upscale")

    elif mode == "edit-end":
        print("=== EDITING END FRAME (logo_latte_v2 -> full 9:16 scene) ===")
        logo_url = f"{GITHUB_RAW_BASE}/logo_latte_v2.png"
        edit_prompt = (
            "Transform this overhead latte photograph into a full 9:16 vertical "
            "editorial food scene. Keep the latte cup and its latte art design "
            "EXACTLY as-is — do not modify the cup contents or the botanical "
            "latte art pattern in any way. Expand the scene around the cup: "
            "the surface is warm linen fabric (#F5F3EE color), NOT marble, "
            "NOT white. Add scattered dark roasted coffee beans around the cup, "
            "a folded sage green linen napkin to the lower right, and a gold "
            "spoon beside the cup. Warm golden morning light from the left, "
            "shallow depth of field, editorial food photography, premium "
            "artisanal coffee aesthetic."
        )
        result = edit_frame(logo_url, edit_prompt, "video_frame_end_v3")
        if result:
            print(f"\n  END frame (edited) saved: {result}")
        else:
            print("\n  END frame edit FAILED")

    elif mode == "upscale":
        print("=== UPSCALING HERO FRAMES (4x) ===")
        print("NOTE: Frames must be pushed to GitHub first!\n")

        for name in ["video_frame_start_v3.png", "video_frame_end_v3.png"]:
            if os.path.exists(os.path.join(OUTPUT_DIR, name)):
                result = upscale_frame(name)
                if result:
                    print(f"  Upscaled: {result}")
                else:
                    print(f"  Upscale FAILED: {name}")
            else:
                print(f"  SKIP (not found): {name}")

        print("\n=== DONE ===")
        print("Update HERO_VIDEO_INSTRUCTIONS.md to reference v3 frames.")

    else:
        print("Usage: python scripts/regenerate_hero_frames.py [both|start|end|upscale]")


if __name__ == '__main__':
    main()
