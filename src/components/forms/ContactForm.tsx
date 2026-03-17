'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import useFormSubmit from '@/hooks/useFormSubmit';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const { sending, submitted, handleSubmit } = useFormSubmit('Brew Story — Contact Form');

  if (submitted) {
    return (
      <div className="text-center py-16 bg-linen">
        <h3 className="font-serif text-3xl text-ink mb-4">Thank you!</h3>
        <p className="text-olive">We&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, formData)} className="space-y-6">
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
  );
}
