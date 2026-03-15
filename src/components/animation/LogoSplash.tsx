'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SVG logo draw animation inspired by KOFI (Inspo 6).
 * Shows on first visit only (sessionStorage flag).
 * The botanical circle + text paths will be replaced with the actual
 * Brew Story logo SVG once traced from the PNG.
 */
export default function LogoSplash() {
  const [show, setShow] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    if (typeof window !== 'undefined' && !sessionStorage.getItem('bs-splash-seen')) {
      setShow(true);
      sessionStorage.setItem('bs-splash-seen', '1');
      const timer = setTimeout(() => setShow(false), 3200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[100] bg-cream flex items-center justify-center"
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64">
            {/* Placeholder botanical circle — replace with traced SVG */}
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer circle */}
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                stroke="#6B6B5E"
                strokeWidth="1.5"
                strokeDasharray="565"
                strokeDashoffset="565"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }}
              />

              {/* Inner decorative circle */}
              <motion.circle
                cx="100"
                cy="100"
                r="75"
                stroke="#D4DDD5"
                strokeWidth="0.5"
                strokeDasharray="471"
                strokeDashoffset="471"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.8, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
              />

              {/* Leaf / botanical element placeholder */}
              <motion.path
                d="M100 40 C85 65, 80 90, 100 120 C120 90, 115 65, 100 40Z"
                stroke="#6B6B5E"
                strokeWidth="1"
                strokeDasharray="200"
                strokeDashoffset="200"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, delay: 0.6, ease: [0.65, 0, 0.35, 1] }}
              />

              {/* Small leaf detail */}
              <motion.path
                d="M88 75 C78 60, 70 70, 80 85"
                stroke="#6B6B5E"
                strokeWidth="0.8"
                strokeDasharray="60"
                strokeDashoffset="60"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, delay: 1.2, ease: [0.65, 0, 0.35, 1] }}
              />

              <motion.path
                d="M112 75 C122 60, 130 70, 120 85"
                stroke="#6B6B5E"
                strokeWidth="0.8"
                strokeDasharray="60"
                strokeDashoffset="60"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, delay: 1.3, ease: [0.65, 0, 0.35, 1] }}
              />
            </svg>

            {/* Brand text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-end pb-8"
            >
              <span className="font-serif text-xl md:text-2xl text-ink tracking-wider">
                brew story
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
