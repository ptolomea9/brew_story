import Container from '@/components/ui/Container';
import ScrollReveal from '@/components/animation/ScrollReveal';
import Button from '@/components/ui/Button';

// Placeholder product data — will be replaced by Sanity queries
const products: Record<string, { name: string; price: number; description: string; category: string }> = {
  'house-blend': { name: 'House Blend', price: 1800, description: 'Our signature blend. Smooth, balanced, with notes of chocolate and toasted almond. Roasted in small batches in Huntington Beach.', category: 'coffee' },
  'single-origin-ethiopia': { name: 'Single Origin Ethiopia', price: 2200, description: 'Bright and fruity with blueberry and citrus notes. Washed process from Yirgacheffe.', category: 'coffee' },
  'seasonal-roast': { name: 'Seasonal Roast', price: 2000, description: 'A rotating selection that highlights the best of the current harvest. Ask your barista for this month\'s origin.', category: 'coffee' },
  'chapter-one-tee': { name: 'Chapter One Tee', price: 3500, description: 'Screen printed in-house on premium cotton. Our inaugural design marks the beginning of the Brew Story chapter.', category: 'merch' },
  'brew-story-script-tee': { name: 'Brew Story Script Tee', price: 3500, description: 'Soft hand-lettered script on a vintage-weight tee. Screen printed on-site.', category: 'merch' },
  'ceramic-mug': { name: 'Ceramic Mug', price: 2800, description: 'Handcrafted stoneware mug with the Brew Story botanical mark. 12oz.', category: 'merch' },
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export function generateStaticParams() {
  return Object.keys(products).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // For static generation we need sync access; use a workaround
  return {
    title: 'Product Detail',
    description: 'Shop Brew Story products.',
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products[slug];

  if (!product) {
    return (
      <section className="py-24">
        <Container className="text-center">
          <h1 className="font-serif text-4xl text-ink mb-4">Product Not Found</h1>
          <Button href="/shop">Back to Shop</Button>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <ScrollReveal direction="left">
            <div className="aspect-square bg-linen flex items-center justify-center text-olive/30 font-serif text-lg sticky top-24">
              {product.category}
            </div>
          </ScrollReveal>

          {/* Details */}
          <ScrollReveal direction="right">
            <div>
              <p className="text-xs tracking-widest uppercase text-olive mb-2">{product.category}</p>
              <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4">{product.name}</h1>
              <p className="text-2xl text-olive mb-8">{formatPrice(product.price)}</p>
              <p className="text-charcoal leading-relaxed mb-10">{product.description}</p>

              {/* Variant placeholder — will be VariantSelector */}
              {product.category === 'coffee' && (
                <div className="mb-8">
                  <p className="text-xs tracking-widest uppercase text-olive mb-3">Size</p>
                  <div className="flex gap-3">
                    {['12oz', '2lb', '5lb'].map((size) => (
                      <button
                        key={size}
                        className="px-5 py-2 border border-sage text-sm text-charcoal hover:border-olive hover:text-ink transition-colors"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.category === 'merch' && (
                <div className="mb-8">
                  <p className="text-xs tracking-widest uppercase text-olive mb-3">Size</p>
                  <div className="flex gap-3">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button
                        key={size}
                        className="px-5 py-2 border border-sage text-sm text-charcoal hover:border-olive hover:text-ink transition-colors"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button size="lg" className="w-full">Add to Cart</Button>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
