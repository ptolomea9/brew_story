import { sanityClient, queries } from '@/lib/sanity';
import MenuContent from '@/components/menu/MenuContent';
import menuJson from '@/data/menu.json';

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  dietary?: string[];
  featured?: boolean;
  image?: { asset: { _ref: string } };
}

// Category display name -> slug mapping for JSON fallback
const catSlugMap: Record<string, string> = {
  'Coffee (Hot)': 'coffee-hot',
  'Coffee (Iced)': 'coffee-iced',
  'Signature': 'signature',
  'Matcha': 'matcha',
  'Hojicha': 'hojicha',
  'Specialty Tea': 'specialty-tea',
  'Citrus Sparklers': 'citrus-sparklers',
  'Non-Coffee': 'non-coffee',
  'Pastries': 'pastries',
  'Sandwiches': 'sandwiches',
  'Merchandise': 'merchandise',
};

export const metadata = {
  title: 'Menu',
  description: 'Explore our craft coffee menu, specialty drinks, and fresh pastries at Brew Story.',
};

export const revalidate = 60;

export default async function MenuPage() {
  let items: MenuItem[];
  try {
    items = await sanityClient.fetch(queries.menuItems);
    if (!items || items.length === 0) throw new Error('empty');
  } catch {
    // Fallback to static JSON from Toast scrape
    items = menuJson
      .filter((i: { in_stock: boolean }) => i.in_stock)
      .map((i: { name: string; price: number; category: string; in_stock: boolean }, idx: number) => ({
        _id: `fallback-${idx}`,
        name: i.name,
        price: i.price,
        category: catSlugMap[i.category] || 'signature',
      }));
  }

  return <MenuContent items={items} />;
}
