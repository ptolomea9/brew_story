import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

interface LineItem {
  name: string;
  price: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const { items } = (await req.json()) as { items: LineItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      success_url: `${req.nextUrl.origin}/cart?success=true`,
      cancel_url: `${req.nextUrl.origin}/cart?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
