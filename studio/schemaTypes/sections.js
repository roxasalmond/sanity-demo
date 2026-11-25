// Page sections: the approved pieces editors build pages from.
// Each one matches a component in web/src/components/sections/.
import { defineField, defineType, defineArrayMember } from 'sanity';
import { bodyRules } from './rules.js';

const heading = (required = true) =>
  defineField({
    name: 'heading',
    title: 'Heading',
    type: 'string',
    validation: (Rule) => (required ? Rule.required().max(80) : Rule.max(80)),
  });

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  description: 'The top of the page: headline, intro and the booking button.',
  fields: [
    defineField({ name: 'heading', title: 'Headline', type: 'string', validation: (R) => R.required().max(70) }),
    defineField({ name: 'text', title: 'Intro', type: 'text', rows: 3, validation: (R) => R.required().max(240) }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'cta' })],
      validation: (R) => R.min(1).max(2).error('The hero needs one or two buttons, so visitors always have a next step.'),
    }),
    defineField({
      name: 'showPhone',
      title: 'Show phone number next to the buttons',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title, subtitle: 'Hero' }) },
});

export const stepsSection = defineType({
  name: 'stepsSection',
  title: 'Steps',
  type: 'object',
  description: 'A short numbered process, like what happens on the first call.',
  fields: [
    heading(),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      validation: (R) => R.min(2).max(4).error('Use between 2 and 4 steps.'),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          fields: [
            { name: 'title', title: 'Step', type: 'string', validation: (R) => R.required().max(50) },
            { name: 'text', title: 'Detail', type: 'string', validation: (R) => R.required().max(110) },
          ],
        }),
      ],
    }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title, subtitle: 'Steps' }) },
});

export const serviceListSection = defineType({
  name: 'serviceListSection',
  title: 'Service list',
  type: 'object',
  fields: [
    heading(),
    defineField({
      name: 'services',
      title: 'Services to show',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
      validation: (R) => R.min(1).unique(),
    }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title, subtitle: 'Service list' }) },
});

export const resultsSection = defineType({
  name: 'resultsSection',
  title: 'Client results',
  type: 'object',
  fields: [
    heading(),
    defineField({
      name: 'items',
      title: 'Results',
      type: 'array',
      validation: (R) => R.min(1).max(4),
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
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title, subtitle: 'Client results' }) },
});

export const blogListSection = defineType({
  name: 'blogListSection',
  title: 'Latest blog posts',
  type: 'object',
  fields: [
    heading(),
    defineField({
      name: 'count',
      title: 'How many posts',
      type: 'number',
      initialValue: 2,
      validation: (R) => R.required().integer().min(1).max(6),
    }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title, subtitle: 'Latest blog posts' }) },
});

export const textSection = defineType({
  name: 'textSection',
  title: 'Text',
  type: 'object',
  fields: [heading(false), defineField({ name: 'body', title: 'Text', type: 'richText', validation: bodyRules })],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: title || 'Text', subtitle: 'Text' }) },
});

export const faqSection = defineType({
  name: 'faqSection',
  title: 'Questions and answers',
  type: 'object',
  fields: [
    heading(),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      validation: (R) => R.min(2).max(10),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'qa',
          fields: [
            { name: 'question', title: 'Question', type: 'string', validation: (R) => R.required().max(120) },
            { name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (R) => R.required().max(600) },
          ],
          preview: { select: { title: 'question' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title, subtitle: 'Questions and answers' }) },
});

export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'Call to action',
  type: 'object',
  description: 'A closing prompt with one button.',
  fields: [
    heading(),
    defineField({ name: 'text', title: 'Text', type: 'text', rows: 2, validation: (R) => R.max(240) }),
    defineField({ name: 'cta', title: 'Button', type: 'cta', validation: (R) => R.required() }),
    defineField({
      name: 'showBookingEmbed',
      title: 'Show the booking calendar here',
      type: 'boolean',
      description: 'Turn on for the section the "Book a call" buttons point to (/#book).',
      initialValue: false,
    }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title, subtitle: 'Call to action' }) },
});

export const sectionTypes = [
  heroSection,
  stepsSection,
  serviceListSection,
  resultsSection,
  blogListSection,
  textSection,
  faqSection,
  ctaSection,
];

// Rules for a whole page built from sections.
export const sectionsRules = (Rule) => [
  Rule.required().min(1).error('Add at least one section.'),
  Rule.custom((sections) =>
    sections?.length && sections[0]._type !== 'heroSection'
      ? 'Start the page with a Hero section, so visitors see what the page is about and how to book.'
      : true
  ),
  Rule.custom((sections) =>
    (sections ?? []).filter((s) => s._type === 'heroSection').length > 1 ? 'Use only one Hero section per page.' : true
  ),
];
