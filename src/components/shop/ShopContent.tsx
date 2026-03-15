'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animation/ScrollReveal';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  image?: string;
}

interface ShopContentProps {
  coffeeProducts: Product[];
  merchProducts: Product[];
}

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'coffee', label: 'Coffee' },
  { key: 'merch', label: 'Merchandise' },
] as const;

type TabKey = (typeof tabs)[number]['key'];

export default function ShopContent({ coffeeProducts, merchProducts }: ShopContentProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const allProducts = [...coffeeProducts, ...merchProducts];
  const filtered = activeTab === 'all'
    ? allProducts
    : activeTab === 'coffee'
      ? coffeeProducts
      : merchProducts;

  return (
    <>
      {/* Category Tabs */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex gap-1 p-1 bg-linen">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative px-6 py-2.5 text-sm tracking-widest uppercase transition-colors"
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="shop-tab"
                  className="absolute inset-0 bg-olive"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <span className={`relative z-10 ${activeTab === tab.key ? 'text-cream' : 'text-charcoal'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Headers for subdivisions */}
      {activeTab === 'all' && (
        <>
          <ScrollReveal>
            <h2 className="font-serif text-3xl text-ink mb-6 pb-3 border-b border-sage/30">
              Coffee
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {coffeeProducts.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <h2 className="font-serif text-3xl text-ink mb-6 pb-3 border-b border-sage/30">
              Merchandise
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {merchProducts.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </>
      )}

      {/* Filtered view (single category) */}
      {activeTab !== 'all' && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtered.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.1}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </motion.div>
      )}
    </>
  );
}
