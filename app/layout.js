import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import GetStarted from "@/components/GetStarted";
import ProvidersWrapper from "@/providers/ProvidersWrapper";
import { userIn } from "@/controllers/basics/user";
import Account from "@/components/Account";
import Support from "@/components/Support";
import AppContent from "@/components/AppContent";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Meww Store",
  description: "",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default async function RootLayout({ children }) {
  const session = await userIn();
  return (
    <html lang="en">
      <body className={` ${inter.className} antialiased`}>
        <ProvidersWrapper>
          <Header session={session} />
          {session?.email && <Account session={session} />}
          {!session?.email && <GetStarted />}
          {children}
          <Support />
          {session && <AppContent access={session?.access} />}
        </ProvidersWrapper>
      </body>
    </html>
  );
}
