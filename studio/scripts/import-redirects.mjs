// Bulk-imports redirects from a CSV into Sanity.
//   npm run import:redirects -- redirects.csv          (check and import)
//   npm run import:redirects -- redirects.csv --check  (check only)
//
// CSV columns: from,to,permanent   (permanent is optional: yes/no, default yes)
// Imports skip the editor's validation, so this script runs the same checks.
// Each redirect's ID comes from its old address, so importing the same CSV
// twice updates the redirects instead of duplicating them.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';

const [file, flag] = process.argv.slice(2);
if (!file) {
  console.error('Usage: npm run import:redirects -- <file.csv> [--check]');
  process.exit(1);
}

const lines = (await readFile(file, 'utf8')).split(/\r?\n/).filter((l) => l.trim());
const header = lines[0].toLowerCase().split(',').map((h) => h.trim());
const col = (name) => header.indexOf(name);
if (col('from') < 0 || col('to') < 0) {
  console.error('The CSV needs "from" and "to" columns.');
  process.exit(1);
}

const errors = [];
const warnings = [];
const seen = new Map();

// Full URLs on the site's own domain (SITE_URL, default example.com) become paths.
const ownHost = new URL(process.env.SITE_URL || 'https://example.com').host.replace(/^www\./, '');

const toPath = (value = '') => {
  const v = value.trim();
  if (/^https?:\/\//i.test(v) && new URL(v).host.replace(/^www\./, '') === ownHost) {
    return new URL(v).pathname;
  }
  return v;
};

const rows = lines.slice(1).map((line, i) => {
  const cells = line.split(',');
  const row = i + 2;
  const from = toPath(cells[col('from')]);
  const to = toPath(cells[col('to')]);
  const perm = col('permanent') >= 0 ? (cells[col('permanent')] ?? '').trim().toLowerCase() : '';
  const permanent = !['no', 'false', '0', '302'].includes(perm);

  if (!/^\/\S*$/.test(from)) errors.push(`Row ${row}: old address "${from}" must start with /`);
  if (!/^(\/|https:\/\/)/.test(to)) errors.push(`Row ${row}: new address "${to}" must start with / or https://`);
  if (from === to) errors.push(`Row ${row}: "${from}" redirects to itself`);
  if (to === '/') warnings.push(`Row ${row}: "${from}" goes to the homepage. Pick the closest page if there is one.`);
  if (seen.has(from)) errors.push(`Row ${row}: "${from}" is already redirected on row ${seen.get(from)}`);
  seen.set(from, row);

  return { from, to, permanent, row };
});

// Chains: A -> B where B is also redirected. Visitors and Google take two hops.
const byFrom = new Map(rows.map((r) => [r.from, r]));
for (const r of rows) {
  const next = byFrom.get(r.to);
  if (next) {
    if (next.to === r.from) errors.push(`Row ${r.row}: "${r.from}" and "${r.to}" redirect to each other (loop)`);
    else warnings.push(`Row ${r.row}: "${r.from}" -> "${r.to}" -> "${next.to}" is a chain. Point it straight to "${next.to}".`);
  }
}

console.log(`${rows.length} redirects read from ${file}`);
warnings.forEach((w) => console.log(`  warning  ${w}`));
errors.forEach((e) => console.log(`  error    ${e}`));

if (errors.length) {
  console.log(`\n${errors.length} error(s). Fix the CSV and run again. Nothing was imported.`);
  process.exit(1);
}
if (flag === '--check') {
  console.log('\nCheck passed. Run without --check to import.');
  process.exit(0);
}

const docs = rows.map(({ from, to, permanent }) => ({
  _id: `redirect-${createHash('sha1').update(from).digest('hex').slice(0, 16)}`,
  _type: 'redirect',
  from,
  to,
  permanent,
}));
await writeFile('redirects.ndjson', docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
execSync('npx sanity dataset import redirects.ndjson production --replace', { stdio: 'inherit' });
