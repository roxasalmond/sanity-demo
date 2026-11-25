import { defineField, defineType, defineArrayMember } from 'sanity';
import { bodyRules } from './rules.js';
import { sectionTypes, sectionsRules } from './sections.js';

const slugField = defineField({
  name: 'slug',
  title: 'Page address',
  type: 'slug',
  description: 'The end of the URL. Changing it after launch breaks old links, so add a redirect if you do.',
  options: { source: 'title', maxLength: 70 },
  validation: (Rule) => Rule.required().error('Generate or type a page address.'),
});

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Business name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone number', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (R) => R.required().email() }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking link',
      type: 'string',
      description: 'Where every "Book a call" button goes, on every page. A booking page (https://...) or /#book for the booking section on the homepage.',
      validation: (R) =>
        R.required().custom((v) =>
          /^https:\/\//.test(v ?? '') || v === '/#book'
            ? true
            : 'Use a secure link starting with https://, or /#book for the homepage booking section.'
        ),
    }),
    defineField({ name: 'bookingLabel', title: 'Booking button text', type: 'string', validation: (R) => R.required().max(40) }),
    defineField({
      name: 'mainMenu',
      title: 'Main menu',
      type: 'array',
      description: 'The links at the top of every page. Drag to reorder.',
      of: [defineArrayMember({ type: 'navLink' })],
      validation: (R) => R.min(1).max(5).error('Use between 1 and 5 menu links, so the menu fits on a phone.'),
    }),
    defineField({
      name: 'headerCta',
      title: 'Header button',
      type: 'cta',
      description: 'The button at the top right of every page.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer columns',
      type: 'array',
      of: [defineArrayMember({ type: 'footerColumn' })],
      validation: (R) => R.max(3).error('Use up to 3 footer columns.'),
    }),
    defineField({ name: 'footerNote', title: 'Footer note', type: 'text', rows: 2 }),
  ],
});

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      description: 'Build the page from approved sections. Drag to reorder.',
      of: sectionTypes.map((t) => defineArrayMember({ type: t.name })),
      validation: sectionsRules,
    }),
    defineField({ name: 'seo', title: 'Search listing', type: 'seo', validation: (R) => R.required() }),
  ],
  preview: { prepare: () => ({ title: 'Homepage' }) },
});

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Service name', type: 'string', validation: (R) => R.required() }),
    slugField,
    defineField({
      name: 'summary',
      title: 'One-line summary',
      type: 'text',
      rows: 2,
      description: 'Shows under the headline and in service lists.',
      validation: (R) => R.required().max(200),
    }),
    defineField({ name: 'body', title: 'Page text', type: 'richText', validation: bodyRules }),
    defineField({
      name: 'results',
      title: 'Client results',
      type: 'array',
      description: 'Proof that this service works. Shown near the top of the page.',
      validation: (R) => R.min(1).error('Add at least one client result before publishing.'),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'result',
          fields: [
            { name: 'result', title: 'Result', type: 'string', validation: (R) => R.required().max(110) },
            { name: 'client', title: 'Client (no names without permission)', type: 'string', validation: (R) => R.required() },
          ],
          preview: { select: { title: 'result', subtitle: 'client' } },
        }),
      ],
    }),
    defineField({ name: 'seo', title: 'Search listing', type: 'seo', validation: (R) => R.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});

export const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    slugField,
    defineField({
      name: 'publishedAt',
      title: 'Publish date',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (R) => R.required(),
    }),
    defineField({ name: 'excerpt', title: 'Short summary', type: 'text', rows: 2, validation: (R) => R.required().max(200) }),
    defineField({ name: 'body', title: 'Post text', type: 'richText', validation: bodyRules }),
    defineField({
      name: 'relatedService',
      title: 'Related service',
      type: 'reference',
      to: [{ type: 'service' }],
      description: 'Adds a "Want help with this?" box at the end of the post.',
    }),
    defineField({ name: 'seo', title: 'Search listing', type: 'seo', validation: (R) => R.required() }),
  ],
  orderings: [{ title: 'Newest first', name: 'dateDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'publishedAt' } },
});

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  description: 'Send an old address to the page that replaced it. Never send old pages to the homepage by default.',
  fields: [
    defineField({
      name: 'from',
      title: 'Old address',
      type: 'string',
      description: 'Like /old-page/',
      validation: (R) =>
        R.required().custom((v) => (/^\/\S*$/.test(v ?? '') ? true : 'Start with / and leave out the domain.')),
    }),
    defineField({
      name: 'to',
      title: 'New address',
      type: 'string',
      description: 'The closest matching page, like /services/marketing-strategy/',
      validation: (R) => [
        R.required().custom((to, ctx) => {
          if (!/^(\/|https:\/\/)/.test(to ?? '')) return 'Start with / or https://';
          if (to === ctx.document?.from) return 'The new address is the same as the old one.';
          return true;
        }),
        R.custom((to) =>
          to === '/'
            ? 'Sending old pages to the homepage tells Google they are gone. Pick the closest page if there is one.'
            : true
        ).warning(),
      ],
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent (301)',
      type: 'boolean',
      initialValue: true,
      description: 'Leave on unless the move is temporary.',
    }),
  ],
  preview: {
    select: { from: 'from', to: 'to' },
    prepare: ({ from, to }) => ({ title: `${from} to ${to}` }),
  },
});
