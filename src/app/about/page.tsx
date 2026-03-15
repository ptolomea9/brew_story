import Container from '@/components/ui/Container';
import ScrollReveal from '@/components/animation/ScrollReveal';

export const metadata = {
  title: 'About',
  description: 'The story behind Brew Story - a craft coffee roastery in Huntington Beach, CA.',
};

export default function AboutPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h1 className="font-serif text-5xl md:text-7xl text-ink mb-6">Our Story</h1>
            <p className="text-olive text-lg leading-relaxed">
              What started as a love for great coffee became a story worth telling.
            </p>
          </div>
        </ScrollReveal>

        {/* Origin */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <ScrollReveal direction="left">
            <div className="aspect-[4/5] bg-linen" />
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">
                Born in Huntington Beach
              </h2>
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

        {/* Values */}
        <ScrollReveal>
          <div className="bg-linen py-16 px-8 md:px-16 mb-24">
            <h2 className="font-serif text-3xl md:text-4xl text-ink text-center mb-12">
              What We Believe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { title: 'Craft Over Convenience', desc: 'Every batch roasted by hand. Every drink poured with care.' },
                { title: 'Community First', desc: 'Our shop is a gathering place. Come as a stranger, leave as a friend.' },
                { title: 'Made Here', desc: 'From beans to tees, everything is made in-house in Huntington Beach.' },
              ].map((value) => (
                <div key={value.title} className="text-center">
                  <h3 className="font-serif text-xl text-ink mb-3">{value.title}</h3>
                  <p className="text-sm text-olive leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Team Placeholder */}
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">The Team</h2>
            <p className="text-olive mb-12">The people behind the pour.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {['Founder', 'Head Roaster', 'Lead Barista', 'Creative'].map((role) => (
                <div key={role}>
                  <div className="aspect-square bg-linen mb-3" />
                  <p className="text-sm text-olive">{role}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
