'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

/**
 * Split hero layout:
 * LEFT — "brew story" kinetic typography with logo animation
 * RIGHT — Looping hero video (bean cascade → premium latte, Inspo 3 aesthetic)
 *
 * The video source will be swapped once generated via kie.ai + Cling.
 * Currently shows a placeholder gradient with floating elements.
 */
interface HeroTimelineProps {
  videoSrc?: string;
  heroImage?: string;
  className?: string;
}

export default function HeroTimeline({ videoSrc, heroImage, className = '' }: HeroTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating parallax elements
      gsap.timeline({ repeat: -1, yoyo: true })
        .to('.hero-float-1', { y: -20, x: 10, rotation: 2, duration: 4, ease: 'power2.inOut' }, 0)
        .to('.hero-float-2', { y: 15, x: -12, rotation: -1.5, duration: 5, ease: 'power2.inOut' }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Auto-play video when it loads
  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoSrc]);

  return (
    <div ref={containerRef} className={`relative min-h-[90vh] flex items-center overflow-hidden ${className}`}>
      <div className="mx-auto max-w-7xl px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

        {/* ── LEFT: Brand + Typography ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 text-center lg:text-left py-12 lg:py-0"
        >
          {/* Floating decorative elements */}
          <div className="hero-float-1 absolute -top-8 -left-4 w-20 h-20 bg-sage/15 rounded-full hidden lg:block" />
          <div className="hero-float-2 absolute bottom-4 -right-8 w-14 h-14 bg-olive/10 rounded-full hidden lg:block" />

          <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl text-ink leading-[0.85] tracking-tight mb-6">
            brew
            <br />
            story
          </h1>

          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-olive mb-8">
            Coffee Roastery &middot; Huntington Beach
          </p>

          <p className="text-charcoal text-lg md:text-xl leading-relaxed max-w-md mx-auto lg:mx-0 mb-10">
            Craft roasted coffee in the heart of Huntington Beach.
            Every cup tells a story.
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
            <a href="/order" className="inline-flex items-center justify-center tracking-widest uppercase font-medium bg-olive text-cream hover:bg-charcoal px-8 py-4 text-base transition-all duration-200">
              Order Now
            </a>
            <a href="/shop" className="inline-flex items-center justify-center tracking-widest uppercase font-medium bg-linen text-charcoal border border-sage hover:bg-sage/40 px-8 py-4 text-base transition-all duration-200">
              Shop Coffee
            </a>
          </div>
        </motion.div>

        {/* ── RIGHT: Hero Visual (Video or Placeholder) ── */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10"
        >
          <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-sm">
            {videoSrc ? (
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : heroImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={heroImage}
                alt="Brew Story — craft roasted coffee"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-linen via-sage/20 to-linen relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-sage/20 flex items-center justify-center">
                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-olive/10 flex items-center justify-center">
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-sage/15" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subtle overlay gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-cream/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
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
