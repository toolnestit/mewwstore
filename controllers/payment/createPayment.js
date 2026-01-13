"use server";

import dbConnect from "@/lib/mongoose";
import { accessOfTools, userIn } from "../basics/user";
import Order from "@/models/Order";
import { sanityClient } from "@/sanity.cli";
import { backendProductsQuery, planQuery } from "@/lib/Query";
import {
  extractAccessFromPlan,
  getDateAfterDays,
  getDiscountedPrice,
} from "@/lib/utils";

export const createPaymentServer = async ({ planData, selectedTools }) => {
  const user = await userIn();
  const statusUser = await validateUser(user);
  if (!statusUser.success) return statusUser;

  const [accessData, planDataFetch, allProducts] = await Promise.all([
    accessOfTools(),
    planData
      ? sanityClient.fetch(planQuery, { slug: planData?.slug?.current })
      : null,
    !planData &&
      selectedTools?.length > 0 &&
      sanityClient.fetch(backendProductsQuery),
  ]);

  // Handle plan purchase
  if (planDataFetch) {
    if (!planDataFetch.name) return { success: false, error: "Invalid Plan" };
    if (accessData.ownedPlans?.includes(planDataFetch.slug.current))
      return { success: false, error: "You already owned this plan" };

    await dbConnect();
    const order = await new Order({
      userId: user._id,
      pricePaid: getDiscountedPrice(
        planDataFetch.price.normalBDT,
        planDataFetch.price.discount
      ),
      plan: [
        {
          slug: planDataFetch.slug.current,
          expireAt: getDateAfterDays(30),
        },
      ],
      access: extractAccessFromPlan(planData, 30),
      expireAt: getDateAfterDays(30),
      paymentMethod: "uddoktapay BDT",
    }).save();

    return createUddoktaPayCharge(user, order);
  }

  // Handle tool purchase
  if (!selectedTools?.length)
    return { success: false, error: "Select at least 1 tool" };

  const filteredProducts = selectedTools.filter(
    (t) => !accessData.access.some((a) => a.slug === t.slug.current)
  );
  if (!filteredProducts.length)
    return { success: false, error: "Invalid selection" };

  const getOrderAbleP = allProducts.filter((item) =>
    filteredProducts.some((p) => p.slug.current === item.slug)
  );
  if (!getOrderAbleP.length)
    return { success: false, error: "Invalid selection" };

  const summury = await calculateDiscounts(getOrderAbleP);
  await dbConnect();
  const order = await new Order({
    userId: user._id,
    pricePaid: summury.totalPrice,
    plan: [
      {
        slug: generateUnique6CharID(),
        expireAt: getDateAfterDays(30),
      },
    ],
    access: summury.arr,
    expireAt: getDateAfterDays(30),
    paymentMethod: "uddoktapay BDT",
  }).save();

  return createUddoktaPayCharge(user, order);
};

async function createUddoktaPayCharge(user, order) {
  const uddoktaURL = `${process.env.UDDOKTA_PAY_BASE_URL}/api/checkout-v2`;
  const apiKey = process.env.UDDOKTA_PAY_API_KEY;

  const body = {
    full_name: `${user?.name}}`,
    email: user.email,
    amount: `${order.pricePaid}`,
    metadata: { userId: user._id.toString(), orderId: order._id.toString() },
    redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback`,
    return_type: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/error?msg=Payment Canceled`,
    return_type: "POST",
  };

  const res = await fetch(uddoktaURL, {
    method: "POST",
    headers: {
      "RT-UDDOKTAPAY-API-KEY": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!json.status)
    return { success: false, error: json.message || "Payment creation failed" };

  return {
    success: true,
    payment_url: json.payment_url,
    orderId: order._id.toString(),
  };
}

const usedIDs = new Set();
function generateUnique6CharID() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id;
  do {
    id = Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  } while (usedIDs.has(id));
  usedIDs.add(id);
  return id;
}

async function calculateDiscounts(products) {
  let totalPrice = 0;
  const arr = products.map((product) => {
    let finalPrice = product.priceBDT * (1 - product.discount / 100);
    if (products.length >= 5 && product.discountGroup !== null)
      finalPrice = product.priceBDT * (1 - product.discountGroup / 100);
    totalPrice += finalPrice;
    return { slug: product.slug, expireAt: getDateAfterDays(30) };
  });
  return { totalPrice, arr };
}

export async function validateUser(user) {
  if (!user) return { success: false, error: "User data missing" };
  if (user.status !== "active")
    return { success: false, error: "User is not active" };
  if (!user.isVerified)
    return { success: false, error: "User is not verified" };
  if (user.progress !== 100)
    return { success: false, error: "User profile is not complete" };
  return { success: true };
}
