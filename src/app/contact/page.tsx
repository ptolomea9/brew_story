import Container from '@/components/ui/Container';
import ScrollReveal from '@/components/animation/ScrollReveal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export const metadata = {
  title: 'Contact',
  description: 'Visit Brew Story in Huntington Beach, CA. Find our hours, location, and get in touch.',
};

export default function ContactPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl md:text-7xl text-ink mb-4">Visit Us</h1>
            <p className="text-olive max-w-md mx-auto">
              Come write a chapter with us in Huntington Beach.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Info */}
          <ScrollReveal direction="left">
            <div className="space-y-10">
              <div>
                <h2 className="text-xs tracking-widest uppercase text-olive mb-3">Location</h2>
                <p className="text-charcoal">Huntington Beach, CA</p>
              </div>

              <div>
                <h2 className="text-xs tracking-widest uppercase text-olive mb-3">Hours</h2>
                <div className="space-y-1 text-charcoal">
                  <p>Monday - Friday: 7am - 5pm</p>
                  <p>Saturday - Sunday: 8am - 5pm</p>
                </div>
              </div>

              <div>
                <h2 className="text-xs tracking-widest uppercase text-olive mb-3">Contact</h2>
                <div className="space-y-1 text-charcoal">
                  <p>hello@brewstory.com</p>
                </div>
              </div>

              {/* Storefront Image */}
              <div className="aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/generated/exterior_storefront.png"
                  alt="Brew Story storefront in Huntington Beach"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal direction="right">
            <div>
              <h2 className="font-serif text-2xl text-ink mb-8">Get in Touch</h2>
              <form className="space-y-6">
                <Input id="name" label="Name" placeholder="Your name" required />
                <Input id="email" label="Email" type="email" placeholder="your@email.com" required />
                <div>
                  <label htmlFor="message" className="block text-xs tracking-widest uppercase text-olive mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="How can we help?"
                    required
                    className="w-full px-4 py-3 bg-transparent border border-sage text-charcoal placeholder:text-sage focus:border-olive focus:outline-none transition-colors resize-none"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">Send Message</Button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
