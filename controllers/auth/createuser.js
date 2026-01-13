"use server";

import { verifyCaptcha } from "@/lib/captchaverify";
import { getIPv4 } from "@/lib/ip";
import { validateEmailFormat } from "@/lib/mail";
import dbConnect from "@/lib/mongoose";
import sendMail from "@/lib/nodemailer";
import { createSecurePassword } from "@/lib/password";
import User from "@/models/user";

export const createUser = async (email, token) => {
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

  await dbConnect();
  const validateUser = await User.findOne({ email: email });
  if (validateUser) {
    return { success: false, error: "User already exist" };
  }
  const { ip } = await getIPv4();

  const password = await createSecurePassword();
  const createUser = User({
    avatar: `/api/og/avatar?q=${email}`,
    email,
    isVerified: true,
    password: password.hashedPassword,
    ipAddresses: [ip],
  });

  const res = await createUser.save();
  await sendMail({
    to: email,
    subject: "Meww store new account activation password",
    html: `
        <h1>${password?.rawPassword}</h1>
    `,
  });
  return { success: true, msg: "Signup success, login via mailed password" };
};
