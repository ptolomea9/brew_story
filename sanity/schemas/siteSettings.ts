import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'shopName',
      title: 'Shop Name',
      type: 'string',
      initialValue: 'Brew Story',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'Coffee Roastery',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      initialValue: 'Huntington Beach, CA',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      initialValue: 'hello@brewstory.com',
    }),
    defineField({
      name: 'hours',
      title: 'Hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'days', title: 'Days', type: 'string' }),
            defineField({ name: 'hours', title: 'Hours', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'tiktok', title: 'TikTok URL', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
      ],
    }),
    defineField({
      name: 'announcement',
      title: 'Announcement Bar',
      type: 'string',
      description: 'Optional banner message at top of site (leave empty to hide)',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
});
