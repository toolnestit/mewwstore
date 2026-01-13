import dbConnect from "@/lib/mongoose";
import { getDateAfterDays } from "@/lib/utils";
import Order from "@/models/Order";
import User from "@/models/user";
import { NextResponse } from "next/server";

function mergeBySlug(oldArr = [], newArr = []) {
  const map = new Map();

  oldArr.forEach((item) => {
    map.set(item.slug, { ...item });
  });

  newArr.forEach((item) => {
    map.set(item.slug, { ...item });
  });

  return Array.from(map.values());
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const invoice_id = formData.get("invoice_id");

    if (!invoice_id) {
      return NextResponse.json(
        { success: false, message: "invoice_id missing" },
        { status: 400 }
      );
    }

    const paymentRes = await verifyUddoktaPayPayment(invoice_id);

    if (!paymentRes.success) {
      return NextResponse.redirect(
        new URL(
          `/error?msg=${encodeURIComponent(paymentRes.error)}`,
          request.url
        )
      );
    }

    await dbConnect();

    const { data } = paymentRes;

    const orderExist = await Order.findOne({
      _id: data.metadata?.orderId,
    });

    if (!orderExist || orderExist.status === "COMPLETED") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const newExpireDate = getDateAfterDays(30);

    /* ---------- update order plan & access ---------- */
    const updatedPlan = (orderExist.plan || []).map((item) => ({
      ...item.toObject(),
      expireAt: newExpireDate,
    }));

    const updatedAccess = (orderExist.access || []).map((item) => ({
      ...item.toObject(),
      expireAt: newExpireDate,
    }));

    await Order.findOneAndUpdate(
      { _id: orderExist._id },
      {
        $set: {
          status: "COMPLETED",
          metadata: JSON.stringify(data),
          expireAt: newExpireDate,
          plan: updatedPlan,
          access: updatedAccess,
        },
      }
    );

    const user = await User.findOne({ _id: orderExist.userId }).lean();

    const mergedPlans = mergeBySlug(user?.ownedPlans, updatedPlan);
    const mergedAccess = mergeBySlug(user?.access, updatedAccess);

    await User.findOneAndUpdate(
      { _id: orderExist.userId },
      {
        $set: {
          ownedPlans: mergedPlans,
          access: mergedAccess,
        },
      }
    );

    return NextResponse.redirect(new URL("/?refresh=true", request.url));
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}

export async function verifyUddoktaPayPayment(invoice_id) {
  if (!invoice_id) return { success: false, error: "Invoice ID missing" };

  const res = await fetch(
    `${process.env.UDDOKTA_PAY_BASE_URL}/api/verify-payment`,
    {
      method: "POST",
      headers: {
        "RT-UDDOKTAPAY-API-KEY": process.env.UDDOKTA_PAY_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ invoice_id }),
    }
  );

  const data = await res.json();

  if (!data.status) {
    return { success: false, error: data.message || "Verification failed" };
  }

  return { success: true, data };
}
