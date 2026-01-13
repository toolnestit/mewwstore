import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import { deskStructure } from './structure'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'meww',

  projectId: 'y6dp9dxb',
  dataset: 'production',

  plugins: [structureTool({
      structure: deskStructure,
    }), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
