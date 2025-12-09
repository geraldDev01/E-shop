import Navbar from "@/components/ui/Navbar";
import type { Metadata } from "next";
import { PayPalProvider } from "@/providers/PayPalProvider";
import ChatBot from '@/components/ui/ChatBot';

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
        <main className="min-h-screen bg-gradient-to-br from-[#FEF8F1] via-white to-[#fff7f0] transition-colors duration-300">
          {children}
        </main>
        <ChatBot />
      </div>
    </PayPalProvider>
  );
}