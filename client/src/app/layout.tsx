import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import { Toaster } from "sonner";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "Babyshop - Premium Baby Products & Shopping",
  description: "Shop the best baby products online. Discover premium quality items for your little ones at Babyshop.",
  keywords: "baby products, online shopping, baby clothes, toys, gear",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Header />
        {children}
        <Footer />
        <Toaster position="bottom-right"
          className="rounded-lg shadow-lg border"
          duration={4000}
        />
      </body>
    </html>
  );
}
