import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemas } from './sanity/schemas';

export default defineConfig({
  name: 'brew-story',
  title: 'Brew Story CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5d3kzu53',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemas },
});
