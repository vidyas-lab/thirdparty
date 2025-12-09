import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChatProvider } from "@/context/ChatContext";
import CookieConsent from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Profit Leakage Calculator",
  description: "A detailed assessment of the money slipping through the cracks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ChatProvider>
          <Header />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </ChatProvider>
      </body>
    </html>
  );
}
