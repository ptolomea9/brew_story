#!/usr/bin/env python3
"""
Batch generate menu images for Brew Story via kie.ai API.
Submits tasks in batches, polls for completion, downloads results.
Updates menu-images.json with new entries.
"""

import json
import re
import time
import os
import sys
import requests
from pathlib import Path
from urllib.parse import urlparse

API_KEY = os.environ.get("KIE_AI_API_KEY", "")
BASE_URL = "https://api.kie.ai/api/v1/jobs"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MENU_JSON = PROJECT_ROOT / "src" / "data" / "menu.json"
IMAGES_JSON = PROJECT_ROOT / "src" / "data" / "menu-images.json"
OUTPUT_DIR = PROJECT_ROOT / "public" / "images" / "menu"

BATCH_SIZE = 8
POLL_INTERVAL = 10  # seconds
MAX_POLLS = 60  # 10 minutes max per batch


def slugify(name):
    clean_map = {
        "MaMa Latte Matcha latte with matcha cream top.": "mama-latte",
        "The Yoda Iced Latte with Matcha Cream top.": "the-yoda",
        "Banana Cream COFFEE Latte": "banana-cream-latte",
        "Strawberry Citrus Sparkler Fresh Strawberries, Yuzu, Sparkling water": "strawberry-citrus-sparkler",
        "Sparkling Yuzu Matcha Sparkling Water, Yuzu Citrus, Matcha": "sparkling-yuzu-matcha",
        "Strawberry SHORTCAKE Matcha Latte": "strawberry-shortcake-matcha-latte",
        "Coconut Water Matcha Cream Top": "coconut-water-matcha-cream-top",
    }
    if name in clean_map:
        return clean_map[name]
    s = name.lower()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'\s+', '-', s.strip())
    s = re.sub(r'-+', '-', s)
    return s


