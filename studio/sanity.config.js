import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes, singletons } from './schemaTypes/index.js';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

// A sidebar written for the people who edit the site, not for developers.
const structure = (S) =>
  S.list()
    .title('Website')
    .items([
      S.listItem().title('Homepage').id('homePage').child(S.document().schemaType('homePage').documentId('homePage')),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('post').title('Blog posts'),
      S.divider(),
      S.documentTypeListItem('redirect').title('Redirects'),
      S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ]);

export default defineConfig({
  name: 'default',
  title: 'Wren & Ledger',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // Hide "create new" for the homepage and settings.
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletons.includes(schemaType)
        ? actions.filter(({ action }) => ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
});
