"""
Generate all 86 menu item images with gray marble cement counter background.
Uses kie.ai API with nano-banana-pro model.
Batches of 8 tasks at a time, polls until complete, downloads results.
"""

import json
import os
import sys
import time
import requests

API_KEY = os.environ.get("KIE_AI_API_KEY", "")
BASE_URL = "https://api.kie.ai/api/v1/jobs"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
MENU_JSON = os.path.join(PROJECT_ROOT, "src", "data", "menu-images.json")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "public", "images", "menu")

NEGATIVE_PROMPT = "text, words, letters, watermarks, signatures, deformed, distorted, bad anatomy, wooden surface, warm tones, linen fabric, white background, orange tones"

MARBLE_BG = "polished gray marble cement countertop with subtle white veining, cool gray tones"
CAFE_BG = "Blurred minimalist cafe interior background. Soft natural overhead lighting, shallow depth of field"

# ── Per-item prompt overrides for items with specific visual details ──
ITEM_PROMPTS = {
    # === SIGNATURE DRINKS ===
    "tiramisu-latte": f"Professional editorial food photograph of a Tiramisu Latte in a clear glass cup. Layered espresso drink with visible espresso and milk layers, topped with thick mascarpone cream, generous cocoa powder dusting, and a ladyfinger cookie perched on top. Sitting on a {MARBLE_BG}. {CAFE_BG}, premium artisanal cafe aesthetic. 1:1 square crop.",

    "banana-cream-latte": f"Professional editorial food photograph of an iced Banana Cream Coffee Latte in a clear plastic cup with dome lid. Visible banana cream layer at bottom, espresso and milk in middle, topped with crunchy granola crumble and banana slice. Ice cubes visible through cup. Sitting on a {MARBLE_BG}. {CAFE_BG}, condensation on cup. 1:1 square crop.",

    "sweet-corn-latte": f"Professional editorial food photograph of a Sweet Corn Latte in a clear glass. Golden yellow corn-infused latte with beautiful gradient of golden corn syrup and espresso, topped with light cream. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "mama-latte": f"Professional editorial food photograph of a MaMa Latte — a matcha latte in a clear glass cup. Vibrant green matcha base with a thick layer of white cream on top, beautiful green and white contrast. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "creme-brulee-latte": f"Professional editorial food photograph of a Creme Brulee Latte in a white porcelain cup. Dark amber espresso latte with a caramelized sugar crust on top that has been torch-finished, showing crackled golden-brown brulee surface. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "coconut-cloud-latte": f"Professional editorial food photograph of a Coconut Cloud Latte in a clear glass. Espresso latte topped with an enormous fluffy white coconut cream cloud that rises above the rim of the glass, ethereal and pillow-like. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "the-yoda": f"Professional editorial food photograph of The Yoda — an iced latte in a clear plastic cup with dome lid. Milk and espresso base with a dramatic bright green matcha cream top layer, creating a striking two-tone effect. Ice visible through cup. Sitting on a {MARBLE_BG}. {CAFE_BG}, condensation on cup. 1:1 square crop.",

    "tiramisu-americano": f"Professional editorial food photograph of a Tiramisu Americano in a clear glass. Dark espresso over water base, topped with dollop of mascarpone cream, cocoa powder dusting, and a ladyfinger cookie on the side. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "spanish-latte": f"Professional editorial food photograph of a Spanish Latte in a clear glass. Beautiful swirl of condensed milk and espresso creating caramel-toned layers, rich and creamy appearance. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "lavender-butterfly-pea-latte": f"Professional editorial food photograph of a Lavender Butterfly Pea Latte in a clear glass. Stunning purple-blue gradient from deep indigo at bottom to lighter lavender at top, with a cream layer on top. Beautiful color separation. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "salted-caramel-cream-topped-latte": f"Professional editorial food photograph of a Salted Caramel Cream Topped Latte in a clear glass. Iced espresso latte with a thick layer of salted caramel cream on top, drizzled with caramel sauce, flaky sea salt crystals visible. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "cookie-butter-cream-top-latte": f"Professional editorial food photograph of a Cookie Butter Cream Top Latte in a clear glass. Iced espresso latte topped with swirled cookie butter cream, specks of speculoos cookie crumbles on top, warm golden-brown cream layer. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "the-italian": f"Professional editorial food photograph of The Italian sandwich. Thick Italian deli sandwich on artisan ciabatta bread with layers of salami, capicola, provolone cheese, lettuce, tomato, red onion, and Italian dressing. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    # === MATCHA ===
    "matcha-latte": f"Professional editorial food photograph of a Matcha Latte in a clear glass. Vibrant bright green matcha with beautiful layered green and white milk gradient, premium Japanese matcha color. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "banana-matcha-latte": f"Professional editorial food photograph of a Banana Matcha Latte in a clear glass. Vibrant green matcha latte with banana cream layer, creating a green-yellow gradient effect. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "cookie-butter-cream-top-matcha-latte": f"Professional editorial food photograph of a Cookie Butter Cream Top Matcha Latte in a clear glass. Vibrant green matcha base topped with swirled cookie butter cream and speculoos cookie crumbles. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "sweet-corn-matcha-latte": f"Professional editorial food photograph of a Sweet Corn Matcha Latte in a clear glass. Green matcha blended with golden sweet corn cream, creating a unique green-gold gradient. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "coconut-cloud-matcha": f"Professional editorial food photograph of a Coconut Cloud Matcha in a clear glass. Vibrant green matcha topped with an enormous fluffy white coconut cream cloud. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "strawberry-matcha-latte": f"Professional editorial food photograph of a Strawberry Matcha Latte in a clear glass. Stunning pink strawberry layer at bottom transitioning to vibrant green matcha on top, beautiful pink-green gradient. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "lavender-butterfly-pea-matcha-latte": f"Professional editorial food photograph of a Lavender Butterfly Pea Matcha Latte in a clear glass. Mesmerizing purple-blue butterfly pea flower base blending with vibrant green matcha, creating a purple-green ombre effect. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "creme-brulee-matcha-latte": f"Professional editorial food photograph of a Creme Brulee Matcha Latte in a clear glass. Vibrant green matcha latte with a caramelized brulee sugar top, torch-finished golden crust over green matcha. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "strawberry-shortcake-matcha-latte": f"Professional editorial food photograph of a Strawberry Shortcake Matcha Latte in a clear glass. Vibrant green matcha with layers of strawberry cream and shortcake crumbles on top, pink and green layers. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "coconut-water-matcha-cream-top": f"Professional editorial food photograph of a Coconut Water Matcha with cream top in a clear glass. Light green coconut water matcha base with thick cream layer floating on top. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "sparkling-yuzu-matcha": f"Professional editorial food photograph of a Sparkling Yuzu Matcha in a clear glass with bubbles. Effervescent green matcha with yuzu citrus in sparkling water, visible carbonation bubbles, bright and refreshing appearance. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "pumpkin-pie-matcha-latte": f"Professional editorial food photograph of a Pumpkin Pie Matcha Latte in a clear glass. Vibrant green matcha with warm pumpkin spice cream swirl, autumn-inspired green and orange tones. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    # === HOJICHA ===
    "hojicha": f"Professional editorial food photograph of a Hojicha latte in a clear glass. Warm reddish-brown roasted Japanese tea latte with creamy milk, beautiful amber-brown color. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    # === COFFEE HOT ===
    "morning-drip-regular": f"Professional editorial food photograph of a regular Morning Drip coffee in a clean white porcelain mug. Fresh brewed filter coffee, dark rich brown color with slight steam rising. Sitting on a {MARBLE_BG}. {CAFE_BG}, premium artisanal cafe aesthetic. 1:1 square crop.",

    "morning-drip-large": f"Professional editorial food photograph of a large Morning Drip coffee in a tall clean white porcelain mug. Fresh brewed filter coffee, dark rich brown color with slight steam rising. Sitting on a {MARBLE_BG}. {CAFE_BG}, premium artisanal cafe aesthetic. 1:1 square crop.",

    "hot-americano": f"Professional editorial food photograph of a Hot Americano in a clean white porcelain cup. Dark espresso over hot water with beautiful crema on top, deep brown color. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "cappuccino": f"Professional editorial food photograph of a Cappuccino in a clean white porcelain cup. Classic Italian cappuccino with thick velvety milk foam layer on top, light latte art visible, equal thirds of espresso, steamed milk, and foam. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "flat-white": f"Professional editorial food photograph of a Flat White in a clean white porcelain cup. Velvety microfoam with delicate latte art, smooth and glossy surface, thin layer of perfectly textured milk. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "cortado": f"Professional editorial food photograph of a Cortado in a small clear glass. Equal parts espresso and steamed milk, small and concentrated, rich brown with thin milk layer. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "espresso": f"Professional editorial food photograph of a double Espresso in a small white espresso cup with saucer. Rich dark crema on top, deep brown color, concentrated and intense. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "pour-over": f"Professional editorial food photograph of a Pour Over coffee in a clear glass carafe with a ceramic dripper on top. Clean, light-bodied coffee, golden-amber color, pour over setup visible. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "hot-latte": f"Professional editorial food photograph of a Hot Latte in a clean white porcelain cup. Smooth steamed milk with beautiful latte art rosetta pattern, creamy and inviting. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "hot-vanilla-latte": f"Professional editorial food photograph of a Hot Vanilla Latte in a clean white porcelain cup. Smooth steamed milk with latte art, subtle vanilla-infused cream color, slightly lighter than regular latte. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "hot-spanish-latte": f"Professional editorial food photograph of a Hot Spanish Latte in a clean white porcelain cup. Rich espresso with condensed milk creating a sweet caramel-toned latte, creamy and sweet appearance. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "traditional-macchiato": f"Professional editorial food photograph of a Traditional Macchiato in a small white espresso cup. Dark espresso stained with just a dollop of milk foam on top, classic and minimal. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "hot-mocha-latte": f"Professional editorial food photograph of a Hot Mocha Latte in a clean white porcelain cup. Rich chocolate and espresso combined with steamed milk, dark chocolate color with cream top, drizzle of chocolate sauce. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    # === COFFEE ICED ===
    "iced-latte": f"Professional editorial food photograph of an Iced Latte in a clear plastic cup with dome lid. Espresso and cold milk over ice, beautiful brown gradient visible through clear cup. Sitting on a {MARBLE_BG}. {CAFE_BG}, condensation on cup. 1:1 square crop.",

    "iced-vanilla-latte": f"Professional editorial food photograph of an Iced Vanilla Latte in a clear plastic cup with dome lid. Vanilla-infused espresso and milk over ice, slightly lighter caramel tone, ice cubes visible. Sitting on a {MARBLE_BG}. {CAFE_BG}, condensation on cup. 1:1 square crop.",

    "iced-brown-sugar-latte": f"Professional editorial food photograph of an Iced Brown Sugar Latte in a clear plastic cup with dome lid. Dark brown sugar syrup swirled with espresso and oat milk over ice, rich amber-brown layers. Sitting on a {MARBLE_BG}. {CAFE_BG}, condensation on cup. 1:1 square crop.",

    "iced-spanish-latte": f"Professional editorial food photograph of an Iced Spanish Latte in a clear plastic cup with dome lid. Condensed milk swirled with espresso over ice, sweet caramel gradient layers visible. Sitting on a {MARBLE_BG}. {CAFE_BG}, condensation on cup. 1:1 square crop.",

    "iced-mocha-latte": f"Professional editorial food photograph of an Iced Mocha Latte in a clear plastic cup with dome lid. Rich chocolate espresso with cold milk over ice, dark chocolate-brown color with cream layer. Sitting on a {MARBLE_BG}. {CAFE_BG}, condensation on cup. 1:1 square crop.",

    "iced-americano": f"Professional editorial food photograph of an Iced Americano in a clear plastic cup with dome lid. Dark espresso over cold water and ice, deep brown-black color, ice cubes prominent. Sitting on a {MARBLE_BG}. {CAFE_BG}, condensation on cup. 1:1 square crop.",

    "cream-top-americano": f"Professional editorial food photograph of a Cream Top Americano in a clear plastic cup with dome lid. Dark iced americano with thick layer of sweet cream floating on top, dramatic dark-light contrast. Sitting on a {MARBLE_BG}. {CAFE_BG}, condensation on cup. 1:1 square crop.",

    "iced-lavender-butterfly-pea-latte": f"Professional editorial food photograph of an Iced Lavender Butterfly Pea Latte in a clear plastic cup with dome lid. Stunning purple-blue gradient with milk, butterfly pea flower creating vivid indigo-lavender color over ice. Sitting on a {MARBLE_BG}. {CAFE_BG}, condensation on cup. 1:1 square crop.",

    "fine-robusta-iced-coffee": f"Professional editorial food photograph of a Fine Robusta Iced Coffee in a clear plastic cup with dome lid. Strong, dark Vietnamese-style robusta coffee over ice, deep dark brown, bold appearance. Sitting on a {MARBLE_BG}. {CAFE_BG}, condensation on cup. 1:1 square crop.",

    "yuzu-espresso-tonic": f"Professional editorial food photograph of a Yuzu Espresso Tonic in a clear glass. Espresso floated on top of tonic water with yuzu citrus, creating a dramatic two-layer effect — dark espresso on top, golden effervescent tonic below, visible bubbles. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "cold-brew": f"Professional editorial food photograph of a Cold Brew coffee in a clear plastic cup with dome lid. Smooth, dark cold brew coffee over ice, deep rich brown-black color, clean and refreshing. Sitting on a {MARBLE_BG}. {CAFE_BG}, condensation on cup. 1:1 square crop.",

    # === SPECIALTY TEA ===
    "masala-chai-latte": f"Professional editorial food photograph of a Masala Chai Latte in a clean white porcelain cup. Rich spiced chai with steamed milk, warm amber-brown color, slight foam on top with cinnamon dust. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "earl-grey-blend": f"Professional editorial food photograph of an Earl Grey tea in a clean white porcelain cup with saucer. Light golden-amber tea, clear and aromatic, with a small bergamot slice garnish. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "phoenix-jasmine-pearl": f"Professional editorial food photograph of Phoenix Jasmine Pearl tea in a clear glass cup. Delicate pale golden-green tea with jasmine pearl tea leaves unfurling in the water, elegant and refined. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "peach-oolong": f"Professional editorial food photograph of Peach Oolong tea in a clear glass cup. Golden amber oolong tea with a peach-tinted hue, light and refreshing, with a thin slice of peach. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "wild-strawberry": f"Professional editorial food photograph of Wild Strawberry tea in a clear glass cup. Bright pinkish-red strawberry herbal tea, vibrant ruby color, with small dried strawberry pieces floating. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    # === CITRUS SPARKLERS ===
    "strawberry-citrus-sparkler": f"Professional editorial food photograph of a Strawberry Citrus Sparkler in a clear glass. Fresh strawberry and yuzu citrus sparkling beverage, bright pink-red color with visible carbonation bubbles, fresh strawberry slices, and ice. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "yuzu-citrus-sparkler": f"Professional editorial food photograph of a Yuzu Citrus Sparkler in a clear glass. Bright yuzu citrus sparkling water, pale golden-yellow color with visible carbonation bubbles, yuzu citrus slice garnish, and ice. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    # === PASTRY ===
    "almond-croissant": f"Professional editorial food photograph of an Almond Croissant. Golden flaky croissant filled with almond cream, topped with sliced almonds and light dusting of powdered sugar, beautifully laminated layers visible. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "butter-croissant": f"Professional editorial food photograph of a classic Butter Croissant. Perfect golden-brown flaky pastry with visible laminated buttery layers, slightly curved crescent shape. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "ham-and-cheese-croissant": f"Professional editorial food photograph of a Ham and Cheese Croissant. Golden baked croissant with melted cheese and ham visible at the ends, slightly toasted and glistening. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "chocolate-croissant": f"Professional editorial food photograph of a Chocolate Croissant (pain au chocolat). Golden flaky pastry with dark chocolate visible at the ends, perfectly laminated layers, slightly cracked surface showing buttery interior. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "bacon-tomato-croissant": f"Professional editorial food photograph of a Bacon Tomato Croissant. Golden baked croissant stuffed with crispy bacon strips and fresh tomato slices, slightly open to show filling. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "raspberry-pistachio-croissant": f"Professional editorial food photograph of a Raspberry Pistachio Croissant. Golden flaky croissant filled with raspberry compote and pistachio cream, topped with crushed pistachios and raspberry drizzle, vibrant pink and green accents. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "spinach-mushroom-feta-croissant": f"Professional editorial food photograph of a Spinach Mushroom Feta Croissant. Golden baked savory croissant with spinach, sauteed mushrooms, and crumbled feta visible, slightly open to show the filling. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "bacon-jalapeo-cream-cheese-croissant": f"Professional editorial food photograph of a Bacon Jalapeno Cream Cheese Croissant. Golden baked croissant stuffed with crispy bacon, sliced jalapenos, and cream cheese, slightly open showing spicy filling. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    # === FOOD ===
    "avocado-toast": f"Professional editorial food photograph of Avocado Toast. Smashed ripe avocado spread thick on toasted artisan sourdough bread, topped with everything bagel seeds, microgreens, red pepper flakes, and a drizzle of olive oil. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "house-cured-salmon-toast": f"Professional editorial food photograph of House Cured Salmon Toast. Silky pink house-cured salmon layered on artisan toasted bread with cream cheese, capers, fresh dill, thinly sliced red onion, and a squeeze of lemon. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "the-turkey": f"Professional editorial food photograph of The Turkey sandwich. Generous sliced turkey breast on artisan bread with crisp lettuce, ripe tomato slices, and condiments, served on a plate. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "the-tuna": f"Professional editorial food photograph of The Tuna sandwich. Fresh tuna salad sandwich on artisan bread with lettuce, tomato, and creamy tuna filling visible from the side. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "the-roast-beef": f"Professional editorial food photograph of The Roast Beef sandwich. Thick sliced roast beef on artisan bread with horseradish cream, arugula, and caramelized onions, hearty and substantial. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    # === NON-COFFEE ===
    "strawberry-milk": f"Professional editorial food photograph of Strawberry Milk in a clear glass. Beautiful pink strawberry milk, creamy and smooth, with a fresh strawberry garnish. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "chocolate-milk": f"Professional editorial food photograph of Chocolate Milk in a clear glass. Rich dark chocolate milk, creamy and smooth, deep brown cocoa color. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "hot-chocolate": f"Professional editorial food photograph of a Hot Chocolate in a clean white porcelain mug. Rich, creamy hot chocolate topped with whipped cream and cocoa powder, steam rising, dark and decadent. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "babycino": f"Professional editorial food photograph of a Babycino in a small white porcelain cup. Frothed steamed milk with no coffee, topped with a light dusting of cocoa powder and a marshmallow, kid-friendly and adorable. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "banana-milk": f"Professional editorial food photograph of Banana Milk in a clear glass. Creamy pale yellow banana milk, smooth and thick, with a banana slice garnish. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    "corn-milk": f"Professional editorial food photograph of Corn Milk in a clear glass. Creamy golden yellow corn milk, smooth and naturally sweet, warm golden color. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop.",

    # === MERCHANDISE ===
    "s-shirt": f"Professional flat-lay product photograph of a folded black screen-printed coffee shop t-shirt size Small with minimalist botanical coffee plant design. Laying on a polished gray marble cement surface with subtle white veining. Soft overhead lighting, clean editorial styling. 1:1 square crop.",

    "m-shirt": f"Professional flat-lay product photograph of a folded black screen-printed coffee shop t-shirt size Medium with minimalist botanical coffee plant design. Laying on a polished gray marble cement surface with subtle white veining. Soft overhead lighting, clean editorial styling. 1:1 square crop.",

    "l-shirt": f"Professional flat-lay product photograph of a folded black screen-printed coffee shop t-shirt size Large with minimalist botanical coffee plant design. Laying on a polished gray marble cement surface with subtle white veining. Soft overhead lighting, clean editorial styling. 1:1 square crop.",

    "xl-shirt": f"Professional flat-lay product photograph of a folded black screen-printed coffee shop t-shirt size XL with minimalist botanical coffee plant design. Laying on a polished gray marble cement surface with subtle white veining. Soft overhead lighting, clean editorial styling. 1:1 square crop.",

    "xxl-shirt": f"Professional flat-lay product photograph of a folded black screen-printed coffee shop t-shirt size XXL with minimalist botanical coffee plant design. Laying on a polished gray marble cement surface with subtle white veining. Soft overhead lighting, clean editorial styling. 1:1 square crop.",

    "xxxl-shirt": f"Professional flat-lay product photograph of a folded black screen-printed coffee shop t-shirt size XXXL with minimalist botanical coffee plant design. Laying on a polished gray marble cement surface with subtle white veining. Soft overhead lighting, clean editorial styling. 1:1 square crop.",

    "m-sweater": f"Professional flat-lay product photograph of a folded cream-colored screen-printed coffee shop crewneck sweater size Medium with minimalist botanical coffee plant design. Laying on a polished gray marble cement surface with subtle white veining. Soft overhead lighting, clean editorial styling. 1:1 square crop.",

    "l-sweater": f"Professional flat-lay product photograph of a folded cream-colored screen-printed coffee shop crewneck sweater size Large with minimalist botanical coffee plant design. Laying on a polished gray marble cement surface with subtle white veining. Soft overhead lighting, clean editorial styling. 1:1 square crop.",

    "xl-sweater": f"Professional flat-lay product photograph of a folded cream-colored screen-printed coffee shop crewneck sweater size XL with minimalist botanical coffee plant design. Laying on a polished gray marble cement surface with subtle white veining. Soft overhead lighting, clean editorial styling. 1:1 square crop.",

    "xxl-sweater": f"Professional flat-lay product photograph of a folded cream-colored screen-printed coffee shop crewneck sweater size XXL with minimalist botanical coffee plant design. Laying on a polished gray marble cement surface with subtle white veining. Soft overhead lighting, clean editorial styling. 1:1 square crop.",
}


