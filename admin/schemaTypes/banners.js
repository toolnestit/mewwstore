import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'banner',
  title: 'Banners',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      validation: (Rule) =>
        Rule.required().regex(/^\/.*/, {
          name: 'relative-url',
          invert: false,
        }),
      description: 'Internal link (e.g. /blogs)',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
