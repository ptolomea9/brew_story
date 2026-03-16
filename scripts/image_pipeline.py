"""
Brew Story Image/Video Generation Pipeline
Uses kie.ai API for:
  1. Upscaling real stills (crisp-upscale, 4x)
  2. Generating lifestyle imagery (nano-banana-pro)
  3. Editing/enhancing real photos (nano-banana-edit)

Requirements: Real stills must be at publicly accessible URLs.
We push them to GitHub first, then use raw.githubusercontent.com URLs.
"""
import requests
import time
import json
import os
import sys

API_KEY = os.environ.get("KIE_AI_API_KEY", "")
BASE_URL = "https://api.kie.ai/api/v1/jobs"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'images')
GITHUB_RAW_BASE = "https://raw.githubusercontent.com/ptolomea9/brew_story/main/public/images/stills"

NEGATIVE_PROMPT = (
    "speech bubbles, talking, text, words, letters, watermarks, signatures, "
    "extra limbs, deformed, distorted, bad anatomy, bad proportions, duplicate"
)

# ── Best stills to upscale (selected from extraction) ──
UPSCALE_TARGETS = [
    "still_001_0s.jpg",   # Brew Story tee, clean white interior
    "still_003_4s.jpg",   # Screen printing frame
    "still_005_8s.jpg",   # Iced matcha branded cup
    "still_007_12s.jpg",  # Mirror + merch display
    "still_008_14s.jpg",  # "MAKE TODAY LOOK GOOD" tee
    "still_009_16s.jpg",  # Chapter One tees
    "still_011_20s.jpg",  # Screen printing action
    "still_013_24s.jpg",  # Flowers, clean interior
]

# ── AI generation prompts ──
GENERATION_TARGETS = [
    {
        "name": "hero_latte",
        "prompt": (
            "Premium overhead photo of a latte with intricate latte art on a marble countertop, "
            "cinnamon being sprinkled from above creating a dusty trail, warm morning light from the left, "
            "cream and olive green color palette, minimalist styling, editorial food photography, "
            "shallow depth of field, clean white ceramic cup with thin rim, sage green napkin beside it"
        ),
        "aspect_ratio": "16:9",
    },
    {
        "name": "hero_beans_pour",
        "prompt": (
            "Dramatic photo of roasted coffee beans cascading from a burlap sack into a designer ceramic bowl, "
            "dark roasted beans with visible oil sheen, cream colored background, warm side lighting, "
            "motion blur on falling beans, editorial product photography, minimalist staging, "
            "olive and sage green accents, premium artisanal feel"
        ),
        "aspect_ratio": "9:16",
    },
    {
        "name": "product_coffee_bags",
        "prompt": (
            "Flat-lay product photography of three craft coffee bags arranged on a marble surface, "
            "olive green labels with botanical illustrations, kraft paper bags, scattered coffee beans, "
            "a small succulent plant, warm natural light, cream background, editorial styling, "
            "premium packaging design, top-down angle"
        ),
        "aspect_ratio": "1:1",
    },
    {
        "name": "product_merch_flatlay",
        "prompt": (
            "Flat-lay product photography of folded t-shirts in white olive and blue colors, "
            "screen printed coffee shop logo, arranged on light wood surface, "
            "a coffee cup and pair of sunglasses beside them, natural light, "
            "minimalist SoCal lifestyle brand aesthetic, editorial styling"
        ),
        "aspect_ratio": "1:1",
    },
    {
        "name": "atmosphere_pourover",
        "prompt": (
            "Close-up editorial photo of a pour-over coffee being brewed, hot water stream from a "
            "gooseneck kettle into a ceramic V60 dripper, steam rising, warm golden light, "
            "blurred cafe interior background in cream and olive tones, barista hands visible, "
            "artisanal craft coffee atmosphere, shallow depth of field"
        ),
        "aspect_ratio": "4:3",
    },
    {
        "name": "exterior_storefront",
        "prompt": (
            "Warm golden hour photo of a modern coffee shop exterior in a SoCal strip mall, "
            "tan stucco building with terracotta tile roof, clean minimalist signage reading "
            "'brew story COFFEE ROASTERY', hanging plants, outdoor seating, "
            "Huntington Beach California vibes, palm trees in background, warm sunset light"
        ),
        "aspect_ratio": "16:9",
    },
    {
        "name": "menu_iced_matcha",
        "prompt": (
            "Glamour shot of an iced matcha latte in a clear glass with visible green and white layers, "
            "on a marble countertop, cream colored background, natural window light, "
            "condensation on glass, fresh mint garnish, editorial drink photography, "
            "clean minimalist styling, sage green color theme"
        ),
        "aspect_ratio": "3:4",
    },
]