def get_prompt_for_item(slug, item_data):
    """Generate appropriate prompt based on item category and details."""
    if slug in ITEM_PROMPTS:
        return ITEM_PROMPTS[slug]

    name = item_data["name"]
    category = item_data["category"]

    # Determine prompt template based on category
    if category == "merchandise":
        if "sweater" in slug:
            return f"Professional flat-lay product photograph of a folded cream-colored screen-printed coffee shop crewneck sweater with minimalist botanical coffee plant design. Laying on a polished gray marble cement surface with subtle white veining. Soft overhead lighting, clean editorial styling. 1:1 square crop."
        else:
            return f"Professional flat-lay product photograph of a folded black screen-printed coffee shop t-shirt with minimalist botanical coffee plant design. Laying on a polished gray marble cement surface with subtle white veining. Soft overhead lighting, clean editorial styling. 1:1 square crop."

    elif category in ("food",):
        return f"Professional editorial food photograph of {name}. Artisan cafe quality, beautifully plated and garnished. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop."

    elif category in ("pastry",):
        return f"Professional editorial food photograph of a {name}. Golden, flaky, beautifully baked pastry with visible layers. On a small white plate sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop."

    elif category in ("coffee-iced", "citrus-sparklers") or "iced" in name.lower() or "cold" in name.lower() or "sparkling" in name.lower():
        return f"Professional editorial food photograph of an iced {name} in a clear plastic cup with dome lid. Beautiful color and layers visible through cup, ice cubes, refreshing appearance. Sitting on a {MARBLE_BG}. {CAFE_BG}, condensation on cup. 1:1 square crop."

    elif category in ("coffee-hot", "specialty-tea", "hojicha"):
        return f"Professional editorial food photograph of a {name} in a clean white porcelain cup. Beautifully crafted, steam rising, rich color and inviting. Sitting on a {MARBLE_BG}. {CAFE_BG}, premium artisanal cafe aesthetic. 1:1 square crop."

    elif category in ("non-coffee",):
        if "hot" in name.lower():
            return f"Professional editorial food photograph of a {name} in a clean white porcelain mug. Creamy and inviting, steam rising. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop."
        else:
            return f"Professional editorial food photograph of {name} in a clear glass. Creamy and colorful, smooth and appealing. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop."

    elif category in ("matcha",):
        return f"Professional editorial food photograph of a {name} in a clear glass. Vibrant green matcha with beautiful color, premium Japanese matcha quality. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop."

    elif category in ("signature-drinks",):
        return f"Professional editorial food photograph of a {name} in a clear glass. Beautifully layered artisan coffee drink with unique colors and textures. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop."

    # Default fallback
    return f"Professional editorial food photograph of a {name}. Premium artisan cafe quality, beautifully presented. Sitting on a {MARBLE_BG}. {CAFE_BG}. 1:1 square crop."


