import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2026-03-15',
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
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

  menuItems: `*[_type == "menuItem" && available == true] | order(sortOrder asc) {
    _id, name, description, price, category, dietary, image
  }`,

  teamMembers: `*[_type == "teamMember"] | order(sortOrder asc) {
    _id, name, role, bio, photo
  }`,

  siteSettings: `*[_type == "siteSettings"][0] {
    logo, shopName, tagline, address, city, phone, email, hours, socialLinks, announcement
  }`,
};
