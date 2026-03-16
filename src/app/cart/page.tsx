'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import PageHero from '@/components/ui/PageHero';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  return (
    <>
    <PageHero title="Cart" />
    <section className="py-16 md:py-24">
      <Container>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-olive text-lg mb-8">Your cart is empty.</p>
            <Button href="/shop">Continue Shopping</Button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6 mb-12">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-sage/30">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-ink">{item.name}</h3>
                    {item.variant && <p className="text-sm text-olive">{item.variant}</p>}
                    <p className="text-sm text-olive">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-sage">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-charcoal hover:text-ink transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-sm text-ink">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-charcoal hover:text-ink transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-olive hover:text-ink transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between py-6 border-t border-ink/10">
              <span className="font-serif text-xl text-ink">Total</span>
              <span className="font-serif text-2xl text-ink">{formatPrice(totalPrice())}</span>
            </div>

            <Button onClick={handleCheckout} size="lg" className="w-full mt-6">
              Checkout
            </Button>
          </div>
        )}
      </Container>
    </section>
    </>
  );
}
