import Image from 'next/image';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/animation/ScrollReveal';
import HeroTimeline from '@/components/animation/HeroTimeline';
import TextReveal from '@/components/animation/TextReveal';
import ParallaxLayer from '@/components/animation/ParallaxLayer';

const featuredProducts = [
  { name: 'Single Origin', price: '$22.00', image: '/images/generated/atmosphere_pourover.png' },
  { name: 'House Blend', price: '$18.00', image: '/images/generated/product_coffee_bags.png' },
  { name: 'Seasonal Roast', price: '$20.00', image: '/images/generated/hero_beans_pour.png' },
];

export default function Home() {
  return (
    <>
      {/* Hero Section — Split layout: text left, hero image right */}
      <section className="bg-linen -mt-16 md:-mt-20">
        <HeroTimeline heroImage="/images/generated/hero_latte.png" />
      </section>

      {/* Featured Section */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="text-center mb-16">
            <TextReveal
              text="Fresh Roasted"
              as="h2"
              className="font-serif text-4xl md:text-5xl text-ink mb-4"
            />
            <ScrollReveal delay={0.3}>
              <p className="text-olive max-w-md mx-auto">
                Small batch roasted for peak flavor. From our roastery to your cup.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, i) => (
              <ScrollReveal key={product.name} delay={i * 0.15}>
                <div className="group bg-linen text-center hover:bg-sage/20 transition-colors duration-300 overflow-hidden">
                  <div className="w-full aspect-square relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl text-ink mb-2">{product.name}</h3>
                    <p className="text-sm text-olive mb-4">From {product.price}</p>
                    <Button href="/shop" variant="ghost" size="sm">View Details</Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Story Teaser with Parallax */}
      <section className="py-24 md:py-32 bg-linen relative overflow-hidden">
        <ParallaxLayer speed={0.2} className="absolute top-10 right-[5%] w-40 h-40 bg-sage/15 rounded-full" />
        <ParallaxLayer speed={0.4} className="absolute bottom-20 left-[8%] w-28 h-28 bg-olive/8 rounded-full" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <TextReveal
              text="Every bean has a story. This is ours."
              as="h2"
              className="font-serif text-4xl md:text-6xl text-ink mb-8 leading-tight"
            />
            <ScrollReveal delay={0.4}>
              <p className="text-olive text-lg mb-8 leading-relaxed">
                Born in Huntington Beach, Brew Story is more than a coffee shop.
                We roast every batch in-house, print our merch on-site, and pour
                every drink with intention.
              </p>
              <Button href="/about" variant="ghost" size="lg">Read Our Story</Button>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <Container>
          <ScrollReveal>
            <div className="text-center">
              <p className="text-xs tracking-widest uppercase text-olive mb-4">
                Huntington Beach, CA
              </p>
              <TextReveal
                text="Come write a chapter with us."
                as="h2"
                className="font-serif text-4xl md:text-5xl text-ink mb-8"
              />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/contact" size="lg">Visit Us</Button>
                <Button href="/order" variant="secondary" size="lg">Order Pickup</Button>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
