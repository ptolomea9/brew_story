import Container from '@/components/ui/Container';
import ScrollReveal from '@/components/animation/ScrollReveal';
import Button from '@/components/ui/Button';
import PageHero from '@/components/ui/PageHero';

export const metadata = {
  title: 'Order Online',
  description: 'Order pickup from Brew Story. Fresh roasted coffee and specialty drinks ready when you are.',
};

export default function OrderPage() {
  return (
    <>
      <PageHero title="Order Online" />

      <section className="py-16 md:py-24">
        <Container>
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-olive text-lg mb-12 leading-relaxed">
                Skip the line. Order ahead for pickup at our Huntington Beach location.
              </p>

              {/* Toast Integration Placeholder */}
              <div className="bg-linen p-12 mb-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/generated/menu_iced_matcha.png"
                    alt="Iced matcha latte"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-olive mb-6">
                  Online ordering is powered by Toast. Click below to place your order.
                </p>
                <Button
                  href="https://order.toasttab.com/online/brew-story-16889-beach-blvd"
                  size="lg"
                >
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
    </>
  );
}
