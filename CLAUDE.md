# Brew Story

Coffee roastery website for a shop in Huntington Beach, CA.

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- GSAP 3 + ScrollTrigger (hero timelines, text reveals, parallax)
- Framer Motion 11 (scroll reveals, hover states, page transitions, layout animations)
- Lenis (smooth scroll)
- Sanity v3 (CMS, not yet initialized)
- Stripe (e-commerce checkout)
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

## Project Structure
```
src/
├── app/          8 pages + 1 API route
├── components/
│   ├── animation/  LogoSplash, HeroTimeline, TextReveal, ScrollReveal, ParallaxLayer, TiltedPhotoGrid
│   ├── layout/     Header, Footer, MobileMenu, PageTransition
│   ├── providers/  LenisProvider
│   ├── sanity/     SanityImage, PortableText
│   ├── shop/       ProductCard, ProductGrid, CartDrawer, VariantSelector, CheckoutButton
│   └── ui/         Button, Input, Badge, Container
├── hooks/        useCart (Zustand)
└── lib/          sanity, stripe, utils
```

## Key Patterns
- Stripe client is lazy-initialized (getStripe()) to avoid build-time errors without API key
- Animation components are all 'use client' — server components import them
- ScrollReveal uses Framer Motion whileInView; TextReveal/ParallaxLayer use GSAP ScrollTrigger
- Tailwind v4 uses CSS-first config in globals.css (@theme inline block)
