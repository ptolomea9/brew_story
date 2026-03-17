import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FooterGate from '@/components/layout/FooterGate';
import LenisProvider from '@/components/providers/LenisProvider';

export const metadata: Metadata = {
  title: {
    default: 'Brew Story | Coffee Roastery',
    template: '%s | Brew Story',
  },
  description: 'Craft coffee roastery in Huntington Beach, CA. Fresh roasted beans, specialty drinks, and original merchandise.',
  keywords: ['coffee', 'roastery', 'Huntington Beach', 'specialty coffee', 'brew story'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Brew Story',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LenisProvider>
          {/* <LogoSplash /> */}
          <Header />
          <main className="min-h-screen pt-16 md:pt-20">
            {children}
          </main>
          <FooterGate><Footer /></FooterGate>
        </LenisProvider>
      </body>
    </html>
  );
}
