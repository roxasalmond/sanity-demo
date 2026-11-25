// One place to get content. With SANITY_PROJECT_ID set, pages read from
// Sanity at build time. Without it, they read the demo file, so the site
// builds and runs before any CMS account exists.
import { createClient } from '@sanity/client';
import * as demo from '../data/demo-content.js';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET || 'production';

const client = projectId
  ? createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: false })
  : null;

export const usingSanity = Boolean(client);

const SERVICE = `{ _id, title, "slug": slug.current, summary, body, results, seo }`;
const POST = `{ _id, title, "slug": slug.current, publishedAt, excerpt, body, seo,
  "relatedService": relatedService->{ title, "slug": slug.current, summary } }`;

const flat = (doc) => doc && { ...doc, slug: doc.slug?.current ?? doc.slug };
const byDateDesc = (a, b) => (a.publishedAt < b.publishedAt ? 1 : -1);

export async function getSettings() {
  if (!client) return demo.settings;
  return (await client.fetch(`*[_id == "siteSettings"][0]`)) ?? demo.settings;
}

export async function getHome() {
  if (!client) {
    return {
      ...demo.home,
      sections: demo.home.sections.map((section) =>
        section._type === 'serviceListSection'
          ? {
              ...section,
              services: section.services
                .map((ref) => flat(demo.services.find((s) => s._id === ref._ref)))
                .filter(Boolean),
            }
          : section
      ),
    };
  }
  return client.fetch(
    `*[_id == "homePage"][0]{
      ...,
      sections[]{
        ...,
        _type == "serviceListSection" => { "services": services[]->${SERVICE} }
      }
    }`
  );
}

export async function getServices() {
  if (!client) return demo.services.map(flat);
  return client.fetch(`*[_type == "service" && defined(slug.current)] | order(title asc) ${SERVICE}`);
}

export async function getPosts() {
  if (!client) {
    return demo.posts
      .map((post) => ({
        ...flat(post),
        relatedService: flat(demo.services.find((s) => s._id === post.relatedService?._ref)),
      }))
      .sort(byDateDesc);
  }
  return client.fetch(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) ${POST}`
  );
}

export async function getRedirects() {
  if (!client) return demo.redirects;
  return client.fetch(`*[_type == "redirect"]{ from, to, permanent }`);
}
