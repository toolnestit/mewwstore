import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import dbConnect from "@/lib/mongoose";
import { getIPv4 } from "@/lib/ip";
import sendMail from "@/lib/nodemailer";
import { comparePassword, createSecurePassword } from "@/lib/password";
import { validateEmailFormat } from "@/lib/mail";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();
        const user = await User.findOne({ email }).lean();

        if (!user) {
          throw new Error("User not found");
        }

        const passOK = await comparePassword(password, user.password);
        if (!passOK) {
          throw new Error("Incorrect password");
        }
        return {
          id: user._id,
          email: user.email,
          name: user.name,
          image: user.avatar,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;

      if (!user?.email) throw new Error("Need Required Values");

      if (!validateEmailFormat(user?.email)) {
        throw new Error(
          "Only Gmail, Yahoo, iCloud, and Outlook emails are supported"
        );
        return;
      }

      await dbConnect();
      const { ip } = await getIPv4();

      const userExist = await User.findOne({ email: user.email });

      if (userExist) {
        return true;
      }

      const password = await createSecurePassword();

      const newUser = new User({
        name: user.name,
        avatar: user.image,
        email: user.email,
        isVerified: true,
        password: password.hashedPassword,
        ipAddresses: [ip],
      });

      await newUser.save();

      sendMail({
        to: user.email,
        subject: "Meww Store Account Password",
        html: `<h1>Password: <strong>${password.rawPassword}</strong></h1>`,
      });

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
