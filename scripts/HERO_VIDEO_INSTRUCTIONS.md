# Hero Video Generation — Cling Instructions

## Frames Ready
- **Start frame**: `public/images/generated/video_frame_start.png` — Beans cascading on marble
- **End frame**: `public/images/generated/video_frame_end.png` — Latte with cinnamon art on marble

Both frames are matched: same 9:16 aspect ratio, same overhead angle, same marble surface, same olive napkin, same warm lighting. This gives Cling the best chance at a smooth interpolation.

## Steps in Cling (klingai.com)

1. Go to **klingai.com** and sign in
2. Select **Image to Video** mode
3. Upload `video_frame_start.png` as the **Start Frame**
4. Upload `video_frame_end.png` as the **End Frame**
5. Set the prompt:
   ```
   Smooth cinematic transition of coffee beans slowly settling into a ceramic cup,
   then hot espresso being poured in, milk being steamed and swirled to create
   beautiful latte art, finished with cinnamon being gently sprinkled on top,
   overhead camera angle, warm golden morning light, editorial food videography,
   slow motion, marble countertop
   ```
6. Settings:
   - Duration: **5 seconds** (or 10s for slower, more premium feel)
   - Mode: **Professional** (if available)
   - Motion: **Medium** (avoid too much movement that distorts the frames)
7. Generate and download the MP4

## Wiring into the site

Once you have the MP4:
1. Save it to `public/videos/hero-beans-to-latte.mp4`
2. Update `src/app/page.tsx`:
   ```tsx
   <HeroTimeline videoSrc="/videos/hero-beans-to-latte.mp4" />
   ```
   (Remove the `heroImage` prop — video takes priority over image)
3. The HeroTimeline component already supports `videoSrc` with autoPlay, muted, loop, playsInline.

## Alternative: Runway Gen-3

If Cling doesn't produce the desired quality:
1. Go to **runwayml.com** → Gen-3 Alpha Turbo
2. Same workflow: First Frame + Last Frame mode
3. Same prompt as above
4. 5-10 second generation

## Fallback

If video generation doesn't meet the bar, the current `heroImage` (hero_latte.png)
looks excellent as a static hero. The site is fully functional either way.
