'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '/menu', label: 'Menu' },
  { href: '/shop', label: 'Shop' },
  { href: '/order', label: 'Order' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm md:hidden"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="absolute right-0 top-0 bottom-0 w-80 bg-cream shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6">
          <button
            onClick={onClose}
            className="p-2 text-charcoal hover:text-olive transition-colors"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="px-8">
          <ul className="space-y-6">
            {navLinks.map((link, i) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block text-2xl font-serif text-ink hover:text-olive transition-colors"
                >
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Bottom Info */}
        <div className="absolute bottom-8 left-8 right-8">
          <p className="text-sm text-olive">Huntington Beach, CA</p>
          <p className="text-sm text-olive mt-1">Coffee Roastery</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
