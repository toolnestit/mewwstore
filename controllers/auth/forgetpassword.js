"use server";

import { verifyCaptcha } from "@/lib/captchaverify";
import { validateEmailFormat } from "@/lib/mail";
import dbConnect from "@/lib/mongoose";
import sendMail from "@/lib/nodemailer";
import { createSecurePassword } from "@/lib/password";
import User from "@/models/user";

export const forgetPassword = async (token, email) => {
  if (!validateEmailFormat(email)) {
    return {
      success: false,
      error: "Only Gmail, Yahoo, iCloud, and Outlook emails are supported",
    };
  }

  const verified = await verifyCaptcha(token);
  if (!verified?.success) {
    return { success: false, error: "Invalid Captcha Token" };
  }

  const password = await createSecurePassword();

  await dbConnect();

  const res = await User.updateOne(
    { email: email }, // Filter
    { $set: { password: password?.hashedPassword } } // Update
  );

  await sendMail({
    to: email,
    subject: "Meww Store Password Reset",
    html: `<h1>${password?.rawPassword}</h1>`,
  });

  return { success: true, msg: "Check you inbox" };
};
