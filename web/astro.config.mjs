import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const { SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

export default defineConfig({
  site: SITE_URL || 'https://example.com',
  // One URL per page: always with a trailing slash. This avoids the
  // slash / no-slash duplicates that split a page's ranking in two.
  trailingSlash: 'always',
  build: { format: 'directory' },
});
