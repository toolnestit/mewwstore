import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default {
  name: 'pricing',
  title: 'Pricing',
  type: 'document',
  orderings: [orderRankOrdering],

  preview: {
    select: {
      title: 'name',
      price: 'price.normal',
      highlighted: 'highlighted',
    },
    prepare({title, price, highlighted}) {
      return {
        title: title || 'Untitled Plan',
        subtitle: `${price ? `$${price}` : 'No price'}${highlighted ? ' ⭐ Highlighted' : ''}`,
      }
    },
  },

  fields: [
    orderRankField({type: 'pricing'}),

    {
      name: 'name',
      title: 'Plan Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },

    {
      name: 'price',
      title: 'Price',
      type: 'object',
      fields: [
        {
          name: 'normal',
          title: 'Normal Price',
          type: 'number',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'normalBDT',
          title: 'Normal Price BDT',
          type: 'number',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'discount',
          title: 'Discount Price',
          type: 'number',
        },
      ],
    },

    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          name: 'featureItem',
          title: 'Feature',
          type: 'object',

          fields: [
            // 🔹 Feature order
            orderRankField({type: 'featureItem'}),

            {
              name: 'type',
              title: 'Feature Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Product Reference', value: 'product'},
                  {title: 'Custom Feature', value: 'custom'},
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            },

            {
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{type: 'product'}],
              hidden: ({parent}) => parent?.type !== 'product',
            },

            {
              name: 'name',
              title: 'Feature Name',
              type: 'string',
              hidden: ({parent}) => parent?.type !== 'custom',
            },

            {
              name: 'link',
              title: 'Feature Link',
              type: 'url',
              hidden: ({parent}) => parent?.type !== 'custom',
            },
          ],

          // 🔹 Feature Preview (Untitled FIX)
          preview: {
            select: {
              type: 'type',
              name: 'name',
              productTitle: 'product.name',
            },
            prepare({type, name, productTitle}) {
              return {
                title:
                  type === 'product' ? productTitle || 'Product Feature' : name || 'Custom Feature',
                subtitle: type === 'product' ? 'Product Reference' : 'Custom Feature',
              }
            },
          },
        },
      ],
    },

    {
      name: 'highlighted',
      title: 'Highlighted Plan',
      type: 'boolean',
      description: 'Mark this plan as featured or recommended',
      initialValue: false,
    },

    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
  ],
}
