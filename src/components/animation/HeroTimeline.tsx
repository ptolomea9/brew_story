'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

/**
 * Hero experience:
 * 1. Page loads in settled layout (text left, video right)
 * 2. Text animates in (fade + slide), video slides into position
 * 3. Video autoplays in its right-side position
 * 4. Return visits: everything shows instantly, no animation
 */
interface HeroTimelineProps {
  videoSrc?: string;
  heroImage?: string;
  className?: string;
}

export default function HeroTimeline({ videoSrc, heroImage, className = '' }: HeroTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [animationReady, setAnimationReady] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  // On mount: trigger entrance animations (or skip on return visits)
  useEffect(() => {
    const seen = sessionStorage.getItem('brew-story-hero-seen');
    if (seen) {
      setSkipAnimation(true);
      setAnimationReady(true);
    } else {
      sessionStorage.setItem('brew-story-hero-seen', '1');
      // Small delay so layout paints first, then animate in
      requestAnimationFrame(() => setAnimationReady(true));
    }
    window.dispatchEvent(new Event('heroVideoEnded'));
  }, []);

  // Floating parallax elements
  useEffect(() => {
    if (!animationReady) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ repeat: -1, yoyo: true })
        .to('.hero-float-1', { y: -20, x: 10, rotation: 2, duration: 4, ease: 'power2.inOut' }, 0)
        .to('.hero-float-2', { y: 15, x: -12, rotation: -1.5, duration: 5, ease: 'power2.inOut' }, 0);
    }, containerRef);
    return () => ctx.revert();
  }, [animationReady]);

  const handleVideoEnd = useCallback(() => {
    sessionStorage.setItem('brew-story-hero-seen', '1');
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

  // Desktop slide target
  const slideX = typeof window !== 'undefined' && window.innerWidth >= 768 ? '25%' : 0;

  return (
    <div ref={containerRef} className={`relative bg-[#EEF0E4] min-h-screen md:h-[90vh] overflow-hidden ${className}`}>

      {/* ── VIDEO LAYER ── */}
      <motion.div
        className="bg-[#EEF0E4] md:absolute md:inset-0"
        initial={skipAnimation ? { x: slideX } : { x: 0 }}
        animate={animationReady ? { x: slideX } : { x: 0 }}
        transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Left edge fade — desktop only */}
        <div
          className="absolute inset-0 z-10 pointer-events-none hidden md:block"
          style={{
            opacity: animationReady ? 1 : 0,
            transition: 'opacity 1s',
            background: 'linear-gradient(to right, #EEF0E4 0%, #EEF0E4 10%, transparent 50%)',
          }}
        />

        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-contain"
            style={{ objectPosition: 'center 60%' }}
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
            className="w-full h-full object-contain"
            style={{ objectPosition: 'center 60%' }}
          />
        ) : (
          <div className="w-full h-full bg-linen" />
        )}
      </motion.div>

      {/* ── TEXT LAYER ── */}
      <motion.div
        initial={skipAnimation ? 'visible' : 'hidden'}
        animate={animationReady ? 'visible' : 'hidden'}
        variants={staggerChildren}
        className="relative z-20 py-12 md:py-0 md:h-full md:flex md:items-center"
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={animationReady ? { opacity: 1 } : { opacity: 0 }}
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
    </div>
  );
}
