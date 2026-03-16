'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import { urlFor } from '@/lib/sanity';
import PageHero from '@/components/ui/PageHero';
import menuImages from '@/data/menu-images.json';

// Category slug -> display name
const categoryLabels: Record<string, string> = {
  'coffee-hot': 'Coffee (Hot)',
  'coffee-iced': 'Coffee (Iced)',
  'signature': 'Signature',
  'matcha': 'Matcha',
  'hojicha': 'Hojicha',
  'specialty-tea': 'Specialty Tea',
  'citrus-sparklers': 'Citrus Sparklers',
  'non-coffee': 'Non-Coffee',
  'pastries': 'Pastries',
  'sandwiches': 'Sandwiches',
};

const categoryOrder = Object.keys(categoryLabels);

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  dietary?: string[];
  featured?: boolean;
  image?: { asset: { _ref: string } };
}

// Build a lookup from item name slug -> local image path
const imageMap = new Map<string, string>();
for (const [slug, data] of Object.entries(menuImages)) {
  imageMap.set(slug, (data as { image: string }).image);
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getItemImage(item: MenuItem): string | null {
  // Sanity image first
  if (item.image?.asset) {
    return urlFor(item.image).width(400).height(400).url();
  }
  // Fall back to local generated images
  const slug = slugify(item.name);
  return imageMap.get(slug) || null;
}

export default function MenuContent({ items }: { items: MenuItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Get unique categories in order
  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return categoryOrder.filter((c) => cats.has(c));
  }, [items]);

  // Filter items (exclude merchandise — that's in Shop)
  const filtered = useMemo(() => {
    let result = items.filter((i) => i.category !== 'merchandise');
    if (activeCategory !== 'all') {
      result = result.filter((i) => i.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, activeCategory, search]);

  // Group filtered items by category
  const grouped = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const item of filtered) {
      const cat = item.category || 'signature';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    }
    return [...map.entries()].sort(
      (a, b) => categoryOrder.indexOf(a[0]) - categoryOrder.indexOf(b[0])
    );
  }, [filtered]);

  return (
    <>
      <PageHero title="Menu" />

      <section className="py-16 md:py-24">
        <Container>
          {/* Search + Filters */}
          <div className="max-w-4xl mx-auto mb-12 space-y-6">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-olive/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-linen border border-sage/30 text-charcoal placeholder:text-olive/40 focus:outline-none focus:border-olive/50 transition-colors"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 text-sm tracking-wide uppercase transition-all duration-200 ${
                  activeCategory === 'all'
                    ? 'bg-olive text-cream'
                    : 'bg-linen text-olive border border-sage/30 hover:bg-sage/20'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-sm tracking-wide uppercase transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-olive text-cream'
                      : 'bg-linen text-olive border border-sage/30 hover:bg-sage/20'
                  }`}
                >
                  {categoryLabels[cat] || cat}
                </button>
              ))}
            </div>

            {/* Result count */}
            <p className="text-sm text-olive/60">
              {filtered.length} item{filtered.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </p>
          </div>

          {/* Menu Items */}
          <div className="max-w-4xl mx-auto space-y-16">
            {grouped.length === 0 && (
              <p className="text-center text-olive py-12">No items found.</p>
            )}

            {grouped.map(([catSlug, catItems]) => (
              <div key={catSlug}>
                <h2 className="font-serif text-3xl text-ink mb-8 pb-3 border-b border-sage/40">
                  {categoryLabels[catSlug] || catSlug}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catItems.map((item) => {
                    const img = getItemImage(item);
                    return (
                      <div
                        key={item._id}
                        className="group bg-linen hover:bg-sage/10 transition-colors duration-300 overflow-hidden"
                      >
                        {/* Image */}
                        {img ? (
                          <div className="aspect-square relative overflow-hidden">
                            <Image
                              src={img}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        ) : (
                          <div className="aspect-square bg-sage/10 flex items-center justify-center">
                            <svg
                              className="w-12 h-12 text-sage/30"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1}
                            >
                              <path d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M9 6.75V15m6-6v8.25M7.5 21h9a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0016.5 3h-9A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21z" />
                            </svg>
                          </div>
                        )}

                        {/* Info */}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-serif text-lg text-ink leading-tight">
                              {item.name}
                            </h3>
                            <span className="text-olive text-sm font-medium whitespace-nowrap">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-olive/70 mb-2 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1.5">
                            {item.dietary?.map((tag) => (
                              <Badge key={tag} variant="accent">
                                {tag}
                              </Badge>
                            ))}
                            {item.featured && (
                              <Badge variant="accent">popular</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
