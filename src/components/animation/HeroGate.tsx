'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SEEN_KEY = 'brew-story-hero-seen';

/**
 * Wraps content that should only appear after the hero video finishes.
 * Once the video has been seen in this session, content shows immediately.
 */
export default function HeroGate({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [alreadySeen, setAlreadySeen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      setAlreadySeen(true);
      setVisible(true);
      return;
    }
    const handler = () => {
      sessionStorage.setItem(SEEN_KEY, '1');
      setVisible(true);
    };
    window.addEventListener('heroVideoEnded', handler);
    return () => window.removeEventListener('heroVideoEnded', handler);
  }, []);

  if (alreadySeen) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
