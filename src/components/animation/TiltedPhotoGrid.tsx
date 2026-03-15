'use client';

import { motion } from 'framer-motion';

/**
 * Overlapping tilted photo grid (ref: Inspo 4).
 * Photos appear with staggered rotation and offset.
 */
interface TiltedPhotoGridProps {
  images: { src?: string; alt: string }[];
  className?: string;
}

const rotations = [-3, 2, -1.5, 3, -2, 1.5];
const offsets = [
  { x: 0, y: 0 },
  { x: 20, y: -10 },
  { x: -15, y: 15 },
  { x: 10, y: -20 },
  { x: -10, y: 5 },
  { x: 15, y: -5 },
];

export default function TiltedPhotoGrid({ images, className = '' }: TiltedPhotoGridProps) {
  return (
    <div className={`relative grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {images.map((image, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30, rotate: 0 }}
          whileInView={{
            opacity: 1,
            y: offsets[i % offsets.length].y,
            x: offsets[i % offsets.length].x,
            rotate: rotations[i % rotations.length],
          }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.7,
            delay: i * 0.12,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="overflow-hidden shadow-lg"
        >
          {image.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.src} alt={image.alt} className="w-full aspect-[4/5] object-cover" />
          ) : (
            <div className="w-full aspect-[4/5] bg-linen flex items-center justify-center text-olive/30 text-sm">
              {image.alt}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
