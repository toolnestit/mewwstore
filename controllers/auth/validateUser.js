"use server";

import { validateEmailFormat } from "@/lib/mail";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user";

export const validateUserEmail = async (email) => {
  if (!validateEmailFormat(email)) {
    return {
      success: false,
      error: "Only Gmail, Yahoo, iCloud, and Outlook emails are supported",
    };
  }
  await dbConnect();
  const res = await User.findOne({ email }).select("email -_id").lean();
  return res?.email ? true : false;
};
