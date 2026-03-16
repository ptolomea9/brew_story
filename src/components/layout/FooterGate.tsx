'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

/**
 * On the homepage, hides the footer until the hero video finishes.
 * On all other pages, shows immediately.
 */
export default function FooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [visible, setVisible] = useState(!isHome);

  useEffect(() => {
    if (!isHome) return;
    if (sessionStorage.getItem('brew-story-hero-seen')) {
      setVisible(true);
      return;
    }
    const handler = () => setVisible(true);
    window.addEventListener('heroVideoEnded', handler);
    return () => window.removeEventListener('heroVideoEnded', handler);
  }, [isHome]);

  if (visible) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
