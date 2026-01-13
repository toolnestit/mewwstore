export default {
  name: 'trendingProducts',
  title: 'Trending Products',
  type: 'document',
  fields: [
    {
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'product'}],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
  ],
}
