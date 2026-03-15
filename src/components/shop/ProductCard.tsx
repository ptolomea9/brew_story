'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  image?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.slug}`}>
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(42,42,34,0.08)' }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="group bg-linen overflow-hidden"
      >
        <div className="aspect-square bg-sage/20 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-olive/30 font-serif text-lg">
            {product.category}
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-serif text-xl text-ink group-hover:text-olive transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-olive mt-1">{formatPrice(product.price)}</p>
        </div>
      </motion.div>
    </Link>
  );
}