def get_prompt(slug, name, category):
    """Generate a descriptive prompt for each menu item."""
    prompts = {
        # --- MATCHA ---
        "banana-matcha-latte": "Professional editorial food photograph of an iced banana matcha latte in a clear glass showing vibrant green matcha layer and creamy banana layer. Condensation on glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "cookie-butter-cream-top-matcha-latte": "Professional editorial food photograph of an iced matcha latte topped with a thick swirl of cookie butter cream in a clear glass. Rich golden-brown cookie butter cream contrasting with vibrant green matcha below. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "sweet-corn-matcha-latte": "Professional editorial food photograph of an iced sweet corn matcha latte in a clear glass, golden corn cream layer blending into vibrant green matcha. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "coconut-cloud-matcha": "Professional editorial food photograph of an iced coconut cloud matcha latte in a clear glass, fluffy white coconut cream cloud floating on vibrant green matcha. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "strawberry-matcha-latte": "Professional editorial food photograph of an iced strawberry matcha latte in a clear glass showing pink strawberry layer and vibrant green matcha creating a beautiful gradient. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "lavender-butterfly-pea-matcha-latte": "Professional editorial food photograph of an iced lavender butterfly pea matcha latte in a clear glass, deep purple-blue butterfly pea layer transitioning into vibrant green matcha, topped with light lavender foam. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "creme-brulee-matcha-latte": "Professional editorial food photograph of an iced creme brulee matcha latte in a clear glass, caramelized golden creme brulee cream top over vibrant green matcha. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "strawberry-shortcake-matcha-latte": "Professional editorial food photograph of an iced strawberry shortcake matcha latte in a clear glass, layers of pink strawberry cream, crumbled shortcake bits, and vibrant green matcha. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "coconut-water-matcha-cream-top": "Professional editorial food photograph of coconut water matcha with a cream top in a clear glass, refreshing light green matcha with coconut water base, topped with a thick matcha cream layer. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "sparkling-yuzu-matcha": "Professional editorial food photograph of a sparkling yuzu matcha drink in a clear glass with visible carbonation bubbles, bright green matcha with golden yuzu citrus notes. Ice cubes visible. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "pumpkin-pie-matcha-latte": "Professional editorial food photograph of an iced pumpkin pie matcha latte in a clear glass, warm orange-brown pumpkin spice layer with vibrant green matcha, topped with cream and a dusting of cinnamon. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",

        # --- HOJICHA ---
        "hojicha": "Professional editorial food photograph of a warm hojicha latte in a clean white porcelain cup, deep amber-brown roasted Japanese tea with steamed milk creating a warm caramel color. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",

        # --- COFFEE (HOT) ---
        "morning-drip-regular": "Professional editorial food photograph of a regular drip coffee in a clean white porcelain cup, rich dark brown coffee with slight steam rising. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "morning-drip-large": "Professional editorial food photograph of a large drip coffee in a tall clean white porcelain mug, rich dark brown coffee with slight steam rising. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "hot-americano": "Professional editorial food photograph of a hot americano in a clean white porcelain cup, dark espresso diluted with hot water showing a thin crema layer on top. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "cappuccino": "Professional editorial food photograph of a cappuccino in a clean white porcelain cup, thick velvety microfoam with beautiful latte art rosetta pattern on top. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "flat-white": "Professional editorial food photograph of a flat white in a clean white porcelain cup, smooth velvety microfoam with a delicate latte art dot pattern, thinner foam than cappuccino. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "cortado": "Professional editorial food photograph of a cortado in a small clear glass, equal parts espresso and steamed milk, rich caramel-brown color. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "espresso": "Professional editorial food photograph of a double espresso in a small white demitasse cup, rich dark crema on top, tiny cup on a saucer. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "pour-over": "Professional editorial food photograph of pour-over coffee in a clean glass carafe next to a white porcelain cup, golden-amber translucent coffee. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "hot-latte": "Professional editorial food photograph of a hot latte in a clean white porcelain cup, beautiful latte art heart pattern in smooth steamed milk. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "hot-vanilla-latte": "Professional editorial food photograph of a hot vanilla latte in a clean white porcelain cup, creamy golden-tinted steamed milk with latte art, hint of vanilla bean specks. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "hot-spanish-latte": "Professional editorial food photograph of a hot Spanish latte in a clean white porcelain cup, rich creamy condensed milk blended with espresso creating a sweet caramel-toned latte. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "traditional-macchiato": "Professional editorial food photograph of a traditional macchiato in a small white demitasse cup, dark espresso with just a dollop of steamed milk foam on top. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "hot-mocha-latte": "Professional editorial food photograph of a hot mocha latte in a clean white porcelain cup, rich chocolate-brown color with steamed milk and a swirl of chocolate on the foam. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",

        # --- COFFEE (ICED) ---
        "iced-latte": "Professional editorial food photograph of an iced latte in a clear glass with ice cubes, espresso and cold milk creating a light brown color. Condensation on glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "iced-vanilla-latte": "Professional editorial food photograph of an iced vanilla latte in a clear glass with ice, creamy golden-tinted milk with espresso, slight vanilla hue. Condensation on glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "iced-brown-sugar-latte": "Professional editorial food photograph of an iced brown sugar latte in a clear glass, dark caramel-brown sugar syrup swirling into espresso and milk, rich amber tones. Ice cubes visible. Condensation on glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "iced-spanish-latte": "Professional editorial food photograph of an iced Spanish latte in a clear glass, layers of condensed milk on the bottom and espresso on top with ice. Condensation on glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "iced-mocha-latte": "Professional editorial food photograph of an iced mocha latte in a clear glass, rich chocolate-espresso brown with milk, drizzle of chocolate visible. Ice cubes. Condensation on glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "iced-americano": "Professional editorial food photograph of an iced americano in a clear glass, dark espresso over ice and water, showing deep black-brown color. Condensation on glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "cream-top-americano": "Professional editorial food photograph of an iced cream top americano in a clear glass, dark espresso americano on the bottom with a thick layer of sweet cream floating on top, creating a dramatic two-tone contrast. Condensation on glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "iced-lavender-butterfly-pea-latte": "Professional editorial food photograph of an iced lavender butterfly pea latte in a clear glass, stunning purple-blue gradient from butterfly pea flower with creamy milk and hints of lavender. Ice cubes. Condensation on glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "salted-caramel-cream-topped-latte": "Professional editorial food photograph of an iced salted caramel cream topped latte in a clear glass, espresso and milk below with a thick layer of salted caramel cream on top, caramel drizzle. Ice cubes. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "fine-robusta-iced-coffee": "Professional editorial food photograph of a fine robusta iced coffee in a clear glass, strong dark coffee over ice, rich dark brown with slight reddish tones characteristic of robusta beans. Condensation on glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "yuzu-espresso-tonic": "Professional editorial food photograph of a yuzu espresso tonic in a clear glass, layered dark espresso floating on top of sparkling tonic water with yuzu citrus, visible carbonation bubbles. Ice cubes. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "cookie-butter-cream-top-latte": "Professional editorial food photograph of an iced cookie butter cream top latte in a clear glass, espresso and milk below with a thick swirl of golden-brown cookie butter cream on top. Ice cubes. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "cold-brew": "Professional editorial food photograph of cold brew coffee in a clear glass, smooth dark coffee over ice, deep rich black-brown color. Condensation on glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",

        # --- SPECIALTY TEA ---
        "masala-chai-latte": "Professional editorial food photograph of a hot masala chai latte in a clean white porcelain cup, warm spiced tea with steamed milk, golden-amber color with a dusting of cinnamon on the foam. A cinnamon stick beside the cup. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "earl-grey-blend": "Professional editorial food photograph of Earl Grey tea in a clean white porcelain cup, elegant amber-golden tea with a bergamot-scented aroma, a small dried bergamot peel beside the cup. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "phoenix-jasmine-pearl": "Professional editorial food photograph of Phoenix Jasmine Pearl tea in a clear glass cup, delicate pale golden-green tea with rolled jasmine pearl tea leaves unfurling at the bottom. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "peach-oolong": "Professional editorial food photograph of peach oolong tea in a clear glass cup, golden amber oolong tea with a soft peachy tint, a fresh peach slice beside the cup. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "wild-strawberry": "Professional editorial food photograph of wild strawberry tea in a clear glass cup, beautiful ruby-red herbal tea infusion, a few dried strawberry pieces beside the cup. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",

        # --- CITRUS SPARKLERS ---
        "strawberry-citrus-sparkler": "Professional editorial food photograph of a strawberry citrus sparkler in a clear glass, bright pink-red sparkling drink with fresh strawberry slices and yuzu citrus, visible carbonation bubbles. Ice cubes. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "yuzu-citrus-sparkler": "Professional editorial food photograph of a yuzu citrus sparkler in a clear glass, bright golden-yellow sparkling drink with yuzu citrus, visible carbonation bubbles. Ice cubes. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",

        # --- PASTRIES ---
        "butter-croissant": "Professional editorial food photograph of a golden butter croissant, flaky laminated layers visible, perfectly baked golden-brown exterior. On a small white plate, warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field. 1:1 square crop.",
        "ham-and-cheese-croissant": "Professional editorial food photograph of a ham and cheese croissant cut in half showing melted cheese and ham inside, golden flaky exterior. On a small white plate, warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field. 1:1 square crop.",
        "chocolate-croissant": "Professional editorial food photograph of a chocolate croissant (pain au chocolat), golden flaky layers with dark chocolate visible at the ends. On a small white plate, warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field. 1:1 square crop.",
        "bacon-tomato-croissant": "Professional editorial food photograph of a savory bacon and tomato croissant, golden flaky exterior with crispy bacon and fresh tomato filling visible. On a small white plate, warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field. 1:1 square crop.",
        "raspberry-pistachio-croissant": "Professional editorial food photograph of a raspberry pistachio croissant, golden flaky pastry topped with crushed green pistachios and bright raspberry filling peeking through. On a small white plate, warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field. 1:1 square crop.",
        "spinach-mushroom-feta-croissant": "Professional editorial food photograph of a spinach mushroom feta croissant, golden baked savory croissant with green spinach, mushroom, and white feta cheese visible. On a small white plate, warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field. 1:1 square crop.",
        "bacon-jalapeo-cream-cheese-croissant": "Professional editorial food photograph of a bacon jalapeno cream cheese croissant, golden flaky croissant with crispy bacon, green jalapeno slices, and cream cheese filling visible. On a small white plate, warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field. 1:1 square crop.",

        # --- SANDWICHES ---
        "the-tuna": "Professional editorial food photograph of a gourmet tuna sandwich on artisan bread, fresh tuna salad with greens on thick-cut sourdough bread. On a small white plate, warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field. 1:1 square crop.",
        "the-roast-beef": "Professional editorial food photograph of a gourmet roast beef sandwich on artisan bread, sliced roast beef with fresh greens and condiments on thick-cut sourdough. On a small white plate, warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field. 1:1 square crop.",
        "the-italian": "Professional editorial food photograph of a gourmet Italian sandwich on artisan bread, layers of Italian meats like salami and capicola with fresh greens, tomato, and olive oil on thick-cut sourdough. On a small white plate, warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field. 1:1 square crop.",

        # --- NON-COFFEE ---
        "strawberry-milk": "Professional editorial food photograph of a glass of strawberry milk, beautiful pink color, in a clear glass. Fresh strawberry beside the glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "chocolate-milk": "Professional editorial food photograph of a glass of rich chocolate milk, deep brown color, in a clear glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "hot-chocolate": "Professional editorial food photograph of a hot chocolate in a clean white porcelain cup, rich dark chocolate color with marshmallows or whipped cream on top, steam rising. Warm linen background (#F5F3EE). Warm soft diffused lighting, shallow depth of field, minimalist styling, premium artisanal cafe aesthetic. 1:1 square crop.",
        "babycino": "Professional editorial food photograph of a babycino in a tiny white porcelain cup, frothed warm milk with a light dusting of cocoa powder on top, child-friendly small portion. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "banana-milk": "Professional editorial food photograph of a glass of banana milk, creamy pale yellow color, in a clear glass. Fresh banana beside the glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",
        "corn-milk": "Professional editorial food photograph of a glass of sweet corn milk, creamy golden-yellow color, in a clear glass. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.",

        # --- MERCHANDISE (shared images per type) ---
        "s-shirt": "Flat-lay product photograph of a cream-colored screen-printed coffee shop t-shirt with minimalist coffee bean logo design, size small, neatly folded on a warm linen background (#F5F3EE). Soft diffused lighting, editorial product photography. 1:1 square crop.",
        "m-shirt": "Flat-lay product photograph of a cream-colored screen-printed coffee shop t-shirt with minimalist coffee bean logo design, neatly folded on a warm linen background (#F5F3EE). Soft diffused lighting, editorial product photography. 1:1 square crop.",
        "l-shirt": "Flat-lay product photograph of a cream-colored screen-printed coffee shop t-shirt with minimalist coffee bean logo design, neatly folded on a warm linen background (#F5F3EE). Soft diffused lighting, editorial product photography. 1:1 square crop.",
        "xl-shirt": "Flat-lay product photograph of a cream-colored screen-printed coffee shop t-shirt with minimalist coffee bean logo design, neatly folded on a warm linen background (#F5F3EE). Soft diffused lighting, editorial product photography. 1:1 square crop.",
        "xxl-shirt": "Flat-lay product photograph of a cream-colored screen-printed coffee shop t-shirt with minimalist coffee bean logo design, neatly folded on a warm linen background (#F5F3EE). Soft diffused lighting, editorial product photography. 1:1 square crop.",
        "xxxl-shirt": "Flat-lay product photograph of a cream-colored screen-printed coffee shop t-shirt with minimalist coffee bean logo design, neatly folded on a warm linen background (#F5F3EE). Soft diffused lighting, editorial product photography. 1:1 square crop.",
        "m-sweater": "Flat-lay product photograph of a sage green (#D4DDD5) crewneck sweater with minimalist embroidered coffee shop logo, premium heavyweight cotton, neatly folded on a warm linen background (#F5F3EE). Soft diffused lighting, editorial product photography. 1:1 square crop.",
        "l-sweater": "Flat-lay product photograph of a sage green (#D4DDD5) crewneck sweater with minimalist embroidered coffee shop logo, premium heavyweight cotton, neatly folded on a warm linen background (#F5F3EE). Soft diffused lighting, editorial product photography. 1:1 square crop.",
        "xl-sweater": "Flat-lay product photograph of a sage green (#D4DDD5) crewneck sweater with minimalist embroidered coffee shop logo, premium heavyweight cotton, neatly folded on a warm linen background (#F5F3EE). Soft diffused lighting, editorial product photography. 1:1 square crop.",
        "xxl-sweater": "Flat-lay product photograph of a sage green (#D4DDD5) crewneck sweater with minimalist embroidered coffee shop logo, premium heavyweight cotton, neatly folded on a warm linen background (#F5F3EE). Soft diffused lighting, editorial product photography. 1:1 square crop.",
    }
    return prompts.get(slug, f"Professional editorial food photograph of {name} from a premium artisanal cafe. Warm linen background (#F5F3EE). Soft diffused lighting, shallow depth of field, minimalist styling. 1:1 square crop.")


