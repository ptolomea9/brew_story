'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Accurate Brew Story logo draw animation (ref: KOFI Inspo 6).
 * Logo structure: double circle badge → oval emblem with coffee plant
 * (two leaves + cherry cluster) → "brew story" text → "COFFEE ROASTERY" subtitle.
 * Shows on first visit only (sessionStorage flag).
 */

const drawTransition = (duration: number, delay: number) => ({
  duration,
  delay,
  ease: [0.65, 0, 0.35, 1] as const,
});

export default function LogoSplash() {
  const [show, setShow] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    if (typeof window !== 'undefined' && !sessionStorage.getItem('bs-splash-seen')) {
      setShow(true);
      sessionStorage.setItem('bs-splash-seen', '1');
      const timer = setTimeout(() => setShow(false), 4200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[100] bg-cream flex items-center justify-center"
        >
          <div className="relative w-64 h-72 md:w-80 md:h-96">
            <svg
              viewBox="0 0 300 360"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* ── Outer thick circle (light gray badge ring) ── */}
              <motion.circle
                cx="150"
                cy="150"
                r="140"
                stroke="#C8C8C0"
                strokeWidth="8"
                strokeDasharray="880"
                strokeDashoffset="880"
                animate={{ strokeDashoffset: 0 }}
                transition={drawTransition(2.2, 0)}
              />

              {/* ── Inner thin circle ── */}
              <motion.circle
                cx="150"
                cy="150"
                r="125"
                stroke="#C8C8C0"
                strokeWidth="1"
                strokeDasharray="785"
                strokeDashoffset="785"
                animate={{ strokeDashoffset: 0 }}
                transition={drawTransition(1.8, 0.4)}
              />

              {/* ── Oval emblem outline ── */}
              <motion.ellipse
                cx="150"
                cy="85"
                rx="28"
                ry="35"
                stroke="#6B6B5E"
                strokeWidth="1"
                strokeDasharray="200"
                strokeDashoffset="200"
                animate={{ strokeDashoffset: 0 }}
                transition={drawTransition(1.2, 0.8)}
              />

              {/* ── Coffee plant stem (center) ── */}
              <motion.path
                d="M150 60 L150 110"
                stroke="#6B6B5E"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="50"
                strokeDashoffset="50"
                animate={{ strokeDashoffset: 0 }}
                transition={drawTransition(0.8, 1.2)}
              />

              {/* ── Left leaf (pointed, with vein) ── */}
              <motion.path
                d="M150 75 C140 68, 125 65, 120 72 C118 78, 125 88, 145 95"
                stroke="#6B6B5E"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset="100"
                animate={{ strokeDashoffset: 0 }}
                transition={drawTransition(1, 1.4)}
              />
              {/* Left leaf vein */}
              <motion.path
                d="M148 78 C140 75, 130 72, 125 74"
                stroke="#6B6B5E"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeDasharray="30"
                strokeDashoffset="30"
                animate={{ strokeDashoffset: 0 }}
                transition={drawTransition(0.6, 1.7)}
              />

              {/* ── Right leaf (pointed, with vein) ── */}
              <motion.path
                d="M150 75 C160 68, 175 65, 180 72 C182 78, 175 88, 155 95"
                stroke="#6B6B5E"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset="100"
                animate={{ strokeDashoffset: 0 }}
                transition={drawTransition(1, 1.5)}
              />
              {/* Right leaf vein */}
              <motion.path
                d="M152 78 C160 75, 170 72, 175 74"
                stroke="#6B6B5E"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeDasharray="30"
                strokeDashoffset="30"
                animate={{ strokeDashoffset: 0 }}
                transition={drawTransition(0.6, 1.8)}
              />

              {/* ── Lower left leaf ── */}
              <motion.path
                d="M148 90 C138 95, 128 92, 126 86 C124 80, 132 78, 146 84"
                stroke="#6B6B5E"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeDasharray="80"
                strokeDashoffset="80"
                animate={{ strokeDashoffset: 0 }}
                transition={drawTransition(0.8, 1.6)}
              />

              {/* ── Lower right leaf ── */}
              <motion.path
                d="M152 90 C162 95, 172 92, 174 86 C176 80, 168 78, 154 84"
                stroke="#6B6B5E"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeDasharray="80"
                strokeDashoffset="80"
                animate={{ strokeDashoffset: 0 }}
                transition={drawTransition(0.8, 1.7)}
              />

              {/* ── Coffee cherry cluster (small circles) ── */}
              {[
                { cx: 147, cy: 82 },
                { cx: 153, cy: 82 },
                { cx: 150, cy: 78 },
                { cx: 145, cy: 86 },
                { cx: 155, cy: 86 },
                { cx: 150, cy: 90 },
              ].map((cherry, i) => (
                <motion.circle
                  key={i}
                  cx={cherry.cx}
                  cy={cherry.cy}
                  r="2.5"
                  stroke="#6B6B5E"
                  strokeWidth="0.8"
                  strokeDasharray="16"
                  strokeDashoffset="16"
                  animate={{ strokeDashoffset: 0 }}
                  transition={drawTransition(0.4, 1.9 + i * 0.08)}
                />
              ))}

              {/* ── "brew story" text ── */}
              <motion.text
                x="150"
                y="175"
                textAnchor="middle"
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontSize="38"
                fontWeight="400"
                fill="#6B6B5E"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4, duration: 0.8 }}
              >
                brew story
              </motion.text>

              {/* ── "COFFEE ROASTERY" subtitle ── */}
              <motion.text
                x="150"
                y="205"
                textAnchor="middle"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                fontSize="11"
                fontWeight="300"
                letterSpacing="4"
                fill="#6B6B5E"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8, duration: 0.8 }}
              >
                COFFEE
              </motion.text>
              <motion.text
                x="150"
                y="222"
                textAnchor="middle"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                fontSize="11"
                fontWeight="300"
                letterSpacing="4"
                fill="#6B6B5E"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.0, duration: 0.8 }}
              >
                ROASTERY
              </motion.text>
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
