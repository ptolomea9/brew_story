import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5d3kzu53';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

let _client: SanityClient | null = null;

function getClient(): SanityClient {
  if (!_client) {
    if (!projectId) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID not set');
    _client = createClient({
      projectId,
      dataset,
      apiVersion: '2026-03-15',
      useCdn: true,
    });
  }
  return _client;
}

export const sanityClient = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch: <T = any>(query: string, params?: any): Promise<T> =>
    getClient().fetch<T>(query, params) as Promise<T>,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return createImageUrlBuilder({ projectId, dataset }).image(source);
}

// ── GROQ Queries ──

export const queries = {
  allProducts: `*[_type == "product" && inStock == true] | order(category asc, name asc) {
    _id, name, "slug": slug.current, description, price, category, images, variants, featured
  }`,

  featuredProducts: `*[_type == "product" && featured == true && inStock == true] | order(name asc) {
    _id, name, "slug": slug.current, price, category, images
  }`,

  productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id, name, "slug": slug.current, description, price, category, images, variants
  }`,

  menuItems: `*[_type == "menuItem" && available == true] | order(category asc, sortOrder asc) {
    _id, name, description, price, category, dietary, image, featured
  }`,

  allMenuItems: `*[_type == "menuItem"] | order(category asc, sortOrder asc) {
    _id, name, description, price, category, dietary, image, featured, available
  }`,

  featuredMenuItems: `*[_type == "menuItem" && available == true && featured == true] | order(sortOrder asc) {
    _id, name, description, price, category, image
  }`,

  teamMembers: `*[_type == "teamMember"] | order(sortOrder asc) {
    _id, name, role, bio, photo
  }`,

  siteSettings: `*[_type == "siteSettings"][0] {
    logo, shopName, tagline, address, city, phone, email, hours, socialLinks, announcement
  }`,
};
