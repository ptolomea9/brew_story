import Container from '@/components/ui/Container';
import ScrollReveal from '@/components/animation/ScrollReveal';
import ShopContent from '@/components/shop/ShopContent';

const coffeeProducts = [
  { id: '1', name: 'House Blend', slug: 'house-blend', price: 1800, category: 'coffee', image: '/images/generated/product_coffee_bags.png' },
  { id: '2', name: 'Single Origin Ethiopia', slug: 'single-origin-ethiopia', price: 2200, category: 'coffee', image: '/images/generated/hero_beans_pour.png' },
  { id: '3', name: 'Seasonal Roast', slug: 'seasonal-roast', price: 2000, category: 'coffee', image: '/images/generated/atmosphere_pourover.png' },
];

const merchProducts = [
  { id: '4', name: 'Chapter One Tee', slug: 'chapter-one-tee', price: 3500, category: 'merch', image: '/images/stills/still_001_0s.jpg' },
  { id: '5', name: 'Brew Story Script Tee', slug: 'brew-story-script-tee', price: 3500, category: 'merch', image: '/images/stills/still_009_16s.jpg' },
  { id: '6', name: 'Ceramic Mug', slug: 'ceramic-mug', price: 2800, category: 'merch', image: '/images/generated/product_merch_flatlay.png' },
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

        <ShopContent coffeeProducts={coffeeProducts} merchProducts={merchProducts} />
      </Container>
    </section>
  );
}
