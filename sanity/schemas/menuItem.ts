import { defineType, defineField } from 'sanity';

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Coffee (Hot)', value: 'coffee-hot' },
          { title: 'Coffee (Iced)', value: 'coffee-iced' },
          { title: 'Signature', value: 'signature' },
          { title: 'Matcha', value: 'matcha' },
          { title: 'Hojicha', value: 'hojicha' },
          { title: 'Specialty Tea', value: 'specialty-tea' },
          { title: 'Citrus Sparklers', value: 'citrus-sparklers' },
          { title: 'Non-Coffee', value: 'non-coffee' },
          { title: 'Pastries', value: 'pastries' },
          { title: 'Sandwiches', value: 'sandwiches' },
          { title: 'Merchandise', value: 'merchandise' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'dietary',
      title: 'Dietary Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Vegan', value: 'vegan' },
          { title: 'Gluten-Free', value: 'gf' },
          { title: 'Dairy-Free', value: 'df' },
          { title: 'Popular', value: 'popular' },
          { title: 'New', value: 'new' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'image', available: 'available', price: 'price' },
    prepare({ title, subtitle, media, available, price }) {
      return {
        title: `${available === false ? '🔴 ' : ''}${title}`,
        subtitle: `${subtitle} — $${price?.toFixed(2) ?? '?'}`,
        media,
      };
    },
  },
});
