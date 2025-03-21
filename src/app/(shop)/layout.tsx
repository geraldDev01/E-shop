import Navbar from "@/components/ui/Navbar";
import type { Metadata } from "next";
import { PayPalProvider } from "@/providers/PayPalProvider";

export const metadata: Metadata = {
  title: "Shop | Your Store Name",
  description: "Browse our collection of products",
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PayPalProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </PayPalProvider>
  );
}