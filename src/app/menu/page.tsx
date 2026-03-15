import Container from '@/components/ui/Container';
import ScrollReveal from '@/components/animation/ScrollReveal';
import Badge from '@/components/ui/Badge';

const menuCategories = [
  {
    name: 'Espresso',
    items: [
      { name: 'Espresso', price: '$3.50', tags: [] },
      { name: 'Americano', price: '$4.50', tags: [] },
      { name: 'Latte', price: '$5.50', tags: [] },
      { name: 'Cappuccino', price: '$5.50', tags: [] },
      { name: 'Mocha', price: '$6.00', tags: [] },
      { name: 'Cortado', price: '$4.50', tags: [] },
    ],
  },
  {
    name: 'Specialty',
    items: [
      { name: 'Matcha Latte', price: '$6.50', tags: ['popular'] },
      { name: 'Chai Latte', price: '$5.50', tags: [] },
      { name: 'Lavender Latte', price: '$6.50', tags: ['new'] },
      { name: 'Honey Oat Latte', price: '$6.50', tags: ['popular'] },
    ],
  },
  {
    name: 'Cold Drinks',
    items: [
      { name: 'Cold Brew', price: '$5.00', tags: [] },
      { name: 'Iced Latte', price: '$5.50', tags: [] },
      { name: 'Iced Matcha', price: '$6.50', tags: ['popular'] },
      { name: 'Lemonade', price: '$4.00', tags: [] },
    ],
  },
  {
    name: 'Pastries',
    items: [
      { name: 'Croissant', price: '$4.00', tags: [] },
      { name: 'Banana Bread', price: '$4.50', tags: ['vegan'] },
      { name: 'Blueberry Muffin', price: '$4.00', tags: [] },
      { name: 'Cookie', price: '$3.50', tags: [] },
    ],
  },
];

export const metadata = {
  title: 'Menu',
  description: 'Explore our craft coffee menu, specialty drinks, and fresh pastries at Brew Story.',
};

export default function MenuPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl md:text-7xl text-ink mb-4">Menu</h1>
            <p className="text-olive max-w-md mx-auto">
              Craft roasted daily. Made with care.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-16">
          {menuCategories.map((category, ci) => (
            <ScrollReveal key={category.name} delay={ci * 0.1}>
              <div>
                <h2 className="font-serif text-3xl text-ink mb-6 pb-3 border-b border-sage/40">
                  {category.name}
                </h2>
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-charcoal">{item.name}</span>
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="accent">{tag}</Badge>
                        ))}
                      </div>
                      <span className="text-olive text-sm">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
