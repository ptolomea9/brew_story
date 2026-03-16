import Container from '@/components/ui/Container';
import ScrollReveal from '@/components/animation/ScrollReveal';
import TextReveal from '@/components/animation/TextReveal';
import TiltedPhotoGrid from '@/components/animation/TiltedPhotoGrid';
import ParallaxLayer from '@/components/animation/ParallaxLayer';
import PageHero from '@/components/ui/PageHero';

export const metadata = {
  title: 'About',
  description: 'The story behind Brew Story - a craft coffee roastery in Huntington Beach, CA.',
};

const communityPhotos = [
  { src: '/images/upscaled/still_001_0s_4x.jpg', alt: 'Brew Story tee in-store' },
  { src: '/images/upscaled/still_005_8s_4x.jpg', alt: 'Iced matcha in branded cup' },
  { src: '/images/upscaled/still_007_12s_4x.jpg', alt: 'Merch display and mirror' },
  { src: '/images/interior_aesthetic.jpg', alt: 'Minimalist interior at Brew Story' },
  { src: '/images/upscaled/still_009_16s_4x.jpg', alt: 'Chapter One tees on display' },
  { src: '/images/upscaled/still_008_14s_4x.jpg', alt: 'Make Today Look Good tee' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="Our Story" />

      <section className="py-16 md:py-24">
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-20">
              <p className="text-olive text-lg leading-relaxed">
                What started as a love for great coffee became a story worth telling.
              </p>
            </div>
          </ScrollReveal>

          {/* Origin — image + text */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <ScrollReveal direction="left">
              <div className="aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/interior_seating.jpg"
                  alt="Inside Brew Story — Huntington Beach"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div>
                <TextReveal
                  text="Born in Huntington Beach"
                  as="h2"
                  className="font-serif text-3xl md:text-4xl text-ink mb-6"
                />
                <p className="text-charcoal leading-relaxed mb-4">
                  Brew Story was born out of a simple belief: that every cup of coffee
                  should be an experience, not just a routine. We roast every batch
                  in-house, right here in Huntington Beach.
                </p>
                <p className="text-charcoal leading-relaxed">
                  From sourcing single-origin beans to screen printing our own merch
                  on-site, we put intention into everything we do. Because the best
                  stories are the ones you craft yourself.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Screen Printing — reversed layout */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <ScrollReveal direction="left" className="order-2 md:order-1">
              <div>
                <TextReveal
                  text="Original merch. Made with intention."
                  as="h2"
                  className="font-serif text-3xl md:text-4xl text-ink mb-6"
                />
                <p className="text-charcoal leading-relaxed mb-4">
                  Our first batch of merch was screen printed right here in the
                  shop during a community event. Every design is original,
                  every piece is part of the story.
                </p>
                <p className="text-charcoal leading-relaxed">
                  From tees to sweaters, our merch is designed to feel as
                  intentional as the coffee we serve.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" className="order-1 md:order-2">
              <div className="aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/upscaled/still_011_20s_4x.jpg"
                  alt="Screen printing at Brew Story"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-linen relative overflow-hidden">
        <ParallaxLayer speed={0.15} className="absolute -top-10 right-[10%] w-32 h-32 bg-sage/20 rounded-full" />
        <ParallaxLayer speed={0.3} className="absolute bottom-10 left-[5%] w-24 h-24 bg-olive/10 rounded-full" />

        <Container className="relative z-10">
          <ScrollReveal>
            <TextReveal
              text="What We Believe"
              as="h2"
              className="font-serif text-3xl md:text-5xl text-ink text-center mb-16"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              {
                title: 'Craft Over Convenience',
                desc: 'Every batch roasted by hand. Every drink poured with care. We don\'t take shortcuts because the details are the story.',
                image: '/images/generated/atmosphere_pourover.png',
              },
              {
                title: 'Community First',
                desc: 'Our shop is a gathering place. Come as a stranger, leave as a friend. The best chapters are written together.',
                image: '/images/upscaled/still_001_0s_4x.jpg',
              },
              {
                title: 'Made Here',
                desc: 'From beans to tees, everything is made in-house in Huntington Beach. We believe in owning the whole process.',
                image: '/images/upscaled/still_003_4s_4x.jpg',
              },
            ].map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.15}>
                <div className="text-center">
                  <div className="w-full aspect-[4/3] overflow-hidden mb-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value.image} alt={value.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-serif text-xl text-ink mb-3">{value.title}</h3>
                  <p className="text-sm text-olive leading-relaxed">{value.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Community Tilted Photo Grid */}
      <section className="py-16 md:py-24">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-12">
              <TextReveal
                text="Chapter One"
                as="h2"
                className="font-serif text-3xl md:text-5xl text-ink mb-4"
              />
              <p className="text-olive">One year in. Here&apos;s a look back.</p>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto">
            <TiltedPhotoGrid images={communityPhotos} />
          </div>
        </Container>
      </section>
    </>
  );
}
