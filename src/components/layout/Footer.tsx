import Link from 'next/link';

const footerLinks = {
  visit: [
    { href: '/menu', label: 'Menu' },
    { href: '/order', label: 'Order Online' },
    { href: '/about', label: 'Our Story' },
    { href: '/contact', label: 'Contact' },
  ],
  shop: [
    { href: '/shop', label: 'Coffee' },
    { href: '/shop', label: 'Merchandise' },
    { href: '/cart', label: 'Cart' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/80">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="font-serif text-3xl text-cream mb-4">brew story</h2>
            <p className="text-sm leading-relaxed text-cream/60">
              Coffee Roastery<br />
              Huntington Beach, CA
            </p>
          </div>

          {/* Visit Links */}
          <div>
            <h3 className="text-xs tracking-widest uppercase text-cream/40 mb-4">Visit</h3>
            <ul className="space-y-3">
              {footerLinks.visit.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-cream/70 hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs tracking-widest uppercase text-cream/40 mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-cream/70 hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-xs tracking-widest uppercase text-cream/40 mb-4">Hours</h3>
            <div className="space-y-2 text-sm text-cream/70">
              <p>Monday - Friday: 8am - 7pm</p>
              <p>Saturday - Sunday: 8am - 4pm</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/40">
            &copy; {new Date().getFullYear()} Brew Story. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/brewstory_/" target="_blank" rel="noopener noreferrer" className="text-cream/40 hover:text-cream transition-colors" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@brewstory_" target="_blank" rel="noopener noreferrer" className="text-cream/40 hover:text-cream transition-colors" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.16v-3.45a4.85 4.85 0 01-2.32-.59V6.69h2.32z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