def create_task(model: str, input_data: dict) -> str | None:
    """Submit a task to kie.ai and return the taskId."""
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
    """Poll until task completes. Returns result dict or None."""
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

            time.sleep(5)
        except Exception as e:
            print(f"    Poll error: {e}")
            time.sleep(5)

    print(f"    Task {task_id} TIMED OUT after {max_wait}s")
    return None


def download_result(result: dict, output_path: str) -> bool:
    """Download the result image from kie.ai."""
    try:
        # Parse resultJson if it's a string
        result_json = result.get("resultJson", "{}")
        if isinstance(result_json, str):
            result_json = json.loads(result_json)

        urls = result_json.get("resultUrls", [])
        if not urls:
            # Try alternate location
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

        size_mb = len(r.content) / (1024 * 1024)
        print(f"    Saved: {output_path} ({size_mb:.1f} MB)")
        return True
    except Exception as e:
        print(f"    Download error: {e}")
        return False


def upscale_stills():
    """Upscale selected real stills using crisp-upscale (4x)."""
    print("\n=== UPSCALING REAL STILLS ===\n")
    results = []

    for filename in UPSCALE_TARGETS:
        url = f"{GITHUB_RAW_BASE}/{filename}"
        output = os.path.join(OUTPUT_DIR, 'upscaled', filename.replace('.jpg', '_4x.jpg'))

        if os.path.exists(output):
            print(f"  SKIP (exists): {filename}")
            results.append(output)
            continue

        print(f"  Upscaling: {filename}")
        print(f"    Source: {url}")

        task_id = create_task("recraft/crisp-upscale", {
            "image": url,
        })
        if not task_id:
            continue

        result = poll_task(task_id)
        if result and download_result(result, output):
            results.append(output)

    print(f"\nUpscaled {len(results)}/{len(UPSCALE_TARGETS)} stills")
    return results


def generate_images():
    """Generate lifestyle/product images using nano-banana-pro."""
    print("\n=== GENERATING AI IMAGERY ===\n")
    results = []

    for target in GENERATION_TARGETS:
        name = target["name"]
        output = os.path.join(OUTPUT_DIR, 'generated', f"{name}.png")

        if os.path.exists(output):
            print(f"  SKIP (exists): {name}")
            results.append(output)
            continue

        print(f"  Generating: {name}")
        print(f"    Prompt: {target['prompt'][:80]}...")

        task_id = create_task("nano-banana-pro", {
            "prompt": target["prompt"],
            "negative_prompt": NEGATIVE_PROMPT,
            "aspect_ratio": target.get("aspect_ratio", "1:1"),
        })
        if not task_id:
            continue

        result = poll_task(task_id, max_wait=180)
        if result and download_result(result, output):
            results.append(output)

    print(f"\nGenerated {len(results)}/{len(GENERATION_TARGETS)} images")
    return results


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"

    if mode in ("all", "generate"):
        generate_images()

    if mode in ("all", "upscale"):
        print("\nNOTE: Upscaling requires stills to be pushed to GitHub first.")
        print("Run: git add public/images/stills && git commit && git push")
        print("Then: python scripts/image_pipeline.py upscale")
        if mode == "all":
            print("Skipping upscale for now (stills not yet on GitHub).")
        else:
            upscale_stills()


if __name__ == '__main__':
    main()