def create_task(prompt):
    """Submit a generation task to kie.ai API."""
    payload = {
        "model": "nano-banana-pro",
        "input": {
            "prompt": prompt,
            "negative_prompt": NEGATIVE_PROMPT,
            "aspect_ratio": "1:1"
        }
    }
    try:
        resp = requests.post(f"{BASE_URL}/createTask", headers=HEADERS, json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        task_id = data.get("data", {}).get("taskId")
        if not task_id:
            print(f"  ERROR: No taskId in response: {data}")
            return None
        return task_id
    except Exception as e:
        print(f"  ERROR creating task: {e}")
        return None


def poll_task(task_id, max_wait=300, interval=5):
    """Poll a task until success/failed or timeout."""
    elapsed = 0
    while elapsed < max_wait:
        try:
            resp = requests.get(f"{BASE_URL}/recordInfo?taskId={task_id}", headers=HEADERS, timeout=30)
            resp.raise_for_status()
            data = resp.json().get("data", {})
            state = data.get("state", "")

            if state == "success":
                rj = data.get("resultJson", {})
                # resultJson may be a JSON string that needs parsing
                if isinstance(rj, str):
                    try:
                        rj = json.loads(rj)
                    except json.JSONDecodeError:
                        pass
                if isinstance(rj, dict):
                    urls = rj.get("resultUrls", [])
                    if urls:
                        return urls[0]
                    for key in ["url", "image_url", "output"]:
                        if key in rj:
                            val = rj[key]
                            if isinstance(val, list) and val:
                                return val[0]
                            elif isinstance(val, str):
                                return val
                print(f"  WARNING: success but no URL found in: {str(rj)[:200]}")
                return None
            elif state == "failed":
                print(f"  FAILED: {data.get('errorMessage', 'unknown error')}")
                return None
        except Exception as e:
            print(f"  Poll error: {e}")

        time.sleep(interval)
        elapsed += interval

    print(f"  TIMEOUT after {max_wait}s")
    return None


def download_image(url, filepath):
    """Download image from URL and save to filepath."""
    try:
        resp = requests.get(url, timeout=60)
        resp.raise_for_status()
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "wb") as f:
            f.write(resp.content)
        return True
    except Exception as e:
        print(f"  Download error: {e}")
        return False


