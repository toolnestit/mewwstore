import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export const deskStructure = (S, context) =>
  S.list()
    .title('Content')
    .items([
      orderableDocumentListDeskItem({
        type: 'pricing',
        title: 'Pricing Plans',
        S,
        context,
      }),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) => !['pricing'].includes(listItem.getId())
      ),
    ])
