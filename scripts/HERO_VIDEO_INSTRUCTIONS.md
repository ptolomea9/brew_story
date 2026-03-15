# Hero Video Generation — Kling AI Instructions

## Creative Vision

A single continuous shot where:
1. **Side view** — Coffee beans pour from above into a ceramic cup
2. **Camera rotates** — Smoothly pans from side view upward to overhead
3. **Beans transform** — As they pour, the solid beans dissolve into dark liquid
4. **Latte art forms** — Milk swirls in, creating a rosetta pattern
5. **Cinnamon dusts** — Final overhead moment, cinnamon sprinkles over the foam

The essence: **coffee beans becoming the final coffee art**, captured in one cinematic rotation.

## Frames (use the 4x upscaled versions)

- **Start frame**: `public/images/generated/video_frame_start_v2_4x.png`
  Side view of beans pouring into a ceramic cup, some dissolving into liquid (~3072x5504)

- **End frame**: `public/images/generated/video_frame_end_4x.png`
  Overhead view of finished latte with rosetta art + cinnamon dust (~3072x5504)

GitHub URLs (for mobile/tablet access):
- Start: https://raw.githubusercontent.com/ptolomea9/brew_story/main/public/images/generated/video_frame_start_v2_4x.png
- End: https://raw.githubusercontent.com/ptolomea9/brew_story/main/public/images/generated/video_frame_end_4x.png

## Steps in Kling AI (klingai.com)

1. Go to **klingai.com** and sign in
2. Select **Image to Video** mode
3. Upload `video_frame_start_v2_4x.png` as the **Start Frame**
4. Upload `video_frame_end_4x.png` as the **End Frame**
5. Set the prompt:

```
The camera begins at a side angle showing dark roasted coffee beans pouring
from a container into a ceramic cup on a marble surface. As the camera slowly
rotates upward toward an overhead view, the falling beans gradually dissolve
and transform into rich dark espresso liquid. Steamed milk begins to flow in,
swirling naturally to form intricate rosetta latte art. The camera settles
into a direct overhead position as fine cinnamon powder is gently dusted
across the foam, creating a warm pattern. Warm golden morning light
throughout, editorial food cinematography, smooth slow motion, shallow depth
of field, premium artisanal coffee aesthetic.
```

6. Settings:
   - Duration: **10 seconds** (longer = smoother camera rotation)
   - Mode: **Professional / High Quality**
   - Motion: **Medium** (enough for the camera rotation + pour, not so much it distorts)

## Tips for Best Results

- If the transformation (beans to liquid) isn't smooth, try adding "morphing transition" or "seamless transformation" to the prompt
- If the camera rotation is too jerky, reduce motion to Low and increase duration to 10s
- Try generating 2-3 variations and pick the best one
- Kling's "Professional" mode (if available) handles complex camera moves better

## Alternative Prompts to Try

**Simpler version** (if the full transformation is too complex):
```
Cinematic camera slowly rotating from side view to overhead view of a
coffee cup on marble. Coffee beans transform into dark liquid, then milk
swirls in creating latte art. Cinnamon dusts over the foam. Warm golden
light, slow motion, editorial food videography.
```

**Two-part approach** (if single generation fails):
1. Generate side-view beans pouring into cup (start frame only, 5s)
2. Generate overhead latte art forming with cinnamon (end frame only, 5s)
3. Stitch together with a crossfade in CapCut or similar

## Wiring into the Site

Once you have the MP4:
1. Save it to `public/videos/hero-beans-to-latte.mp4`
2. Update `src/app/page.tsx`:
   ```tsx
   <HeroTimeline videoSrc="/videos/hero-beans-to-latte.mp4" />
   ```
   (Remove the `heroImage` prop, video takes priority)
3. The HeroTimeline component already supports `videoSrc` with autoPlay, muted, loop, playsInline.

## Alternative Platforms

| Platform | Start+End Frames | Best For |
|----------|-----------------|----------|
| **Kling AI** (klingai.com) | Yes | Complex camera moves, transformations |
| **Runway Gen-3** (runwayml.com) | Yes | High fidelity, consistent lighting |
| **Pika** (pika.art) | Yes | Stylized motion, good with food |
| **Luma Dream Machine** | Yes | Natural motion, photorealism |

## Fallback

The current static `heroImage` (hero_latte.png) looks excellent.
The site is fully functional with or without the video.
