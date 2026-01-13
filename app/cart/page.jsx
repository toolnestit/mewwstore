import CartClient from "@/components/CartClient";
import { accessOfTools, userIn } from "@/controllers/basics/user";
import { allProductsQuery, planQuery } from "@/lib/Query";
import {
  canAddSlug,
  checkExpire,
  extractJSONFromHash,
  extractProductFeatures,
} from "@/lib/utils";
import { sanityClient } from "@/sanity.cli";
import { redirect } from "next/navigation";

const normalizeToArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
};

async function Cart({ searchParams }) {
  const query = await searchParams;

  const [allProducts, pricing, user, accessData] = await Promise.all([
    sanityClient.fetch(allProductsQuery),
    query?.plan ? sanityClient.fetch(planQuery, { slug: query.plan }) : null,
    userIn(),
    accessOfTools(),
  ]);
  const { access, ownedPlans } = accessData;
  const planSelected = pricing?.features
    ? extractProductFeatures(pricing.features)
    : null;

  if (checkExpire(ownedPlans, pricing?.slug?.current)) {
    return redirect("/cart?msg=You already owned this plan");
  }
  const tool = query?.tool ? extractJSONFromHash(query.tool) : null;
  const toolSelected = canAddSlug(access, tool?.slug?.curren) ? tool : null;
  const initialSelected = normalizeToArray(planSelected ?? toolSelected);
  return (
    <CartClient
      access={access}
      data={allProducts}
      initialSelected={initialSelected}
      planData={pricing}
      query={query}
      user={user}
    />
  );
}

export default Cart;
