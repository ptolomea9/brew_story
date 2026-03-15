import Container from '@/components/ui/Container';
import ScrollReveal from '@/components/animation/ScrollReveal';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Order Online',
  description: 'Order pickup from Brew Story. Fresh roasted coffee and specialty drinks ready when you are.',
};

export default function OrderPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-serif text-5xl md:text-7xl text-ink mb-4">Order Online</h1>
            <p className="text-olive text-lg mb-12 leading-relaxed">
              Skip the line. Order ahead for pickup at our Huntington Beach location.
            </p>

            {/* Toast Integration Placeholder */}
            <div className="bg-linen p-12 mb-8">
              <p className="text-olive mb-6">
                Online ordering is powered by Toast. Click below to place your order.
              </p>
              <Button size="lg">
                Order on Toast
              </Button>
            </div>

            <p className="text-sm text-olive">
              Orders are typically ready in 10-15 minutes.
            </p>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
