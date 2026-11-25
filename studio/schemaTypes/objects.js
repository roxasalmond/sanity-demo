import { defineField, defineType, defineArrayMember } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'Search listing',
  type: 'object',
  description: 'What Google shows for this page. Every page needs both fields.',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Title in Google',
      type: 'string',
      validation: (Rule) => [
        Rule.required().error('Add a title for Google.'),
        Rule.max(60).warning('Google cuts titles off after about 60 characters.'),
      ],
    }),
    defineField({
      name: 'metaDescription',
      title: 'Description in Google',
      type: 'text',
      rows: 3,
      validation: (Rule) => [
        Rule.required().error('Add a description for Google.'),
        Rule.min(70).warning('Aim for at least 70 characters, so Google has something to show.'),
        Rule.max(160).warning('Google cuts descriptions off after about 160 characters.'),
      ],
    }),
    defineField({
      name: 'noindex',
      title: 'Hide from Google',
      type: 'boolean',
      description: 'Turn on for pages that should not appear in search results.',
      initialValue: false,
    }),
  ],
});

export const richText = defineType({
  name: 'richText',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        { title: 'Heading', value: 'h2' },
        { title: 'Subheading', value: 'h3' },
      ],
      lists: [
        { title: 'Bullets', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'Address',
                type: 'string',
                description: 'A page on this site starts with / (like /services/marketing-strategy/). Other sites start with https://.',
                validation: (Rule) =>
                  Rule.required().custom((href) =>
                    /^(\/|https:\/\/|mailto:|tel:)/.test(href ?? '')
                      ? true
                      : 'Start with / for this site, or https:// for another site.'
                  ),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      name: 'image',
      title: 'Image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Describe the image',
          type: 'string',
          description: 'What someone would need to know if they could not see it. Read aloud by screen readers and used by Google.',
          validation: (Rule) => Rule.required().error('Describe the image before publishing.'),
        }),
        defineField({ name: 'caption', title: 'Caption (optional)', type: 'string' }),
      ],
    }),
    defineArrayMember({ type: 'video' }),
  ],
});

const VIDEO_HOSTS = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)/;

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube or Vimeo link',
      type: 'url',
      validation: (Rule) =>
        Rule.required().custom((url) =>
          VIDEO_HOSTS.test(url ?? '') ? true : 'Use a YouTube or Vimeo link, like https://www.youtube.com/watch?v=...'
        ),
    }),
    defineField({
      name: 'title',
      title: 'Video title',
      type: 'string',
      description: 'Read aloud by screen readers.',
      validation: (Rule) => Rule.required().error('Give the video a title.'),
    }),
    defineField({
      name: 'fit',
      title: 'Why this video fits this page',
      type: 'text',
      rows: 2,
      description: 'Not shown on the site. Helps reviewers check that the video matches the topic.',
      validation: (Rule) => Rule.required().min(20).error('Say in a sentence why this video belongs on this page.'),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'url' } },
});
