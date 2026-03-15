import Container from '@/components/ui/Container';
import ScrollReveal from '@/components/animation/ScrollReveal';
import ProductCard from '@/components/shop/ProductCard';

const placeholderProducts = [
  { id: '1', name: 'House Blend', slug: 'house-blend', price: 1800, category: 'coffee' },
  { id: '2', name: 'Single Origin Ethiopia', slug: 'single-origin-ethiopia', price: 2200, category: 'coffee' },
  { id: '3', name: 'Seasonal Roast', slug: 'seasonal-roast', price: 2000, category: 'coffee' },
  { id: '4', name: 'Chapter One Tee', slug: 'chapter-one-tee', price: 3500, category: 'merch' },
  { id: '5', name: 'Brew Story Script Tee', slug: 'brew-story-script-tee', price: 3500, category: 'merch' },
  { id: '6', name: 'Ceramic Mug', slug: 'ceramic-mug', price: 2800, category: 'merch' },
];

export const metadata = {
  title: 'Shop',
  description: 'Shop fresh roasted coffee beans and original Brew Story merchandise.',
};

export default function ShopPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl md:text-7xl text-ink mb-4">Shop</h1>
            <p className="text-olive max-w-md mx-auto">
              Fresh roasted beans and original merch, made in Huntington Beach.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {placeholderProducts.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.1}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
