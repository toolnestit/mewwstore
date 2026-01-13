export const bannerQuery = `*[_type == "slider"]{
  label,
  title,
  "img": image.asset->url,
  link
}`;

export const categoriesToolsQuery = `
  *[_type == "categoryTool"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    link,
    icon {
      asset->{
        _id,
        url
      },
      alt
    }
  }
`;

export const multiSectionQuery = `*[_type == "banner"]{
  title,
  buttonText,
  href,
  "img": image.asset->url
}`;

export const trendingQuery = `*[_type == "trendingProducts"][0]{
  products[]->{
    name,
    price,
    priceBDT,
    discount,
    "thumb": thumb.asset->url,
    slug,
    cloudURL,
    demoUrl,
    accessType,
    discountGroup,
    isPriceFixed,
    category->{
      name,
      "link": slug.current
    },
    "sources": sources[].asset->url
  }
}`;

export const productQuery = `*[_type == "product"][0...8]{
  name,
  price,
  discount,
  priceBDT,
  "thumb": thumb.asset->url,
  slug,
  accessType,
  demoUrl,
  cloudURL,
  isPriceFixed,
  discountGroup,
  category->{
    name,
    "link": slug.current
  },
  "sources": sources[].asset->url
}`;

export const productContentQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  category->{
    _id,
    name,
    slug
  },
  thumb,
  price,
  priceBDT,
  discount,
  discountGroup,
  sources,
  demoUrl,
  cloudURL,
  accessType,
  isPriceFixed,
  cookies,
  content
}
`;

export const pricingQuery = `*[_type == "pricing"] | order(orderRank asc) {
  _id,
  name,
  description,
  highlighted,
  slug,
  price {
    normal,
    normalBDT,
    discount,
  },

  "featuresCount": count(features),

  "features": features[0...100000] | order(orderRank asc) {
    type,

    type == "product" => {
      "product": product->{
        _id,
        name,
        slug,
        cloudURL,
        price,
        discountGroup,
        discount,
        "thumb": thumb.asset->url,
      }
    },

    type == "custom" => {
      name,
      link
    }
  }
}
`;

export const faqsQuery = `*[_type == "faqSection"][0]{
  faqs[]{
    question,
    answer
  }
}
`;

export const planQuery = `*[_type == "pricing" && slug.current == $slug][0]{
  _id,
  name,
  description,
  highlighted,
  price {
    normal,
    normalBDT,
    discount
  },
  slug {
    current
  },
  features[] | order(orderRank asc){
    type,
    name,
    link,
    product->{
        _id,
        name,
        price,
        discount,
        priceBDT,
        "thumb": thumb.asset->url,
        slug,
        accessType,
        isPriceFixed,
        cloudURL,
        discountGroup,
        demoUrl,
        category->{
          name,
          "link": slug.current
        },
        "sources": sources[].asset->url
    }
  }
}`;

export const allProductsQuery = `*[_type == "product"]{
  name,
  price,
  discount,
  discountGroup,
  priceBDT,
  "thumb": thumb.asset->url,
  slug,
  accessType,
  isPriceFixed,
  demoUrl,
  cloudURL,
  category->{
    name,
    "link": slug.current
  },
  "sources": sources[].asset->url
}`;

export const backendProductsQuery = `*[_type == "product"]{
  "slug": slug.current,
  priceBDT,
  discount,
  discountGroup
}`;
