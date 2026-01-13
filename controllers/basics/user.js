"use server";

import dbConnect from "@/lib/mongoose";
import { productContentQuery } from "@/lib/Query";
import { checkExpire } from "@/lib/utils";
import Order from "@/models/Order";
import User from "@/models/user";
import { sanityClient } from "@/sanity.cli";
import { getServerSession } from "next-auth";

export const userIn = async () => {
  const session = await getServerSession();
  if (!session?.user?.email) return null;

  await dbConnect();

  const res = await User.findOne({ email: session.user.email })
    .select("-password -__v")
    .lean();

  if (!res) return null;

  return {
    ...res,
    _id: res._id.toString(),
    createdAt: res.createdAt?.toISOString(),
    access: serializeUserPlans(res.access),
    ownedPlans: serializeUserPlans(res.ownedPlans),
  };
};

const serializeUserPlans = (arr = []) => {
  return arr.map((item) => ({
    slug: item.slug,
    expireAt: item.expireAt ? new Date(item.expireAt).toISOString() : null,
    _id: item._id?.toString(),
  }));
};

export async function updateUser(name, phone) {
  try {
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return {
        success: false,
        msg: "Invalid name. Minimum 2 characters required.",
      };
    }

    const phoneRegex = /^[0-9]{6,15}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return {
        success: false,
        msg: "Invalid phone number format.",
      };
    }

    const user = await userIn();
    if (!user || !user.email) {
      return {
        success: false,
        msg: "User not authenticated.",
      };
    }

    await dbConnect();

    const result = await User.updateOne(
      { email: user.email },
      {
        $set: {
          name: name.trim(),
          phoneNumber: phone,
          progress: 100,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return {
        success: false,
        msg: "No changes were made.",
      };
    }

    return {
      success: true,
      msg: "User updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      msg: "Server error during update.",
    };
  }
}

export const accessOfTools = async () => {
  const user = await userIn();

  if (!user?.email) {
    return {
      access: [],
      ownedPlans: [],
    };
  }
  return {
    access: user?.access,
    ownedPlans: user?.ownedPlans,
  };
};

export const getSubscriptionHistory = async () => {
  const user = await userIn();
  if (!user?.email) {
    return { success: false, error: "Unauthorized" };
  }
  await dbConnect();
  const offer = await Order.find({
    userId: user?._id,
    status: "COMPLETED",
  })
    .select("-_id -userId -plan -access -__v")
    .lean();
  return offer;
};

export async function getPorudctContent(slug) {
  const user = await userIn();
  const isValid = checkExpire(user?.access, slug);

  if (!isValid) {
    return null;
  }

  const query = `*[_type == "product" && slug.current == $slug][0]{
    content
  }`;

  const product = await sanityClient.fetch(query, { slug });
  return product;
}