def get_category_for_images(slug, name, category):
    """Map to image json categories."""
    cat_map = {
        "Coffee (Hot)": "coffee-hot",
        "Coffee (Iced)": "coffee-iced",
        "Signature": "signature-drinks",
        "Matcha": "matcha",
        "Hojicha": "hojicha",
        "Specialty Tea": "specialty-tea",
        "Citrus Sparklers": "citrus-sparklers",
        "Non-Coffee": "non-coffee",
        "Pastries": "pastry",
        "Sandwiches": "food",
        "Merchandise": "merchandise",
    }
    return cat_map.get(category, "other")


def submit_task(slug, prompt):
    """Submit a generation task to kie.ai."""
    payload = {
        "model": "nano-banana-pro",
        "input": {
            "prompt": prompt,
            "negative_prompt": "text, watermarks, deformed, blurry, low quality, ugly, distorted",
            "aspect_ratio": "1:1"
        }
    }
    try:
        resp = requests.post(f"{BASE_URL}/createTask", headers=HEADERS, json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        task_id = data.get("data", {}).get("taskId")
        if task_id:
            return task_id
        print(f"  [WARN] No taskId for {slug}: {data}")
        return None
    except Exception as e:
        print(f"  [ERROR] Submit failed for {slug}: {e}")
        return None


def poll_task(task_id):
    """Poll until task completes. Returns result URLs or None."""
    for i in range(MAX_POLLS):
        try:
            resp = requests.get(f"{BASE_URL}/recordInfo", params={"taskId": task_id}, headers=HEADERS, timeout=30)
            resp.raise_for_status()
            data = resp.json().get("data", {})
            state = data.get("state", "")
            if state == "success":
                result_json_raw = data.get("resultJson", "{}")
                # resultJson comes back as a JSON string, not a dict
                if isinstance(result_json_raw, str):
                    result_json = json.loads(result_json_raw)
                else:
                    result_json = result_json_raw
                urls = result_json.get("resultUrls", [])
                return urls
            elif state == "failed":
                print(f"  [FAIL] Task {task_id} failed: {data.get('error', 'unknown')}")
                return None
            # Still processing
        except Exception as e:
            print(f"  [WARN] Poll error for {task_id}: {e}")
        time.sleep(POLL_INTERVAL)
    print(f"  [TIMEOUT] Task {task_id} did not complete in time")
    return None


def download_image(url, output_path):
    """Download image from URL to local path."""
    try:
        resp = requests.get(url, timeout=60)
        resp.raise_for_status()
        # Determine extension from URL or content type
        content_type = resp.headers.get("Content-Type", "")
        if "png" in content_type or url.endswith(".png"):
            ext = ".png"
        elif "webp" in content_type or url.endswith(".webp"):
            ext = ".webp"
        else:
            ext = ".jpg"

        final_path = output_path.with_suffix(ext)
        with open(final_path, "wb") as f:
            f.write(resp.content)
        return final_path
    except Exception as e:
        print(f"  [ERROR] Download failed: {e}")
        return None


def main():
    # Load data
    with open(MENU_JSON, "r", encoding="utf-8") as f:
        menu = json.load(f)
    with open(IMAGES_JSON, "r", encoding="utf-8") as f:
        existing = json.load(f)

    existing_slugs = set(existing.keys())

    # Build remaining items
    remaining = []
    for item in menu:
        slug = slugify(item["name"])
        if slug not in existing_slugs:
            remaining.append({
                "slug": slug,
                "name": item["name"],
                "price": item["price"],
                "category": item["category"],
            })

    # Check if --resume flag: skip items that already have downloaded images
    resume = "--resume" in sys.argv
    if resume:
        filtered = []
        for item in remaining:
            # Check if any image file already exists for this slug
            found = False
            for ext in [".jpg", ".jpeg", ".png", ".webp"]:
                if (OUTPUT_DIR / f"{item['slug']}{ext}").exists():
                    found = True
                    break
            if not found:
                filtered.append(item)
            else:
                print(f"  [SKIP] {item['slug']} already downloaded")
        remaining = filtered

    total = len(remaining)
    print(f"\n{'='*60}")
    print(f"  Brew Story Menu Image Generator")
    print(f"  {total} items to generate, batch size {BATCH_SIZE}")
    print(f"{'='*60}\n")

    if total == 0:
        print("Nothing to generate!")
        return

    # Process in batches
    results = {}  # slug -> local_path
    for batch_start in range(0, total, BATCH_SIZE):
        batch = remaining[batch_start:batch_start + BATCH_SIZE]
        batch_num = batch_start // BATCH_SIZE + 1
        total_batches = (total + BATCH_SIZE - 1) // BATCH_SIZE
        print(f"\n--- Batch {batch_num}/{total_batches} ({len(batch)} items) ---")

        # Submit all tasks in batch
        tasks = {}  # task_id -> item
        for item in batch:
            prompt = get_prompt(item["slug"], item["name"], item["category"])
            print(f"  Submitting: {item['slug']}")
            task_id = submit_task(item["slug"], prompt)
            if task_id:
                tasks[task_id] = item
                print(f"    -> taskId: {task_id}")
            time.sleep(0.5)  # Small delay between submissions

        if not tasks:
            print("  No tasks submitted in this batch, skipping...")
            continue

        # Wait a bit before polling
        print(f"\n  Waiting 15s before polling...")
        time.sleep(15)

        # Poll all tasks
        for task_id, item in tasks.items():
            print(f"  Polling: {item['slug']} (task {task_id})")
            urls = poll_task(task_id)
            if urls and len(urls) > 0:
                output_path = OUTPUT_DIR / item["slug"]
                local_path = download_image(urls[0], output_path)
                if local_path:
                    results[item["slug"]] = {
                        "path": local_path,
                        "item": item
                    }
                    print(f"    -> Downloaded: {local_path.name}")
                else:
                    print(f"    -> Download failed")
            else:
                print(f"    -> No result URLs")

        print(f"\n  Batch {batch_num} complete: {len([r for r in results if r in [i['slug'] for i in batch]])} succeeded")

    # Update menu-images.json
    print(f"\n{'='*60}")
    print(f"  Updating menu-images.json...")

    for slug, result in results.items():
        item = result["item"]
        local_path = result["path"]
        ext = local_path.suffix
        image_path = f"/images/menu/{slug}{ext}"
        cat = get_category_for_images(slug, item["name"], item["category"])

        existing[slug] = {
            "name": item["name"],
            "price": f"${item['price']:.2f}" if isinstance(item["price"], (int, float)) else str(item["price"]),
            "category": cat,
            "image": image_path,
            "source": "generated",
            "description": f"AI-generated image for {item['name']}"
        }

    with open(IMAGES_JSON, "w", encoding="utf-8") as f:
        json.dump(existing, f, indent=2, ensure_ascii=False)

    print(f"  Total entries in menu-images.json: {len(existing)}")
    print(f"  New entries added: {len(results)}")
    print(f"  Failed: {total - len(results)}")
    print(f"\nDone!")


if __name__ == "__main__":
    main()
