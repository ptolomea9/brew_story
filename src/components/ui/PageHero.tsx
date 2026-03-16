/**
 * Consistent hero banner for subpages.
 * Latte art background with cream wash overlay and olive text.
 */
export default function PageHero({ title }: { title: string }) {
  return (
    <section className="relative h-64 md:h-80 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/generated/logo_latte_v2_4x.png"
        alt="Brew Story botanical latte art"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-cream/60 flex items-center justify-center">
        <h1 className="font-serif text-5xl md:text-7xl" style={{ color: '#6B6B5E' }}>{title}</h1>
      </div>
    </section>
  );
}
