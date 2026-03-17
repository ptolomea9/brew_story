'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import ScrollReveal from '@/components/animation/ScrollReveal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PageHero from '@/components/ui/PageHero';

const FORM_URL = 'https://formsubmit.co/ajax/brewstoryhb@gmail.com';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch(FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...formData,
          _subject: 'Brew Story — Contact Form',
          _template: 'table',
        }),
      });
      setSubmitted(true);
    } catch {
      alert('Something went wrong. Please try again or email us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
    <PageHero title="Visit Us" />
    <section className="py-16 md:py-24">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-16">
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
                  <p>Monday - Friday: 8am - 7pm</p>
                  <p>Saturday - Sunday: 8am - 4pm</p>
                </div>
              </div>

              <div>
                <h2 className="text-xs tracking-widest uppercase text-olive mb-3">Contact</h2>
                <div className="space-y-1 text-charcoal">
                  <p>brewstoryhb@gmail.com</p>
                </div>
              </div>

              {/* Storefront Image */}
              <div className="aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/exterior_real.jpg"
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
              {submitted ? (
                <div className="text-center py-16 bg-linen">
                  <h3 className="font-serif text-3xl text-ink mb-4">Thank you!</h3>
                  <p className="text-olive">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    id="name"
                    label="Name"
                    placeholder="Your name"
                    required
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <div>
                    <label htmlFor="message" className="block text-xs tracking-widest uppercase text-olive mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="How can we help?"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-sage text-charcoal placeholder:text-sage focus:border-olive focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={sending}>
                    {sending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
    </>
  );
}
