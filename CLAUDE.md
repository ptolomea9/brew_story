# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
Coffee roastery website for Brew Story in Huntington Beach, CA. 16889 Beach Blvd.

## Deploy
- **Live**: https://brew-story.vercel.app
- **Studio**: https://brew-story.vercel.app/studio (Sanity CMS)
- **Repo**: ptolomea9/brew_story (GitHub)
- **Deploy**: `npx vercel --prod --yes` (also auto-deploys on push to main)
- **Vercel env vars**: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- GSAP 3 + ScrollTrigger (hero timelines, text reveals, parallax)
- Framer Motion 11 (scroll reveals, hover states, page transitions, layout animations)
- Lenis (smooth scroll)
- Sanity v5 (CMS — project `5d3kzu53`, dataset `production`)
- Stripe (e-commerce checkout, lazy-init)
- Toast POS (ordering — links to `order.toasttab.com/online/brew-story-16889-beach-blvd`)
- Zustand (cart state)

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `KIE_AI_API_KEY=xxx python scripts/image_pipeline.py generate` — AI image generation
- `KIE_AI_API_KEY=xxx python scripts/generate_marble_images.py` — regenerate menu photos
- `node scripts/seed-sanity.mjs` — seed Sanity (needs `SANITY_TOKEN` env var)

## Design System
- Colors: cream `#FEFDFB`, linen `#F5F3EE`, sage `#D4DDD5`, olive `#6B6B5E`, charcoal `#4A4A3C`, ink `#2A2A22`
- Headlines: Cormorant Garamond serif
- Body: System sans-serif stack
- Aesthetic: "West Elm meets Apple" — minimal, premium
- Store surface: gray marble cement counter with white veining (menu photos use this background)

## Architecture

### Sanity CMS
- Schemas: `sanity/schemas/` — menuItem, siteSettings, product, teamMember, page, blockContent
- Client: `src/lib/sanity.ts` — lazy-initialized to avoid build errors when project ID is missing. Throws inside `fetch()`, not at import time.
- Menu page fetches from Sanity with JSON fallback (`src/data/menu.json`) if Sanity is unreachable.
- Studio route: `src/app/studio/[[...tool]]/` — uses a `<div>` wrapper, NOT its own `<html>`/`<body>` (causes hydration errors).

### Hero Video UX
- `HeroTimeline` plays a Kling AI animation (beans → latte art) on first visit.
- After video ends, dispatches `window.dispatchEvent(new Event('heroVideoEnded'))`.
- `HeroGate` wraps homepage content below hero — hidden until event fires.
- `FooterGate` and `Header` also listen for this event.
- `sessionStorage('brew-story-hero-seen')` tracks whether video was seen. On return visits within the session, everything shows immediately (no animation).
- **CRITICAL**: Never access `sessionStorage` during render (causes hydration mismatch). Always use `useEffect`.

### Menu Page
- Server component (`src/app/menu/page.tsx`) fetches from Sanity, passes to client component `MenuContent`.
- `MenuContent` handles category filters, search, and photo display.
- Photos come from `public/images/menu/` with slug-based lookup via `src/data/menu-images.json`.
- Merchandise category is excluded from menu (it's in Shop).

### Subpage Hero Banners
- `PageHero` component (`src/components/ui/PageHero.tsx`) — consistent across all subpages.
- Uses `logo_latte_v2_4x.png` with `bg-cream/60` wash overlay and olive text.

## Key Patterns
- Stripe client is lazy-initialized (`getStripe()`) to avoid build-time errors without API key
- Sanity client is lazy-initialized (same reason) — wraps `createClient` in a getter
- Animation components are all `'use client'` — server components import them
- ScrollReveal uses Framer Motion `whileInView`; TextReveal/ParallaxLayer use GSAP ScrollTrigger
- Tailwind v4 uses CSS-first config in `globals.css` (`@theme` inline block)
- Custom colors (cream, linen, sage, olive, etc.) are CSS variables in globals.css, referenced as Tailwind classes

## Image Pipeline (kie.ai)
- API key: `KIE_AI_API_KEY` env var (in `.env.local`, never hardcoded)
- Generation model: `nano-banana-pro` (no vendor prefix)
- `nano-banana-edit` is DEPRECATED — do not use. Generate fresh instead.
- Upscale model: `recraft/crisp-upscale` (uses `image` param, not `image_urls`)
- Poll: GET `/recordInfo?taskId=xxx` — check `data.state` (not `status`) for "success"/"failed"
- Result URLs: `data.resultJson.resultUrls[]` (resultJson may be a string, parse it)
- Images must be at public URLs for upscaling (push to GitHub first)
- Menu photos: gray marble cement counter background, 1:1 square, editorial food photography style
- **DO NOT use warm linen backgrounds** for menu photos — the store has gray marble surfaces

## Social
- Instagram: `@brewstory_` — https://www.instagram.com/brewstory_/
- TikTok: `@brewstory_` — https://www.tiktok.com/@brewstory_

## Hours
- Monday - Friday: 8am - 7pm
- Saturday - Sunday: 8am - 4pm

## Future Work
- Toast API integration (needs owner admin credentials) — replace Sanity as menu source of truth
- Merge Menu + Order into single experience
- Connect Sanity site settings to header/footer (currently hardcoded)
- Sanity image uploads for menu items (currently using local files)
