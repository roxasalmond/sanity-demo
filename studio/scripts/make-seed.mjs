// Builds seed.ndjson from the website's demo content, for:
//   npx sanity dataset import seed.ndjson production --replace
import { writeFile } from 'node:fs/promises';
import * as demo from '../../web/src/data/demo-content.js';

const docs = [demo.settings, demo.home, ...demo.services, ...demo.posts, ...demo.redirects];
await writeFile(new URL('../seed.ndjson', import.meta.url), docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`Wrote ${docs.length} documents to seed.ndjson`);
