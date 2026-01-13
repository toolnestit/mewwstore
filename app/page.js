import AllTools from "@/components/AllTools";
import Banner from "@/components/Banner";
import Categories from "@/components/Categories";
import Faqs from "@/components/Faqs";
import MultiSection from "@/components/MultiSection";
import Pricing from "@/components/Pricing";
import SectionDivider from "@/components/SectionDivider";
import Trending from "@/components/Trending";
import { accessOfTools } from "@/controllers/basics/user";
import {
  bannerQuery,
  categoriesToolsQuery,
  faqsQuery,
  multiSectionQuery,
  pricingQuery,
  productQuery,
  trendingQuery,
} from "@/lib/Query";
import { sanityClient } from "@/sanity.cli";

export default async function Home() {
  const [
    bannerData,
    multiSectionData,
    categoriesData,
    trendingData,
    productData,
    pricingData,
    faqsData,
    accessData,
  ] = await Promise.all([
    sanityClient.fetch(bannerQuery),
    sanityClient.fetch(multiSectionQuery),
    sanityClient.fetch(categoriesToolsQuery),
    sanityClient.fetch(trendingQuery),
    sanityClient.fetch(productQuery),
    sanityClient.fetch(pricingQuery),
    sanityClient.fetch(faqsQuery),
    accessOfTools(),
  ]);

  const { access, ownedPlans } = accessData;
  return (
    <>
      <Banner data={bannerData} />
      <MultiSection data={multiSectionData} />
      <Categories data={categoriesData} />
      <Trending access={access} data={trendingData} />
      <AllTools access={access} data={productData} />
      <SectionDivider />
      <Pricing data={pricingData} />
      <Faqs data={faqsData} />
    </>
  );
}
