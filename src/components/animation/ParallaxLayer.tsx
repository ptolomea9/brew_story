'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollTrigger parallax wrapper with configurable speed.
 * speed > 0 = moves slower than scroll (background feel)
 * speed < 0 = moves faster than scroll (foreground feel)
 */
interface ParallaxLayerProps {
  children?: React.ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxLayer({
  children,
  speed = 0.3,
  className = '',
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: () => speed * -100,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
