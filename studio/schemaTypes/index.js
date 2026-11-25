import { seo, richText, video } from './objects.js';
import { cta, navLink, footerColumn } from './components.js';
import { sectionTypes } from './sections.js';
import { siteSettings, homePage, service, post, redirect } from './documents.js';

export const schemaTypes = [
  seo,
  richText,
  video,
  cta,
  navLink,
  footerColumn,
  ...sectionTypes,
  siteSettings,
  homePage,
  service,
  post,
  redirect,
];

// One-of-a-kind documents: edited in place, never created or deleted.
export const singletons = ['siteSettings', 'homePage'];
