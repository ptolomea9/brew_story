'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

/**
 * Hero experience:
 * 1. Video fills the entire hero section — no visible edges
 * 2. Video plays (5s): beans pouring → latte with Brew Story logo art
 * 3. Video ends, holds on last frame
 * 4. Video slides to the right half, text animates in from the left
 * 5. In final state, video bleeds off the right/top/bottom edges,
 *    with a soft gradient fade on the left edge where it meets text.
 */
interface HeroTimelineProps {
  videoSrc?: string;
  heroImage?: string;
  className?: string;
}

export default function HeroTimeline({ videoSrc, heroImage, className = '' }: HeroTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(!videoSrc);

  // Skip video if already seen this session
  useEffect(() => {
    if (sessionStorage.getItem('brew-story-hero-seen')) {
      setVideoEnded(true);
    }
  }, []);

  // Floating parallax elements (only after text is visible)
  useEffect(() => {
    if (!videoEnded) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ repeat: -1, yoyo: true })
        .to('.hero-float-1', { y: -20, x: 10, rotation: 2, duration: 4, ease: 'power2.inOut' }, 0)
        .to('.hero-float-2', { y: 15, x: -12, rotation: -1.5, duration: 5, ease: 'power2.inOut' }, 0);
    }, containerRef);
    return () => ctx.revert();
  }, [videoEnded]);

  const handleVideoEnd = useCallback(() => {
    setVideoEnded(true);
    window.dispatchEvent(new Event('heroVideoEnded'));
  }, []);

  const textVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  } as const;

  const staggerChildren = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  } as const;

  return (
    <div ref={containerRef} className={`relative ${videoEnded ? 'min-h-screen md:h-[90vh]' : 'h-screen'} overflow-hidden transition-all duration-1000 ${className}`}>

      {/* ── VIDEO LAYER ── */}
      {/* Mobile: flows in document after text. Desktop: absolute positioned, slides right */}
      <motion.div
        className={`bg-linen ${videoEnded ? 'md:absolute md:inset-0' : 'absolute inset-0'}`}
        initial={{ x: 0 }}
        animate={videoEnded ? { x: typeof window !== 'undefined' && window.innerWidth >= 768 ? '25%' : 0 } : { x: 0 }}
        transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Left edge fade — desktop only */}
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000 hidden md:block"
          style={{
            opacity: videoEnded ? 1 : 0,
            background: 'linear-gradient(to right, var(--linen) 0%, transparent 30%)',
          }}
        />

        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            className={`w-full object-contain ${videoEnded ? 'h-[50vh] md:h-full' : 'h-full'}`}
            autoPlay
            muted
            playsInline
            poster={heroImage}
            onEnded={handleVideoEnd}
          />
        ) : heroImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroImage}
            alt="Brew Story — craft roasted coffee"
            className={`w-full object-contain ${videoEnded ? 'h-[50vh] md:h-full' : 'h-full'}`}
          />
        ) : (
          <div className="w-full h-full bg-linen" />
        )}
      </motion.div>

      {/* ── TEXT LAYER ── */}
      {/* Mobile: stacked below video. Desktop: overlaid on left */}
      <motion.div
        initial="hidden"
        animate={videoEnded ? 'visible' : 'hidden'}
        variants={staggerChildren}
        className={`relative z-20 ${videoEnded ? 'py-12 md:py-0 md:h-full md:flex md:items-center' : 'h-full flex items-center'}`}
      >
        <div className="mx-auto max-w-7xl px-6 w-full">
          <div className="max-w-lg">
            {/* Floating decorative elements */}
            <div className="hero-float-1 absolute -top-8 -left-4 w-20 h-20 bg-sage/15 rounded-full hidden lg:block" />
            <div className="hero-float-2 absolute bottom-4 -right-8 w-14 h-14 bg-olive/10 rounded-full hidden lg:block" />

            <motion.h1
              variants={textVariants}
              className="font-serif text-5xl md:text-8xl lg:text-9xl text-ink leading-none tracking-tight mb-4 md:mb-6"
            >
              crafted
              <span className="block -mt-2 md:-mt-6 lg:-mt-8">with care</span>
            </motion.h1>

            <motion.p
              variants={textVariants}
              className="text-charcoal text-base md:text-xl leading-relaxed max-w-md mb-8 md:mb-10"
            >
              Roasted coffee in the heart of Huntington Beach.
              Every cup tells a story.
            </motion.p>

            <motion.div
              variants={textVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4"
            >
              <a href="/order" className="inline-flex items-center justify-center tracking-widest uppercase font-medium bg-olive text-cream hover:bg-charcoal px-6 py-3 md:px-8 md:py-4 text-sm md:text-base transition-all duration-200">
                Order Now
              </a>
              <a href="/shop" className="inline-flex items-center justify-center tracking-widest uppercase font-medium bg-linen text-charcoal border border-sage hover:bg-sage/40 px-6 py-3 md:px-8 md:py-4 text-sm md:text-base transition-all duration-200">
                Shop Coffee
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom scroll indicator */}
      {videoEnded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-5 h-8 border border-olive/30 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-olive/40 rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
