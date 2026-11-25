// Writes public/_redirects before each build, from the Redirects list in Sanity
// (or the demo file). Netlify and Cloudflare Pages read this file natively.
import { writeFile } from 'node:fs/promises';
import { createClient } from '@sanity/client';
import { redirects as demoRedirects } from '../src/data/demo-content.js';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';

const redirects = projectId
  ? await createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: false }).fetch(
      `*[_type == "redirect"]{ from, to, permanent }`
    )
  : demoRedirects;

const lines = redirects
  .filter((r) => r.from && r.to)
  .map((r) => `${r.from}  ${r.to}  ${r.permanent === false ? 302 : 301}`);

await writeFile(new URL('../public/_redirects', import.meta.url), lines.join('\n') + '\n');
console.log(`Wrote ${lines.length} redirects to public/_redirects`);
