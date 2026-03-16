/**
 * Seed Sanity with menu items from Toast scrape + initial site settings.
 * Run: node scripts/seed-sanity.mjs
 */
import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const client = createClient({
  projectId: '5d3kzu53',
  dataset: 'production',
  apiVersion: '2026-03-15',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

// Category mapping: display name -> slug value
const categoryMap = {
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

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Signature items to feature on homepage
const featuredItems = [
  'Tiramisu Latte',
  'Banana Cream COFFEE Latte',
  'Sweet Corn Latte',
  'MaMa Latte Matcha latte with matcha cream top.',
  'Creme Brulee Latte',
  'The Yoda Iced Latte with Matcha Cream top.',
];

async function seedMenu() {
  const raw = readFileSync('src/data/menu.json', 'utf-8');
  const items = JSON.parse(raw);

  console.log(`Seeding ${items.length} menu items...`);

  const transaction = client.transaction();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const slug = slugify(item.name);
    const id = `menu-${slug}`;

    transaction.createOrReplace({
      _id: id,
      _type: 'menuItem',
      name: item.name,
      slug: { _type: 'slug', current: slug },
      price: item.price,
      category: categoryMap[item.category] || 'signature',
      available: item.in_stock,
      featured: featuredItems.includes(item.name),
      sortOrder: i,
    });
  }

  const result = await transaction.commit();
  console.log(`Done — ${items.length} menu items seeded.`);
  return result;
}

async function seedSettings() {
  console.log('Seeding site settings...');

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    shopName: 'Brew Story',
    tagline: 'Coffee Roastery',
    address: '16889 Beach Blvd',
    city: 'Huntington Beach, CA 92647',
    phone: '',
    email: 'hello@brewstory.com',
    hours: [
      { _key: 'weekday', days: 'Monday - Friday', hours: '8:00 AM - 7:00 PM' },
      { _key: 'weekend', days: 'Saturday - Sunday', hours: '8:00 AM - 4:00 PM' },
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/brewstorycoffee/',
    },
    announcement: '',
  });

  console.log('Done — site settings seeded.');
}

async function main() {
  try {
    await seedMenu();
    await seedSettings();
    console.log('\nAll done! Visit https://brew-story.sanity.studio to manage content.');
  } catch (err) {
    console.error('Seed error:', err.message);
    if (err.message.includes('token')) {
      console.error('\nYou need a write token. Run:');
      console.error('  npx sanity manage');
      console.error('  → API → Tokens → Add token (Editor role)');
      console.error('  Then: SANITY_TOKEN=<token> node scripts/seed-sanity.mjs');
    }
  }
}

main();