def main():
    # Load menu items
    with open(MENU_JSON, "r") as f:
        menu = json.load(f)

    items = list(menu.items())
    total = len(items)
    print(f"Total items to generate: {total}")

    # Check for --resume flag
    start_idx = 0
    if len(sys.argv) > 1 and sys.argv[1] == "--resume":
        resume_from = int(sys.argv[2]) if len(sys.argv) > 2 else 0
        start_idx = resume_from
        print(f"Resuming from item index {start_idx}")

    BATCH_SIZE = 8
    total_batches = (total - start_idx + BATCH_SIZE - 1) // BATCH_SIZE
    batch_num = 0

    succeeded = 0
    failed_items = []

    for i in range(start_idx, total, BATCH_SIZE):
        batch = items[i:i + BATCH_SIZE]
        batch_num += 1
        print(f"\n{'='*60}")
        print(f"Batch {batch_num}/{total_batches}: items {i+1}-{min(i+BATCH_SIZE, total)} of {total}")
        print(f"{'='*60}")

        # Submit all tasks in batch
        tasks = {}  # slug -> (task_id, item_data, is_retry)
        for slug, item_data in batch:
            prompt = get_prompt_for_item(slug, item_data)
            print(f"  Submitting: {slug}")
            task_id = create_task(prompt)
            if task_id:
                tasks[slug] = (task_id, item_data, False)
                print(f"    -> taskId: {task_id}")
            else:
                print(f"    -> FAILED to submit")
                failed_items.append(slug)
            time.sleep(0.5)  # Small delay between submissions

        if not tasks:
            print("  No tasks submitted in this batch, skipping...")
            continue

        # Wait a bit before polling
        print(f"\n  Waiting 15s before polling...")
        time.sleep(15)

        # Poll all tasks
        batch_succeeded = 0
        retry_tasks = {}

        for slug, (task_id, item_data, is_retry) in tasks.items():
            print(f"  Polling: {slug} (task {task_id})")
            url = poll_task(task_id)

            if url:
                filepath = os.path.join(OUTPUT_DIR, f"{slug}.jpg")
                print(f"    Downloading to {filepath}")
                if download_image(url, filepath):
                    batch_succeeded += 1
                    succeeded += 1
                    print(f"    -> SUCCESS")
                else:
                    if not is_retry:
                        retry_tasks[slug] = item_data
                    else:
                        failed_items.append(slug)
            else:
                if not is_retry:
                    retry_tasks[slug] = item_data
                else:
                    failed_items.append(slug)
                    print(f"    -> FAILED (no retry)")

        print(f"\n  Batch {batch_num}/{total_batches}: generated {batch_succeeded}/{len(tasks)} items")

        # Retry failed items once
        if retry_tasks:
            print(f"\n  Retrying {len(retry_tasks)} failed items...")
            time.sleep(5)

            retry_task_ids = {}
            for slug, item_data in retry_tasks.items():
                prompt = get_prompt_for_item(slug, item_data)
                print(f"    Re-submitting: {slug}")
                task_id = create_task(prompt)
                if task_id:
                    retry_task_ids[slug] = (task_id, item_data, True)
                else:
                    failed_items.append(slug)
                time.sleep(0.5)

            if retry_task_ids:
                print(f"    Waiting 15s before polling retries...")
                time.sleep(15)

                for slug, (task_id, item_data, _) in retry_task_ids.items():
                    print(f"    Polling retry: {slug}")
                    url = poll_task(task_id)
                    if url:
                        filepath = os.path.join(OUTPUT_DIR, f"{slug}.jpg")
                        if download_image(url, filepath):
                            succeeded += 1
                            print(f"      -> RETRY SUCCESS")
                        else:
                            failed_items.append(slug)
                    else:
                        failed_items.append(slug)
                        print(f"      -> RETRY FAILED")

    # Update menu-images.json - mark all as regenerated
    print(f"\n{'='*60}")
    print(f"Updating menu-images.json...")
    for slug in menu:
        menu[slug]["source"] = "generated-marble-bg"
        menu[slug]["description"] = f"AI-generated image with gray marble counter background for {menu[slug]['name']}"

    with open(MENU_JSON, "w") as f:
        json.dump(menu, f, indent=2)
    print("menu-images.json updated.")

    # Summary
    print(f"\n{'='*60}")
    print(f"COMPLETE: {succeeded}/{total} images generated successfully")
    if failed_items:
        print(f"FAILED ({len(failed_items)}): {', '.join(failed_items)}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
