'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Word-by-word text reveal (ref: brew Inspo 7).
 * Uses GSAP to stagger words into view with opacity + y offset.
 * SplitText would be ideal but requires GSAP Club; this is a manual split approach.
 */
interface TextRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  stagger?: number;
  duration?: number;
}

export default function TextReveal({
  text,
  as: Tag = 'h2',
  className = '',
  stagger = 0.12,
  duration = 0.6,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = containerRef.current?.querySelectorAll('.word');
      if (!words) return;

      gsap.set(words, { opacity: 0, y: 20 });

      gsap.to(words, {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [text, stagger, duration]);

  const words = text.split(' ');

  return (
    <div ref={containerRef}>
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={i} className="word inline-block mr-[0.3em]">
            {word}
          </span>
        ))}
      </Tag>
    </div>
  );
}
