export default {
  name: 'ubtton',
  title: 'Action Button',
  type: 'object',
  fields: [
    {
      name: 'name',
      title: 'Button Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'behavior',
      title: 'Button Behavior',
      type: 'string',
      options: {
        list: [
          {title: 'Copy', value: 'copy'},
          {title: 'Redirect', value: 'redirect'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'copyValue',
      title: 'Copy Value',
      type: 'string',
      hidden: ({parent}) => parent?.behavior !== 'copy',
    },
    {
      name: 'redirectUrl',
      title: 'Redirect URL',
      type: 'url',
      hidden: ({parent}) => parent?.behavior !== 'redirect',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    },
  ],
}
