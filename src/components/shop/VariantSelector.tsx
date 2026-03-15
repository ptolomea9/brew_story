'use client';

import { motion } from 'framer-motion';

/**
 * Pill-style variant selector (ref: Sippin Inspo 8).
 * Uses Framer Motion layoutId for the active indicator.
 */
interface VariantSelectorProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  layoutId?: string;
}

export default function VariantSelector({
  label,
  options,
  selected,
  onSelect,
  layoutId = 'variant-pill',
}: VariantSelectorProps) {
  return (
    <div className="mb-6">
      <p className="text-xs tracking-widest uppercase text-olive mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className="relative px-5 py-2 text-sm transition-colors"
          >
            {selected === option && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-olive"
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
            <span
              className={`relative z-10 ${
                selected === option ? 'text-cream' : 'text-charcoal'
              }`}
            >
              {option}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
