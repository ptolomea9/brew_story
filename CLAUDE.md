# Brew Story

Coffee roastery website for a shop in Huntington Beach, CA.

## Deploy
- **Live**: https://brew-story.vercel.app
- **Repo**: ptolomea9/brew_story (GitHub)
- **Deploy**: `npx vercel --prod --yes` (auto on push once linked)

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- GSAP 3 + ScrollTrigger (hero timelines, text reveals, parallax)
- Framer Motion 11 (scroll reveals, hover states, page transitions, layout animations)
- Lenis (smooth scroll)
- Sanity v3 (CMS, not yet initialized)
- Stripe (e-commerce checkout, lazy-init)
- Toast (POS/ordering, placeholder)
- Zustand (cart state)

## Design System
- Colors: cream `#FEFDFB`, linen `#F5F3EE`, sage `#D4DDD5`, olive `#6B6B5E`, charcoal `#4A4A3C`, ink `#2A2A22`
- Headlines: Cormorant Garamond serif
- Body: System sans-serif stack
- Aesthetic: "West Elm meets Apple" — minimal, premium

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `python scripts/extract_frames.py` — extract stills from anniversary video
- `python scripts/image_pipeline.py generate` — AI image generation (kie.ai)
- `python scripts/image_pipeline.py upscale` — 4x upscale real stills

## Project Structure
```
src/
├── app/          8 pages + 1 API route (/api/checkout)
├── components/
│   ├── animation/  LogoSplash, HeroTimeline, TextReveal, ScrollReveal, ParallaxLayer, TiltedPhotoGrid
│   ├── layout/     Header, Footer, MobileMenu, PageTransition
│   ├── providers/  LenisProvider
│   ├── sanity/     SanityImage, PortableText
│   ├── shop/       ProductCard, ProductGrid, ShopContent, CartDrawer, VariantSelector, CheckoutButton
│   └── ui/         Button, Input, Badge, Container
├── hooks/        useCart (Zustand)
└── lib/          sanity, stripe, utils

public/images/
├── stills/       13 frames from anniversary video (682x1220)
├── upscaled/     8 best stills at 4x (~2728x4880)
└── generated/    7 AI images + 2 video frame pairs (kie.ai nano-banana-pro)

scripts/
├── extract_frames.py         OpenCV frame extraction
├── image_pipeline.py         kie.ai batch generation + upscale
└── HERO_VIDEO_INSTRUCTIONS.md  Kling AI start/end frame workflow
```

## Key Patterns
- Stripe client is lazy-initialized (getStripe()) to avoid build-time errors without API key
- Animation components are all 'use client' — server components import them
- ScrollReveal uses Framer Motion whileInView; TextReveal/ParallaxLayer use GSAP ScrollTrigger
- Tailwind v4 uses CSS-first config in globals.css (@theme inline block)
- Shop page uses ShopContent (client) with animated pill tab filter (All/Coffee/Merchandise)
- HeroTimeline accepts videoSrc (priority) or heroImage prop for the right-side visual

## Image Pipeline (kie.ai)
- API key: `7cde39d381c7cabab1a9c9d7c0798392`
- Generation model: `nano-banana-pro` (no vendor prefix)
- Upscale model: `recraft/crisp-upscale` (uses `image` param, not `image_urls`)
- Poll field: `state` not `status` in recordInfo response
- Images must be at public URLs for upscaling (push to GitHub first)
