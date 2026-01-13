export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'categoryTool'}], // categoryTool schema
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'thumb',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    },
    {
      name: 'priceBDT',
      title: 'Price BDT',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    },

    {
      name: 'discount',
      title: 'Discount (%)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    },
    {
      name: 'discountGroup',
      title: 'Discount Group (%)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    },
    {
      name: 'sources',
      title: 'Sources',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          validation: (Rule) => Rule.required(),
        },
      ],
      description: 'Optional source images',
    },
    {
      name: 'demoUrl',
      title: 'Demo URL',
      type: 'url',
      description: 'Optional demo or preview link',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
          allowRelative: false,
        }),
    },
    {
      name: 'cloudURL',
      title: 'Cloud URL',
      type: 'url',
      description: 'Optional demo or preview link',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
          allowRelative: false,
        }),
    },
    {
      name: 'accessType',
      title: 'Access Type',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              {title: 'Cloud', value: 'cloud'},
              {title: 'Extension', value: 'extension'},
              {title: 'Credential', value: 'credential'},
              {title: 'Software', value: 'software'},
            ],
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    },
    {
      name: 'isPriceFixed',
      title: 'Is Price Fixed',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'cookies',
      title: 'Cookies',
      type: 'text',
    },
    {
      name: 'content',
      title: 'Product Content',
      type: 'array',
      of: [
        {type: 'block'}, // normal rich text
        {type: 'ubtton'}, // our custom button block
      ],
    },
  ],
}
