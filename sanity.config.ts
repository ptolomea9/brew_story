import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemas } from './sanity/schemas';

export default defineConfig({
  name: 'brew-story',
  title: 'Brew Story CMS',
  projectId: '5d3kzu53',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemas },
});
