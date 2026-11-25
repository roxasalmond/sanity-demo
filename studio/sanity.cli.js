import { defineCliConfig } from 'sanity/cli';

// Make sure CLI commands (seed, deploy) see the project ID in .env.
try {
  process.loadEnvFile('.env');
} catch {
  // No .env yet: commands that need a project will say so.
}

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
});
