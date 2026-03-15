'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Kinetic typography hero (ref: ROASTED Inspo 2).
 * Large "brew story" text with floating coffee imagery overlaying at different z-layers.
 * The floating objects will be real photos once available; placeholder shapes for now.
 */
interface HeroTimelineProps {
  className?: string;
}

export default function HeroTimeline({ className = '' }: HeroTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });

      // Animate floating elements with slow parallax drift
      tl.to('.hero-float-1', {
        y: -30,
        x: 15,
        rotation: 3,
        duration: 4,
        ease: 'power2.inOut',
      }, 0);

      tl.to('.hero-float-2', {
        y: 20,
        x: -20,
        rotation: -2,
        duration: 5,
        ease: 'power2.inOut',
      }, 0);

      tl.to('.hero-float-3', {
        y: -15,
        x: -10,
        rotation: 4,
        duration: 3.5,
        ease: 'power2.inOut',
      }, 0.5);

      tlRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background floating objects (behind text) */}
      <div className="hero-float-1 absolute top-[15%] left-[10%] w-32 h-32 md:w-48 md:h-48 bg-sage/20 rounded-full z-0" />
      <div className="hero-float-2 absolute bottom-[20%] right-[12%] w-24 h-24 md:w-36 md:h-36 bg-olive/10 rounded-full z-0" />

      {/* Main typography */}
      <div className="relative z-10 text-center px-6">
        <h1 className="font-serif text-7xl md:text-[10rem] lg:text-[12rem] text-ink leading-[0.85] tracking-tight select-none">
          brew
          <br />
          story
        </h1>
      </div>

      {/* Foreground floating objects (in front of text) */}
      <div className="hero-float-3 absolute top-[35%] right-[20%] w-20 h-20 md:w-28 md:h-28 bg-sage/30 rounded-full z-20 pointer-events-none" />

      {/* Subtitle below */}
      <div className="absolute bottom-12 md:bottom-16 text-center z-10">
        <p className="text-sm md:text-base tracking-[0.3em] uppercase text-olive">
          Coffee Roastery &middot; Huntington Beach
        </p>
      </div>
    </div>
  );
}
