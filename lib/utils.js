import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getDiscountedPrice(price, discountPercent) {
  if (typeof price !== "number" || typeof discountPercent !== "number") {
    return 0;
  }

  if (price < 0 || discountPercent < 0) {
    return 0;
  }

  const discounted =
    Math.round((price - (price * discountPercent) / 100) * 100) / 100;

  return discounted;
}

export function getExpiryDate(months = 1) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date; // Date object
}

export function isExpired(expiryDate) {
  const today = new Date();
  const expDate = new Date(expiryDate);

  return expDate < today;
}

export function getItemBySlug(items, slug) {
  return items.find((item) => item.slug?.current === slug);
}

export function extractProductFeatures(features = []) {
  return features
    .filter((item) => item?.type === "product" && item?.product)
    .map((item) => {
      const p = item.product;
      return {
        name: p.name ?? null,
        slug: {
          type: "slug",
          current: p.slug?.current ?? null,
        },
        isPriceFixed: p.isPriceFixed ?? false,
        price: p.price ?? null,
        thumb: p?.thumb,
        discountGroup: p?.discountGroup,
        priceBDT: p?.priceBDT,
        discount: p?.discount,
      };
    });
}

export function createHashFromJSON(obj) {
  return btoa(encodeURIComponent(JSON.stringify(obj)));
}

export function extractJSONFromHash(hash) {
  try {
    return JSON.parse(decodeURIComponent(atob(hash)));
  } catch {
    return null;
  }
}

export function checkExpire(list = [], slug) {
  if (!Array.isArray(list) || !slug) return false;

  const item = list.find((i) => i.slug === slug);
  if (!item || !item.expireAt) return false;

  return new Date(item.expireAt).getTime() > Date.now();
}

export function getDateAfterDays(days = 30) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function extractAccessFromPlan(plan, days = 30) {
  if (!plan?.features || !Array.isArray(plan.features)) return [];

  return plan.features
    .filter((f) => f.type === "product" && f.product?.slug?.current)
    .map((f) => ({
      slug: f.product.slug.current,
      expireAt: getDateAfterDays(days),
    }));
}

export async function validateUser(user) {
  if (!user) {
    return { success: false, error: "User data missing" };
  }

  if (user.status !== "active") {
    return { success: false, error: "User is not active" };
  }

  if (user.isVerified !== true) {
    return { success: false, error: "User is not verified" };
  }

  if (user.progress !== 100) {
    return { success: false, error: "User profile is not complete" };
  }

  return { success: true };
}

export function canAddSlug(arr, slug) {
  return !arr.some((item) => item.slug === slug);
}
