// Reusable building blocks: buttons, menu links and footer columns.
// Editors fill in the words and links; the site decides how they look.
import { defineField, defineType, defineArrayMember } from 'sanity';
import { linkFormat, linkTargetExists } from './rules.js';

const VAGUE_LABELS = /^(click here|learn more|read more|submit|more|go|here|continue)$/i;

export const cta = defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button text',
      type: 'string',
      description: 'Say what happens when someone clicks, like "Book a free call".',
      validation: (Rule) => [
        Rule.required().error('Add the button text.'),
        Rule.max(30).error('Keep button text to 30 characters or less.'),
        Rule.custom((label) =>
          VAGUE_LABELS.test((label ?? '').trim())
            ? 'Say what the button does ("Book a free call", "See our services"), not "Click here" or "Learn more".'
            : true
        ),
      ],
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      validation: (Rule) => [
        Rule.required().error('Add where the button goes.'),
        Rule.custom(linkFormat),
        Rule.custom(linkTargetExists).warning(),
      ],
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Main (filled)', value: 'primary' },
          { title: 'Secondary (outline)', value: 'secondary' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'primary',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
});

export const navLink = defineType({
  name: 'navLink',
  title: 'Menu link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.required().max(24).error('Keep menu text short: 24 characters or less.'),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      validation: (Rule) => [
        Rule.required().error('Add where the link goes.'),
        Rule.custom(linkFormat),
        Rule.custom(linkTargetExists).warning(),
      ],
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
});

export const footerColumn = defineType({
  name: 'footerColumn',
  title: 'Footer column',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required().max(30) }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({ type: 'navLink' })],
      validation: (Rule) => Rule.min(1).max(8).error('Use between 1 and 8 links per column.'),
    }),
  ],
  preview: { select: { title: 'heading' } },
});
