'use client';

import Image from 'next/image';
import { useState } from 'react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/animation/ScrollReveal';
import TextReveal from '@/components/animation/TextReveal';
import ParallaxLayer from '@/components/animation/ParallaxLayer';

const services = [
  {
    title: 'Mobile Coffee Bar',
    description:
      'Our custom Sprinter van brings the full Brew Story experience to your location. Espresso, matcha, specialty drinks, and fresh pastries served by our baristas.',
    image: '/images/catering/catering_mobile_bar.jpg',
  },
  {
    title: 'Corporate Events',
    description:
      'Elevate your team meetings, product launches, and all-hands. We set up, serve, and clean up so you can focus on what matters.',
    image: '/images/catering/catering_corporate.jpg',
  },
  {
    title: 'Private Events',
    description:
      'Weddings, birthdays, and celebrations. A premium coffee experience your guests will remember.',
    image: '/images/catering/catering_private.jpg',
  },
  {
    title: 'Pop-Up Collaborations',
    description:
      'Partner with us for farmers markets, brand activations, and co-branded experiences. We bring the bar, you bring the crowd.',
    image: '/images/catering/catering_popup.jpg',
  },
];

const steps = [
  { number: '01', title: 'Inquire', desc: 'Tell us about your event, date, and vision.' },
  { number: '02', title: 'Customize', desc: 'We build a menu tailored to your guests and occasion.' },
  { number: '03', title: 'We Show Up', desc: 'Our team arrives, sets up, serves, and cleans up.' },
];

const eventTypes = ['Corporate Event', 'Private Event', 'Pop-Up / Market', 'Wedding', 'Other'];
const guestRanges = ['Under 25', '25-50', '50-100', '100-200', '200+'];

export default function CateringPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: '',
    date: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to email service or Sanity
    setSubmitted(true);
  };

  return (
    <>
      {/* ── CINEMATIC HERO ── */}
      <section className="relative h-screen overflow-hidden -mt-16 md:-mt-20">
        <div className="absolute inset-0">
          <Image
            src="/images/catering/catering_hero.jpg"
            alt="Brew Story mobile coffee bar"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative z-10 h-full flex items-center">
          <Container>
            <ScrollReveal>
              <div className="max-w-2xl">
                <h1 className="font-serif text-6xl md:text-8xl leading-[0.85] tracking-tight mb-6" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                  We come
                  <span className="block">to you.</span>
                </h1>
                <p className="text-lg md:text-xl leading-relaxed max-w-lg mb-10" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  Mobile coffee bar for corporate events, private parties, and pop-ups.
                  The full Brew Story experience, wherever you need it.
                </p>
                <a
                  href="#inquiry"
                  className="inline-flex items-center justify-center tracking-widest uppercase font-medium bg-cream text-ink hover:bg-sage px-8 py-4 text-base transition-all duration-200"
                >
                  Get a Quote
                </a>
              </div>
            </ScrollReveal>
          </Container>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-5 h-8 border border-cream/40 rounded-full flex justify-center pt-1.5 animate-bounce">
            <div className="w-1 h-2 bg-cream/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-24 md:py-32">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-20">
              <TextReveal
                text="What we offer"
                as="h2"
                className="font-serif text-4xl md:text-5xl text-ink mb-4"
              />
              <p className="text-olive max-w-md mx-auto">
                From intimate gatherings to large-scale corporate events.
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-5xl mx-auto space-y-24">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                    i % 2 !== 0 ? 'md:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl md:text-4xl text-ink mb-4">
                      {service.title}
                    </h3>
                    <p className="text-olive text-lg leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 md:py-32 bg-linen relative overflow-hidden">
        <ParallaxLayer speed={0.15} className="absolute -top-10 right-[8%] w-36 h-36 bg-sage/20 rounded-full" />
        <ParallaxLayer speed={0.3} className="absolute bottom-16 left-[5%] w-24 h-24 bg-olive/10 rounded-full" />

        <Container className="relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <TextReveal
                text="How it works"
                as="h2"
                className="font-serif text-4xl md:text-5xl text-ink mb-4"
              />
              <p className="text-olive max-w-md mx-auto">
                Three steps to your perfect event.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.15}>
                <div className="text-center">
                  <span className="block font-serif text-6xl text-sage/50 mb-4">
                    {step.number}
                  </span>
                  <h3 className="font-serif text-2xl text-ink mb-3">{step.title}</h3>
                  <p className="text-olive leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-16 border-y border-sage/20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <ScrollReveal delay={0}>
              <div>
                <span className="block font-serif text-4xl text-ink mb-1">Full Service</span>
                <span className="text-sm tracking-widest uppercase text-olive">Setup to cleanup</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div>
                <span className="block font-serif text-4xl text-ink mb-1">Custom Menus</span>
                <span className="text-sm tracking-widest uppercase text-olive">Tailored to your event</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div>
                <span className="block font-serif text-4xl text-ink mb-1">SoCal Based</span>
                <span className="text-sm tracking-widest uppercase text-olive">Huntington Beach & beyond</span>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ── INQUIRY FORM ── */}
      <section id="inquiry" className="py-24 md:py-32">
        <Container>
          <div className="max-w-2xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <TextReveal
                  text="Let's plan something."
                  as="h2"
                  className="font-serif text-4xl md:text-5xl text-ink mb-4"
                />
                <p className="text-olive">
                  Tell us about your event and we'll get back to you within 24 hours.
                </p>
              </div>
            </ScrollReveal>

            {submitted ? (
              <ScrollReveal>
                <div className="text-center py-16 bg-linen">
                  <h3 className="font-serif text-3xl text-ink mb-4">Thank you!</h3>
                  <p className="text-olive">
                    We've received your inquiry and will be in touch within 24 hours.
                  </p>
                </div>
              </ScrollReveal>
            ) : (
              <ScrollReveal>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-olive mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-4 py-3 bg-transparent border border-sage text-charcoal placeholder:text-sage focus:border-olive focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-olive mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 bg-transparent border border-sage text-charcoal placeholder:text-sage focus:border-olive focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-olive mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="w-full px-4 py-3 bg-transparent border border-sage text-charcoal placeholder:text-sage focus:border-olive focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-olive mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 bg-transparent border border-sage text-charcoal focus:border-olive focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-olive mb-2">
                        Event Type
                      </label>
                      <select
                        required
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        className="w-full px-4 py-3 bg-transparent border border-sage text-charcoal focus:border-olive focus:outline-none transition-colors appearance-none"
                      >
                        <option value="">Select event type</option>
                        {eventTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-olive mb-2">
                        Estimated Guests
                      </label>
                      <select
                        value={formData.guestCount}
                        onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                        className="w-full px-4 py-3 bg-transparent border border-sage text-charcoal focus:border-olive focus:outline-none transition-colors appearance-none"
                      >
                        <option value="">Select guest count</option>
                        {guestRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest uppercase text-olive mb-2">
                      Tell Us About Your Event
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Location, theme, any special requests..."
                      className="w-full px-4 py-3 bg-transparent border border-sage text-charcoal placeholder:text-sage focus:border-olive focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Request a Quote
                  </Button>
                </form>
              </ScrollReveal>
            )}
          </div>
        </Container>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 bg-linen">
        <Container>
          <ScrollReveal>
            <div className="text-center">
              <p className="text-olive mb-6">
                Want to see what we serve?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/menu" variant="ghost">View Our Menu</Button>
                <Button href="/contact" variant="ghost">Contact Us</Button>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
